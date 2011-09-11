;(function($){

var notifications = webkitNotifications;
var tabs = chrome.tabs;

var Interceptor = function() {
    this.count = 0;
}

Interceptor.prototype.init = function() {
    var settings = this.getSettings();
    if (settings.rules.length <= 0) {
        // NOTE: show ext as disabled
        return this;
    }

    chrome.experimental.webRequest.onBeforeRequest.addListener(
        this.handle.bind(this),
        {
            urls: settings.rules
        } // RequestFilter filter,
    );
    return this;
}

Interceptor.prototype.handle = function(details) {
    var tab = tabs.get(
        details.tabId,
        function(tab) {
            this.incCount();
            var notification = notifications
                .createNotification(
                    "icon.jpg",
                    tab.url,
                    details.url
                );
            notification.onclose = this.decCount.bind(this);
            notification.show();
        }.bind(this)
    );
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
        chrome.browserAction.setBadgeBackgroundColor({ "color": [31,240,0, 255]});
        chrome.browserAction.setBadgeText({ "text": "" +this.count });
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
    this.updateCount(-this.count);
    window.location.reload();
}

// Initialization.
var onload = setTimeout(init, 0); function init() {
    window.faviconer = new Interceptor().init();
}

}(jQuery));
