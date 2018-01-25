$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyChWZs4t1PL1N4rNwZDKPqBwA91FP5buEQ",
        authDomain: "project1-auth-c69cf.firebaseapp.com",
        databaseURL: "https://project1-auth-c69cf.firebaseio.com",
        projectId: "project1-auth-c69cf",
        storageBucket: "project1-auth-c69cf.appspot.com",
        messagingSenderId: "816793565972"
        };
        firebase.initializeApp(config); 

        $(document).on("click", ".login-btn", function(event){
            event.preventDefault();
    
            var email = $("#user-name").val();
            var pass = $("#password").val();
            var auth = firebase.auth();
    
            var promise = auth.signInWithEmailAndPassword(email, pass);
            promise.catch(e => console.log(e.message));

        });
    
        $(document).on("click", ".signup-btn", function(event){
            event.preventDefault();
    
            var email = $("#user-name").val();
            var pass = $("#password").val();
            var auth = firebase.auth();
    
            var promise = auth.createUserWithEmailAndPassword(email, pass);
            promise.catch(e => console.log(e.message));
    
        });
    
        $(document).on("click", ".logout-btn", function(event){
            firebase.auth().signOut();
            location.reload();
        });
    
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser) {
                $("#logged-in-user").html("Welcome to GetHi, " + firebaseUser.email);
                $(".logout-btn").removeClass("hideme");
                // $(".signup-btn").addClass("hideme");
    
            } else {
                $(".logout-btn").addClass("hideme");
                $("#logged-in-user").html("Welcome to GetHi.");
            }
        });
});