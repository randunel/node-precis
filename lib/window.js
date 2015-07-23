'use strict';

var blessed = require('blessed');

module.exports = Window;

function Window() {
    this.screen = blessed.screen({
        autoPadding: true,
        smartCSR: true,
        dockBorders: true
    });
    this.panels = {};
}

Window.prototype.drawDefault = function drawDefault() {
    var main = this.getPanel('main');
    main.addLeft(this.getPanel('channels', 20, '100%'));
    main.addRight(this.getPanel('chat', 85, '100%'));
    this.addToScreen(main);
};

Window.prototype.addToScreen = function addToScreen(panel) {
    this.screen.append(panel.getElement());
    this.refresh();
};

Window.prototype.refresh = function refresh() {
    this.screen.render();
};

Window.prototype.getPanel = function getPanel(name, width, height) {
    if (!this.panels[name]) {
        var Panel = require('./panels/' + name);
        this.panels[name] = new Panel(width, height);
    }
    return this.panels[name];
};

Window.prototype.notify = function notify(text) {
    this.panels.chat.addMessage(text, {
        bg: 'red',
        bold: true
    });
    this.refresh();
};

Window.prototype.addChannel = function addChannel(name) {
    this.panels.channels.add('#' + name);
    this.refresh();
};

