import { Header } from "components";
import React from "react";
const Dashboard = () => {
    const user = {
        name: "Eric",
    };

    return (
        <main className="dashboard wrapper">
            <Header
                title={`Welcome ${user?.name ?? "Guest"} 😘`}
                description="Track activity, trends are popular dewstination in real time"
            />
        </main>
    );
};

export default Dashboard;
