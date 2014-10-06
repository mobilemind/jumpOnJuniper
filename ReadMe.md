# jumpOnJuniper #

The “jumpOnJuniper” bookmarklet streamlines logging in via Juniper Networks Infranet
“VisitorNet” sites that control access to WiFi networks. The bookmarklet will paste in the
Username and password values stored in the bookmark and then submit the form.

## Install ##

**Mobile Safari**
The [hosted jOJ page](http://mmind.me/joj) is a form that will create the bookmarklet and
explains how to store and edit the bookmarklet on your iPad or iPhone. Tap the
[hosted jOJ page](http://mmind.me/jOJ) link and follow the instructions.

The same form is available as [jumpOnJuniper](http://mobilemind.github.com/jumpOnJuniper/joj.html) too.

See [http://mobilemind.github.com/jumpOnJuniper/joj.html](http://mobilemind.github.com/jumpOnJuniper/joj.html)

## Use ##

Make sure you have installed/created a bookmark first (see above).

Connect to the WiFi network and open a web page. The VisitorNet sign-in page should appear.

Activate the jOJ bookmarklet (tap on the link for it in the bookmark bar or use Bookmarks
menu). The default bookmark title is usually “jOJ login ___name___&hellip;” where ___name___ is the
first part of your Username (email).

The bookmarklet created via installation will paste in the Username, the stored password
and then submit the form.

#### Compatibility

Requires a browser that supports ````javascript:```` bookmarks.

Updated for Firefox 32.x, Safari 7.x and Mobile Safari 8.x (including iPhone 6 & iPhone 6 Plus).

----------

## License ##

MIT License - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)

jumpOnJuniper
Copyright (c) 2012, 2013, 2014 Tom King <mobilemind@pobox.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

----------

## Build Requirements ##

The jumpOnJuniper Makefile requires htmlcompressor. The htmlcompressor project has its own license
and sub-projects. End-users are responsible for obtaining a htmlcompressor and its related
components, under their respective license terms.

For htmlcompressor see: <https://code.google.com/p/htmlcompressor/>

The jumpOnJuniper Makefile also requires bash shell, make, gzip, perl, tidy (or tidy-html5), jsl,
node (nodejs on Windows) and optionally uses growlnotify. Required utilities are easily
installed on Mac OS X via homebrew or on Windows via Cygwin setup.

The W3C tidy-html5 is available here: <http://w3c.github.com/tidy-html5/>

**Mac**

* For utilities such as **jsl** and **node** using homebrew see: <http://mxcl.github.com/homebrew/>
* For **growlnotify** (requires Growl), see: <http://growl.info>

**Win**

* For **Cygwin** and related utilities such as **make**, **gzip**, **perl**, **tidy**, **nodejs**,
see: <http://www.cygwin.com/>
* For **growlnotify** (requires Growl for Windows), see: <http://growlforwindows.com>
* For **jsl**, see: <http://www.javascriptlint.com/>

----------

## Build ##

Use ````make```` at the command shell prompt to create the joj HTML page and manifest.
See ````/web/```` directory for results.
