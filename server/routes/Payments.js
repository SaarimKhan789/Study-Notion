// Import the required modules
const express = require("express");
const router = express.Router();

const {
  requestPayments,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/Payments");
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");
router.post("/requestPayments", auth, isStudent, requestPayments);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

module.exports = router;
