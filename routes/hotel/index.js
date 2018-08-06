const router  = require('express').Router();
const hotels = require('../../controllers/hotels');
const rooms = require('../../controllers/rooms');

/**
 USER LOGIN, CREATE USER ROUTE NEED TO ADDED
*/
router.post('/hotel/addHotel', hotels.addHotels);
router.post('/hotel/addRooms', rooms.addRooms);
router.patch('/hotel/:hotelId', hotels.update);
router.delete('/hotel/remove', hotels.remove);

module.exports = router;
