//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

const secret = "Thisismylittlesecret";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home")
});

app.get("/register", function (req, res) {
    res.render("register")
});

app.get("/login", function (req, res) {
    res.render("login")
});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
    .then(function () {
        res.render("secrets");
    })
    .catch(function (err) {
        console.log(err);
    });
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
    .then(function (foundUser) {
        if (foundUser.password === password) {
            res.render("secrets");
        } else {
            res.send("Username and Password does not match!")
        };
    })
    .catch(function () {
        res.send("Your username is not in the database. Please register first!")
    }) 
})

app.listen(3000, function () {
    console.log("Server has started on port 3000 successfully!");
})