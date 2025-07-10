import React from "react";
import { Header } from "components";
import {
    ColumnDirective,
    ColumnsDirective,
    GridComponent,
} from "@syncfusion/ej2-react-grids";
import { users } from "~/constants";
import { cn, formatDate } from "lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/all-users";

// a loader is a function tied to a specific route.
// Its job is to fetch data before the component is rendered
export const loader = async () => {
    const { users, total } = await getAllUsers(10, 0);

    return { users, total };
};

// loaderData prop is automatically filled with whatever your route’s loader()
const AllUser = ({ loaderData }: Route.ComponentProps) => {
    const { users } = loaderData;
    return (
        <main className="all-users wrapper">
            {/* Pass in props to Header component
            <Header
                title="Manage Users"
                description="Filter, sort, and access detailed user"
            /> */}
            {/* use syncfusion grid component */}
            <GridComponent dataSource={users} gridLines="None">
                <ColumnsDirective>
                    <ColumnDirective
                        field="name"
                        headerText="Name"
                        width="200"
                        textAlign="Left"
                        template={(props: UserData) => (
                            <div className="flex items-center gap-1 .5px-4">
                                <img
                                    src={props.imageUrl}
                                    alt="user"
                                    className="rounded-full size-8 aspect-square"
                                    referrerPolicy="no-referrer"
                                />
                                <span>{props.name}</span>
                            </div>
                        )}
                    />
                    <ColumnDirective
                        // field need to be match with user's data
                        field="email"
                        headerText="Email Address"
                        width="200"
                        textAlign="Left"
                    />
                    <ColumnDirective
                        // field need to be match with user's data
                        field="joinedAt"
                        headerText="Date Joined"
                        width="120"
                        textAlign="Left"
                        // template to identify how to render it
                        template={({ joinedAt }: { joinedAt: string }) =>
                            formatDate(joinedAt)
                        }
                    />
                    <ColumnDirective
                        // field need to be match with user's data
                        field="status"
                        headerText="Type"
                        width="100"
                        textAlign="Left"
                        template={({ status }: UserData) => (
                            <article
                                // this className making the color circle around the word
                                className={cn(
                                    "status-column",
                                    status === "user"
                                        ? "bg-success-50"
                                        : "bg-light-300"
                                )}
                            >
                                {/* This div is the little circle appear before the word */}
                                <div
                                    className={cn(
                                        "size-1.5 rounded-full",
                                        status === "user"
                                            ? "bg-success-500"
                                            : "bg-gray-500"
                                    )}
                                />
                                {/* diff text color */}
                                <h3
                                    className={cn(
                                        "font-inter text-xs font-medium",
                                        status === "user"
                                            ? "text-success-700"
                                            : "text-gray-500"
                                    )}
                                >
                                    {status}
                                </h3>
                            </article>
                        )}
                    />
                </ColumnsDirective>
            </GridComponent>
            Dashboard Content
        </main>
    );
};

export default AllUser;
