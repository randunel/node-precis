'use strict';

var blessed = require('blessed');
var helpers = require('./helpers');

module.exports = Panel;

function Panel() {
    this.element = blessed.box({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    });
    this.layout = blessed.layout({
        parent: this.element,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    });
    this.children = {};
}

Panel.prototype.getElement = function getElement() {
    return this.element;
};

Panel.prototype.addLeft = function addLeft(child) {
    if (this.children.left) {
        throw new Error('Not implemented');
    }
    this.children.left = child;
    this.layout.append(child.getElement());
};

Panel.prototype.addRight = function addRight(child) {
    if (this.children.right) {
        throw new Error('Not implemented');
    }
    this.children.right = child;
    this.layout.append(helpers.getSeparator('vertical'));
    this.layout.append(child.getElement());
};

