'use strict';

module.exports = ({ strapi }) => ({
  async findMany(ctx) {
    ctx.body = await strapi
      .plugin('awesome-help')
      .service('helpService')
      .findMany(ctx.query);
  },
});
