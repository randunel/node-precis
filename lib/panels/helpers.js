'use strict';

var blessed = require('blessed');

module.exports = {
    getSeparator: function getSeparator(orientation) {
        var width = '100%';
        var height = 1;
        if ('vertical' === orientation) {
            width = 1;
            height = '100%';
        }
        return blessed.line({
            orientation: orientation,
            width: width,
            height: height
        });
    }
};

