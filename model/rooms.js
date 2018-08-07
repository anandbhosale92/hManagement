module.exports = {
  async addRooms(data) {

    const insertParam = {
      hotelId          : objectID(data.hotelId),
      roomNo           : data.roomNo,
      type             : data.type,
      floorNo          : data.floorNo,
      price            : data.price,
      beds             : data.beds,
      maxOccupancy     : data.maxOccupancy,
      status           : 'Y',
      reserved         : [],
      insertedOn       : new Date()
    };

    //CHECK FOR USER HAS ALREADY REQUEST OR NOT
    const result = await mongoClient.collection(roomsDB).insert(insertParam);

    return await result;
  },

  async getRooms(data) {
    const objData = ['hotelId', 'type', 'beds','maxOccupancy', 'price'];
    const findQuery    = {};
    for (var key in data) {
      /**
       * 1.Condition check for object has key
       * 2.key is not null or undefined
       * 3.if key is passed in objData exist in it
       */
      if (data[key] && objData.includes(key)) {
        findQuery[key] = data[key];
      }
    }

    //IF FROM, TO DATE ARE PASSED THEN DO NOT GET THOSE ROOMS WHICH COMES UNDER FOLLOWING DATE RANGE
    if (data.fromDate && data.toDate) {

      findQuery.reserved = {
        //Check if any of the dates the room has been reserved for overlap with the requsted dates
        $not: {
            $elemMatch: {from: {$lt: data.toDate}, to: {$gt: data.fromDate }}
        }
      }
    }

    const projection = {
      roomNo      : 1,
      type        : 1,
      floorNo     : 1,
      price       : 1,
      beds        : 1,
      maxOccupancy: 1,
    };
    const result = await mongoClient.collection(roomsDB).find(findQuery, projection).toArray();

    return await result;
  },
  async bookRoom(data) {
    const query = {_id : objectID(data.roomId)};
    const updateQuery = {
      $push: { "reserved": { from: data.fromDate, to: data.toDate } }
    };

    await mongoClient.collection(roomsDB).update(query, updateQuery);
    //NOW ADD USER TRANSACTION DATA IN BOOKING HISTORY TABLE

    const insertParam = {
      userId      : objectID(data.userId),
      roomId      : objectID(data.roomId),
      bookingDate : {
        from  : data.fromDate,
        to    : data.toDate
      },
      insertedOn : new Date()
    };

    await mongoClient.collection(bookingDB).insert(insertParam);

    return await true;
  },
  //CHECK FOR NO OF ROOM in HOTEL ADDED
  //IF FLOORNO IS PASSED THEN CHECK FOR ROOM ON FLOOR FOR A HOTEL
  async checkNoOfRooms(data) {
    const checkQuery = { hotelId: objectID(data.hotelId) };
    if (data.floorNo) {
      checkQuery.floorNo = data.floorNo;
    }

    const response = await mongoClient.collection(roomsDB).find(checkQuery).toArray();

    return await response;
  },
  async CheckRoomExists(data) {
    const findQuery = { _id: objectID(data.roomId) };
    const response = await mongoClient.collection(roomsDB).findOne(findQuery);
    return await response;
  },
  async checkRoomAvailibility(data) {
    const findQuery = { _id: objectID(data.roomId) };
    findQuery.reserved = {
      //Check if any of the dates the room has been reserved for overlap with the requsted dates
      $not: {
          $elemMatch: {from: {$lt: data.toDate}, to: {$gt: data.fromDate }}
      }
    }
    const response = await mongoClient.collection(roomsDB).findOne(findQuery);

    return await response;
  }
};
