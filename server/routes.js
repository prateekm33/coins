const path = require('path');

module.exports = app => {
  // app.use('route path', route controller)
  app.use('*', (req, res) => {
    res.sendFile('index.html', { root : path.resolve(__dirname, '..', 'client')});
  })
}