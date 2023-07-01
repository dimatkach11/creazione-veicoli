"use strict";

module.exports = ({ strapi }) => ({
  getWelcomeMessage() {
    return { message: "Welcome to Strapi 🚀" };
  },
});
