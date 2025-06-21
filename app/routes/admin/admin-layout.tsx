import React from "react";
import { Outlet } from "react-router";

function AdminLayout() {
    return (
        <div className="admin-layout">
            AdminLayout
            <aside className="w-full max-w-[270px] hidden lg:block">
                side bar
            </aside>
            <aside className="children">
                <Outlet />
            </aside>
        </div>
    );
}

export default AdminLayout;
