const routes   = require('express').Router();
const user = require('./user');
const hotel  = require('./hotel');

routes.use('/api/user', user);
routes.use('/api', hotel);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;
