var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
  async checkUser(data) {
    const checkQuery =  { $or: [{email: data.email}, {_id : objectID(data.userId) }]  };

    const response = await mongoClient.collection(userDB).findOne(checkQuery);

    return await response;
  },

  async createUser(data) {

    const insertParam = {
      email    : data.email,
      mobile   : data.mobile,
      name     : data.name,
      password : await bcrypt.hash(data.password, saltRounds),
      role     : data.role.toUpperCase(),
      createdOn: new Date()
    };

    let resp = await mongoClient.collection(userDB).insert(insertParam);

    return await resp;
  },

  async updateUser(data) {
    //CHECK FOR USER EXISTS
    const checkQuery = { _id: objectID(data.userId) };
    delete data.userId;
    const objData = ['mobile', 'name', 'password'];
    const temp    = {};
    for (var key in data) {
      /**
       * 1.Condition check for object has key
       * 2.key is not null or undefined
       * 3.if key is passed in objData exist in it
       */
      if (key === 'password') {
        data[key] = await bcrypt.hash(data[key], saltRounds)
      }

      if (data[key] && objData.includes(key)) {
        temp[key] = data[key];
      }
    }

    let result = await mongoClient.collection(userDB).update(checkQuery, { $set: temp }, { upsert: true });

    if (result.result.ok === 1) {
      return await true;
    }

    return await false;
  },

  async removeUser(data) {
    const removeQuery = { _id: objectID(data.userId) };

    await mongoClient.collection(userDB).remove(removeQuery);
    //REMOVE ALL ROOMS BOOKING ADDED FOR FOLLOWING USER

    return await true;
  }
};

