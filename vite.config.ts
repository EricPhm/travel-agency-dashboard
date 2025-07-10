import { reactRouter } from "@react-router/dev/vite";
import {
    sentryReactRouter,
    type SentryReactRouterBuildOptions,
} from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// new config
const sentryConfig: SentryReactRouterBuildOptions = {
    org: "seattle-university-7a",
    project: "travel-agencies",
    // An auth token is required for uploading source maps.
    authToken:
        "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",
    // ...
};

export default defineConfig((config) => {
    return {
        plugins: [
            tailwindcss(),
            tsconfigPaths(),
            reactRouter(),
            sentryReactRouter(sentryConfig, config),
        ],
        sentryConfig,
        ssr: {
            noExternal: [/@syncfusion/],
        },
    };
});

// export default defineConfig({
//     plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
//     ssr: {
//         noExternal: [/@syncfusion/],
//     },
// });
