import React from "react";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { sidebarItems } from "~/constants";
import { cn } from "../lib/utils"; // cn is className
import { logoutUser } from "~/appwrite/auth";

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
    // const user = {
    //     name: "Eric",
    //     email: "ericpham288@gmail.com",
    //     imageUrl: "../public/assets/images/david.webp",
    // };

    // You define a special function (loader) for a route.
    // That function runs before your component is rendered.
    const user = useLoaderData();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        await logoutUser();
        navigate("/sign-in");
    };

    return (
        <section className="nav-items">
            <Link to="/" className="link-logo">
                <img
                    src="../public/assets/icons/logo.svg"
                    alt="logo"
                    className="size-[30px]"
                />
                <h1>Touriss</h1>
            </Link>

            <div className="container">
                {/* sidebarItems in index.ts */}
                <nav>
                    {/* sidebarItems keep the name and link (/dashboard) */}
                    {sidebarItems.map(({ id, href, icon, label }) => (
                        <NavLink to={href} key={id}>
                            {({ isActive }: { isActive: boolean }) => (
                                // if isActive then change the color for the icon
                                <div
                                    className={cn("group nav-item", {
                                        "bg-primary-100 !text-white": isActive,
                                    })}
                                    onClick={handleClick}
                                >
                                    <img
                                        src={icon}
                                        alt={label}
                                        className={`group-hover:brightness-0 size-0 group-hover:invert ${
                                            isActive
                                                ? "brightness-0 invert"
                                                : "text-dark-200"
                                        } `}
                                    />
                                    {label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* create a footer for the user */}
                <footer className="nav-footer">
                    <img
                        src={user?.imageUrl || "assets/images/david.webp"}
                        alt={user?.name || "David"}
                        referrerPolicy="no-referrer"
                    />
                    {/* article is like div but the content is related */}
                    <article>
                        <h2>{user?.name}</h2>
                        <p>{user?.email}</p>
                    </article>

                    <button onClick={handleLogOut} className="cursor-pointer">
                        <img
                            src="../public/assets/icons/logout.svg"
                            alt="logout"
                            className="size-6"
                        />
                    </button>
                </footer>
            </div>
        </section>
    );
};

export default NavItems;
