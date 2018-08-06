module.exports = {
  async addRooms(data) {

    const insertParam = {
      hotelId          : objectID(data.hotelId),
      type             : data.type,
      floorNo          : data.floorNo,
      price            : data.price,
      status           : 'Y',
      insertedOn       : new Date()
    };

    //CHECK FOR USER HAS ALREADY REQUEST OR NOT
    const result = await mongoClient.collection(roomsDB).insert(insertParam);

    return await result;
  },

  //CHECK FOR NO OF ROOM in HOTEL ADDED
  //IF FLOORNO IS PASSED THEN CHECK FOR ROOM ON FLOOR FOR A HOTEL
  async checkNoOfRooms(data) {
    const checkQuery = { hotelId: objectID(data.hotelId) };
    if (data.floorNo) {
      checkQuery.floorNo = data.floorNo;
    }
    console.log(checkQuery);
    const response = await mongoClient.collection(roomsDB).find(checkQuery).toArray();

    return await response;
  }
};
