'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('awesome-help')
      .service('myService')
      .getWelcomeMessage();
  },
});
