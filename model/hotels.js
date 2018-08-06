module.exports = {
  async addHotels(data) {

    const insertParam = {
      name             : data.name,
      description      : data.description,
      address          : data.address,
      totalRooms       : data.totalRooms,
      noOfFloors       : data.noOfFloors,
      noOfRoomPerFloor : data.noOfRoomPerFloor,
      roomsOccupied    : 0,
      insertedOn       : new Date()
    };

    //CHECK FOR USER HAS ALREADY REQUEST OR NOT
    const result = await mongoClient.collection(hotelsDB).insert(insertParam);

    return await result;
  },
  async updateHotel(data) {
    //CHECK FOR HOTEL EXISTS
    const checkQuery = { _id: objectID(data.hotelId) };
    const hotel    = await mongoClient.collection(hotelsDB).findOne(checkQuery);

    if (!hotel) {
      throw 13;
    }

    delete data.hotelId;
    const objData = ['name', 'description', 'address'];
    const temp    = {};
    for (var key in data) {
      /**
       * 1.Condition check for object has key
       * 2.key is not null or undefined
       * 3.if key is passed in objData exist in it
       */
      if (data[key] && objData.includes(key)) {
        temp[key] = data[key];
      }
    }

    let result = await mongoClient.collection(hotelsDB).update(checkQuery, { $set: temp }, { upsert: true });

    if (result.result.ok === 1) {
      return await true;
    }

    return await false;
  },
  async removeHotel(data) {
    const removeQuery = { _id: objectID(data.hotelId) };

    await mongoClient.collection(hotelsDB).remove(removeQuery);
    //REMOVE ALL ROOMS ADDED FOR FOLLOWING HOTEL
    const removeRooms = { hotelId: objectID(data.hotelId) };
    await mongoClient.collection(roomsDB).remove(removeRooms);

    return await true;
  },

  //CHECK FOR HOTEL EXISTS OR NOT
  async checkHotelExists(data) {
    const checkQuery = { _id: objectID(data.hotelId) };

    const response = await mongoClient.collection(hotelsDB).findOne(checkQuery);

    return await response;
  },
};
