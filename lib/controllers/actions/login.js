'use strict';
// var Auth = require('../../spotify-authentication');
/**
 * Login action
 */
module.exports = function(req, res){
  var request =  this.spotify.authenticationRequest();
  res.redirect(request.url);
};
