// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.20/esri/copyright.txt for details.
//>>built
define("esri/tasks/ImageServiceIdentifyTask","dojo/_base/declare dojo/_base/lang dojo/has ../kernel ../request ../geometry/normalizeUtils ./Task ./ImageServiceIdentifyResult".split(" "),function(a,b,g,k,l,m,n,p){a=a(n,{declaredClass:"esri.tasks.ImageServiceIdentifyTask",constructor:function(e){this._url.path+="/identify";this._handler=b.hitch(this,this._handler)},__msigns:[{n:"execute",c:3,a:[{i:0,p:["geometry"]}],e:2}],_handler:function(e,a,f,c,d){try{var b=new p(e);this._successHandler([b],"onComplete",
f,d)}catch(h){this._errorHandler(h,c,d)}},execute:function(a,g,f,c){var d=c.assembly;a=this._encode(b.mixin({},this._url.query,{f:"json"},a.toJson(d&&d[0])));var e=this._handler,h=this._errorHandler;return l({url:this._url.path,content:a,callbackParamName:"callback",load:function(a,b){e(a,b,g,f,c.dfd)},error:function(a){h(a,f,c.dfd)}})},onComplete:function(){}});m._createWrappers(a);g("extend-esri")&&b.setObject("tasks.ImageServiceIdentifyTask",a,k);return a});