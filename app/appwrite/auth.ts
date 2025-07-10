import { ID, OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { redirect } from "react-router";

export const storeUserData = async () => {
    try {
        const user = await account.get();

        if (!user) return null;

        // check if user already exists in database
        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", user.$id)]
        );

        // if exist then just return the user
        if (documents.length > 0) return documents[0];

        // else add new user to database
        const imageUrl = await getGooglePicture();

        // create new user document
        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            // unique ID for each user
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: imageUrl || "",
                joinedAt: new Date().toISOString(),
            }
        );

        return newUser;
    } catch (e) {
        console.log(e);
    }
};

export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session(OAuthProvider.Google);
    } catch (e) {
        console.log("loginWithGoogle", e);
    }
};

export const logoutUser = async () => {
    try {
        //  sessionId
        await account.deleteSession("current");
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

// get the user that login
export const getUser = async () => {
    try {
        // get user info then get the data from that user in database
        const user = await account.get();
        if (!user) return redirect("/sign-in");

        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal("accountId", user.$id),
                Query.select([
                    "name",
                    "email",
                    "imageUrl",
                    "joinedAt",
                    "accountId",
                ]),
            ]
        );

        return documents.length > 0 ? documents[0] : redirect("/sign-in");
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

export const getGooglePicture = async () => {
    try {
        // get the current user session
        const session = await account.getSession("current");

        // get OAuth2 token from the session
        const oAuthToken = session.providerAccessToken;

        // check access token
        if (!oAuthToken) {
            console.log("No OAuth token available");
            return null;
        }

        // make a request to Google API to get the profile photo
        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            {
                headers: {
                    Authorization: `Bearer ${oAuthToken}`,
                },
            }
        );

        if (!response.ok) {
            console.log("Failed to fetch profile photo from Google People API");
            return null;
        }

        const data = await response.json();

        // extract the profile photo URL from response
        const photoUrl =
            data.photos && data.photos.length > 0 ? data.photos[0].url : null;

        return photoUrl;
    } catch (e) {
        console.log(e);
    }
};

// "Find all documents in the user collection where the accountId field is equal to this user's ID."
// But for this to work, your documents in userCollectionId must have a field named accountId
//  -that you previously set to be equal to the authenticated user's ID when creating the document.
export const getExistingUser = async () => {
    try {
        const user = await account.get();

        if (!user) return null;

        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", user.$id)]
        );
        if (documents.length === 0) return null;

        return documents[0];
    } catch (e) {
        console.log(e);
    }
};

// Takes in a limit (how many users to fetch)
// And an offset (how many users to skip)
// Returns a chunk of users from your database along with the total count
export const getAllUsers = async (limit: number, offset: number) => {
    try {
        // named documents -> users (because usersCollection)
        const { documents: users, total } = await database.listDocuments(
            appwriteConfig.databaseId, // your target database
            appwriteConfig.userCollectionId, // the specific collection inside that database
            [Query.limit(limit), Query.offset(offset)] // query modifiers (this part's the most interesting)
        );

        if (total === 0) return { users: [], total };

        return { users, total };
    } catch (e) {
        console.log("Error fetching all users", e);
        // if sth crash return [] for users and 0 for total
        return { users: [], total: 0 };
    }
};

/*
When use Appwrite’s database.listDocuments(...) method, 
it returns a structured response like this:
{
  documents: [ // array of document objects / ],
  total: 42
}

Each document represents one entry—a single "row" of structured data—such as a user profile, post, or product.
{
  "$id": "a1b2c3",
  "$collectionId": "users",
  "$createdAt": "2025-07-06T22:13:00.000Z",
  "$updatedAt": "2025-07-07T00:42:00.000Z",
  "name": "Alice",
  "email": "alice@example.com",
  "accountId": "user_abc123"
}



*/
