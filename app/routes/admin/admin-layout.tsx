import React from "react";
import { Outlet, redirect } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { NavItems, MobileSidebar } from "components";
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/auth";

// check authentication, if admin then show dashboard, else just trip card
export async function clientLoader() {
    try {
        const user = await account.get();
        if (!user.$id) return redirect("/sign-in");

        // check for admin
        const existingUser = await getExistingUser(user.$id);
        if (existingUser?.status === "user") {
            return redirect("/");
        }

        return existingUser?.$id ? existingUser : await storeUserData();
    } catch (e) {
        console.log("Error in clientLoader", e);
        return redirect("/sign-in");
    }
}

function AdminLayout() {
    return (
        <div className="admin-layout">
            {/* Mobile sidebar */}
            <MobileSidebar />

            {/* Desktop sidebar */}
            <aside className="w-full max-w-[270px] hidden lg:block">
                <SidebarComponent width={270} enableGestures={false}>
                    <NavItems />
                </SidebarComponent>
            </aside>

            {/* Show the rest of page content */}
            <aside className="children">
                <Outlet />
            </aside>
        </div>
    );
}

export default AdminLayout;

/**
MobileSidebar: hamburger menu for mobile, toggles visibility.

SidebarComponent: renders navigation on desktop.

<NavItems />: the actual clickable nav buttons.

<Outlet />: this is where the selected route’s content appears! 
    ➤ User visits /dashboard
        React Router renders AdminLayout

        Inside AdminLayout, it hits <Outlet />

        Since path is /dashboard, it renders dashboard.tsx inside <Outlet />
*/
