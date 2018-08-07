
const errMsg = [];

const commonMsg = [];
commonMsg[1] = 'Required field not passed';
commonMsg[2] = commonMsg[2];
commonMsg[3] = 'Unable to process request. Please try again later.';
commonMsg[4] = 'No such user found aginst particular Id.';


errMsg[1] = commonMsg[1];
errMsg[2] = commonMsg[2];
errMsg[3] = 'User is already created with same email.';
errMsg[4] = commonMsg[3];
errMsg[5] = commonMsg[1];
errMsg[6] = commonMsg[4];
errMsg[7] = commonMsg[3];
errMsg[8] = commonMsg[1];
errMsg[9] = commonMsg[4];
errMsg[10] = commonMsg[3];
errMsg[11] = commonMsg[1];
errMsg[12] = 'Total rooms are less than rooms on each floor';
errMsg[13] = 'Unauthorised to access.';
errMsg[14] = commonMsg[3];
errMsg[15] = commonMsg[1];
errMsg[16] = commonMsg[3];
errMsg[17] = commonMsg[1];
errMsg[18] = 'Unauthorised to access.';
errMsg[19] = commonMsg[3];
errMsg[20] = commonMsg[1];
errMsg[21] = 'Unauthorised to access.';
errMsg[22] = 'No hotel detail found with following id';
errMsg[23] = 'Floor no is greater than the total no of hotel';
errMsg[24] = 'No more rooms can be added on current floor';
errMsg[25] = 'Room addition limit exausted';
errMsg[26] = commonMsg[3];
errMsg[27] = commonMsg[4];
errMsg[28] = 'No hotel found with following id.';
errMsg[29] = commonMsg[3];
errMsg[30] = commonMsg[1];
errMsg[31] = commonMsg[4];
errMsg[32] = 'No room detail found againsts roomId';
errMsg[33] = 'No room available for following dates';
errMsg[34] = commonMsg[3];

module.exports = {
  sendResponse(data) {

    //ERROR REQUEST
    if (data.type === 'E') {
      data.res.status(400).json({ msg: errMsg[data.code], code : data.code });
      return;
    }

    data.res.status(200).json(data.result);
    return;
  }
};
