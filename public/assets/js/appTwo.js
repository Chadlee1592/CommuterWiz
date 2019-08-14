$(document).ready(function(){
     $('.sidenav').sidenav();
     $('.modal').modal();
 }); 

var firebaseConfig = {
    apiKey: "AIzaSyCV31dWmcbG9dNiWhj4PALbuHy1MyROZMk",
    authDomain: "wed-app-c014d.firebaseapp.com",
    databaseURL: "https://wed-app-c014d.firebaseio.com",
    projectId: "wed-app-c014d",
    storageBucket: "wed-app-c014d.appspot.com",
    messagingSenderId: "881504760486",
    appId: "1:881504760486:web:a95e69f5a7a8ae54"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const dataRef = firebase.database();

var refreshTimeStamp = new Date
var timeStamp = refreshTimeStamp.toLocaleString();

$("#logOut").on("click", function() {
     firebase.auth().signOut();
     window.location = "/"
});

$("#submit").on("click", function(event) {
     event.preventDefault();


     var startingAddr = $("#startingLocation").val().trim();
     var destination = $("#destination").val().trim();
     var startingLabel = $("#startingLabel").val().trim();
     var destinationLabel = $("#destinationLabel").val().trim();

     var userInput = {
          starting: startingAddr,
          destination: destination,
          startingLabel: startingLabel,
          destinationLabel: destinationLabel,
          timeStamp: timeStamp
     }

     $.post("/test", userInput).then(function(data){
          console.log("data", data)

          if(data.status === "OK") {
               var startLat = data.startLat;
               var startLng = data.startLng;
               var destinationLat = data.destinationLat;
               var destinationLng = data.destinationLng;
               var startingLabel = data.startingLabel;
               var destinationLabel = data.destinationLabel;
               var token = data.token;
               var distanceText = data.distanceText;
               var distanceValue = data.distanceValue;
               var durationText = data.durationText;
               var durationValue = data.durationValue;
               var durationInTrafficText = data.durationInTrafficText;
               var durationInTrafficValue = data.durationInTrafficValue;
               var startingAddr = data.startingAddr;
               var destination = data.destinationAddr;
               var timeStamp = data.timeStamp;
     
               dataRef.ref().push({
                    startLat: startLat,
                    startLng: startLng,
                    destinationLat: destinationLat,
                    destinationLng: destinationLng,
                    startingLabel: startingLabel,
                    destinationLabel: destinationLabel,
                    token: token,
                    distanceText: distanceText,
                    distanceValue: distanceValue,
                    durationText: durationText,
                    durationValue: durationValue,
                    durationInTrafficText: durationInTrafficText,
                    durationInTrafficValue: durationInTrafficValue,
                    startingAddr: startingAddr,
                    destination: destination,
                    timeStamp: timeStamp
               })
     
          } else {
               alert("Location not found. Try again")
          }
     })
     $("#startingLocation").val("");
     $("#destination").val("");
     $("#startingLabel").val("")
     $("#destinationLabel").val("")
})

dataRef.ref().on("child_added", function(childSnapshot) {
     firebase.auth().onAuthStateChanged(firebaseUser =>{
          if(!firebaseUser) {
               window.location = "/"
          } else {
               var userToken = firebaseUser.uid
               var token = childSnapshot.val().token;
               var data = childSnapshot.val()
               var key = childSnapshot.key
               if(userToken === token) {
                    if((data.durationValue * 1.05) < data.durationInTrafficValue && (data.durationValue * 1.3) > data.durationInTrafficValue) {
                         displayTraffic(data.startingLabel, data.destinationLabel, data.distanceText, "Light Traffic", data.durationInTrafficText,data.timeStamp, key)
     
                    } else if((data.durationValue * 1.3) < data.durationInTrafficValue && (data.durationValue * 1.5) > data.durationInTrafficValue) {
                         displayTraffic(data.startingLabel, data.destinationLabel, data.distanceText, "Moderate Traffic", data.durationInTrafficText,data.timeStamp, key)
     
                    } else if((data.durationValue * 1.5) < data.durationInTrafficValue) {
                         displayTraffic(data.startingLabel, data.destinationLabel, data.distanceText, "Heavy Traffic", data.durationInTrafficText,data.timeStamp, key)
     
                    } else if((data.durationValue * 1.05) > data.durationInTrafficValue) {
                         displayTraffic(data.startingLabel, data.destinationLabel, data.distanceText, "No Traffic", data.durationInTrafficText,data.timeStamp, key)
                    }
     
                    $("#refresh").on("click", function(event) {
                         event.preventDefault();

                         var refresh = {
                              starting: data.startingAddr,
                              destination: data.destination,
                              timeStamp: timeStamp
                         }
                         $.post("/test", refresh).then(function(data){
                              console.log("data", data)
                              dataRef.ref(key).update({
                                   durationInTrafficText: data.durationInTrafficText,
                                   durationInTrafficValue: data.durationInTrafficValue,
                                   durationValue: data.durationValue,
                                   durationText: data.durationText,
                                   timeStamp: data.timeStamp
                              })
                              location.reload();
                         })   
                    })
     
                    $(".delete").on("click", function(event) {
                         event.preventDefault();
     
                        var deleteKey = $(this).data("key");
     
                        dataRef.ref(deleteKey).remove();
                        location.reload();
     
                    })
     
                    $(".update").on("click", function(event) {
                         event.preventDefault();
     
                         var updateKey = $(this).data("key");
                        dataRef.ref(updateKey).on("value",function(snapshot) {
                             var data = snapshot.val()
                             var destination = data.destination;
                             var destinationLabel = data.destinationLabel;
                             var startingAddr = data.startingAddr;
                             var startLabel = data.startingLabel;

                             $("#startingLabel1").val(startLabel);
                             $("#startingLocation1").val(startingAddr);
                             $("#destinationLabel1").val(destinationLabel);
                             $("#destination1").val(destination);

                             $("#submit1").on("click", function(event) {
                                  event.preventDefault();
                                   var newStartLabel = $("#startingLabel1").val().trim();
                                   var newStartLocation = $("#startingLocation1").val().trim();
                                   var newDestination = $("#destination1").val().trim();
                                   var newDestinationLabel = $("#destinationLabel1").val().trim()

                                   var updateObject = {
                                        starting: newStartLocation,
                                        destination: newDestination,
                                        startingLabel: newStartLabel,
                                        destinationLabel: newDestinationLabel,
                                        timeStamp: timeStamp
                                   }

                                   console.log("updateObject", updateObject)

                                   $.post("/test", updateObject).then(function(data) {

                                        console.log(data)
                                        dataRef.ref(updateKey).update({
                                             startingLabel: data.startingLabel,
                                             destinationLabel: data.destinationLabel,
                                             durationInTrafficText: data.durationInTrafficText,
                                             durationInTrafficValue: data.durationInTrafficValue,
                                             durationValue: data.durationValue,
                                             durationText: data.durationText,
                                             timeStamp: data.timeStamp
                                        });

                                        location.reload();
     
                                   })


                             })

                        })

                         
                    })
     
                    function displayTraffic (startingLabel, destinationLabel, distanceText, traffic, durationInTrafficText,timeStamp, key) {

                         if(durationInTrafficText === "Light Traffic") {
                              $("tbody").append(
                                   $("<tr>").append(
                                        $("<td>").text(startingLabel),
                                        $("<td>").text(destinationLabel),
                                        $("<td>").text(distanceText),
                                        $("<td class='green-text text-lighten-2'>").text(traffic),
                                        $("<td>").text(durationInTrafficText),
                                        $("<td>").text(timeStamp),
                                        $("<td>").html("<a class='btn-floating btn update waves-effect waves-light modal-trigger' href='#modal4' data-key=" + key + "><i class='material-icons'>update</i></a>"),
                                        $("<td>").html("<button class='btn-floating btn waves-effect waves-light delete' data-key=" + key + "><i class='material-icons'>delete</i></button>")
                                   )
                              )
     
                         } else if(durationInTrafficText === "Moderate Traffic") {
                              $("tbody").append(
                                   $("<tr>").append(
                                        $("<td>").text(startingLabel),
                                        $("<td>").text(destinationLabel),
                                        $("<td>").text(distanceText),
                                        $("<td class='orange-text text-lighten-2>").text(traffic),
                                        $("<td>").text(durationInTrafficText),
                                        $("<td>").text(timeStamp),
                                        $("<td>").html("<a class='btn-floating btn update waves-effect waves-light modal-trigger' href='#modal4' data-key=" + key + "><i class='material-icons'>update</i></a>"),
                                        $("<td>").html("<button class='btn-floating btn waves-effect waves-light delete' data-key=" + key + "><i class='material-icons'>delete</i></button>")
                                   )
                              )
     
                         } else if(durationInTrafficText === "Heavy Traffic") {
                              $("tbody").append(
                                   $("<tr>").append(
                                        $("<td>").text(startingLabel),
                                        $("<td>").text(destinationLabel),
                                        $("<td>").text(distanceText),
                                        $("<td class='red-text text-lighten-2'>").text(traffic),
                                        $("<td>").text(durationInTrafficText),
                                        $("<td>").text(timeStamp),
                                        $("<td>").html("<a class='btn-floating btn update waves-effect waves-light modal-trigger' href='#modal4' data-key=" + key + "><i class='material-icons'>update</i></a>"),
                                        $("<td>").html("<button class='btn-floating btn waves-effect waves-light delete' data-key=" + key + "><i class='material-icons'>delete</i></button>")
                                   )
                              )     
                         } else {
                              $("tbody").append(
                                   $("<tr>").append(
                                        $("<td>").text(startingLabel),
                                        $("<td>").text(destinationLabel),
                                        $("<td>").text(distanceText),
                                        $("<td class='green-text text-lighten-2'>").text(traffic),
                                        $("<td>").text(durationInTrafficText),
                                        $("<td>").text(timeStamp),
                                        $("<td>").html("<a class='btn-floating btn update waves-effect waves-light modal-trigger' href='#modal4' data-key=" + key + "><i class='material-icons'>update</i></a>"),
                                        $("<td>").html("<button class='btn-floating btn waves effect waves-light delete' data-key=" + key + "><i class='material-icons'>delete</i></button>")
                                   )
                              )
                         }
          
                    }
               }      
          }
     })
     
})




