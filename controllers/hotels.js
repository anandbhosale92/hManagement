const user           = require('../model/user');
const hotels         = require('../model/hotels');
const commonFunction = require('../handlers/common');
const sendResp       = require('../handlers/sendResponse');
const moment 				 = require('moment');

const response = {};
module.exports = {
  async addHotels(req, res, next) {
    response.res = res;
    //VALIDATION PART
    let data = req.body;
    const requiredParam = ['name', 'description', 'address', 'totalRooms', 'noOfFloors', 'noOfRoomPerFloor', 'userId'];

    if (!commonFunction.checkEmptyValue(data, requiredParam)) {
      response.type = 'E';
      response.code = 11;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR TOTAL ROOMS IS EQUAL TO  NO OF FLOORS * NO OF FLAT PER FLOOR
    if ((data.noOfFloors * data.noOfRoomPerFloor) !== data.totalRooms) {
      response.type = 'E';
      response.code = 12;

      sendResp.sendResponse(response);
      return;
    }
    //CHECK FOR USER ALREADY EXSITS OR NOT
    //IF USERS ROLE = {USER} THEN RETURN
    const isExists = await user.checkUser(data);

    if (!isExists || isExists.role === 'USER') {
      response.type = 'E';
      response.code = 13;

      sendResp.sendResponse(response);
      return;
    }

    // ALL SET ADD NEW HOTELS
    try {
      const resp = await hotels.addHotels(data);
      const resTxt = { msg: "Hotel added successfully", id: resp.insertedIds[0] };
      response.type = 'S';
      response.result = resTxt;
      //ALL FINE RETURN RESULT
      sendResp.sendResponse(response);
      return;
    }
    catch (e) {
      response.code = 14;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    };
  },

  async update(req, res, next) {
    //VALIDATION PART
    response.res = res;
    let data = req.body;

    const hotelId = req.params.hotelId;

    if (!objectID.isValid(hotelId)) {
      response.type = 'E';
      response.code = 15;

      sendResp.sendResponse(response);
      return;
    }
    data.hotelId = hotelId;

    //ALL SET
    try {
      const resp = await hotels.updateHotel(data);
      if (resp) {
        const respTxt = { msg: "Hotel Detail updated successfully", hotelId: hotelId };
        response.type = 'S';
        response.result = respTxt;
        //ALL FINE RETURN RESULT
        sendResp.sendResponse(response);
        return;
      }

      throw 14;
    }
    catch (e) {
      response.type = 'E';
      response.code = 16;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    }
  },

  async remove(req, res, next) {
    response.res = res;
    //VALIDATION PART
    let data = req.body;
    const requiredParam = ['hotelId', 'userId'];

    if (!commonFunction.checkEmptyValue(data, requiredParam)) {
      response.type = 'E';
      response.code = 17;

      sendResp.sendResponse(response);
      return;
    }

    //CHECK FOR USER ALREADY EXSITS OR NOT
    //IF USERS ROLE = {USER} THEN RETURN
    const isExists = await user.checkUser(data);

    if (!isExists || isExists.role === 'USER') {
      response.type = 'E';
      response.code = 18;

      sendResp.sendResponse(response);
      return;
    }

    //ALL SET REMOVE HOTEL ALONG WITH ITS ROOMS
    try {
      const resp = await hotels.removeHotel(data);
      const resTxt = { msg: "Hotel removed successfully" };
      response.type = 'S';
      response.result = resTxt;
      //ALL FINE RETURN RESULT
      sendResp.sendResponse(response);
      return;
    }
    catch (e) {
      response.type = 'E';
      response.code = 19;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    };
  }
};
