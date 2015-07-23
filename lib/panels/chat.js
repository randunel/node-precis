'use strict';

var blessed = require('blessed');
var helpers = require('./helpers');

module.exports = Chat;

function Chat(width, height) {
    this.width = width;
    this.element = blessed.box({
        width: width,
        height: height,
        shrink: true,
    });
    this.messageArea = blessed.list({
        parent: this.element,
        //top: 0,
        //right: 0,
        width: width,
        tags: true,
        height: '100%-3',
        bg: '#888888',
    });
    for (var i = 0; i < 26; ++i) {
        this.messageArea.addItem('' + i);
    }
    this.element.append(helpers.getSeparator('horizontal'));
    this.inputArea = blessed.box({
        parent: this.element,
        bottom: 0,
        right: 0,
        width: width,
        height: 3,
        shrink: true,
        content: 'input area',
        bg: '#eeeeee'
    });
}

Chat.prototype.getElement = function getElement() {
    return this.element;
};

Chat.prototype.addMessage = function addMessage(text, styles) {
    var remaining = this.addFirstLine(text, styles);
    while (remaining.length) {
        remaining = this.addNextLine(remaining, styles);
    }
};

Chat.prototype.addFirstLine = function addFirstLine(text, styles) {
    this.addLine(text.substring(0, this.width), styles);
    return text.substring(this.width);
};

Chat.prototype.addNextLine = function addNextLine(text, styles) {
    var prefix = ' ';
    var line = prefix + text.substring(0, this.width - prefix.length);
    this.addLine(line, styles);
    return text.substring(this.width - prefix.length);
};

Chat.prototype.addLine = function addLine(text, styles) {
    this.messageArea.shiftItem();
    if (styles) {
        text = blessed.generateTags(styles, text);
    } else {
        text = blessed.escape(text);
    }
    this.messageArea.addItem(text);
};

