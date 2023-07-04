"use strict";

/**
 * `custom-select` middleware
 */

const keyExists = async (obj, key, strapi) => {
  if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
    return false;
  } else if (obj.hasOwnProperty(key)) {
    const jsonValue = obj[key];

    if (jsonValue && typeof jsonValue === "object") {
      console.log(jsonValue);

      const collectionTypeNames = Object.keys(jsonValue);
      for (const name of collectionTypeNames) {
        const collection = await strapi.entityService.findOne(
          `api::${name}.${name}`,
          jsonValue[name].id
        );
        console.log(collection);
        obj[name] = collection;
      }
      delete obj[key];
    }

    return true;
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const result = await keyExists(obj[i], key, strapi);
      if (result) {
        return result;
      }
    }
  } else {
    for (const k in obj) {
      const result = await keyExists(obj[k], key, strapi);
      if (result) {
        return result;
      }
    }
  }

  return false;
};

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In global custom-select middleware.");

    const requestUrl = ctx.request.url;
    const isApiRequest = requestUrl.indexOf("/api/") === 0;

    let customSelectFieldName = undefined;
    if (isApiRequest) {
      const populate = ctx.request.query.populate;
      customSelectFieldName = populate?.["custom-select"];
    }

    let response = {};
    await next();

    if (isApiRequest && customSelectFieldName && ctx.response.status === 200) {
      response = ctx.response.body;
      // console.log(response);
      const isKeyInResponse = await keyExists(
        response,
        customSelectFieldName,
        strapi
      );
      console.log(isKeyInResponse);
      ctx.response.body = response;
    }

    // console.log(ctx.response.body);
  };
};
