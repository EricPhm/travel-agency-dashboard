import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { Header } from "components";
import React from "react";
import type { Route } from "./+types/create-trip";
import { select } from "@syncfusion/ej2-base";
import {
    comboBoxItems,
    groupTypes,
    interests,
    selectItems,
    travelStyles,
} from "~/constants";
import { cn, formatKey } from "lib/utils";
import {
    LayerDirective,
    LayersDirective,
    MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

// loader function to fetch all countries
export const loader = async () => {
    // need to fields, 10 fields max
    const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags,latlng,maps"
    );
    const data = await response.json();
    return data.map((country: any) => ({
        name: country.name.common,
        flag: country.flags.png,
        coordinates: country.latlng,
        openStreetMap: country.maps?.openStreetMap,
    }));
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
    const countries = loaderData as Country[];
    const navigate = useNavigate();

    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.name || "",
        travelStyle: "",
        interest: "",
        budget: "",
        duration: 0,
        groupType: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // console.log(countries);

    const countryData = countries.map((country) => ({
        name: country.name,
        flag: country.flag,
    }));

    const mapData = [
        {
            country: formData.country,
            color: "#EA382E",
            coordinate:
                countries.find((c: Country) => c.name === formData.country)
                    ?.coordinates || [],
        },
    ];

    const handleChange = (key: keyof TripFormData, value: string | number) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // prevent reload
        e.preventDefault();

        setLoading(true);

        if (
            !formData.country ||
            !formData.budget ||
            !formData.duration ||
            !formData.groupType ||
            !formData.interest ||
            !formData.travelStyle
        ) {
            setError("Please provide values for all fields");
            setLoading(false);
            return;
        }

        if (formData.duration < 1 || formData.duration > 10) {
            setError("Duration must be between 1 and 10 days");
            setLoading(false);
            return;
        }

        // check user authentication
        const user = await account.get();
        if (!user.$id) {
            console.error("User not authenticated");
            setLoading(false);
            return;
        }

        try {
            //
            // console.log("user", user);
            // console.log("formData", formData);

            // CALL API in routes/api/create-trip.ts that will trigger the AI API call
            const response = await fetch("/api/create-trip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    country: formData.country,
                    numberOfDays: formData.duration,
                    travelStyle: formData.travelStyle,
                    interest: formData.interest,
                    budget: formData.budget,
                    groupType: formData.groupType,
                    userId: user.$id,
                }),
            });

            //  CreateTripResponse is an interface
            const result: CreateTripResponse = await response.json();

            if (result?.id) navigate(`/trips/${result.id}`);
            else {
                console.log("Failed to generate trip");
            }
        } catch (e) {
            console.error("Error generating trip", e);
            setLoading(false);
        } finally {
            setLoading(true);
        }
    };

    return (
        // wrap everythin in main-tag meaning its a page
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header
                title="Add a New Trip"
                description="View and edit AI Generated travel plans"
            />
            {/* wrapper-md ensure the form stay in the center of the screen */}
            <section className="mt-2.5 wrapper-md">
                <form className="trip-form" onSubmit={handleSubmit}>
                    {/* country combobox */}
                    <div>
                        <label htmlFor="country">Country</label>
                        {/* typing and show matching country */}
                        <ComboBoxComponent
                            id="country"
                            // list of all country by fetch an api have all countries data
                            dataSource={countryData}
                            fields={{ text: "name", value: "name" }}
                            placeholder="Select a Country"
                            className="combo-box"
                            change={(e: { value: string | undefined }) => {
                                if (e.value) {
                                    handleChange("country", e.value);
                                }
                            }}
                            allowFiltering
                            filtering={(e) => {
                                const query = e.text.toLowerCase();
                                // filter function
                                const filtered = countries.filter((country) =>
                                    country.name.toLowerCase().includes(query)
                                );
                                e.updateData(filtered);
                            }}
                            // The itemTemplate gets called once for each object in that array
                            // For each country object, Syncfusion internally runs:
                            // const rendered = itemTemplate(countryObject);
                            itemTemplate={(data: any) => (
                                <div className="flex items-center gap-1">
                                    <img
                                        src={data.flag}
                                        alt={data.name}
                                        className="w-6 h-4 "
                                    />
                                    <span>{data.name}</span>
                                </div>
                            )}
                        />
                    </div>
                    {/* duration placeholder */}
                    <div className="">
                        <label htmlFor="duration">Duration</label>
                        <input
                            id="duration"
                            name="duration"
                            type="number"
                            placeholder="Enter a number of days"
                            className="form-input placeholder:text-gray-100"
                            onChange={(e) =>
                                handleChange("duration", Number(e.target.value))
                            }
                        />
                    </div>
                    {/* type of group */}
                    {selectItems.map((key) => (
                        <div key={key}>
                            <label htmlFor={key}>{formatKey(key)}</label>
                            <ComboBoxComponent
                                id={key}
                                // comboBoxItems in index.ts which create interface already
                                dataSource={comboBoxItems[key].map((item) => ({
                                    text: item,
                                    value: item,
                                }))}
                                fields={{ text: "text", value: "value" }}
                                placeholder={`Select ${formatKey(key)}`}
                                change={(e: { value: string | undefined }) => {
                                    if (e.value) {
                                        handleChange(key, e.value);
                                    }
                                }}
                                allowFiltering
                                filtering={(e) => {
                                    const query = e.text.toLowerCase();
                                    // filter function
                                    const filtered = comboBoxItems[key].filter(
                                        (item) =>
                                            item.toLowerCase().includes(query)
                                    );

                                    e.updateData(filtered);
                                }}
                                className="combo-box"
                            />
                        </div>
                    ))}
                    {/* create map */}
                    <div>
                        <label htmlFor="location">
                            Location on the world map
                        </label>
                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective
                                    // world_map.ts in constant have coordinates of all the country in the world
                                    shapeData={world_map}
                                    dataSource={mapData}
                                    shapePropertyPath="name"
                                    shapeDataPath="country"
                                    shapeSettings={{
                                        colorValuePath: "color",
                                        fill: "#e5e5e5",
                                    }}
                                />
                            </LayersDirective>
                        </MapsComponent>
                    </div>

                    <div className="bg-gray-200 h-px w-full" />

                    {/* Error UI */}
                    {error && (
                        <div className="error">
                            <p>{error}</p>
                        </div>
                    )}

                    <footer className="px-6 w-full">
                        <ButtonComponent
                            type="submit"
                            className="button-class !h-12 !w-full"
                            disabled={loading}
                        >
                            <img
                                src={`../public/assets/icons/${
                                    loading ? "loader.svg" : "magic-star.svg"
                                }`}
                                className={cn("size-5", {
                                    "animate-spin": loading,
                                })}
                            />
                            <span className="p-16-semibold text-white">
                                {loading ? "Generating..." : "Generate Trip"}
                            </span>
                        </ButtonComponent>
                    </footer>
                </form>
            </section>
        </main>
    );
};

export default CreateTrip;
