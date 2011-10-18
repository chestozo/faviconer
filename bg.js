;(function($){

var notifications = webkitNotifications;
var tabs = chrome.tabs;

var Interceptor = function() {
    this.notes = [];
}

Interceptor.prototype.init = function() {
    this.reload();
    chrome.browserAction.onClicked.addListener(this._clearAll.bind(this));
    chrome.experimental.webRequest.onBeforeRequest.addListener(this.handle.bind(this));
    return this;
}

Interceptor.prototype._clearAll = function(tab) {
    $.each(this.notes, function(i,note) { note.cancel(); });
}

Interceptor.prototype.handle = function(details) {
    var url = details.url;
    if (!this._matchRules(url)) {
        return;
    }

    var tab = tabs.get(
        details.tabId,
        function(tab) {
            if (!tab) {
                return;
            }
            this._notify(tab.url, url);
        }.bind(this)
    );
}

Interceptor.prototype._notify = function(page_url, request_url) {
    // Double html decode.
    var ta = document.createElement("textarea");
    var val = document.createTextNode(decodeURIComponent(request_url));
    ta.appendChild(val);
    ta.innerHTML = ta.innerText;

    if (!prompt(ta.innerText, ta.innerText)) {
        return;
    }

    var notification = notifications
        .createNotification(
            "icon.jpg",
            page_url,
            request_url
        );

    this.notes.push(notification);

    notification.onclose = function() { this._remove(notification); }.bind(this);
    notification.show();

    this.updateCount();
}

Interceptor.prototype._remove = function(note) {
    for (var i = 0; i < this.notes.length; i++) {
        if (this.notes[i] === note) {
            this.notes.splice(i, 1);
        }
    }
    this.updateCount();
}

Interceptor.prototype._matchRules = function(url) {
    for (var i = 0; i < this.rules.length; i++) {
        if (this.rules[i].test(url)) {
            return true;
        }
    }
    return false;
}

Interceptor.prototype.updateCount = function(diff) {
    var count = this.notes.length;
    if (count === 0) {
        chrome.browserAction.setBadgeText({ "text": "" });
    } else {
        chrome.browserAction.setBadgeBackgroundColor({ "color": [255,51,51, 255]});
        chrome.browserAction.setBadgeText({ "text": " " + count + " " });
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
