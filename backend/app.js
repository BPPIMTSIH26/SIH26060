import express from "express";
import cookieParser from "cookie-parser";

import dbConnect from "./src/db/dbConnect.js";
import passport from "./src/config/passport.js";

import userRouter from "./src/routes/user.routes.js";
import stationRouter from "./src/routes/station.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(passport.initialize());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/stations", stationRouter);

app.get("/test", (req, res) => {
    res.json({
        message: "App is working"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;