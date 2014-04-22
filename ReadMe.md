# jumpOnJuniper

The “jumpOnJuniper” (jOJ) bookmarklet streamlines logging in via Juniper Networks Infranet
“VisitorNet” sites that control access to WiFi networks. The bookmarklet will paste in the
Username and password values stored in the bookmark and then submit the form.

## Install

### Mobile Safari
The [hosted jOJ page][mmjoj] is a form that will create the bookmarklet and
explains how to store and edit the bookmarklet on your iPad or iPhone. Tap the
[hosted jOJ page][mmjoj] link and follow the instructions.

The same form is available as [jumpOnJuniper][ghjoj] in case there is an issue following
one of the links above.

### Desktop Browser
Select a link below and then follow the on-screen instructions. Note that on a desktop
machine the browser may allow you to drag or right-click and bookmark the underlined
link that appears upon completing Step 1.

* [jOJ hosted on mmind.me site][mmjoj]
* [jOJ hosted on github.com][ghjoj]

[mmjoj]: http://mmind.me/joj  "jumpOnJuniper (mmind.me site)"
[ghjoj]: http://mobilemind.github.io/jumpOnJuniper/joj.html  "jumpOnJuniper (github site)"

## Use
Make sure you have installed/created a bookmark first (see above).

Connect to the WiFi network and open a web page. The VisitorNet sign-in page should appear.

Activate the jOJ bookmarklet (tap on the link for it in the bookmark bar or use Bookmarks
menu). The default bookmark title is usually "jOJ login ___name___&hellip;"
 where ___name___ is the first part of your Username (email).

The bookmarklet created via installation will paste in the Username, the stored password
and then submit the form.

## Compatibility

Requires a browser that supports `javascript:` bookmarks.

Tested with Firefox 11.x - 28.x, Safari 5.1.x - 7.x and Mobile Safari 5.x - 7.x.

## License

MIT License - <http://www.opensource.org/licenses/mit-license.php>

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

## Build Requirements
The jumpOnJuniper Makefile requires htmlcompressor. The htmlcompressor project has its own
license and sub-projects. End-users are responsible for obtaining a htmlcompressor and its
related components, under their respective license terms.

For htmlcompressor see: <https://code.google.com/p/htmlcompressor/>

The jumpOnJuniper Makefile also requires bash shell, make, gzip, perl, tidy (or tidy-html5),
jsl, node (nodejs on Windows) and optionally uses growlnotify. Required utilities are easily
installed on Mac OS X via homebrew or on Windows via Cygwin setup.

The W3C tidy-html5 is available here: <http://w3c.github.com/tidy-html5/>

> **NOTE**: An alternative build system using grunt is available on the
> [trygrunt](https://github.com/mobilemind/jumpOnJuniper/tree/trygrunt#) branch of this
> repository.

### Mac
* For utilities such as **jsl** and **node** using homebrew see: <http://mxcl.github.com/homebrew/>
* For **growlnotify** (requires Growl), see: <http://growl.info>

### Win
* For **Cygwin** and related utilities such as **make**, **gzip**, **perl**, **tidy**,
**nodejs**, see: <http://www.cygwin.com/>. jumpOnJuniper compiles under Cygwin 1.7.18 for
either 32 bit or 64 bit versions of Windows.
* For **growlnotify** (requires Growl for Windows), see: <http://growlforwindows.com>
* For **jsl**, see: <http://www.javascriptlint.com/>

## Build
Use `make` at the command shell prompt to create the joj HTML page and manifest.
See `/web/` directory for results.
