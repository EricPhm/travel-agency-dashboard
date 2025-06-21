import React from "react";
import { cn } from "lib/utils";
import { useLocation } from "react-router";

interface Props {
    title: string;
    description: string;
}

const Header = ({ title, description }: Props) => {
    // to check the path name
    const location = useLocation();

    return (
        <header className="header">
            <article>
                <h1
                    className={cn(
                        "text-dark-100",
                        // if at the main page then text in header bigger
                        location.pathname === "/"
                            ? "text-2xl md:text-4l font-bold"
                            : "text-xl md:text-2xl font-semibold"
                    )}
                >
                    {title}
                </h1>
                <p
                    className={cn(
                        "text-gray-100",
                        // if at the main page then text in header bigger
                        location.pathname === "/"
                            ? "text-base md:text-lg"
                            : "text-sm md:text-lg "
                    )}
                >
                    {description}
                </p>
            </article>
        </header>
    );
};

export default Header;
