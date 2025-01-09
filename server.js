// Here is where we import modules
// We begin by loading Express
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");
const Fruit = require("./models/fruit.js");

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});
mongoose.connection.on("error", err => {
    console.log(`Failed to connect due to ${err}`);
});

// Middleware
// This checks the incoming request for form data and turns it into req.body
app.use(express.urlencoded({ extended: false }));
// Morgan logs the incoming requests
app.use(morgan("tiny"));
// Use delete and put
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// GET request HOME
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// I.N.D.U.C.E.S
// I Index /fruits
// N New /fruits/new
// D Delete /fruits/:id
// U Update /fruits/:id
// C Create /fruits
// E Edit /fruits/:id/edit
// S Show /fruits/:id

// FRUITS ROUTES

app.get("/fruits", async (req, res) => {
    const fruits = await Fruit.find({}); // Find will search the database for all fruits
    res.render("fruits/index.ejs", {
        title: "This is the Fruits page",
        fruits,
    });
});

app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.ejs")
});

app.delete("/fruits/:id", (req, res) => {
    // Alternative to async/await is
    Fruit.findByIdAndDelete(req.params.id)
        .then((responseFromDB) => {
            console.log(responseFromDB);
            res.redirect("/fruits");
        });
});

app.put("/fruits/:id", async (req, res) => {
    // Form data is inside of req.body
    req.body.isReadyToEat = req.body.isReadyToEat ? true : false;
    const fruit = await Fruit.findByIdAndUpdate(req.params.id, req.body, {
        new: true // This is to make the function return the new version of the fruit updated
    });

    res.redirect(`/fruits/${req.params.id}`);
})

app.post("/fruits", async (req, res) => {
    console.log(req.body, ", this is the req.body");
    req.body.isReadyToEat = req.body.isReadyToEat ? true : false;
    const fruit = await Fruit.create(req.body);
    // res.json(fruit);
    res.redirect("/fruits");
});

app.get("/fruits/:id/edit", async (req, res) => {
    const fruit = await Fruit.findById(req.params.id);
    res.render("fruits/edit.ejs", { fruit });
})

app.get("/fruits/:id", async (req, res) => {
    const fruit = await Fruit.findById(req.params.id);
    res.render("fruits/show.ejs", { fruit });
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
