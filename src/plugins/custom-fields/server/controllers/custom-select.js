'use strict';

module.exports = ({ strapi }) => ({
  async findMany(ctx) {
    ctx.body = await strapi
      .plugin('custom-fields')
      .service('customSelect')
      .findMany(ctx.request.body);
  },
});
