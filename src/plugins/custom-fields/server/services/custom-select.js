"use strict";

module.exports = ({ strapi }) => ({
  async findMany(body) {
    const { collectionTypeNames, filter } = body;

    try {
      const collectionEntities = await Promise.all(
        collectionTypeNames.map((collectionTypeName) => {
          return strapi.entityService.findMany(
            `api::${collectionTypeName}.${collectionTypeName}`,
            {
              // fields: ['title', 'description'],
              filters: filter ? { ...filter } : {},
              // filters: { title: 'Hello World' },
              sort: { createdAt: "DESC" },
              // populate: { category: true },
            }
          );
        })
      );

      const collections = collectionTypeNames.map((collectionType, index) => ({
        name: collectionType,
        entities: collectionEntities[index],
      }));

      return {
        services: "custom-fields.customSelect.findMany",
        ...body,
        collections,
      };
    } catch (exp) {
      throw new Error(
        `Custom Select Service: An error occurred when get findMany: ${exp.message}`
      );
    }
  },
});
