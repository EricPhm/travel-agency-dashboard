import { calculateTrendPercentage } from "lib/utils";
import React from "react";
import { cn } from "lib/utils";

// interface StatsCard in index.d.ts
const StatsCard = ({
    headerTitle,
    total,
    currentMonthCount,
    lastMonthCount,
}: StatsCard) => {
    // use the function calculateTrendPercentage in utils.ts folder
    const { trend, percentage } = calculateTrendPercentage(
        currentMonthCount,
        lastMonthCount
    );

    const isDecrement = trend === "decrement";

    // using the className css (stats-card) in folder app.css
    return (
        <article className="stats-card">
            <h3 className="text-base font-medium">{headerTitle}</h3>
            <div className="content">
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl font-semibold">{total}</h2>
                    <div className="flex items-center gap-2">
                        <figure className="flex items-center gap-1">
                            <img
                                src={`../public/assets/icons/${
                                    isDecrement
                                        ? "arrow-down-red.svg"
                                        : "arrow-up-green.svg"
                                }`}
                                className="size-5"
                                alt="arrow"
                            />
                            <figcaption
                                className={cn(
                                    "text-sm font-medium",
                                    isDecrement
                                        ? "text-red-500"
                                        : "text-success-700"
                                )}
                            >
                                {Math.round(percentage)}%
                            </figcaption>
                            <p className="text-sm-medium text-gray-100 truncate">
                                vs last month
                            </p>
                        </figure>
                    </div>
                </div>
                <img
                    src={`../public/assets/icons/${
                        isDecrement ? "decrement.svg" : "increment.svg"
                    }`}
                    // extralare device: w-32 w-full || medium device: hh-32
                    className="xl:w-32 w-full h-full md:h-32 xl:h-full"
                    alt="trend graph"
                />
            </div>
        </article>
    );
};

export default StatsCard;
