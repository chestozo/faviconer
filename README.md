Faviconer
=============

If you want to detect browser requests (like `favicon.ico` requests with additional information) - this extension is for you!

NOTE 1: currently I could not deploy it at Chrome web store with resolution "Extension or apps with experimental APIs are not allowed in the gallery."
But you can install it by loading an unpacked extension in at `chrome://extensions/`.

NOTE 2: for running this extension u will also need to run browser in special mode like this: `/Applications/Web/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --enable-experimental-extension-apis`.

Features
--------
* Add as many request masks as you want (at options page)
* See them while you are at any page (maybe different, that the source page for the request).

Settings
--------
To set up a list of request masks you need to go to the options page.
There you can find a single text field. This is a rules list.
One line - one rule.
Every rule is a simple mask with a single asterix at the end of the pattern (if needed).

For example: `http://some-page.url*`

Do not forget to press Save after changing the rules list.
