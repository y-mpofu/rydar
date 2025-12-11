// Dynamically provide secrets from environment variables so they are not committed.
// Expo will prefer this file over app.json when present.
const appJson = require("./app.json");

module.exports = ({ config }) => {
  return {
    ...appJson.expo,
    ...config,
    extra: {
      MAPBOX_KEY: process.env.EXPO_PUBLIC_MAPBOX_KEY ?? "",
      GOOGLE_PLACES_KEY: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY ?? "",
    },
  };
};

