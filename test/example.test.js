var mocha = require('mocha');
var chai = require('chai');

describe('Basic Mocha String Test', function () {
    it('should return number of charachters in a string', function () {
           chai.assert.equal("Hello".length, 5);
       });
    it('should return first charachter of the string', function () {
           chai.assert.equal("Hello".charAt(0), 'H');
       });
});