import { Query } from "appwrite";
import { appwriteConfig, database } from "./client";

export const getAllTrips = async (limit: number, offset: number) => {
    const allTrips = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.tripsCollectionId,
        [Query.limit(limit), Query.offset(offset), Query.orderDesc("createdAt")]
    );

    // total is the total items get back from database
    if (allTrips.total === 0) {
        console.error("Error fetching all trips.");
        return { allTrips: [], total: 0 };
    }

    return {
        allTrips: allTrips.documents,
        total: allTrips.total,
    };
};

// fetch trip detail
export const getTripById = async (tripId: string) => {
    const trip = await database.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.tripsCollectionId,
        tripId
    );

    if (!trip.$id) {
        console.log("Trip not found");
        return null;
    }

    return trip;
};
