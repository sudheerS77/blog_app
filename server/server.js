require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const term = require("terminal-kit").terminal;

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category')
const tagRoutes = require('./routes/tag')
const blogRoutes = require('./routes/blog');

//app
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

//cors
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

//Routes middlewar
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);
app.use("/api", blogRoutes);


const port = process.env.PORT || 8080;

//db
mongoose
  .connect(process.env.MONGODB_URI)  .then(() => term.bold.underline.green("  DB CONNECTED"))
  .catch((err) => term.red(err));


app.listen(port, () => {
  term.bold.underline.blue(`server running on PORT - ${port}`);
});