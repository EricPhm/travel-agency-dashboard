import { HeaderRender } from "@syncfusion/ej2-react-grids";
import { Header } from "components";
import React from "react";

const Trips = () => {
    return (
        <main className="all-user wrapper">
            <Header
                title="Trips"
                description="View and edit AI-generated travel plans"
                // ctaText is word in the button inside Header component
                ctaText="Create a trip"
                ctaUrl="/trips/create"
            />
        </main>
    );
};

export default Trips;
