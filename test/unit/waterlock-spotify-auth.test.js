'use strict';
var proxyquire = require('proxyquire');
var should = require('should');
var mocha = require('mocha');
//var config = require('../fixtures/waterlock.config');


var spotifyAuth = require('../../lib/waterlock-spotify-auth');


var AuthenticationRequest = require('../../lib/authentication-request');

global.sails = {
	getBaseurl: function(){
		return '';
	}
};


describe('waterlock-spotify-auth', function() {
	describe('authentication-request', function() {
		it('returns a configured builder', function(done) {
			AuthenticationRequest.builder().port.should.equal(443);
      AuthenticationRequest.builder().scheme.should.equal('https');
      AuthenticationRequest.builder().host.should.equal('accounts.spotify.com');
			done();
		});
	});

	describe('controllers', function(){
		describe('actions', function(){
			describe('login', function(){
				it('returns a redicrect with the correct URL when called', function(done) {

					var response = {
						redirect: function(url){
							url.should.equal('https://accounts.spotify.com/authorize?client_id=test&response_type=code&redirect_uri=http://dev.festivaltribe.co.uk:4200/login&scope=user-read-private%20user-read-email&state=some-state-of-my-choice');
						}
					};

					var request = {};

					var login = new spotifyAuth().actions.login;
					login(request, response);

					done();
				});
			});
		});
	});
});
