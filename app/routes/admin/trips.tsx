import { HeaderRender, PagerComponent } from "@syncfusion/ej2-react-grids";
import type { LoaderFunctionArgs } from "react-router"; //type definition so you get proper autocomplete and type safety when using TypeScript.
import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trips";
import { cn, getFirstWord, parseTripData } from "lib/utils";
import { useLoaderData, useSearchParams } from "react-router";
import { Header, InfoPill, TripCard } from "components";
import {
    ChipDirective,
    ChipListComponent,
    ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import { allTrips } from "~/constants";
import { useState } from "react";

// request to know which page we are on
export const loader = async ({ request }: LoaderFunctionArgs) => {
    const limit = 8;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const { allTrips, total } = await getAllTrips(limit, offset);

    // console.log(trips);

    return {
        trips: allTrips.map(({ $id, tripDetail, imageUrls }) => ({
            id: $id,
            ...parseTripData(tripDetail), // object spread operator to flatten the returned Trip object
            imageUrls: imageUrls ?? [],
        })),
        total,
    };
};

const Trips = () => {
    // interface Trip,
    const loaderData = useLoaderData();
    const [searchParams] = useSearchParams();
    const initialPage = Number(searchParams.get("page") || "1");
    const [currentPage, setCurrentPage] = useState(initialPage);
    const allTrips = loaderData.trips as Trip[] | [];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.location.search = `?page=${page}`;
    };

    return (
        <main className="all-user wrapper">
            <Header
                title="Trips"
                description="View and edit AI-generated travel plans"
                // ctaText is word in the button inside Header component
                ctaText="Create a trip"
                ctaUrl="/trips/create"
            />

            {/* Trips section */}
            <section>
                <h1 className="p-24-semibold text-dark-100">
                    Manage Created Trips
                </h1>
                <div className="trip-grid mb-4">
                    {allTrips.map(
                        ({
                            id,
                            name,
                            imageUrls,
                            itinerary,
                            interests,
                            travelStyle,
                            estimatedPrice,
                        }) => (
                            <TripCard
                                id={id}
                                key={id}
                                name={name}
                                location={itinerary?.[0].location ?? ""}
                                imageUrl={imageUrls[0]}
                                tags={[interests, travelStyle]}
                                price={estimatedPrice}
                            />
                        )
                    )}
                </div>
                <PagerComponent
                    totalRecordsCount={loaderData.total}
                    pageSize={8} // 8 trips per page
                    currentPage={currentPage}
                    click={(args) => handlePageChange(args.currentPage)}
                    cssClass="!mb-4"
                />
            </section>
        </main>
    );
};

export default Trips;
