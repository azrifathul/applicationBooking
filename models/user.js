"use strict";
const bcrypt = require("bcryptjs");
// const { encryptPwd } = require('../helpers/bcrypt')
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static moneyFormatter(num) {
      const result = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(num);

      return result;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Hotel, {
        through: models.Booking,
        foreignKey: "UserId",
      });
    }
  }
  User.init(
    {
      fullName: {
        type: DataTypes.STRING,
        // validate: {
        //   notEmpty: {
        //     msg: "Name must not be empty"
        //   }
        // }
      },
      email: {
        type: DataTypes.STRING,
        // validate: {
        //   isEmail: {
        //     msg: "Please enter a valid email address"
        //   },
        //   notEmpty: {
        //     msg: "Email cannot be empty"
        //   }
        // }
      },
      password: {
        type: DataTypes.STRING,
      },
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      // hooks: {
      //   beforeCreate: (instance, option) => {
      //     console.log(instance.password)
      //     instance.password = encryptPwd(instance.password)
      //   }

      // },
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(User) {
          if (User.changed("password")) {
            const encryptPwd = (password) => bcrypt.hashSync(password, 10);
            User.password = encryptPwd(User.password);
          }
        },
        beforeUpdate(User) {
          if (User.changed("password")) {
            const encryptPwd = (password) => bcrypt.hashSync(password, 10);
            User.password = encryptPwd(User.password);
          }
        },
      },
    }
  );

  return User;
};
