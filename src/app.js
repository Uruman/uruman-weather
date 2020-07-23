// Core modules
const path = require('path')
const geocode = require('./utils/geocode')
const forcast = require('./utils/forecast')

// One time actions in terminal: 1)cd web-server 2)npm init -y 3)npm i express@4.16.4 4)To run the server: node src/app.js (not updating changes) or nodemon src/app.js (reflect changes immediately)
const express = require('express')  // The express library exposes just a single function
const app = express()               // We call the express function to create new express application object
const hbs = require('hbs')          // For the partials (reusable hbs templates)
const forecast = require('./utils/forecast')

// Tell express which dynamic templating engine (hbs - handlebars) we installed before (npm i hbs@4.0.1) by using set() with a setting key and value
app.set('view engine', 'hbs')
// Expresss expects all of your views (handlebars templates) to live in the specific folder views (default) in the root of the project
// We can also customize the folder, instead of view we use (set) another folder (templates/views):
const views_path = path.join(__dirname, '../templates/views')
app.set('views', views_path)

const partials_path = path.join(__dirname, '../templates/partials')     // Get handlebars to the partials which allows us to create hbs templates (part of a bigger webpage like headers or footers)
hbs.registerPartials(partials_path)

// use() is a way to customize your server and here we do to serve up the folder.
// With that we have a static directory where we can put all the assets (html, css, client side js images...) that are gonna make up our website
// For the homepage it looks automatically for index.html, but here we changed to render hbs files
const public_driectory_path = path.join(__dirname, '../public') // Go from path of src to public folder
app.use(express.static(public_driectory_path))

// Get let's us configure what the server should do when someone tries to get the resource at a specific url
// Get takes two arguments, the route (partial url, homepage is empty) and a function (handler) where we describe what we want to do when someone visits the route
app.get('', (req, res) => {     // req (request) is an object containing information about the incoming request to the server. res (response) contains a bunch of methods allowing us to customize what we goona send back to the requestor
    res.render('index', {       // render one of our views hbs (handlebar templates) by providing the view name as agrument, no need for file extension. And then render converts the hbs to html
        title: 'Weather App',   // second argument is an object which contains all of the values you want that view to be able to access
        name: 'Manuel Spies'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Manuel Spies',
        message: 'We help you here :)'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Manuel Spies'
    })
})

app.get('/weather', (req, res) => {
    let address = req.query.address     // Information about the url query string (e.g. api.com?address=Rome) that lives on req (request). Query is an object which contains the query string information as properties
    if (!address) {
        return res.send({
            error: 'Please provide an address!'
        })
    }

    geocode(address, (error, { longitude, latitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecaste_data) => {
            if (error) {
                return res.send({ error })
            }
            res.send({                              // Send to the browser html or json (automatically detected and stringified for us) - has to be the last get() since express looks in order for the gets
                location,
                forecast: forecaste_data,
                address
            })
        })
    })
})

// app.get('/product', (req, res) => {
//     if (!req.query.status) {
//         return res.send({
//             error: 'You must provide a search term'
//         })
//     }
//     console.log(req.query.status)
//     res.send({
//         prodcuts: []
//     })
// })

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        name: 'Manuel Spies',
        error_message: 'Help article not found!'
    })
})

app.get('*', (req, res) => {               // With wildcard * match anything that hasn't been matched so far
    res.render('404', {
        title: '404 Error',
        name: 'Manuel Spies',
        error_message: 'Page not found!'
    })
})

// Start the server up, listen on a specific port, the first argument, we use a common local developer environment port 3000
// The second optional argument, callback function which runs when the server is up and running
// The process of starting up a server is an asyncronous process
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})