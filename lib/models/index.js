'use strict';

var _ = require('lodash');

module.exports = function(){

  return {
    auth:{
      attributes: function(attr){
        var template = {
          spotifyEmail: {
            type: 'string',
            unique: true
          },
          spotifyName:{
            type: 'string'
          }
        };

        _.merge(template, attr);
        _.merge(attr, template);
      }
    }
  };
};
