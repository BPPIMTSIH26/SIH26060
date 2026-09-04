import mongoose from "mongoose";
import Station from "../models/stationModel.js";

const stations = [
    {
        name: "MAITRI",
        code: "MAITRI",
        location: {
            type: "Point",
            coordinates: [
                0,
                0
            ]
        },
        isActive: true
    },
    {
        name: "BHARATI",
        code: "BHARATI",
        location: {
            type: "Point",
            coordinates: [
                0,
                0
            ]
        },
        isActive: true
    }
];

const seedStations = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "MongoDB connected for station seeding"
        );

        await Station.deleteMany({});

        await Station.insertMany(stations);

        console.log(
            "Stations seeded successfully"
        );

        await mongoose.disconnect();

        process.exit(0);
    } catch (error) {
        console.error(
            "Station seeding failed:",
            error
        );

        process.exit(1);
    }
};

seedStations();