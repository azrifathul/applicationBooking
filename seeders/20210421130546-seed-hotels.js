"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = require("../dummyData/hotels.json");
    data.forEach((element) => {
      element.createdAt = new Date();
      element.updatedAt = new Date();
    });

    return queryInterface.bulkInsert("Hotels", data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Hotels", null, {});
  },
};
