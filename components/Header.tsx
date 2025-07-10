import React from "react";
import { cn } from "lib/utils";
import { Link, useLocation } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

// optional for ctaText and ctaUrl for header in trips.tsx
interface Props {
    title: string;
    description: string;
    ctaText?: string;
    ctaUrl?: string;
}

const Header = ({ title, description, ctaText, ctaUrl }: Props) => {
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
            {/* A button that redirect to /trips/create */}
            {ctaText && ctaUrl && (
                <Link to={ctaUrl}>
                    <ButtonComponent
                        type="button"
                        className="button-class !h-11 !w-full md:w-[240px]"
                    >
                        <img
                            src="../public/assets/icons/plus.svg"
                            alt="plus"
                            className="size-5"
                        />
                        <span className="p-16-semibold text-white">
                            {ctaText}
                        </span>
                    </ButtonComponent>
                </Link>
            )}
        </header>
    );
};

export default Header;
