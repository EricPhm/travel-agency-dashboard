import { GoogleGenerativeAI } from "@google/generative-ai";
import { ID } from "appwrite";
import { extractJson, parseMarkdownToJson } from "lib/utils";
import { data, type ActionFunctionArgs } from "react-router";
import { appwriteConfig, database } from "~/appwrite/client";

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        country,
        numberOfDays,
        travelStyle,
        interest,
        budget,
        groupType,
        userId,
    } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!); // ! for GEMINI_API_KEY will be there
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

    try {
        const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
            Budget: '${budget}'
            Interests: '${interest}'
            TravelStyle: '${travelStyle}'
            GroupType: '${groupType}'
            Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
            {
                "name": "A descriptive title for the trip",
                "description": "A brief description of the trip and its highlights not exceeding 100 words",
                "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
                "duration": ${numberOfDays},
                "budget": "${budget}",
                "travelStyle": "${travelStyle}",
                "country": "${country}",
                "interests": ${interest},
                "groupType": "${groupType}",
                "bestTimeToVisit": [
                    '🌸 Season (from month to month): reason to visit',
                    '☀️ Season (from month to month): reason to visit',
                    '🍁 Season (from month to month): reason to visit',
                    '❄️ Season (from month to month): reason to visit'
                ],
                "weatherInfo": [
                    '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
                    '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
                    '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
                    '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
                ],
                "location": {
                    "city": "name of the city or region",
                    "coordinates": [latitude, longitude],
                    "openStreetMap": "link to open street map"
                },
                "itinerary": [
                    {
                        "day": 1,
                        "location": "City/Region Name",
                        "activities": [
                            {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
                            {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
                            {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
                        ]
                    },
                ...
                ]
            }
            Return only pure JSON—no markdown, no code fences, no commentary.
        `;

        const textResult = await genAI
            .getGenerativeModel({ model: "gemini-2.0-flash" })
            .generateContent([prompt]);

        console.log("Raw Gemini Output:", textResult.response.text());

        //  from utils.ts
        // const trip = parseMarkdownToJson(textResult.response.text());
        // 1. Get the raw text (await if it’s a Promise)
        const raw = await textResult.response.text();

        // 2. Remove any Markdown fences/backticks
        const jsonString = extractJson(raw);

        // 3. Safely parse
        let trip;
        try {
            trip = JSON.parse(jsonString);
        } catch (err) {
            console.error("Failed to parse cleaned JSON:", err, {
                raw,
                jsonString,
            });
            throw new Error("Invalid JSON from Gemini");
        }

        const imageResponse = await fetch(
            `https://api.unsplash.com/search/photo?query=${country} ${interest} ${travelStyle}&client_id=${unsplashApiKey} `
        );

        // const imageUrls = (await imageResponse.json()).results
        //     .slice(0, 3)
        //     .map((result: any) => result.urls?.regular || null);
        const rawImages = await imageResponse.json();
        const imageUrls = Array.isArray(rawImages?.results)
            ? rawImages.results
                  .slice(0, 3)
                  .map((img: any) => img.urls?.regular ?? null)
            : [];

        const result = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripsCollectionId,
            ID.unique(),
            {
                tripDetail: JSON.stringify(trip),
                createdAt: new Date().toISOString(),
                imageUrls,
                userId,
            }
        );

        // data import from ReactRouter - because we need a way to return the data that is the result of this server actions
        return data({ id: result.$id });
    } catch (e) {
        console.error("Error generating travel plan: ", e);
    }
};

/**
*** Why Use JSON.stringify() in createDocumentv ***
📦 Appwrite Stores Primitive Types

Appwrite documents store data as primitive types (strings, numbers, booleans, arrays).

Complex objects (like your trip with nested properties) can’t be stored directly unless serialized.


📄 Serialization for Storage

JSON.stringify() serializes the JavaScript object into a JSON string.

This lets you preserve the structure of the object while fitting it into a single string field (tripDetail).
 * 
 */
