require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
var PORT = process.env.PORT || 8080;
var path = require('path');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))

app.use(bodyParser.json())
require('./routes/apiRoutes')(app)
require('./routes/htmlRoutes')(app);

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
})

