import React from "react";
import { Outlet } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { NavItems, MobileSidebar } from "components";

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
