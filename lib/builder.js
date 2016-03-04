'use strict';
var Request = require('./base-request');
var builder = {};

builder.withHost = function(host) {
  this.host = host;
  return this;
};

builder.withPort = function(port) {
  this.port = port;
  return this;
};

builder.withScheme = function(scheme) {
  this.scheme = scheme;
  return this;
};

builder.withQueryParameters = function(queryParameters) {
  this.queryParameters = queryParameters;
  return this;
};

builder.withPath = function(path) {
  this.path = path;
  return this;
};

builder.withBodyParameters = function(bodyParameters) {
  this.bodyParameters = bodyParameters;
  return this;
};

builder.withHeaders = function(headers) {
  this.headers = headers;
  return this;
};

builder.build = function() {
  return new Request(this);
};

module.exports = builder;
