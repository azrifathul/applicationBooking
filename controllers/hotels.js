const { Hotel } = require("../models");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const { moneyFormatter } = require("../helpers");
class Hotels {
  static getDataHandler(req, res) {
    Hotel.findAll({
      order: [["id", "ASC"]],
    })
      .then((data) => {
        console.log(data);
        data.forEach((item) => {
          const instance = new Hotel();

          item.price = moneyFormatter(item.price);
          item.name = instance.toUpperCaseByWord(item.name);
        });
        res.render("hotels/main", {
          data,
          role: req.session.role,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static addDataHandler(req, res) {
    const errors = req.query.errors ? JSON.parse(req.query.errors) : {};
    res.render("hotels/form", {
      data: {},
      type: "add",
      errors,
      role: req.session.role,
    });
  }

  static editDataHandler(req, res) {
    const errors = req.query.errors ? JSON.parse(req.query.errors) : {};
    Hotel.findByPk(Number(req.params.id))
      .then((data) =>
        res.render("hotels/form", {
          data,
          type: "edit",
          errors,
          role: req.session.role,
        })
      )
      .catch((err) => res.send(err));
  }

  static addPostHandler(req, res) {
    let obj = {
      name: req.body.name,
      rating: Number(req.body.rating),
      location: req.body.location,
      price: Number(req.body.price),
      image: req.body.image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    Hotel.create(obj)
      .then(() => res.redirect("/hotels"))
      .catch((err) => {
        if (err.name === "SequelizeValidationError") {
          let obj = {};
          err.errors.forEach((item) => {
            obj[item.path] = item.message;
          });

          res.redirect(`/hotels/add?errors=${JSON.stringify(obj)}`);
        } else {
          res.send(err);
        }
      });
  }

  static editPostHandler(req, res) {
    let obj = {
      name: req.body.name,
      rating: Number(req.body.rating),
      location: req.body.location,
      price: Number(req.body.price),
      image: req.body.image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    Hotel.update(obj, { where: { id: Number(req.params.id) } })
      .then(() => res.redirect("/hotels"))
      .catch((err) => {
        if (err.name === "SequelizeValidationError") {
          let obj = {};
          err.errors.forEach((item) => {
            obj[item.path] = item.message;
          });

          res.redirect(
            `/hotels/edit/${req.params.id}?errors=${JSON.stringify(obj)}`
          );
        } else {
          res.send(err);
        }
      });
  }

  static deleteDataHandler(req, res) {
    Hotel.destroy({
      where: {
        id: Number(req.params.id),
      },
    })
      .then(() => res.redirect("/hotels"))
      .catch((err) => res.send(err));
  }

  static loginHandler(req, res) {
    res.render("hotels/login", {
      role: req.session.role,
    });
  }

  static postLoginHandler(req, res) {
    const hashResult = Hotel.hashingHandler(req.body.password);

    //manual
    if (
      req.body.email === "superadmin@gmail.com" &&
      bcrypt.compareSync("superadmin", hashResult)
    ) {
      req.session.role = "admin";
      req.session.isLogin = true;
      res.redirect("/hotels");
    }

    // getComputedStyle.findAll({
    //   where: {
    //     email: req.body.email,
    //     password: req.body.password,
    //   },
    // });
  }

  static logoutHandler(req, res) {
    req.session.destroy();
    res.redirect("/hotels");
  }
}

module.exports = Hotels;
