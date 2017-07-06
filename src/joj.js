// code w/onLoad handler + function to create bookmarklet string

//  jumpOnJuniper a bookmark-generator to simplify use of Juniper Infranet-based VisitorNet
//  generated URL first displays as http://mmind.me/joj?javascript:var%20d='...
//  Copyright (c) 2012-2017 Tom King. All rights reserved
//
// Comments- Generated bookmarklet is carefully constructed for current version of VisitorNet
// * Bookmarklet code is optimized for size (ie, string length of all the code).
// * UserID (email) and password are used inline for tighter code.
// * void('_MmVERSION_') is a way to embed the version and provides cross-browser compatibility (a non-null return value causes some browsers to navigate)

// creates & returns bookmarklet given 'u' = usr ID and 'p' = pass
function pastelet (u,p) {
    return u + p ? "var u='" + u.match(/^\s*(\S*?)\s*$/)[1] + "',p='" + p + "',e=document,t=location.href,o=e.getElementById('proceedButton'),m=e.getElementsByName('sn-postauth-proceed')[0],n=e.getElementById('realm'),i=e.forms[0];t.match(/visitornet(.*?)p=sn-postauth-show/)?(o?o.click():m.click(),i.submit()):t.match(/^(data:)|(https?:\\/\\/((mmind\\.me\\/joj)|(mobilemind\\.github\\.io\\/.*\\/joj)|(visitornet\\.boeing\\.com\\/.*welcome\\.cgi)))/)?(n?n.selectedIndex=1:0,e.getElementById('username').value=u,e.getElementById('password').value=p,e.getElementById('frmLogin')&&e.getElementById('frmLogin').submit()):location.href='https://visitornet.boeing.com';void'_MmVERSION_'" : "";
}

// listener to dynamically position page for initial or return-trip
window.addEventListener("load", function () {
    const wl = window.location, d = document, n = d.getElementById("username"), w = d.getElementById("password"), b = d.getElementById("bk");
    if (wl.hash) {
        // reload form UI from query string
        try {
            const q = decodeURIComponent(wl.hash.substr(1)),
                m = q.match(/^javascript:(.*?)u='(.*?)',p='(.*?)',/);
            if (!m) throw new Error("No match in: " + q);
            if (!m[2]) throw new Error("No login found in: " + m);
            d.title = "jOJ " + m[2].replace(/\W.*/, "");
            n.value = m[2];
            if (m[3]) w.value = m[3];
            // put a more human-readable, but URI encoded, version of bookmarklet in textarea
            b.textContent = encodeURI(q);
            // if not iPhone/iPad unhide "Pastelet as link" and set anchor tag
            if (!(-1 !== navigator.userAgent.indexOf("Safari") && -1 !== navigator.userAgent.indexOf("Mobile"))) {
                const bl = d.getElementById("bl"), pl = d.getElementById("pl");
                if (bl && pl) {
                    bl.style.display = "block";
                    pl.href = d.getElementById("bk").textContent;
                    pl.title = d.title;
                    pl.appendChild(document.createTextNode(d.title));
                }
            }
            b.disabled = false;
            b.focus();
            b.select();
            // unhide remaining steps
            window.scrollTo(0,200 + d.getElementById("pltMkr").scrollHeight);
        } catch (e) {
            window.alert("Unable to decode pastelet.\r\nForm will be reset.\r\n(" + e + ")");
            wl.replace(wl.pathname);
        }
    }

    const mainForm = d.getElementById("pltMkr");
    mainForm.onreset = function () {
        wl.href = "//" + wl.host + wl.port + wl.pathname;
    };
    mainForm.onsubmit = function () {
        var p = pastelet(n.value,w.value);
        // reload page with new bookmarklet appended
        if (p) {
            b.textContent = p = "javascript:" + encodeURIComponent(p);
            wl.href = "//" + wl.host + wl.port + wl.pathname + "#" + p;
        }
        return false;
    };
    b.onclick = function () {
        b.select();
    };
}, true);
