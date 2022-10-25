//
const express = require("express");
const ejs = require("ejs")

const app = express()

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// Set the view engine to ejs
app.set('view engine', 'ejs');

// Port 3000
const port = 3000;

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
})








app.listen(port, () => {
    console.log("Server is running on port 3000")
})