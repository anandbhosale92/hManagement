const user           = require('../model/user');
const hotels         = require('../model/hotels');
const rooms          = require('../model/rooms');
const commonFunction = require('../handlers/common');
const sendResp       = require('../handlers/sendResponse');

const response = {};
module.exports = {
  async addRooms(req, res, next) {
    response.res = res;
    //VALIDATION PART
    let data = req.body;
    const requiredParam = ['userId', 'hotelId', 'type', 'floorNo', 'price', 'beds', 'maxOccupancy', 'roomNo'];

    if (!commonFunction.checkEmptyValue(data, requiredParam)) {
      response.type = 'E';
      response.code = 20;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR USER ALREADY EXSITS OR NOTs
    //IF USERS ROLE = {USER} THEN RETURN
    const isExists = await user.checkUser(data);
    if(!isExists || isExists.role === 'USER') {
      response.type = 'E';
      response.code = 21;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR HOTEL EXISTS OR NOT
    const isHotelExists = await hotels.checkHotelExists(data);

    if (!isHotelExists) {
      response.type = 'E';
      response.code = 22;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR FLOOR NO. PASS EXISTS FOR HOTEL OR NOT
    if (data.floorNo > isHotelExists.noOfFloors) {
      response.type = 'E';
      response.code = 23;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR ROOM CAN BE ADDED ON HOTEL FLOOR OR NOT
    const noOfRoomsOnFloor = await rooms.checkNoOfRooms(data);
    if (noOfRoomsOnFloor.length >= isHotelExists.noOfRoomPerFloor) {
      response.type = 'E';
      response.code = 24;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR TOTAL ROOM HOTEL ARE OCCUPIED IF OCCUPIED THEN
    //IF OCCUPIED THEN NEW ROOM CANNOT BE ADDED
    const ttlRooms = await rooms.checkNoOfRooms({ hotelId: data.hotelId });
    if (ttlRooms.length >= isHotelExists.totalRooms) {
      response.type = 'E';
      response.code = 25;

      sendResp.sendResponse(response);
      return;
    }

    // ALL SET ADD ROOMS TO A HOTEL
    try {
      let resp = await rooms.addRooms(data);
      //LOOP THROUGH RESPONSE FOR FORMATTING RESPONSE
      // resp = formatGetPrescriptionResponse(resp);
      const resTxt    = { msg: "rooms added successfully", id: resp.insertedIds[0] };
      response.type   = 'S';
      response.result = resTxt;
      //ALL FINE RETURN RESULT
      sendResp.sendResponse(response);
      return;
    }
    catch (e) {
      response.type = 'E';
      response.code = 26;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    };
  },
  async getRooms(req, res, next) {
    response.res = res;
    //VALIDATION PART
    let data = req.body;

    //CHECK FOR USER ALREADY EXSITS OR NOTs
    //IF USERS ROLE = {USER} THEN RETURN
    if (data.userId) {
      const isExists = await user.checkUser(data);
      if(!isExists) {
        response.type = 'E';
        response.code = 27;

        sendResp.sendResponse(response);
        return;
      }
    }

    //CHECK FOR HOTEL EXISTS OR NOT
    if (data.hotelId) {
      const isHotelExists = await hotels.checkHotelExists(data);

      if (!isHotelExists) {
        response.type = 'E';
        response.code = 28;

        sendResp.sendResponse(response);
        return;
      }
    }

   //CHECK IF START DATE IS PASSED THEN CHECK FOR END DATE SHOULD NOT BE GREATER THAT START DATE

    // ALL SET ADD ROOMS TO A HOTEL
    try {
      let resp = await rooms.getRooms(data);
      for (let i = 0; i < resp.length; i++) {
        resp[i].roomId = resp[i]._id;
        delete resp[i]._id;
      }
      //LOOP THROUGH RESPONSE FOR FORMATTING RESPONSE
      // resp = formatGetPrescriptionResponse(resp);
      response.type   = 'S';
      response.result = resp;
      //ALL FINE RETURN RESULT
      sendResp.sendResponse(response);
      return;
    }
    catch (e) {
      response.type = 'E';
      response.code = 29;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    };
  },
  async bookRoom(req, res, next) {
    response.res = res;
    //VALIDATION PART
    let data = req.body;
    const requiredParam = ['userId', 'roomId', 'fromDate', 'toDate'];

    if (!commonFunction.checkEmptyValue(data, requiredParam)) {
      response.type = 'E';
      response.code = 30;

      sendResp.sendResponse(response);
      return;
    }
    //CHECK FOR USER ALREADY EXSITS OR NOTs
    //IF USERS ROLE = {USER} THEN RETURN
    const isExists = await user.checkUser(data);
    if(!isExists) {
      response.type = 'E';
      response.code = 31;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR ROOM EXISTS OR NOT AND ALSO AVAILABLE IN FOLLOWING DATE RANGE
    const isRoomExits = await rooms.CheckRoomExists(data);

    if (!isRoomExits) {
      response.type = 'E';
      response.code = 32;

      sendResp.sendResponse(response);
      return;
    }
    //CHECK FOR BOOKING IS AVAILABLE FOR FOLLOWING DATE OR NOT
    const isRoomAvailable = await rooms.checkRoomAvailibility(data);

    if (!isRoomAvailable) {
      response.type = 'E';
      response.code = 33;

      sendResp.sendResponse(response);
      return;
    }

    //ALL SET BOOK ROOM
    try {
      let resp = await rooms.bookRoom(data);
      const resTxt    = { msg: "rooms booked successfully"};
      response.type   = 'S';
      response.result = resTxt;
      //ALL FINE RETURN RESULT
      sendResp.sendResponse(response);
      return;
    }
    catch (e) {
      response.type = 'E';
      response.code = 34;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    };

  }
};
