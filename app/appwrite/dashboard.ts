import { parseTripData } from "lib/utils";
import { database, appwriteConfig } from "./client";

interface Document {
    [key: string]: any;
}

type FilterByDate = (
    items: Document[],
    key: string,
    start: string,
    end?: string
) => number;

export const getUsersAndTripsStats = async (): Promise<DashboardStats> => {
    const d = new Date();
    const startCurrent = new Date(
        d.getFullYear(),
        d.getMonth(),
        1
    ).toISOString();
    const startPrev = new Date(
        d.getFullYear(),
        d.getMonth() - 1,
        1
    ).toISOString();
    const endPrev = new Date(d.getFullYear(), d.getMonth(), 0).toISOString();

    const [users, trips] = await Promise.all([
        database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId
        ),
        database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.tripsCollectionId
        ),
    ]);

    const filterByDate: FilterByDate = (items, key, start, end) =>
        items.filter((item) => item[key] >= start && (!end || item[key] <= end))
            .length;

    const filterUsersByRole = (role: string) => {
        return users.documents.filter((u: Document) => u.status === role);
    };

    return {
        totalUsers: users.total,
        usersJoined: {
            currentMonth: filterByDate(
                users.documents,
                "joinedAt",
                startCurrent,
                undefined
            ),
            lastMonth: filterByDate(
                users.documents,
                "joinedAt",
                startPrev,
                endPrev
            ),
        },
        userRole: {
            total: filterUsersByRole("user").length,
            currentMonth: filterByDate(
                filterUsersByRole("user"),
                "joinedAt",
                startCurrent,
                undefined
            ),
            lastMonth: filterByDate(
                filterUsersByRole("user"),
                "joinedAt",
                startPrev,
                endPrev
            ),
        },
        totalTrips: trips.total,
        tripsCreated: {
            currentMonth: filterByDate(
                trips.documents,
                "createdAt",
                startCurrent,
                undefined
            ),
            lastMonth: filterByDate(
                filterUsersByRole("user"),
                "joinedAt",
                startPrev,
                endPrev
            ),
        },
    };
};

// need more understanding
export const getUserGrowthPerDay = async () => {
    // list of all user documents
    const users = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId
    );

    // taking current date and time
    // and aggerating the number of users per day that they have joined by using reduce
    const userGrowth = users.documents.reduce(
        (acc: { [key: string]: number }, user: Document) => {
            const date = new Date(user.joinedAt);
            const day = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        },
        {}
    );
    // | Line                      | What it's doing                                              |          |                                                                             |
    // | ------------------------- | ------------------------------------------------------------ | -------- | --------------------------------------------------------------------------- |
    // | `reduce()`                | Loops through all users, one by one                          |          |                                                                             |
    // | `new Date(user.joinedAt)` | Converts the `joinedAt` timestamp into a JS `Date` object    |          |                                                                             |
    // | `toLocaleDateString(...)` | Turns the date into a human-readable format, like `"Jul 17"` |          |                                                                             |
    // {   "Jul 15": 2,   "Jul 16": 4, }                                                          | 0) + 1\` | Adds 1 to the count for that day. If no users on that day yet, start from 0 |

    // convert to array -> [{ day: "Jul 15", count: 2 }, { day: "Jul 16", count: 2 },
    return Object.entries(userGrowth).map(([day, count]) => ({
        count: Number(count),
        day,
    }));
};

export const getTripsCreatedPerDay = async () => {
    const trips = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.tripsCollectionId
    );

    const tripsGrowth = trips.documents.reduce(
        (acc: { [key: string]: number }, trip: Document) => {
            const date = new Date(trip.createdAt);
            const day = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        },
        {}
    );

    return Object.entries(tripsGrowth).map(([day, count]) => ({
        count: Number(count),
        day,
    }));
};

export const getTripsByTravelStyle = async () => {
    const trips = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.tripsCollectionId
    );

    const travelStyleCounts = trips.documents.reduce(
        (acc: { [key: string]: number }, trip: Document) => {
            const tripDetail = parseTripData(trip.tripDetail);

            if (tripDetail && tripDetail.travelStyle) {
                const travelStyle = tripDetail.travelStyle;
                acc[travelStyle] = (acc[travelStyle] || 0) + 1;
            }
            return acc;
        },
        {}
    );

    return Object.entries(travelStyleCounts).map(([travelStyle, count]) => ({
        count: Number(count),
        travelStyle,
    }));
};
