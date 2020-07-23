console.log('JavaScript client side file is loaded')   // Logs show up in the browser developer tools > console

// Select element from our html document (here the tag form) by using document object (DOM) and querySelector
// We get back a js representation of that element and we can use that to manipulate the element or to do things when a user interacts with the element
const weather_form = document.querySelector('form')
const search = document.querySelector('input')
const message_one = document.querySelector('#message_one')  // Target by id with pound sign # followed by the id-value
const message_two = document.querySelector('#message_two')

// Add an event listener onto our element, there are all sorts of event listeners (e.g. hover over sth, scrolling, clicking, submitting form etc.)
// Takes 2 arguments, the name of the event we try to listen for and a callback function which runs every time the event ocurrs
weather_form.addEventListener('submit', (e) => {        // e stands for event
    e.preventDefault()                                  // Prevent the default behavior to refresh the browser
    const location = search.value                       // value extracts the input

    message_one.textContent = 'Loading...'  // Change text content of element
    message_two.textContent = ''

    // Getting the data inside of our client-side js
    // To make the http request from client-side js, we use the fetch-API, it is not js but a browser-based API, thus not accesible in node.js (backend)
    // Calling fetch in our client-side js is gonna kick off an asynchronous I/O operation like request in node.js, i.e. we don't have access to the data right away
    // With request() we had a callback as second argument, here instead we have then() with callback function
    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                message_one.textContent = data.error
            } else {
                message_one.textContent = data.location
                message_two.textContent = data.forecast
            }
        })
    })
})