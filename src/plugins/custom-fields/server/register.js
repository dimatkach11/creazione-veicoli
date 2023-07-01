"use strict";

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: "custom-select",
    plugin: "custom-fields",
    type: "json",
  });
};
