// javascript file for handling events in login.html

var b_submit = document.getElementById("b_submit"); 
var f_email = document.getElementById("email"); 
var f_password = document.getElementById("pwd"); 

// node server url
// var url = "http://127.0.0.1:3000/login";
var url = "http://localhost:3000/login";
// console.log(b_submit);
// console.log("TOP LOGIN.JS");

b_submit.onclick = handleSubmit;

function handleSubmit(){
	var idpwd = {
				id: f_email.value,
				pwd: f_password.value
	};	
	// console.log(idpwd);

	// send username and password securely to the node server
	$.post(url, idpwd, function(data, status) {
		
		// display data sent from the server
		console.log("data from server = " + data);
		// document.cookie="username=John Doe";
		//alert("success");
	});


}

// executed when a user logs in
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
}

// attach to the sign out button
function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
	  console.log('User signed out.');
	});
}