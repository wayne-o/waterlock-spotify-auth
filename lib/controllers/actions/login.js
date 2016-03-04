'use strict';
var auth = require('../../spotify-authentication');
/**
 * Login action
 */
module.exports = function(req, res){
  var state = 'some-state-of-my-choice';
  var scopes = ['user-read-private', 'user-read-email'];
  var request =  auth.createAuthorizeURL(scopes, state);

  res.redirect(request);
};
