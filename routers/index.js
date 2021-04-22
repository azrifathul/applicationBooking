const router = require("express").Router();
const hotelControllers = require("../controllers/hotels");
const userController = require("../controllers/users");
const BookingController = require("../controllers/booking");

const {
  postLoginHandler,
  signUp,
  postUpdateProfile,
  deleteUser,
  getUser,
  getAllUser,
  getSignUp,
} = userController;

const {
  getDataHandler,
  loginHandler,
  addDataHandler,
  addPostHandler,
  editDataHandler,
  editPostHandler,
  deleteDataHandler,
  logoutHandler,
} = hotelControllers;

const {
  getBooking,
  getBookings,
  createBooking,
  deleteBooking,
  confirmBooking,
} = BookingController;

const isLoginMiddleware = function (req, res, next) {
  if (req.session.isLogin) {
    next();
  } else {
    res.redirect("/hotels");
  }
};

// User routers
router.post("/user/delete/:id", isLoginMiddleware, deleteUser);
router.post("/login", postLoginHandler);
router.post("/signUp", signUp);
router.post("/user/update", isLoginMiddleware, postUpdateProfile);
router.get("/myProfile", isLoginMiddleware, getUser);
router.get("/logout", logoutHandler);
router.get("/login", loginHandler);
router.get("/user/list", isLoginMiddleware, getAllUser);
router.get("/signUp", getSignUp);

// Hotel routers
router.get("/hotels", getDataHandler);
router.post("/hotels/add", addPostHandler);
router.post("/hotels/edit/:id", editPostHandler);
router.get("/hotels/edit/:id", isLoginMiddleware, editDataHandler);
router.get("/hotels/add", isLoginMiddleware, addDataHandler);
router.get("/hotels/delete/:id", isLoginMiddleware, deleteDataHandler);

// Booking routers
router.get("/bookingDetails/:id", getBooking); // booking details
router.get("/bookings", getBookings); //booking list
router.get("/booking/:id", createBooking); // get createbooking
router.post("/booking/:id", confirmBooking); // post confirmBooking
router.get("/booking/:UserId/:HotelId/delete", deleteBooking);

module.exports = router;
