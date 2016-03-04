'use strict';

var spotifyAuth = {};
var AuthenticationRequest = require('./authentication-request');
var Promise = require('promise');
var HttpManager = require('http-manager');
// var _credentials = credentials || {};


function _addBodyParameters(request, options) {
	if (options) {
		for (var key in options) {
			if (key !== 'credentials') {
				request.addBodyParameter(key, options[key]);
			}
		}
	}
}

// function _addQueryParameters(request, options) {
// 	if (!options) {
// 		return;
// 	}
// 	for (var key in options) {
// 		if (key !== 'credentials') {
// 			request.addQueryParameter(key, options[key]);
// 		}
// 	}
// }

function _performRequest(method, request) {
	var promiseFunction = function(resolve, reject) {
		method(request, function(error, result) {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	};
	return new Promise(promiseFunction);
}

// function _addAccessToken(request, accessToken) {
// 	if (accessToken) {
// 		request.addHeaders({
// 			'Authorization': 'Bearer ' + accessToken
// 		});
// 	}
// }


spotifyAuth.init = function(clientId, clientSecret, redirectURL, config, allow){
  this.clientId = clientId;
  this.clientSecret = clientSecret;
  this.redirectURL = redirectURL;
  this.config = config;
  this.allow = allow;
};

/**
 * Request an access token using the Client Credentials flow.
 * Requires that client ID and client secret has been set previous to the call.
 * @param {Object} options Options.
 * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
 * @returns {Promise|undefined} A promise that if successful, resolves into an object containing the access token,
 *          token type and time to expiration. If rejected, it contains an error object. Not returned if a callback is given.
 */
spotifyAuth.clientCredentialsGrant = function(options, callback) {
	var request = AuthenticationRequest.builder()
		.withPath('/api/token')
		.withBodyParameters({
			'grant_type': 'client_credentials'
		})
		.withHeaders({
			Authorization: ('Basic ' + new Buffer(this.getClientId() + ':' + this.getClientSecret())
				.toString('base64'))
		})
		.build();

	_addBodyParameters(request, options);

	var promise = _performRequest(HttpManager.post, request);

	if (callback) {
		promise.then(function(data) {
			callback(null, data);
		}, function(err) {
			callback(err);
		});
	} else {
		return promise;
	}
};

/**
 * Request an access token using the Authorization Code flow.
 * Requires that client ID, client secret, and redirect URI has been set previous to the call.
 * @param {string} code The authorization code returned in the callback in the Authorization Code flow.
 * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
 * @returns {Promise|undefined} A promise that if successful, resolves into an object containing the access token,
 *          refresh token, token type and time to expiration. If rejected, it contains an error object.
 *          Not returned if a callback is given.
 */
spotifyAuth.authorizationCodeGrant = function(code, callback) {
	var request = AuthenticationRequest.builder()
		.withPath('/api/token')
		.withBodyParameters({
			'grant_type': 'authorization_code',
			'redirect_uri': this.getRedirectURI(),
			'code': code,
			'client_id': this.getClientId(),
			'client_secret': this.getClientSecret()
		})
		.build();

	var promise = _performRequest(HttpManager.post, request);

	if (callback) {
		promise.then(function(data) {
			callback(null, data);
		}, function(err) {
			callback(err);
		});
	} else {
		return promise;
	}
};

/**
 * Refresh the access token given that it hasn't expired.
 * Requires that client ID, client secret and refresh token has been set previous to the call.
 * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
 * @returns {Promise|undefined} A promise that if successful, resolves to an object containing the
 *          access token, time to expiration and token type. If rejected, it contains an error object.
 *          Not returned if a callback is given.
 */
spotifyAuth.refreshAccessToken = function(callback) {
	var request = AuthenticationRequest.builder()
		.withPath('/api/token')
		.withBodyParameters({
			'grant_type': 'refresh_token',
			'refresh_token': this.getRefreshToken()
		})
		.withHeaders({
			Authorization: ('Basic ' + new Buffer(this.getClientId() + ':' + this.getClientSecret())
				.toString('base64'))
		})
		.build();

	var promise = _performRequest(HttpManager.post, request);

	if (callback) {
		promise.then(function(data) {
			callback(null, data);
		}, function(err) {
			callback(err);
		});
	} else {
		return promise;
	}
};

/**
 * Retrieve a URL where the user can give the application permissions.
 * @param {string[]} scopes The scopes corresponding to the permissions the application needs.
 * @param {string} state A parameter that you can use to maintain a value between the request and the callback to redirect_uri.It is useful to prevent CSRF exploits.
 * @returns {string} The URL where the user can give application permissions.
 */
spotifyAuth.createAuthorizeURL = function(scopes, state) {
	var request = AuthenticationRequest.builder()
		.withPath('/authorize')
		.withQueryParameters({
			'client_id': this.getClientId(),
			'response_type': 'code',
			'redirect_uri': this.getRedirectURI(),
			'scope': scopes.join('%20'),
			'state': state
		})
		.build();

	return request.getURL();
};

module.exports = spotifyAuth;
