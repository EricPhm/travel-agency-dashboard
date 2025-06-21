import React from "react";
import { Header } from "components";

const AllUser = () => {
    return (
        <main className="dashboard wrapper">
            {/* Pass in props to Header component */}
            <Header
                title="Trip Page"
                description="Check out users in real time"
            />
            Dashboard Content
        </main>
    );
};

export default AllUser;
