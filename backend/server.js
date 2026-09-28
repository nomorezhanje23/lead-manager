require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Lead = require("./models/Lead");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


app.get("/", (req, res) => {
    res.send("Lead Management API is Running");
});

app.post("/leads", async (req, res) => {
    try {
        const { name, email, status } = req.body;

    const newLead = new Lead({
        name,
        email,
        status
    });

    await newLead.save();

    res.status(201).json(newLead);
     } catch (error) { 
        if (error.code === 11000) {
            return res.status(409).json({
                message: "A lead with this email already exists."
            });
        }

        res.status(500).json({ 
            message: "Something went wrong while creating the lead."
        });
     }
});

app.get("/leads", async (req, res) => {
    try {
        const leads = await Lead.find();

        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong while fetching leads."
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});