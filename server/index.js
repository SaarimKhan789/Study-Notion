const express = require("express");
const app = express();

const userRoutes = require("../server/routes/User");
const profileRoutes = require("../server/routes/Profile");
const paymentRoutes = require("../server/routes/Payments");
const courseRoutes = require("../server/routes/Course");
const contactUsRoute = require("../server/routes/Contact");
const database = require("../server/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("../server/config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());

const allowedPattern =
  /^https:\/\/study-notion-[\w-]+\.saarimkhan515-gmailcoms-projects\.vercel\.app$/;

const allowedOrigins = [
  "https://study-notion-3o3d.vercel.app", // permanent domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedPattern.test(origin)
      ) {
        callback(null, true);
      } else {
        console.error(" CORS Rejected:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

//def route

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
