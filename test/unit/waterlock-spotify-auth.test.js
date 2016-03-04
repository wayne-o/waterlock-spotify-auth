'use strict';
var proxyquire = require('proxyquire');
var should = require('should');
var mocha = require('mocha');
//var config = require('../fixtures/waterlock.config');
var AuthenticationRequest = require('../../lib/authentication-request');

var spotifyAuth = require('../../')();


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
							url.should.equal('http://google.com');
						}
					};

					var login = spotifyAuth.controllers.actions.login;
					login(null, response);

					done();
				});
			});
		});
	});
});
