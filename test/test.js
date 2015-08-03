// https://gist.github.com/soheilhy/867f76feea7cab4f8a84
// https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha
// http://code.tutsplus.com/tutorials/testing-in-nodejs--net-35018
// https://www.npmjs.com/package/request#forms
// https://www.npmjs.com/package/supertest
/*	Mongoose testing
 	http://www.scotchmedia.com/tutorials/express/authentication/1/06 
*/
var expect  = require("chai").expect;
var request = require("request");

var express = require("express");
var app = require('../server.js');

describe('GET', function() {
//http://localhost:3000/
//https://csc309-a3.herokuapp.com/

	it("index", function(done) {
		request('http://localhost:3000/', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it("login", function(done) {
		request('http://localhost:3000/login', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it("contact", function(done) {
		request('http://localhost:3000/contact', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it("register", function(done) {
		request('http://localhost:3000/register', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it("about", function(done) {
		request('http://localhost:3000/about', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		})
	})

	it("profile", function(done) {
		request('http://localhost:3000/profile', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		})
	})

	


});

