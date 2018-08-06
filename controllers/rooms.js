const user           = require('../model/user');
const hotels         = require('../model/hotels');
const rooms          = require('../model/rooms');
const commonFunction = require('../handlers/common');
const sendResp       = require('../handlers/sendResponse');
const moment 				 = require('moment');

const response = {};
module.exports = {
  async addRooms(req, res, next) {
    response.res = res;
    //VALIDATION PART
    let data = req.body;
    const requiredParam = ['userId', 'hotelId', 'type', 'floorNo', 'price'];

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
      console.log('herererer');
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
};
