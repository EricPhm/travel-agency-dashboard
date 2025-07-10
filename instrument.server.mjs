import * as Sentry from "@sentry/react-router";

Sentry.init({
    dsn: "https://f9e3d8aaab9a4a9c637ba1b5e518d3d5@o4509533740597248.ingest.us.sentry.io/4509533744594944",

    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
});
