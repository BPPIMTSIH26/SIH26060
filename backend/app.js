import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dbConnect from "./src/db/dbConnect.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

dbConnect();

