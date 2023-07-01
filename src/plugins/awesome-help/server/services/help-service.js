'use strict';

module.exports = ({ strapi }) => ({
  async findMany(params, populate) {
    console.log(params, populate);
    const query = strapi.db.query('plugin::awesome-help.help');
    let helpEntities = undefined;
    try {
      helpEntities = query.findMany(params, populate);
    }
    catch (exp) {
      throw new Error(`Help Service: An error occured when get help: ${exp.message}`);
    }
    return helpEntities;
  },
});
