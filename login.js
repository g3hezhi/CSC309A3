// javascript file for handling events in login.html

var b_submit = document.getElementById("b_submit"); 
var f_email = document.getElementById("email"); 
var f_password = document.getElementById("pwd"); 

var url = "http://127.0.0.1:3000/login";
// console.log(b_submit);
// console.log("TOP LOGIN.JS");

b_submit.onclick = handleSubmit;

function handleSubmit(){
	var idpwd = {
				id: f_email.value,
				pwd: f_password.value
	};	
	// console.log(idpwd);

	// send username and password securely to the server
	$.post(url, idpwd, function(data, status) {
		console.log(data);
		//alert("success");
	});


}