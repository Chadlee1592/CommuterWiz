var path = require('path');
const fetch = require("node-fetch");
var token;

const googleAPI = process.env.GOOGLE_API

module.exports = function(app) {

    app.get("/", function(req, res) {
    })

    app.post("/", function(req, res) {

        token = req.body.token

        if(req.body.logIn == "true") {
            res.send({err: 0, redirectUrl: "/test"})
        } else {
            console.log("try again")
        }
    })

    app.post("/test", function(req, res) {
        var timeStamp = req.body.timeStamp;
        var startLocation = req.body.starting;
        var destination = req.body.destination;
        var startingLabel = req.body.startingLabel;
        var destinationLabel = req.body.destinationLabel;
          
        fetch("https://maps.googleapis.com/maps/api/directions/json?origin=" + startLocation + "&destination=" + destination + "&departure_time=now&key=" + googleAPI)
        .then(response => response.json())
        .then(json => {
          if(json.status === "OK") {
            var data = json.routes[0].legs[0]

            var startingLocationLat = data.start_location.lat;
            var startingLocationLng = data.start_location.lng;
            var destinationLocationLat = data.end_location.lat;
            var destinationLocationLng = data.end_location.lng;
            var distanceText = data.distance.text;
            var distanceValue = data.distance.value; 
            var durationText = data.duration.text;
            var durationValue = data.duration.value;
            var durationInTrafficText = data.duration_in_traffic.text;
            var durationInTrafficValue = data.duration_in_traffic.value;
  
            var dataObject = {
              status: json.status,  
              startingAddr: startLocation,
              destinationAddr: destination,
              startingLabel: startingLabel,
              destinationLabel: destinationLabel,
              token: token,
              startLat: startingLocationLat,
              startLng: startingLocationLng,
              destinationLat: destinationLocationLat,
              destinationLng: destinationLocationLng,
              distanceText: distanceText,
              distanceValue: distanceValue,
              durationText: durationText,
              durationValue: durationValue,
              durationInTrafficText: durationInTrafficText,
              durationInTrafficValue: durationInTrafficValue,
              timeStamp: timeStamp
            }
  
            res.send(dataObject);  
          } else {
              var dataObject = {
                  status: json.status
              }  
              res.send(dataObject);
          }

        })
    })
}
