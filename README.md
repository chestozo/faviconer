Faviconer
=============

If you want to detect browser requests (like `favicon.ico` requests with additional information) - this extension is for you!

NOTE 1: currently I could not deploy it at Chrome web store with resolution "Extension or apps with experimental APIs are not allowed in the gallery."
But you can install it by loading an unpacked extension at `chrome://extensions/`.

NOTE 2: for running this extension you will also need enable a flag at `chrome://flags/` called `Experimental Extension APIs`.
Or you can run your browser with the command line flag `--enable-experimental-extension-apis` like so (Mac OS version):

    /Applications/Web/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --enable-experimental-extension-apis

Features
--------
* Add as many request masks as you want (at options page)
* Every mask is a simple js RegExp
* See them while you are at any page (maybe different, that the source page for the request).

Settings
--------
To set up a list of request masks you need to go to the options page.
There you can find a single text field. This is a rules list.
One line - one rule.
Every rule is a regexp.

For example: recieve notifications about all requests to favicon.ico with a question mark and maybe some parameters after it.
    
    ^.*\/favicon\.ico\?.*$

Do not forget to press Save after changing the rules list.
