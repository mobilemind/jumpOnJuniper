// code w/onLoad handler + function to create bookmarklet string
"use strict";

//	jumpOnJuniper a bookmark-generator to simplify use of Juniper Infranet-based VisitorNet
//	generated URL first displays as http://mmind.me/joj?javascript:var%20d='...
//	Copyright (c) 2012-2014 Tom King. All rights reserved
//
// Comments- Generated bookmarklet is carefully constructed for current version of VisitorNet
// * Bookmarklet code is optimized for size (ie, string length of all the code).
// * UserID (email) and password are used inline for tighter code.
// * void('7.2.0g') is a way to embed the version and provides cross-browser compatibility (a non-null return value causes some browsers to navigate)
//
// var u = 'user', p = 'pass',
//	d = document,
//	h = location.href,
//	b = d.getElementById('proceedButton'),
//	s = d.getElementsByName('sn-postauth-proceed')[0],
//	r = d.getElementById('realm'),
//	f = d.forms[0];
// if (h.match(/visitornet(.*?)p=sn-postauth-show/)) b ? b.click() : s.click(), f.submit(); // click agreement
// else if (h.match(/^(data:)|(https?:\\/\\/((mmind\\.me\\/joj)|(mobilemind\\.github\\.io\\/.*\\/joj)|(visitornet\\.boeing\\.com\\/.*welcome\\.cgi)))/)) {
//	// fill-in login form
//	r ? r.selectedIndex = 1 : 0;
//	d.getElementById('username').value = u;
//	d.getElementById('password').value = p;
//	d.getElementById('frmLogin') ? d.getElementById('frmLogin').submit() : 0
// } else location.href = 'https://visitornet.boeing.com'; // redirect to login form
// void'7.2.0g'

// creates & returns bookmarklet given 'u' = usr ID and 'p' = pass
function pastelet(u,p) {
	return u + p ? "var u='" + u.match(/^\s*(\S*?)\s*$/)[1] + "',p='" + p + "',d=document,h=location.href,b=d.getElementById('proceedButton'),s=d.getElementsByName('sn-postauth-proceed')[0],r=d.getElementById('realm'),f=d.forms[0];if(h.match(/visitornet(.*?)p=sn-postauth-show/))b?b.click():s.click(),f.submit();else if(h.match(/^(data:)|(file:)|(https?:\\/\\/((mmind\\.me\\/joj)|(mobilemind\\.github\\.io\\/.*\\/joj)|(visitornet\\.boeing\\.com\\/.*welcome\\.cgi)))/)){r?r.selectedIndex=1:0;d.getElementById('username').value=u;d.getElementById('password').value=p;d.getElementById('frmLogin')?d.getElementById('frmLogin').submit():0}else location.href='https://visitornet.boeing.com';void'7.2.0g'" : '';
}

// listener to dynamically position page for initial or return-trip
window.addEventListener('load', function() {
	var wl = window.location, d = document, n = d.getElementById('username'), w = d.getElementById('password'), b = d.getElementById('bk');
	if (wl.search) {
		// reload form UI from query string
		try {
			var q = wl.search, m = [];
			q = decodeURIComponent(q.substr(1));
			m = q.match(/^javascript:(.*?)u='(.*?)',p='(.*?)',/);
			if (!m) throw 'No match in: ' + q;
			if (!m[2]) throw 'No login found in: ' + m;
			d.title = 'jOJ ' + m[2].replace(/\W.*/, '');
			n.value = m[2];
			if (m[3]) w.value = m[3];
			// put a more human-readable, but URI encoded, version of bookmarklet in textarea
			b.textContent = encodeURI(q);
			// if not iPhone/iPad unhide 'Pastelet as link' and set anchor tag
			if (!(-1 !== navigator.userAgent.indexOf('Safari') && -1 !== navigator.userAgent.indexOf('Mobile'))) {
				var bl = d.getElementById('bl'), pl = d.getElementById('pl');
				if (bl && pl) {
					bl.style.display = 'block';
					pl.href = d.getElementById('bk').textContent;
					pl.innerHTML = pl.title = d.title;
				}
			}
			b.focus();
			b.select();
			// unhide remaining steps
			window.scrollTo(0,200+d.getElementById('pltMkr').scrollHeight);
		}
		catch (e) {
			window.alert("Unable to decode pastelet.\r\nForm will be reset.\r\n(" + e + ")");
			wl.replace(wl.pathname);
		}
	}

	var mainForm = d.getElementById('pltMkr');
	mainForm.onreset = function() {
		wl.href = '//' + wl.host + wl.port + wl.pathname;
	};
	mainForm.onsubmit = function() {
		var p = pastelet(n.value,w.value);
		// reload page with new bookmarklet appended
		if (p) {
			b.textContent = p = 'javascript:' + encodeURIComponent(p);
			wl.href = '//' + wl.host + wl.port + wl.pathname + '?' + p;
		}
		return false;
	};
	b.onclick = function() { b.select(); };
}, true);
