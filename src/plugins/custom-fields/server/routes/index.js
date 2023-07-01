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
    method: 'POST',
    path: '/custom-select',
    handler: 'customSelect.findMany',
    config: {
      policies: [],
      auth: false
    },
  },
];
