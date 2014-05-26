"use strict";

angular.module('arethusa.exercise').service('fillInTheBlank', function(configurator, morph) {
  var self = this;
  this.conf = configurator.configurationFor('fillInTheBlank');
  this.template = this.conf.template;
  this.name = this.conf.name;
  this.main = this.conf.main;
});
