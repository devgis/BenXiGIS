//>>built
define("dojox/socket","dojo/_base/array dojo/_base/lang dojo/_base/xhr dojo/aspect dojo/on dojo/Evented dojo/_base/url".split(" "),function(l,m,u,q,r,v,w){var t=window.WebSocket,c=function(a){"string"==typeof a&&(a={url:a});return t?c.WebSocket(a,!0):c.LongPoll(a)};c.WebSocket=function(a,f){var e=new t(new w((document.baseURI||window.location.href).replace(/^http/i,"ws"),a.url));e.on=function(a,x){e.addEventListener(a,x,!0)};var g;q.after(e,"onopen",function(a){g=!0},!0);q.after(e,"onclose",function(b){g||
f&&c.replace(e,c.LongPoll(a),!0)},!0);return e};c.replace=function(a,f,e){a.send=m.hitch(f,"send");a.close=m.hitch(f,"close");var g=function(b){(f.addEventListener||f.on).call(f,b,function(b){r.emit(a,b.type,b)},!0)};e&&g("open");l.forEach(["message","close","error"],g)};c.LongPoll=function(a){var f=!1,e=!0,g,b=[],c,n,d={send:function(k){var p=m.delegate(a);p.rawBody=k;clearTimeout(g);var h=e?(e=!1,d.firstRequest(p)):d.transport(p);b.push(h);h.then(function(k){d.readyState=1;b.splice(l.indexOf(b,
h),1);b.length||(g=setTimeout(n,a.interval));k&&c("message",{data:k},h)},function(a){b.splice(l.indexOf(b,h),1);f||(c("error",{error:a},h),b.length||(clearTimeout(g),d.readyState=3,c("close",{wasClean:!1},h)))});return h},close:function(){d.readyState=2;f=!0;var a;for(a=0;a<b.length;a++)b[a].cancel();d.readyState=3;c("close",{wasClean:!0})},transport:a.transport||u.post,args:a,url:a.url,readyState:0,CONNECTING:0,OPEN:1,CLOSING:2,CLOSED:3,on:v.prototype.on,firstRequest:function(a){var b=a.headers||
(a.headers={});b.Pragma="start-long-poll";try{return this.transport(a)}finally{delete b.Pragma}}};c=function(a,b,c){d["on"+a]&&(b.ioArgs=c&&c.ioArgs,b.type=a,r.emit(d,a,b))};n=function(){0===d.readyState&&c("open",{});b.length||d.send()};d.connect=d.on;setTimeout(n);return d};return c});