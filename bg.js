;(function($){

var notifications = webkitNotifications;
var tabs = chrome.tabs;

var Interceptor = function() {
    this.count = 0;
}

Interceptor.prototype.init = function() {
    this.reload();
    chrome.experimental.webRequest.onBeforeRequest.addListener(this.handle.bind(this));
    return this;
}

Interceptor.prototype.handle = function(details) {
    var url = details.url;
    if (!this._matchRules(url)) {
        return;
    }

    var tab = tabs.get(
        details.tabId,
        function(tab) {
            this._notify(tab.url, url);
        }.bind(this)
    );
}

Interceptor.prototype._notify = function(page_url, request_url) {
    this.incCount();
    var notification = notifications
        .createNotification(
            "icon.jpg",
            page_url,
            request_url
        );
    notification.onclose = this.decCount.bind(this);
    notification.show();
}

Interceptor.prototype._matchRules = function(url) {
    for (var i = 0; i < this.rules.length; i++) {
        if (this.rules[i].test(url)) {
            return true;
        }
    }
    return false;
}

Interceptor.prototype.incCount = function() {
    this.updateCount(1);
}

Interceptor.prototype.decCount = function() {
    this.updateCount(-1);
}

Interceptor.prototype.updateCount = function(diff) {
    this.count += diff;

    if (this.count === 0) {
        chrome.browserAction.setBadgeText({ "text": "" });
    } else {
        chrome.browserAction.setBadgeBackgroundColor({ "color": [255,51,51, 255]});
        chrome.browserAction.setBadgeText({ "text": " " + this.count + " " });
    }
}

Interceptor.prototype.getSettings = function() {
    var value = localStorage["settings"];
    if (!value) {
        return {
            rules: []
        };
    }
    return JSON.parse(value);
}

Interceptor.prototype.reload = function(full_reload) {
    var settings = this.getSettings();
    this.rules = $.map(settings.rules, this._createRule.bind(this));
}

Interceptor.prototype._createRule = function(template) {
    return new RegExp(template, "gi");
}

// Initialization.
var onload = setTimeout(init, 0); function init() {
    window.faviconer = new Interceptor().init();
}

}(jQuery));
