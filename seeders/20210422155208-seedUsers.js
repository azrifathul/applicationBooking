"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = require("../dummyData/users.json");
    data.forEach((element) => {
      element.createdAt = new Date();
      element.updatedAt = new Date();
    });

    return queryInterface.bulkInsert("Users", data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
