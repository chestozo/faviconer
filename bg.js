// -------------------------------------------------------------------------- //
// Background page starts from here.
// -------------------------------------------------------------------------- //

var tabs = chrome.tabs;

var Interceptor = function() {};

Interceptor.prototype.init = function() {
    var filter = {
        urls: [ "*://*/*" ]
    };
    this.reload();
    chrome.webRequest.onBeforeRequest.addListener(this.handle.bind(this), filter);
    return this;
};

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
};

Interceptor.prototype._notify = function(page_url, request_url) {
    chrome.tabs.executeScript(null, {
        code: 'console.log("' + request_url + '")'
    });
};

Interceptor.prototype._matchRules = function(url) {
    for (var i = 0; i < this.rules.length; i++) {
        if (this.rules[i].test(url)) {
            return true;
        }
    }
    return false;
};

Interceptor.prototype.getSettings = function() {
    var value = localStorage["settings"];
    if (!value) {
        return {
            rules: []
        };
    }
    return JSON.parse(value);
};

Interceptor.prototype.reload = function(full_reload) {
    var settings = this.getSettings();
    this.rules = settings.rules.map(function(template) {
        return new RegExp(template, "gi");
    });
};

// Initialization.
setTimeout(function init() {
    window.faviconer = new Interceptor().init();
}, 0);
