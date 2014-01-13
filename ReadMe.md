# jumpOnJuniper
[![Build Status](https://secure.travis-ci.org/mobilemind/jumpOnJuniper.png?branch=trygrunt)](http://travis-ci.org/mobilemind/jumpOnJuniper)

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

Tested with Firefox 11.x - 26.x, Safari 5.1.x - 7.x and Mobile Safari 5.x - 7.x.

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

## Build
The jumpOnJuniper `trygrunt` branch uses [node](http://nodejs.org/) and
[grunt](http://gruntjs.com/). To clone and build this branch of the project do the
following:
````shell
git clone https://github.com/mobilemind/jumpOnJuniper
cd jumpOnJuniper
git checkout trygrunt
node install
grunt
````
The built files will be in `web` and include the following:

* `img/` - directory containing the support images and an optional .ico file
* `joj` - gzipped HTML5 file, serve as type "text/html; charset=utf-8" with Content-Encoding "gzip"
* `joj.manifest` - HTML5 cache manifest file
* `joj.url` - simplified form of `joj` as a standalone base64 encoded`data:` URL suitable
for use as a bookmarklet

### Deploy
The `grunt deploy` task expects a local file named `.ftppass` in the local project
directory _and_ environment variables `$MYSERVER` and `$MYSERVERHOME` (fully qualified
file path to deployment directory on `$MYSERVER`).

See [grunt-sftp-deploy](https://npmjs.org/package/grunt-sftp-deploy) documentation for
more information on configuring sftp deployment.

See `minimum.csp` for a sample Content Security Policy that could be applied to `joj`.
