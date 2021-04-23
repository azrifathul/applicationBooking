const { Booking, Hotel, User } = require("../models");
const uniqid = require("uniqid");
class BookingController {
  static getBooking(req, res) {
    Booking.findOne({
      where: {
        id: req.params.id,
      },
      include: [Hotel, User],
    })
      .then((data) => res.render("/bookingDetails/:id", { data }))
      .catch((err) => res.send(err));
  }

  static getBookings(req, res) {
    User.findAll({
      where: {
        id: Number(req.session.user.id),
      },
      include: [{ model: Hotel }],
    })
      .then((data) => {
        res.render("users/bookings", {
          data: data[0].Hotels,
          role: req.session.role,
          userId: req.session.user_id,
        });
      })
      .catch((err) => console.log(err));
  }

  static createBooking(req, res) {
    const role = req.session.role;
    const HotelId = req.params.id;

    Hotel.findByPk(HotelId)
      .then((data) => {
        res.render("users/bookingForm", { data, role });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static confirmBooking(req, res) {
    const nodemailer = require("nodemailer");
    const UserId = req.session.user.id;
    const HotelId = req.params.id;
    const { check_in, check_out, night } = req.body;
    Hotel.findByPk(Number(HotelId)).then((data) => {
      Booking.create({
        UserId: Number(UserId),
        HotelId: Number(HotelId),
        check_in,
        check_out,
        night: Number(night),
        total: Number(data.price) * night,
      })
        .then(() => {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "asurisrat@gmail.com",
              pass: "phmrakna10",
            },
          });

          const mailOptions = {
            from: "asurisrat@gmail.com",
            to: req.session.user.email,
            subject: "Booking Hotel App",
            text: `
            Hallo ${
              req.session.user.fullName
            }! Terimakasih telah melakukan booking di Hotel Kami, dengan total biaya Rp ${
              Number(data.price) * night
            }, pada tanggal ${check_in.slice(0, 10)} hingga ${check_out.slice(
              0,
              10
            )}. dengan kode booking ${uniqid()}
            `,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          res.redirect("/bookings");
        })
        .catch((err) => console.log(err));
    });
  }

  static deleteBooking(req, res) {
    Booking.destroy({
      where: {
        UserId: Number(req.params.UserId),
        HotelId: Number(req.params.HotelId),
      },
    })
      .then(() => res.redirect("/bookings"))
      .catch((err) => res.send(err));
  }
}

module.exports = BookingController;
