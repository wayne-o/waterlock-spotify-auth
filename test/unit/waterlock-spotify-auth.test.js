'use strict';
var proxyquire = require('proxyquire');
var should = require('should');
var mocha = require('mocha');
//var config = require('../fixtures/waterlock.config');


var spotifyAuth = require('../../lib/waterlock-spotify-auth');

global.sails = {
	getBaseurl: function(){
		return 'http://test.com/';
	},
	config:{
		waterlock:{
			pluralizeEndpoints: true
		},
		blueprints:{
			prefix: 'test'
		}
	}
};

describe('waterlock-spotify-auth', function() {

	describe('controllers', function(){
		describe('actions', function(){
			describe('login', function(){
				it('returns a redicrect with the correct URL when called', function(done) {

					var response = {
						redirect: function(url){
							url.split('&state')[0].should.equal('https://accounts.spotify.com/authorize?client_id=test&response_type=code&redirect_uri=http://test.com/test/auths/spotify_oauth2&scope=user-read-private%20user-read-email');
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
