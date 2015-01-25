// code w/onLoad handler + function to create bookmarklet string
"use strict";

//	jumpOnJuniper a bookmark-generator to simplify use of Juniper Infranet-based VisitorNet
//	generated URL first displays as http://mmind.me/joj?javascript:var%20d='...
//	Copyright (c) 2012-2014 Tom King. All rights reserved
//
// Comments- Generated bookmarklet is carefully constructed for current version of VisitorNet
// * Bookmarklet code is optimized for size (ie, string length of all the code).
// * UserID (email) and password are used inline for tighter code.
// * void('_MmVERSION_') is a way to embed the version and provides cross-browser compatibility (a non-null return value causes some browsers to navigate)
//
// var u = 'user', p = 'pass',
//	d = document,
//	h = location.href,
//	b = d.getElementById('proceedButton'),
//	s = d.getElementsByName('sn-postauth-proceed')[0],
//	r = d.getElementById('realm'),
//	f = d.forms[0];
// if (h.match(/visitornet(.*?)p=sn-postauth-show/)) b ? b.click() : s.click(), f.submit(); // click agreement
// else if (h.match(/(^data:text\/html;.*|(mmind\\.me|mobilemind\\..*?) \\/joj(\\/|\\?) ?.*|visitornet(.*?)welcome\\.cgi|^data:)$/)) {
//	// fill-in login form
//	r ? r.selectedIndex = 1 : 0;
//	d.getElementById('username').value = u;
//	d.getElementById('password').value = p;
//	d.getElementById('frmLogin') ? d.getElementById('frmLogin').submit() : 0
// } else location.href = 'https://visitornet.boeing.com'; // redirect to login form
// void'_MmVERSION_'

// creates & returns bookmarklet given 'u' = usr ID and 'p' = pass
function pastelet(u,p) {
	if (u + p) {
		u = u.match(/^\s*(\S*?)\s*$/)[1]; // strip leading/trailing spaces to help w/iOS 5 shortcut text
		p = "var u='" + u + "',p='" + p + "',d=document,h=location.href,b=d.getElementById('proceedButton'),s=d.getElementsByName('sn-postauth-proceed')[0],r=d.getElementById('realm'),f=d.forms[0];if(h.match(/visitornet(.*?)p=sn-postauth-show/))b?b.click():s.click(),f.submit();else if(h.match(/(^data:text\\/html;.*|(mmind\\.me|mobilemind\\..*?)\\/joj(\\/|\\?)?.*|visitornet(.*?)welcome\\.cgi)$/)){r?r.selectedIndex=1:0;d.getElementById('username').value=u;d.getElementById('password').value=p;d.getElementById('frmLogin')?d.getElementById('frmLogin').submit():0}else location.href='https://visitornet.boeing.com';void'_MmVERSION_'";
	}
	return p;
}

// listener to dynamically position page for initial or return-trip
window.addEventListener('load', function() {
	if (window.location.search) {
		// reload form UI from query string
		try {
			var q = window.location.search, m = [], b = document.getElementById('bk');
			q = decodeURIComponent(q.substr(1));
			m = q.match(/^javascript:(.*?)u='(.*?)',p='(.*?)',/);
			if (!m) throw 'No match in: ' + q;
			if (!m[2]) throw 'No login found in: ' + m;
			var t = 'jOJ ' + m[2].replace(/\W.*/, '');
			document.title = t;
			document.getElementById('username').value = m[2];
			if (m[3]) document.getElementById('password').value = m[3];
			// put a more human-readable, but URI encoded, version of bookmarklet in textarea
			b.textContent = encodeURI(q);
			// unhide remaining steps
			window.scrollTo(0,200+document.getElementById('pltMkr').scrollHeight);
			// if not iPhone/iPad unhide 'Pastelet as link' and set anchor tag
			if (!(-1 !== navigator.userAgent.indexOf('Safari') && -1 !== navigator.userAgent.indexOf('Mobile'))) {
				var bl = document.getElementById('bl'), pl = document.getElementById('pl');
				if (bl && pl) {
					bl.style.display = 'block';
					pl.href = document.getElementById('bk').textContent;
					pl.title = t;
					pl.innerHTML = t;
				}
			}
			b.select();
			b.focus();
		}
		catch (e) {
			window.alert("Unable to decode pastelet.\r\nForm will be reset.\r\n(" + e + ")");
			window.location.replace(window.location.pathname);
		}
	}

	var mainForm = document.getElementById('pltMkr');
	mainForm.onreset = function() {
		document.getElementById('bk').textContent = '';
		window.location.href='//'+window.location.host+window.location.port+window.location.pathname;
	};

	mainForm.onsubmit = function() {
		var p = pastelet(document.getElementById('username').value,document.getElementById('password').value);
		// reload page with new bookmarklet appended
		if (p) {
			p = 'javascript:' + encodeURIComponent(p);
			document.getElementById('bk').textContent = p;
			window.location.href = '//' + window.location.host + window.location.port + window.location.pathname + '?' + p;
		}
		return false;
	};

}, true);
