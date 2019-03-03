;(function(){

// -------------------------------------------------------------------------- //
// Background page starts from here.
// -------------------------------------------------------------------------- //

const SETTINGS_KEY = 'settings';
const ENABLED_KEY = 'enabled';

var notifications = chrome.notifications;
var tabs = chrome.tabs;

const Interceptor = function() {
    this.notes = [];
    this._enabled = false;
};

Interceptor.prototype.init = async function() {
    const filter = {
        urls: [ "*://*/*" ]
    };

    this.reload();

    this._enabled = await this._getEnabled();
    this._syncButtonState();

    // chrome.browserAction.onClicked.addListener(this._clearAll.bind(this));
    chrome.browserAction.onClicked.addListener(this._toggleEnabled.bind(this));
    chrome.webRequest.onBeforeRequest.addListener(this.handle.bind(this), filter);
    return this;
};

// Interceptor.prototype._clearAll = function(tab) {
//     this.notes.forEach(note => note.cancel());
// };

Interceptor.prototype.handle = function(details) {
    var url = details.url;

    if (!this._enabled) {
        return;
    }

    if (!this._matchRules(url)) {
        return;
    }

    if (details.tabId > -1) {
        var tab = tabs.get(
            details.tabId,
            function(tab) {
                if (!tab) {
                    return;
                }
                this._notify(tab.url, url);
            }.bind(this)
        );
    } else {
        this._notify('NO TAB URL', url);
    }
};

Interceptor.prototype._notify = function(page_url, request_url) {
    // Double html decode.
    var ta = document.createElement("textarea");
    var val = document.createTextNode(decodeURIComponent(request_url));
    ta.appendChild(val);
    ta.innerHTML = ta.innerText;

    if (!prompt(ta.innerText, ta.innerText)) {
        return;
    }

    // TODO not used
    // var notification = notifications
    //     .createNotification(
    //         'icon.png',
    //         page_url,
    //         request_url
    //     );

    // this.notes.push(notification);

    // notification.onclose = function() { this._remove(notification); }.bind(this);
    // notification.show();

    // this.updateCount();
};

Interceptor.prototype._remove = function(note) {
    for (var i = 0; i < this.notes.length; i++) {
        if (this.notes[i] === note) {
            this.notes.splice(i, 1);
        }
    }
    this.updateCount();
};

Interceptor.prototype._matchRules = function(url) {
    for (var i = 0; i < this.rules.length; i++) {
        if (this.rules[i].test(url)) {
            return true;
        }
    }
    return false;
};

Interceptor.prototype.updateCount = function(diff) {
    var count = this.notes.length;
    if (count === 0) {
        chrome.browserAction.setBadgeText({ "text": "" });
    } else {
        chrome.browserAction.setBadgeBackgroundColor({ "color": [255,51,51, 255]});
        chrome.browserAction.setBadgeText({ "text": " " + count + " " });
    }
};

Interceptor.prototype._getSettings = function() {
    return new Promise((resolve) => {
        chrome.storage.local.get([ SETTINGS_KEY ], (result) => {
            let settings = result[SETTINGS_KEY];

            if (!settings || !settings.rules) {
                settings = {
                    rules: []
                };
            }

            resolve(settings);
        });
    });
};

Interceptor.prototype._getEnabled = function() {
    return new Promise((resolve) => {
        chrome.storage.local.get([ ENABLED_KEY ], (result) => {
            let enabled = result[ENABLED_KEY];
            enabled = typeof enabled === 'boolean' ? enabled : true;
            resolve(enabled);
        });
    });
};

Interceptor.prototype.reload = async function() {
    const settings = await this._getSettings();
    this.rules = settings.rules.map(this._createRule.bind(this));
};

Interceptor.prototype._createRule = function(template) {
    return new RegExp(template, "gi");
};

Interceptor.prototype._toggleEnabled = function() {
    this._enabled = !this._enabled;
    this._syncButtonState();
    this._saveEnabled();
};

Interceptor.prototype._saveEnabled = function() {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [ENABLED_KEY]: this._enabled }, resolve);
    });
};

Interceptor.prototype._syncButtonState = function() {
    if (this._enabled) {
        chrome.browserAction.setBadgeText({ 'text': '' });
    } else {
        chrome.browserAction.setBadgeBackgroundColor({ 'color': '#E84C3D' });
        chrome.browserAction.setBadgeText({ 'text': 'off' });
    }
};

// Initialization.
var onload = setTimeout(init, 0);

function init() {
    const faviconer = new Interceptor();
    faviconer.init();

    window.faviconer = faviconer;
}

}());
