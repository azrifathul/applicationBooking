const { User, Hotel } = require("../models");
const bcrypt = require("bcryptjs");
const { moneyFormatter } = require("../helpers");

class Users {
  static getSignUp(req, res) {
    res.render("users/signUp");
  }

  static getAllUser(req, res) {
    User.findAll()
      .then((data) => res.render("/users", { data }))
      .catch((err) => res.send(err));
  }

  static postLoginHandler(req, res) {
    const { email, password } = req.body;

    User.findOne({ where: { email } })
      .then((data) => {
        if (data) {
          const decryptPwd = (password, dbPassword) =>
            bcrypt.compareSync(password, dbPassword);
          if (decryptPwd(password, data.password)) {
            req.session.user = data;
            req.session.role = data.role;
            req.session.isLogin = true;
            res.redirect("/hotels");
          } else {
            res.send("WRONG EMAIL AND PASSWORD COMBINATION");
          }
        } else {
          res.send("Email does not exist, please register");
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static postUpdateProfile(req, res) {
    User.update(req.body, {
      where: { id: req.session.user.id },
      individualHooks: true,
    })
      .then(() => {
        req.session.isLogin = true;
        res.redirect("/hotels");
      })
      .catch((err) => {
        res.send(err);
      });
    User.findOne({ where: { id: req.session.user.id } }).then((data) => {
      res.session.user = data;
    });
  }

  static deleteUser(req, res) {
    User.del({ where: { id: req.params.id } })
      .then(() => {
        res.session.user = null;
        res.session.isLogin = false;
        res.redirect("login");
      })
      .catch((err) => res.send(err));
  }

  static signUp(req, res) {
    let isFound = false;
    let role;
    const { fullName, email, password, address, phoneNumber } = req.body;

    if (req.body.role == null || undefined) {
      role = "user";
    } else {
      role = "admin";
    }

    const input = { fullName, email, password, address, phoneNumber, role };

    User.findOne({ where: { email } })
      .then((data) => {
        if (data) {
          isFound = true;
          res.send("Email already registered");
        }
      })
      .catch((err) => {
        res.send(err);
      });

    if (!isFound)
      User.create(input)
        .then((data) => {
          req.session.user = data;
          req.session.isLogin = true;
          req.session.role = data.role;
          res.redirect("/hotels");
        })
        .catch((err) => {
          res.send(err);
        });
  }

  static getUser(req, res) {
    User.findOne({ where: { id: req.session.user.id } })
      .then((data) => res.render("users/Profile", { data }))
      .catch((err) => res.send(err));
  }
}

module.exports = Users;
