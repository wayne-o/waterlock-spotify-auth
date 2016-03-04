'use strict';

var request = {};

request.init = function(builder) {
  if (!builder) {
    throw new Error('No builder supplied to constructor');
  }

  this.host = builder.host;
  this.port = builder.port;
  this.scheme = builder.scheme;
  this.queryParameters = builder.queryParameters;
  this.bodyParameters = builder.bodyParameters;
  this.headers = builder.headers;
  this.path = builder.path;
};

request.getHost = function() {
  return this.host;
};

request.getPort = function() {
  return this.port;
};

request.getScheme = function() {
  return this.scheme;
};

request.getPath = function() {
  return this.path;
};

request.getQueryParameters = function() {
  return this.queryParameters;
};

request.getBodyParameters = function() {
  return this.bodyParameters;
};

request.getHeaders = function() {
  return this.headers;
};

request.getURI = function() {
  if (!this.scheme || !this.host || !this.port) {
    throw new Error('Missing components necessary to construct URI');
  }
  var uri = this.scheme + '://' + this.host;
  if (this.scheme === 'http' && this.port !== 80 ||
    this.scheme === 'https' && this.port !== 443) {
    uri += ':' + this.port;
  }
  if (this.path) {
    uri += this.path;
  }
  return uri;
};

request.getURL = function() {
  var uri = this.getURI();
  if (this.getQueryParameters()) {
    return uri + this.getQueryParameterString(this.getQueryParameters());
  } else {
    return uri;
  }
};

request.addQueryParameters = function(queryParameters) {
  for (var key in queryParameters) {
    this.addQueryParameter(key, queryParameters[key]);
  }
};

request.addQueryParameter = function(key, value) {
  if (!this.queryParameters) {
    this.queryParameters = {};
  }
  this.queryParameters[key] = value;
};

request.addBodyParameters = function(bodyParameters) {
  for (var key in bodyParameters) {
    this.addBodyParameter(key, bodyParameters[key]);
  }
};

request.addBodyParameter = function(key, value) {
  if (!this.bodyParameters) {
    this.bodyParameters = {};
  }
  this.bodyParameters[key] = value;
};

request.addHeaders = function(headers) {
  if (!this.headers) {
    this.headers = headers;
  } else {
    for (var key in headers) {
      this.headers[key] = headers[key];
    }
  }
};

request.getQueryParameterString = function() {
  var queryParameters = this.getQueryParameters();
  if (!queryParameters) {
    return;
  }
  var queryParameterString = '?';
  var first = true;
  for (var key in queryParameters) {
    if (queryParameters.hasOwnProperty(key)) {
      if (!first) {
        queryParameterString += '&';
      } else {
        first = false;
      }
      queryParameterString += key + '=' + queryParameters[key];
    }
  }
  return queryParameterString;
};

module.exports = request;
