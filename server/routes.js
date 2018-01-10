const path = require('path');
const authRouter = require('./routers/authRouter');

module.exports = app => {
  // app.use('route path', route controller)
  app.use('/auth', authRouter);
  app.use('*', (req, res) => {
    res.sendFile('index.html', { root : path.resolve(__dirname, '..', 'client')});
  })
}