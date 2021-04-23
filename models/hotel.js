"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    //instance method

    static hashingHandler(val) {
      let salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(val, salt);
    }

    removeDot(val) {
      return val.replace(".", "");
    }

    static associate(models) {
      Hotel.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: "HotelId",
      });
    }
  }
  Hotel.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Name is Required",
          },
        },
      },
      rating: DataTypes.INTEGER,
      location: DataTypes.STRING,
      image: DataTypes.STRING,
      price: {
        type: DataTypes.INTEGER,
        validate: {
          customValidator(value) {
            if (value < 1) {
              throw new Error("Price is Required");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Hotel",
    }
  );

  Hotel.addHook("beforeCreate", (instance, options) => {
    if (instance.location === "") {
      instance.location = "-";
    }

    if (instance.image === "") {
      instance.image =
        "https://blackmantkd.com/wp-content/uploads/2017/04/default-image.jpg";
    }
  });

  return Hotel;
};
