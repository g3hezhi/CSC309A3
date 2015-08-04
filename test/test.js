// https://gist.github.com/soheilhy/867f76feea7cab4f8a84
// https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha
// http://code.tutsplus.com/tutorials/testing-in-nodejs--net-35018

/*	Mongoose testing
 	http://www.scotchmedia.com/tutorials/express/authentication/1/06 
*/

// http://visionmedia.github.io/superagent/#get-requests
// http://visionmedia.github.io/superagent/docs/test.html
// http://chaijs.com/guide/styles/
// https://www.npmjs.com/package/request#forms
// https://www.npmjs.com/package/supertest
// https://github.com/visionmedia/superagent/blob/master/test/node/agency.js
// https://shouldjs.github.io/#should-exist

// getting around CSRF
// http://rjzaworski.com/2015/02/testing-around-csrf-protection
// http://stackoverflow.com/questions/23123664/how-to-test-express-form-post-with-csrf

var expect  = require("chai").expect;
var should = require('should');
//var request = require("request");
var request = require('supertest')
var express = require("express");
var app = require('../server.js');

var cheerio = require('cheerio')


function extractCsrfToken (res) {
  var $ = cheerio.load(res.text);
  // get the value from <input id = 'csrf' type="hidden" name="_csrf" value="<%= csrfToken %>">
  return $('input[type="hidden"]').val();
}

describe('PAGES WITHOUT CSRF', function() {

	it('contact', function(done) {
		request('http://localhost:3000')
			.get('/contact')
			.expect(200, done)
	});

	it('about', function(done) {
		request('http://localhost:3000')
			.get('/contact')
			.expect(200, done)
	});

	it('category', function(done) {
		request('http://localhost:3000')
			.get('/category')
			.expect(200, done)
	});

	it('category', function(done) {
		request('http://localhost:3000')
			.post('/search')
			.send({ searchContent: 'PS4'})
			.expect(200, done)
	});




});

describe('/LOGIN', function () {
	it('GET & POST', function(done) {
	    request('http://localhost:3000')
	      .get('/login')
	      .end(function(err, res){
	        
	         csrf = extractCsrfToken(res);
	        //console.log(csrf);
		    request('http://localhost:3000')
		          .post('/login')
		          .set('cookie', res.headers['set-cookie'])
		          .send({
		            _csrf: csrf,
		            email: 'sh@email.com',
		            password: '1234'
		          })
		          .expect(302, done)
	      });
	      
	});
});

describe('/REGISTER', function () {
	it('GET & POST', function(done) {
	    request('http://localhost:3000')
	      .get('/register')
	      .end(function(err, res){
	        
	         csrf = extractCsrfToken(res);
	        //console.log(csrf);
		    request('http://localhost:3000')
		          .post('/register')
		          .set('cookie', res.headers['set-cookie'])
		          .send({
		          	_csrf: csrf,
		            username: 'testUser',
		            email: 'testUser@email.com',
		            password: '1234',
		            pwd_confirmation: '1234'
		          })
		          .expect(302, done)
	      });
	});
});






