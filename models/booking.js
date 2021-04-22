"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init(
    {
      check_in: DataTypes.DATE,
      check_out: DataTypes.DATE,
      total: DataTypes.INTEGER,
      night: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      HotelId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
