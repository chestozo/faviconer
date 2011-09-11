(function($){

var Options = function() {}

Options.prototype.init = function() {
    this.$rules = $(".js-rules");
    this.$save = $(".js-save")
        .bind("click", this.save.bind(this));
    $(document).ready(this.firstTimeLoad.bind(this));
    return this;
}

Options.prototype.firstTimeLoad = function() {
    var settings = this.load();
    this.$rules.val(settings.rules.join("\n"));
    return this;
}

Options.prototype.save = function() {
    var rules = this.$rules.val().split("\n");
    var settings = this.load();
    settings.rules = rules;
    this.update(settings);
    chrome.extension.getBackgroundPage().faviconer.reload();
    this.$save.attr("disabled", "disabled");

    // Enable after text change.
    this.$rules.one("keydown", function() {
        this.$save.removeAttr("disabled");
    }.bind(this));

    return this;
}

Options.prototype.update = function(settings) {
    localStorage["settings"] = JSON.stringify(settings);
    return this;
}

Options.prototype.load = function() {
    var value = localStorage["settings"];
    if (!value) {
        return this.getEmpty();
    }
    return JSON.parse(value);
}

Options.prototype.getEmpty = function() {
    return {
        rules: []
    };
}

// Main.
new Options().init();

})(jQuery);
