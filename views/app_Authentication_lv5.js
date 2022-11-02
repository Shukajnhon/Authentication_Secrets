//
require('dotenv').config() // Environment variables from a .env file
const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")

// Express-session passport passport-local-mongoose
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')



const app = express()
// console.log(process.env.API_KEY)

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// Set the view engine to ejs
app.set('view engine', 'ejs');

// Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))
// Passport
app.use(passport.initialize())
app.use(passport.session())

// Port 3000
const port = 3000;



// Connect to mongodb
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })

// UserSchema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
// PassportLocalMongoose
userSchema.plugin(passportLocalMongoose)
// Model User
const User = mongoose.model("User", userSchema)

// use static authenticate method of model in LocalStrategy
const LocalStrategy = require('passport-local');
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Render Home page
app.get("/", (req, res) => {
    res.render('home')
})

// Render Login page
app.get("/login", (req, res) => {
    res.render('login')
})

// Render Register page
app.get("/register", (req, res) => {
    res.render('register')
});

// Secrets
app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets")
    } else {
        res.redirect("/login")
    }
})

app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.log(err)
        }
        res.redirect('/');
    });
})


// Get value from Register Form by POST method
app.post("/register", (req, res) => {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err)
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets")
            });
        }
    });

});

// Login Route
app.post("/login", (req, res) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, function (err) {
        if (err) {
            console.log(err)
            res.send("Wrong User or Password. Please check again! T-T")
        } else {
            passport.authenticate('local')(req, res, function () {
                res.redirect("/secrets")
            });
        }
    });

});








app.listen(port, () => {
    console.log("Server is running on port 3000")
})