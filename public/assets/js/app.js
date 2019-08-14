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

  $("#submit2").on("click", function(event) {
      event.preventDefault();
      const email = $("#emailSignIn").val().trim();
      const pass = $("#passwordSignIn").val().trim();

      const promise = auth.signInWithEmailAndPassword(email, pass);

      promise.catch(e => alert(e.message, "message"))

      $("#emailSignIn").val("");
      $("#passwordSignIn").val("");
  })
  
  $("#submit1").on("click", function(event) {
    event.preventDefault()
    const firstName = $("#first_name").val().trim();
    const lastName = $("#last_name").val().trim();
    const email = $("#email").val().trim();
    const pass = $("#password").val().trim()

    const promise = auth.createUserWithEmailAndPassword(email, pass);

    promise.catch(e => alert(e.message));

    $("#first_name").val("");
    $("#last_name").val("");
    $("#email").val("");
    $("#password").val("");    
  })

    $("#logOut").on("click", function() {
        firebase.auth().signOut();
        // window.location = "/"
    });


  firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser) {
        $("#logOut").show();
          var logUser = {
              email: firebaseUser.email,
              token: firebaseUser.uid,
              logIn: true
          }
          //create a post request send firebaseuser object to the server
            $.post("/", logUser).then(function(data) {
                if(data.redirectUrl) {
                  window.location = data.redirectUrl
                } else {
                    console.log("not log logged in")
                }
            })
        
           
      } else {
          $("#logOut").hide();
          console.log("not logged in")

          var logUser = {
            logIn: false
          }

          $.post("/", logUser).then(function(data) {
              console.log("logged out")
          }) 
      }
  })


