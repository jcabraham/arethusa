'use strict';
/**
 * @ngdoc service
 * @name arethusa.core.StateChangeWatcher
 * @description
 * # StateChangeWatcherj
 * Watches changes to the given `propertyToWatch`, which must
 * be given as a string.
 * The callbacks object must have the following function:
 * - newMatch(token): This is called when a token changes its `propertyToWatch`
 *   to a truthy value.
 * - lostMatch(token): This is called when a token changes its `propertyToWatch`
 *   from a truthy value to a falsy value.
 * - changedCount(newCount): This is called if the count of tokens with a
 *   truthy `propertyToWatch` changes
 *
 * @requires arethusa.core.state
 */
angular.module('arethusa.core').factory('StateChangeWatcher', [
  'state',
  function (state) {
    return function(propertyToWatch, checkFunction, callbacks) {
      var self = this;

      this.initCount = function() {
        self.count = 0;
        self.matchingTokens = {};
        angular.forEach(state.tokens, function(token) {
          if (!checkFunction(token)) {
            self.count++;
            self.matchingTokens[token.id] = true;
          }
        });
        callbacks.changedCount(self.count);
      };

      this.watchChange = function(newVal, oldVal, event) {
        var id = event.token.id;
        if (newVal) {
          // Check if the token was used before!
          if (!oldVal) {
            self.count--;
            delete self.matchingTokens[id];
            callbacks.lostMatch(event.token);
            callbacks.changedCount(self.count);
          }
        } else {
          self.count++;
          self.matchingTokens[id] = true;
          callbacks.newMatch(event.token);
          callbacks.changedCount(self.count);
        }
      };

      this.applyToMatching = function(fn) {
        angular.forEach(self.matchingTokens, function(value, id) {
          fn(id);
        });
      };

      state.watch(propertyToWatch, this.watchChange);
    };
  }
]);