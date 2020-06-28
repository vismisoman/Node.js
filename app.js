require("dotenv").config();
const logger = require("./api/common/logger").log;
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const userRouter = require("./api/users/user.router");
const tokenRouter = require("./api/token/token.router");
const authRouter = require("./api/auth/auth.router");

const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());

//Middleware
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/token", tokenRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger("server up and running on PORT :", port);
});

mongoose
  .connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => logger("connected to db"))
  .catch((err) => logger("error connecting to db"));
