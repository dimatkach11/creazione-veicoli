module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: 'myController.index',
    config: {
      policies: [],
    },
  },
  {
    // type: 'content-api',
    method: 'GET',
    path: '/helps',
    handler: 'helpController.findMany',
    config: {
      policies: [],
      auth: false
    },
  },
];
