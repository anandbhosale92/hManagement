
// Bring in our dependencies
const
  app        = require('express')(),
  bodyParser = require('body-parser'),
  routes     = require('./routes'),
  mongo      = require('mongodb').MongoClient,
  objectID   = require('mongodb').ObjectID,
  PORT       = process.env.PORT || 3000,
  mongoUrl   = process.env.MONGOURL || 'mongodb://localhost:27017/hotel';

mongo.connect(mongoUrl, function (err, db) {
  if (err) {
    console.log(err);
  }

  global.mongoClient  = db;
  global.objectID     = objectID;
  global.hotelsDB     = process.env.hotelsDB || 'hotels';
  global.userDB       = process.env.userDB || 'users';
  global.roomsDB      = process.env.roomsDB || 'rooms';
  global.bookingDB    = process.env.bookingDB || 'bookinghistory';
});
app.use(bodyParser.json());
//  Connect all our routes to our application
app.use('/', routes);

// Turn on that server!
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
