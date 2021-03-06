# jumpOnJuniper

[![Tag][tag-image]][tag-url]
 [![Build Status][build-image]][build-url]
 [![Dependency Status][dep-image]][dep-url]
 [![devDependency Status][devDep-image]][devDep-url]
 [![Codacy Code Quality Rating][Codacy-image]][Codacy-dash]
 [![Snyk Security Review Status][Snyk-image]][Snyk-dash]

The “jumpOnJuniper” (jOJ) bookmarklet streamlines logging in via Juniper
Networks Infranet “VisitorNet” sites that control access to WiFi networks. The
bookmarklet will paste in the Username and password values stored in the
bookmark and then submit the form.

Version 7.2.x releases are the final versions. I've learned as much as I
needed to learn for this project and have no way to actually use it myself
anymore.

NEVER say never. Updated in 2019 to allow longer values of username and
clarify that password must be _exactly_ 8 characters. See version 7.5.4 or
later.

## Install

### Mobile Safari

The [hosted jOJ page][ghjoj] is a form that will create the bookmarklet and
explains how to store and edit the bookmarklet on your iPad or iPhone. Tap the
[hosted jOJ page][ghjoj] link and follow the instructions.

### Desktop Browser

Select the link below and then follow the on-screen instructions. Note that
on a desktop machine the browser may allow you to drag or right-click and
bookmark the underlined link that appears upon completing Step 1.

[jOJ hosted on github.io][ghjoj]

## Use

Make sure you have installed/created a bookmark first (see above).

Connect to the WiFi network and open a web page. The VisitorNet sign-in page
should appear.

Activate the jOJ bookmarklet (tap on the link for it in the bookmark bar or
use Bookmarks menu). The default bookmark title is usually "jOJ login
___name___&hellip;" where ___name___ is the first part of your Username
(email).

The bookmarklet created via installation will paste in the Username, the
stored password and then submit the form.

## Compatibility

Requires a browser that supports `javascript:` bookmarks.

Updated for Firefox 66.0.x, Safari 12 and Mobile Safari 12 (including iPhone
7, iPhone 8 Plus & iPhone XS).

## License

MIT License - <http://opensource.org/licenses/mit-license.php>

jumpOnJuniper
Copyright (c) 2012-2020 Tom King <mobilemind+joj@pobox.com>

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

REQUIRES a local command-line version of "zopfli" installed. See either
<https://github.com/mathiasbynens/grunt-zopfli> for grunt-zopfli instructions
or <https://github.com/google/zopfli> for zopfli itself.

Use `npm install && grunt` at the command shell prompt to create the joj HTML
page and manifest. See `/web/` directory for results.

<!-- reference URLs -->
[ghjoj]: https://mobilemind.github.io/jumpOnJuniper/joj.html "jumpOnJuniper (github)"
<!-- Badge links -->
[build-image]: https://travis-ci.com/mobilemind/jumpOnJuniper.svg?branch=master
[build-url]: http://travis-ci.com/mobilemind/jumpOnJuniper
[tag-image]: https://img.shields.io/github/tag/mobilemind/jumpOnJuniper.svg
[tag-url]: https://github.com/mobilemind/jumpOnJuniper/tags
[dep-image]: https://david-dm.org/mobilemind/jumpOnJuniper.svg
[dep-url]: https://david-dm.org/mobilemind/jumpOnJuniper
[devDep-image]: https://img.shields.io/david/dev/mobilemind/jumpOnJuniper.svg
[devDep-url]: https://david-dm.org/mobilemind/jumpOnJuniper#info=devDependencies
[Codacy-image]: https://api.codacy.com/project/badge/Grade/f1e4ca9110744143975a5e1202df99ff
[Codacy-dash]: https://www.codacy.com/app/mobilemind/jumpOnJuniper
[Snyk-image]: https://snyk.io/test/github/mobilemind/jumpOnJuniper/badge.svg?targetFile=package.json
[Snyk-dash]: https://snyk.io/test/github/mobilemind/jumpOnJuniper?targetFile=package.json
