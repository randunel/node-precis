'use strict';

var fs = require('fs');
var path = require('path');

var filePath = path.join(__dirname, '..', 'token');
var token;

try {
    token = fs.readFileSync(filePath);
} catch(err) {
    console.log('Could not read token file. Visit http://localhost:3000/oauth/redirect and paste it here:\n');
    console.error('NOT IMPLEMENTED');
    process.exit(1);
}

module.exports = token.toString().trim();

