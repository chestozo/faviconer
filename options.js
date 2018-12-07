(function($){

const SETTINGS_KEY = 'settings';

var Options = function() {}

Options.prototype.init = function() {
    this.$rules = $(".js-rules");
    this.$save = $(".js-save")
        .bind("click", this.save.bind(this));

    this.firstTimeLoad();

    return this;
}

Options.prototype.firstTimeLoad = async function() {
    const settings = await this._getSettings();
    this.$rules.val(settings.rules.join("\n"));
}

Options.prototype.save = async function() {
    const rules = this.$rules.val().split("\n");
    const settings = await this._getSettings();
    settings.rules = rules;

    await this.update(settings);

    chrome.extension.getBackgroundPage().faviconer.reload();

    this.$save.attr("disabled", "disabled");

    // Enable after text change.
    this.$rules.one("keydown", function() {
        this.$save.removeAttr("disabled");
    }.bind(this));
}

Options.prototype.update = function(settings, callback) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [SETTINGS_KEY]: settings }, resolve);
    });
}

Options.prototype._getSettings = function() {
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

Options.prototype.getEmpty = function() {
    return {
        rules: []
    };
}

// Main.
new Options().init();

})(jQuery);
