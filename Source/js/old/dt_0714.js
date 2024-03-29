﻿//需要获取到的json格式
var visible = [];
var ctxMenuForGraphics = null;
var ctxMenuForGraphics = null;
dojo.require("esri/map");
dojo.require("dojo/_base/lang");
dojo.require("dojo/json");
dojo.require("esri/config");
dojo.require("esri/tasks/GeometryService");
dojo.require("esri/tasks/AreasAndLengthsParameters");
dojo.require("dojo/dom-class");
dojo.require("esri/dijit/Popup");
dojo.require("esri/dijit/PopupTemplate");
dojo.require("esri/toolbars/draw");
dojo.require("esri/symbols/SimpleFillSymbol");
dojo.require("esri/geometry/Point");
dojo.require("dojo/on");
dojo.require("dojo/dom");
dojo.require("dojo/_base/Color");
dojo.require("esri/dijit/Scalebar");
dojo.require("esri/dijit/InfoWindowLite");
dojo.require("esri/dijit/InfoWindow");
dojo.require("dojo/dom-construct");
dojo.require("esri/symbols/SimpleMarkerSymbol");
dojo.require("esri/symbols/PictureMarkerSymbol");
dojo.require("esri/symbols/SimpleLineSymbol");
dojo.require("esri/symbols/CartographicLineSymbol");
dojo.require("esri/graphic");
dojo.require("dojo/dom-style");
dojo.require("dojo/query");
dojo.require("esri/layers/GraphicsLayer");
dojo.require("dojox/widget/ColorPicker");
dojo.require("esri/layers/CSVLayer");
dojo.require("esri/Color");
dojo.require("esri/renderers/SimpleRenderer");
dojo.require("esri/InfoTemplate");
dojo.require("esri/urlUtils");
dojo.require("esri/geometry/scaleUtils");
dojo.require("esri/dijit/HomeButton");
dojo.require("esri/tasks/RouteTask");
dojo.require("esri/toolbars/navigation");
dojo.require("esri/tasks/RouteParameters");
dojo.require("esri/tasks/FeatureSet");
dojo.require("esri/tasks/GeometryService");
dojo.require("esri/tasks/BufferParameters");
dojo.require("esri/tasks/IdentifyTask");
dojo.require("esri/tasks/IdentifyParameters");
dojo.require("esri/tasks/FindTask");
dojo.require("esri/tasks/FindParameters");
dojo.require("esri/InfoTemplate");
dojo.require("dijit/Menu");
dojo.require("dijit/MenuItem");
dojo.require("esri/geometry/jsonUtils");
//0710修改
var mapServiceURL = "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer";
mapServiceURL = "http://wangpan.chengtianhuiju.com:6080/arcgis/rest/services/yingkou/MapServer";
var zoneurl = mapServiceURL + "/14"; //县区面图层
var xzurl = mapServiceURL + "/2"; //乡镇图层
var hlurl = mapServiceURL + "/7"; //河流
var geourl = "http://wangpan.chengtianhuiju.com:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer";
var flRiver;
//mapServiceURL = "http://127.0.0.1:6080/arcgis/rest/services/yingkou/MapServer";
var searchNear;
var showFunc;
var map;
var unLayer; //保存信息的图层
var hlLayer, skLayer, ggzLayer; //水库图层
var queryZone, queryTaskZone, queryRiver, queryTaskRiver, symbolRiver; //0710添加
var findXiangCun, findParams;  //查找乡村
require([

        "esri/map",
        "esri/SpatialReference",
        "esri/dijit/Search",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/layers/ImageParameters",
        "esri/symbols/SimpleFillSymbol",
        "esri/InfoTemplate",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "esri/geometry/geometryEngine",
        "esri/geometry/Point",
        "esri/geometry/Polygon",
        "esri/tasks/BufferParameters",
       "esri/tasks/GeometryService",
        "dojo/domReady!"

      ], function (Map, SpatialReference, Search, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, FeatureLayer, ImageParameters, SimpleFillSymbol, InfoTemplate, Query, QueryTask, geometryEngine, Point, Polygon, BufferParameters, GeometryService) {
          map = new Map("map", {
              center: [122.479000, 40.416100], // lon, lat
              sliderPosition: "bottom-right", //bottom-left //top-right
              zoom: 9,
              logo: false
          });

          flRiver = new esri.layers.FeatureLayer(hlurl, {
              mode: esri.layers.FeatureLayer.MODE_SELECTION,
              outFields: ["Name"]
          }
        );
          //flRiver.setVisibility(false);
          map.addLayer(flRiver);

          //map = new Map("map");

          var imageParameters = new ImageParameters();
          imageParameters.format = "PNG32"; //set the image type to PNG24, note default is PNG8.
          /* 如果是普通地图服务就用这种方式加载*/
          var dLayer = new ArcGISDynamicMapServiceLayer(mapServiceURL);
          map.addLayer(dLayer);

          if (dLayer.loaded) {
              buildLayerList(dLayer);
          } else {
              dojo.connect(dLayer, "onLoad", buildLayerList);
          }

          //buildLayerList(dLayer);

          //var tiled = new ArcGISTiledMapServiceLayer(mapServiceURL);
          //map.addLayer(tiled);



          //          var infotemp = new esri.InfoTemplate();
          //          infotemp.setTitle("<b>${stnm}</b>"); //"<b>${name}</b>"
          //          infotemp.setContent("<span>降雨量:${jll}</br>详细地址:${STLC}</span>");

          //          unLayer = new esri.layers.GraphicsLayer("unLayer", { infoTemplate: infotemp });
          unLayer = new esri.layers.GraphicsLayer("unLayer");
          map.addLayer(unLayer);




          //按钮菜单
          ctxMenuForGraphics = new dijit.Menu({});
          ctxMenuForGraphics.addChild(new dijit.MenuItem({
              label: "查看信息",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  alert(selected.attributes["STNM"]);

              }
          }));

          ctxMenuForGraphics.startup();


          dojo.connect(unLayer, "onMouseOver", function (e) {
              selected = e.graphic;
              ctxMenuForGraphics.bindDomNode(e.graphic.getDojoShape().getNode());
          });

          dojo.connect(unLayer, "onMouseOut", function (e) {
              ctxMenuForGraphics.unBindDomNode(e.graphic.getDojoShape().getNode());
          });

          //          //鼠标移动到图元上绑定菜单
          //          unLayer.on("mouse-over", function (evt) {
          //              selected = evt.graphic;
          //              ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
          //          });

          //          //鼠标移出图元解除菜单
          //          unLayer.on("mouse-out", function (evt) {
          //              ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
          //          });

          //var skInfotemp = new esri.InfoTemplate();
          //skInfotemp.setTitle("<b>${STNM}</b>"); //"<b>${name}</b>"
          //skInfotemp.setContent("<span>水库:${STNM}</br>详细信息</br>${DYP}</span>");
          //水库
          skLayer = new esri.layers.GraphicsLayer("skLayer");
          map.addLayer(skLayer);

          //按钮菜单
          ctxMenuForGraphics_sk = new dijit.Menu({});
          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "基本信息",
              onClick: function () {
                  window.open("http://218.60.146.154/sqother/stcdshow.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));
          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "雨量柱状图",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://218.60.146.154/SQother/SQ_Map_chaoyang_1d_canshu.aspx?stcd=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));
          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "曲线分析",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://218.60.146.154/echarts/sk.aspx?stcd=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));
          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "防汛责任人",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://jiekou.chengtianhuiju.com:9099/zhanwang/Reservoir/TL_FXKHZRRShow2.aspx?stcd=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));
          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "逃险避险",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://jiekou.chengtianhuiju.com:9099/zhanwang/Reservoir/ST_AQZRRList.aspx?BranchID=7&paddress=" + selected.attributes["szxian"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));

          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "水文特征值",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://jiekou.chengtianhuiju.com:9099/zhanwang/Reservoir/ST_STBPRP_B/show_sw.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));

          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "水库特征值",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://jiekou.chengtianhuiju.com:9099/zhanwang/Reservoir/ST_STBPRP_B/show_sk.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));
          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "挡水建筑物",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://jiekou.chengtianhuiju.com:9099/zhanwang/Reservoir/ST_STBPRP_B/show_dsjzw.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));

          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "洪水建筑物",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://jiekou.chengtianhuiju.com:9099/zhanwang/Reservoir/ST_STBPRP_B/show_xhjzw.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));

          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "工程效益",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://jiekou.chengtianhuiju.com:9099/zhanwang/Reservoir/ST_STBPRP_B/show_gcxy.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));

          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "工程管理",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://jiekou.chengtianhuiju.com:9099/zhanwang/Reservoir/ST_STBPRP_B/show_gcgl.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));

          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "工程运用",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://jiekou.chengtianhuiju.com:9099/zhanwang/Reservoir/ST_STBPRP_B/show_gcyz.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));

          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "安全检测",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://jiekou.chengtianhuiju.com:9099/zhanwang/Reservoir/ST_STBPRP_B/show_aqjc.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));

          ctxMenuForGraphics_sk.addChild(new dijit.MenuItem({
              label: "安全鉴定",
              onClick: function () {
                  //按钮点击事件 selected就是选择的
                  window.open("http://jiekou.chengtianhuiju.com:9099/zhanwang/Reservoir/ST_STBPRP_B/show_aqjd.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
              }
          }));

          ctxMenuForGraphics_sk.startup();


          dojo.connect(skLayer, "onMouseOver", function (e) {
              selected = e.graphic;
              ctxMenuForGraphics_sk.bindDomNode(e.graphic.getDojoShape().getNode());
          });

          dojo.connect(skLayer, "onMouseOut", function (e) {
              ctxMenuForGraphics_sk.unBindDomNode(e.graphic.getDojoShape().getNode());
          });


          //河流
          hlLayer = new esri.layers.GraphicsLayer("hlLayer");
          map.addLayer(hlLayer);

          //灌溉站
          ggzLayer = new esri.layers.GraphicsLayer("ggzLayer");
          map.addLayer(ggzLayer);

          getAlarmData();
          //0710添加
          //监听click事件，当用户点击地图时执行executeQueryTask方法
          dojo.connect(map, "onClick", executeQueryTaskZone);

          //建立查询任务
          queryTaskZone = new esri.tasks.QueryTask(zoneurl);
          queryTaskRiver = new esri.tasks.QueryTask(hlurl);
          //queryRiver, queryTaskRiver

          //建立查询过滤器
          queryZone = new esri.tasks.Query();
          queryZone.returnGeometry = true;

          findXiangCun = new esri.tasks.FindTask(mapServiceURL);
          //FindTask的参数
          findParams = new esri.tasks.FindParameters();
          //返回Geometry
          findParams.returnGeometry = true;
          //查询的图层id
          findParams.layerIds = [2, 3];
          //查询字段
          findParams.searchFields = ["NAME"];


          symbolZone = new esri.symbol.SimpleFillSymbol
       (esri.symbol.SimpleFillSymbol.STYLE_SOLID,
       new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
       new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.5]));

          symbolRiver = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2);

          var geometryService = esri.tasks.GeometryService(geourl);

          var geom = null;
          function executeQueryTaskZone(evt) {
              //用户点击onClick事件返回地图上EVT点.
              //包含在MapPoint(esri.geometry.point)和screenPoint(pixel像素点).
              //设置查询几何等于evt.mapPoint
              //              queryZone.geometry = evt.mapPoint;

              //              //执行任务和完成showResults
              //              queryTaskZone.execute(queryZone, showResults);
              //              geom = evt.mapPoint;
              //              queryRiver.geometry = evt.mapPoint;
              //              queryTaskRiver.execute(queryRiver, showResultsRiver);
              geom = evt.mapPoint;
              var params = new esri.tasks.BufferParameters();
              params.geometries = [evt.mapPoint];
              params.distances = [100]; //0.1, 0.2
              params.unit = esri.tasks.BufferParameters.UNIT_KILOMETER;
              params.bufferSpatialReference = new SpatialReference({ wkid: 32649 });
              params.outSpatialReference = map.spatialReference;
              //geometryService.buffer(params, showBuffer);
              identifyTask(evt.mapPoint);
          }

          function showBuffer(bufferedGeometries) {
              var bfind = false;
              if (bufferedGeometries.length > 0) {
                  identifyTask(bufferedGeometries[0]);
                  //                  queryRiver = new esri.tasks.Query();
                  //                  queryRiver.geometry = bufferedGeometries[0];
                  //                  //queryRiver.returnGeometry = true;
                  //                  //queryRiver.outFields = ["*"];
                  //                  //服务器给我们返回的字段信息，*代表返回所有字段
                  //                  queryRiver.outFields = ["*"];
                  //                  //空间参考信息
                  //                  queryRiver.outSpatialReference = map.spatialReference;
                  //                  //查询的标准，此处代表和geometry相交的图形都要返回
                  //                  queryRiver.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;    //esri.tasks.    //SPATIAL_REL_INTERSECTS; //SPATIAL_REL_CROSSES
                  //                  //是否返回几何信息
                  //                  queryRiver.returnGeometry = true;
                  //                  queryTaskRiver.execute(queryRiver, showResultsRiver);
              }
              else {
                  queryZone.geometry = geom;
                  queryTaskZone.execute(queryZone, showResults);
              }
              //              for (var i = 0; i < bufferedGeometries.length; i++) {
              //                  if (bufferedGeometries[i] != null || bufferedGeometries[i] != undefined) {

              //                      //                      alert(bufferedGeometries[i].attributes["Name"]);
              //                      //                      var graphic = new esri.Graphic(bufferedGeometries[i], symbolRiver);
              //                      //                      map.graphics.add(graphic);
              //                      //                      bfind = true;

              //                      //                      for (var j = 0; j < flRiver.graphics.length; j++) {
              //                      //                          if (bufferedGeometries[i].getExtent().intersects(flRiver.graphics.geometry)) {
              //                      //                              //相交
              //                      //                              var graphic = new esri.Graphic(flRiver.graphics[j].geometry, symbolRiver);
              //                      //                              map.graphics.add(graphic);
              //                      //                              alert(flRiver.graphics[j].attributes["Name"]);
              //                      //                              bfind = true;
              //                      //                          }
              //                      //                      }

              //                      queryRiver.geometry = bufferedGeometries[i];
              //                      queryTaskRiver.execute(queryRiver, showResultsRiver);
              //                  }
              //              }

              //              if (bfind != true) {
              //                  queryZone.geometry = geom;
              //                  queryTaskZone.execute(queryZone, showResults);
              //              }
          }


          //空间查询
          function identifyTask(geometry) {
              //定义空间查询对象，注意他的参数是整个地图服务，而不是单个图层
              var identifyTask = new esri.tasks.IdentifyTask(mapServiceURL);
              //定义空间查询参数对象
              var params = new esri.tasks.IdentifyParameters();
              //容差
              params.tolerance = 5;
              //是否返回几何信息
              params.returnGeometry = true;
              //空间查询的图层
              params.layerIds = [4];
              //空间查询的条件
              params.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
              params.width = map.width;
              params.height = map.height;
              //空间查询的几何对象
              params.geometry = geometry;
              params.mapExtent = map.extent;
              //执行空间查询
              identifyTask.execute(params, showQueryResult);
          }
          //空间查询展示
          function showQueryResult(idResults) {
              //创建线符号
              //var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3);
              //创建面符号
              //var fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol);
              if (idResults.length > 0) {
                  map.graphics.clear();
                  var result = idResults[0];
                  //获得图形graphic
                  var graphic = result.feature;
                  //设置图形的符号
                  graphic.setSymbol(symbolRiver);
                  map.graphics.add(graphic);
                  alert(graphic.attributes["NAME"]); //获取到名称
              }
              else {
                  queryZone.geometry = geom;
                  queryTaskZone.execute(queryZone, showResults);
              }
          }


          function showResultsRiver(featureSet) {
              //删除地图上所有的图形层
              map.graphics.clear();

              var features = featureSet.features;
              if (features.length > 0) {
                  var graphic = features[0];
                  graphic.setSymbol(symbolRiver);

                  //添加当前这个图形到地图图层中
                  map.graphics.add(graphic);
                  alert(graphic.attributes["NAME"]); //获取到名称
              }
              else {
                  //查询面图层
                  queryZone.geometry = geom;
                  queryTaskZone.execute(queryZone, showResults);
              }
              //QueryTask返回featureSet类型.通过featureSet的循环把他们添加到信息窗口
              //              for (var i = 0, il = features.length; i < il; i++) {
              //                  //从featureSet中得到当前实例.
              //                  //从当前实例赋值给graphic
              //                  var graphic = features[0];
              //                  graphic.setSymbol(symbolZone);

              //                  //添加当前这个图形到地图图层中
              //                  map.graphics.add(graphic);
              //                  alert(graphic.attributes["Name"]); //获取到名称
              //              }


          }

          function showResults(featureSet) {
              //删除地图上所有的图形层
              map.graphics.clear();

              var features = featureSet.features;

              //QueryTask返回featureSet类型.通过featureSet的循环把他们添加到信息窗口
              for (var i = 0, il = features.length; i < il; i++) {
                  //从featureSet中得到当前实例.
                  //从当前实例赋值给graphic
                  var graphic = features[0];
                  graphic.setSymbol(symbolZone);

                  //添加当前这个图形到地图图层中
                  map.graphics.add(graphic);
                  alert(graphic.attributes["Name"]); //获取到名称
              }


          }
          //注册鼠标悬停监听事件
          dojo.connect(skLayer, "onMouseMove", function (evt) {
              var g = evt.graphic;
              var txt = g.attributes["STNM"] + "\n 水位:" + g.attributes["RZ"] + "\n 蓄水量:" + g.attributes["W"] + "\n 出库流量:" + g.attributes["OTQ"] + "\n 入库流量:" + g.attributes["INQ"];
              if (g.isText) {
                  console.log("in:" + g.attributes["STNM"]);
              }
              else {
                  g = findTextGraphic(g.attributes["STNM"]);
              }
              if (g != null) {
                  g.symbol.setText(txt);
                  skLayer.redraw();
              }
          });
          //注册鼠标离开监听事件
          dojo.connect(skLayer, "onMouseOut", function (evt) {
              var g = evt.graphic;
              var txt = g.attributes["STNM"];
              if (g.isText) {
                  console.log("out:" + g.attributes["STNM"]);
              }
              else {
                  g = findTextGraphic(g.attributes["STNM"]);
              }
              if (g != null) {
                  g.symbol.setText(txt);
                  skLayer.redraw();
              }
          });
          function findTextGraphic(stnm) {
              for (var i = 0; i < skLayer.graphics.length; i++) {
                  if (skLayer.graphics[i].isText == true && skLayer.graphics[i].attributes["STNM"] == stnm) {
                      return skLayer.graphics[i];
                  }
              }
              return null;
          }
      });

//初始化界面空间
function init() {
    for (var i = 0; i < 24; i++) { //循环添加多个值
        $("#starthour").append("<option value='" + i + "'>" + i + ":00</option>");
        $("#endhour").append("<option value='" + i + "'>" + i + ":00</option>");
    }

    var now = new Date();
    //alert(now.getDate() + '-' + now.getMonth());
    //格式化日，如果小于9，前面补0  
    var day = ("0" + now.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0  
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    //拼装完整日期格式  
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    //完成赋值  
    $('#startdate').val(today);
    $('#enddate').val(today);

    $("#endhour").val(now.getHours())
}



init();

function getChildrenNodes(parentnodes, node) {
    for (var i = parentnodes.length - 1; i >= 0; i--) {

        var pnode = parentnodes[i];
        //如果是父子关系，为父节点增加子节点，退出for循环
        if (pnode.id == node.pid) {
            pnode.state = "closed"; //关闭二级树
            pnode.children.push(node);
            return;
        } else {
            //如果不是父子关系，删除父节点栈里当前的节点，
            //继续此次循环，直到确定父子关系或不存在退出for循环
            parentnodes.pop();
        }
    }
}

function buildLayerList(layer) {
    //构建图层树形结构
    var layerinfos = layer.layerInfos;
    var treeList = []; //jquery-easyui的tree用到的tree_data.json数组
    var parentnodes = []; //保存所有的父亲节点
    var root = { "id": "rootnode", "text": "所有图层", "children": [] }; //增加一个根节点
    var node = {};
    if (layerinfos != null && layerinfos.length > 0) {

        for (var i = 0, j = layerinfos.length; i < j; i++) {
            var info = layerinfos[i];
            if (info.defaultVisibility) {
                visible.push(info.id);
            }
            //node为tree用到的json数据
            node = {
                "id": info.id,
                "text": info.name,
                "pid": info.parentLayerId,
                "checked": info.defaultVisibility ? true : false,
                "children": []
            };
            if (info.parentLayerId == -1) {
                parentnodes.push(node);
                root.children.push(node);
            } else {
                getChildrenNodes(parentnodes, node);
                parentnodes.push(node);
            }
        }
    }
    treeList.push(root);
    //jquery-easyui的树        
    $('#toc').tree({
        data: treeList,
        checkbox: true, //使节点增加选择框
        onCheck: function (node, checked) {//更新显示选择的图层
            var visible = [];

            var nodes = $('#toc').tree("getChecked");
            dojo.forEach(nodes, function (node) {
                visible.push(node.id);
            });
            //if there aren't any layers visible set the array to be -1
            if (visible.length === 0) {
                visible.push(-1);
            }
            layer.setVisibleLayers(visible);
        }
    });


    layer.setVisibleLayers(visible);
    map.addLayer(layer);
}

dojo.ready(init);

function searchdata() {
    var startdate = $('#startdate').val();
    var enddate = $('#enddate').val();
    var starthour = $('#starthour').val();
    var endhour = $('#endhour').val();
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");
    //ajax请求
    //请求数据
    //从后台获取gps数据
    var dataurl="./data.ashx?sd="+startdate+"&ed="+enddate+"&sh="+starthour+"&eh="+endhour;
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: dataurl,
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            unLayer.clear();
            if (result != null && result.oprates != null && result.oprates.length > 0) {
                //                alert(result);
                //                console.log(result);

                var max = 0;
                for (var i = 0; i < result.oprates.length; i++) {
                    if (parseFloat(result.oprates[i].DYP) > max) {
                        max = parseFloat(result.oprates[i].DYP);
                    }
                }
                for (var i = 0; i < result.oprates.length; i++) {

                    //                    var pSymbol = esri.symbol.PictureMarkerSymbol("img/green.png", 27, 31);
                    //                    if (result.list[i].jll >= 50) {
                    //                        pSymbol = esri.symbol.PictureMarkerSymbol("img/red.png", 27, 31);
                    //                    }
                    //                    else if (result.list[i].jll < 50 && result.list[i].jll >= 10) {
                    //                        pSymbol = esri.symbol.PictureMarkerSymbol("img/yello.png", 27, 31);
                    //                    }
                    //                    else {
                    //                        pSymbol = esri.symbol.PictureMarkerSymbol("img/green.png", 27, 31); 
                    //                    }
                    //                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    //                    graphic = new esri.Graphic(geometry, pSymbol);
                    //                    graphic.attributes = result.list[i];

                    //文本
                    //车号
                    var geometry = new esri.geometry.Point(result.oprates[i].LGTD, result.oprates[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");


                    //文本标注
                    var textSymbol = new esri.symbol.TextSymbol(result.oprates[i].STNM + "\n" + result.oprates[i].DYP);
                    textSymbol.setColor(new esri.Color([220, 25, 125, 0.5]));

                    if (result.oprates[i].DYP == max) {
                        textSymbol.setColor(new esri.Color([255, 0, 0, 1]));
                        font.setSize("20pt");
                    }
                    else {
                        font.setSize("10pt");
                        textSymbol.setColor(new esri.Color([20, 25, 220, 0.5]));
                    }
                    textSymbol.setFont(font);
                    //textSymbol.setOffset(0, -25);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.oprates[i]);
                    unLayer.add(graphicText);
                }
            }
            unLayer.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

function searchhldata() {
    var startdate = $('#startdate').val();
    var enddate = $('#enddate').val();
    var starthour = $('#starthour').val();
    var endhour = $('#endhour').val();
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");
    //ajax请求
    //请求数据
    //从后台获取gps数据
    var dataurl = "./data.ashx?t=hl&?sd=" + startdate + "&ed=" + enddate + "&sh=" + starthour + "&eh=" + endhour;
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: dataurl,
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            hlLayer.clear();
            if (result != null && result.oprates != null && result.oprates.length > 0) {
                //                alert(result);
                //                console.log(result);

                for (var i = 0; i < result.oprates.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol("img/shuiwei.gif", 16, 16);
                    var geometry = new esri.geometry.Point(result.oprates[i].LGTD, result.oprates[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.oprates[i];
                    hlLayer.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.oprates[i].LGTD, result.oprates[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");


                    //文本标注
                    var textSymbol = new esri.symbol.TextSymbol(result.oprates[i].STNM + "\n Z=" + result.oprates[i].Z + "\n Q=" + result.oprates[i].Q + "\n WPTN=" + result.oprates[i].WPTN);
                    textSymbol.setColor(new esri.Color([10, 25, 200, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -39);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.oprates[i]);
                    hlLayer.add(graphicText);
                }
            }
            hlLayer.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}
function searchskdata() {
    var startdate = $('#startdate').val();
    var enddate = $('#enddate').val();
    var starthour = $('#starthour').val();
    var endhour = $('#endhour').val();
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");
    //ajax请求
    //请求数据
    //从后台获取gps数据
    var dataurl = "./data.ashx?t=sk&?sd=" + startdate + "&ed=" + enddate + "&sh=" + starthour + "&eh=" + endhour;
    //加载水库信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: dataurl,
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            skLayer.clear();
            if (result != null && result.oprates != null && result.oprates.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.oprates.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol("img/sk.gif", 16, 16);
                    //                if (result.list[i].jll >= 50) {
                    //                    pSymbol = esri.symbol.PictureMarkerSymbol("img/red.png", 27, 31);
                    //                }
                    //                else if (result.list[i].jll < 50 && result.list[i].jll >= 10) {
                    //                    pSymbol = esri.symbol.PictureMarkerSymbol("img/yello.png", 27, 31);
                    //                }
                    //                else {
                    //                    pSymbol = esri.symbol.PictureMarkerSymbol("img/green.png", 27, 31); 
                    //                }
                    var geometry = new esri.geometry.Point(result.oprates[i].LGTD, result.oprates[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.oprates[i];
                    skLayer.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.oprates[i].LGTD, result.oprates[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //文本标注 //0710修改
                    var textSymbol = new esri.symbol.TextSymbol(result.oprates[i].STNM);
                    //var textSymbol = new esri.symbol.TextSymbol(result.oprates[i].STNM + "\n RZ =" + result.oprates[i].RZ + "\n W =" + result.oprates[i].W + "\n OTQ =" + result.oprates[i].OTQ + "\n INQ =" + result.oprates[i].INQ);
                    textSymbol.setColor(new esri.Color([100, 120, 200, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -50);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.oprates[i]);
                    graphicText.isText = true;
                    skLayer.add(graphicText);
                }
            }
            skLayer.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

function searchskdatawdcl() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=skwdcl",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            skLayer.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol("img/sk.gif", 16, 16);

                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    skLayer.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");


                    //文本标注 //0710修改
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([100, 120, 200, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    graphicText.isText = true;
                    skLayer.add(graphicText);
                }
            }
            skLayer.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}


function searchggzdata() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=ggz",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            ggzLayer.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol("img/ggz.png", 16, 16);
                    //                if (result.list[i].jll >= 50) {
                    //                    pSymbol = esri.symbol.PictureMarkerSymbol("img/red.png", 27, 31);
                    //                }
                    //                else if (result.list[i].jll < 50 && result.list[i].jll >= 10) {
                    //                    pSymbol = esri.symbol.PictureMarkerSymbol("img/yello.png", 27, 31);
                    //                }
                    //                else {
                    //                    pSymbol = esri.symbol.PictureMarkerSymbol("img/green.png", 27, 31); 
                    //                }
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    ggzLayer.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //"ts":"","xs":"","djrl":"","yxpsmj":"","bz":"","xian":"大石桥市","xiangzhen":"沟沿镇","hnnm":"","bsnm":
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].mc + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].mc);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    graphicText.isText = true;
                    ggzLayer.add(graphicText);
                }
            }
            ggzLayer.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

function clearall() {

    unLayer.clear();
    hlLayer.clear();
    skLayer.clear();
    ggzLayer.clear();

    unLayer.redraw();
    hlLayer.redraw();
    skLayer.redraw();
    ggzLayer.redraw();
}

function searchWords() {
    var words = $('#tbWords').val();
    searchLocalAndServer(words);
}

function searchLocalAndServer(word) {
    //查询本地
    var ggzFind = false;
    for (var i = 0; i < ggzLayer.graphics.length; i++) {
        if (ggzLayer.graphics[i].isText != true && ggzLayer.graphics[i].attributes["STNM"].includes(word)) {
            ggzFind = true;

//            var sGeometry = ggzLayer.graphics[i].geometry; //获取图形
//            var centerPoint = sGeometry.getCentroid(); //获取多边形中心点
//            var cPoint = new esri.geometry.Point();
//            cPoint.x = centerPoint.x;
            //            cPoint.y = centerPoint.y;
            require([
        "esri/map", "esri/toolbars/draw",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/PictureFillSymbol", "esri/symbols/CartographicLineSymbol",
        "esri/graphic",
        "esri/Color", "dojo/dom", "dojo/on", "dojo/domReady!"
      ], function (
        Map, Draw,
        SimpleMarkerSymbol, SimpleLineSymbol,
        PictureFillSymbol, CartographicLineSymbol,
        Graphic,
        Color, dom, on
      ) {

          var markerSymbol = new SimpleMarkerSymbol();
          markerSymbol.setPath("M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z");
          markerSymbol.setColor(new Color("#00FFFF"));

          markerSymbol = new SimpleMarkerSymbol(
              SimpleMarkerSymbol.STYLE_CIRCLE,
              20, new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 5, 5, 0.5]),
                10
              ),
              new Color([255, 5, 5, 0.9]));
          map.graphics.clear();
          map.graphics.add(new Graphic(ggzLayer.graphics[i].geometry, markerSymbol));
          map.centerAt(ggzLayer.graphics[i].geometry);
      });
            //	feature.setSymbol(poly
        }
    }
    //查询服务器
if (!ggzFind) {
//    var queryTask = new esri.tasks.QueryTask(xzurl);

//    var query = new esri.tasks.Query();
//    query.returnGeometry = true;
//    query.outFields = [
//          "Name"
    //        ];

    findParams.searchText = word;
    findXiangCun.execute(findParams, showResultsXZ);

    function showResults(results) {
        if (results.features.length > 0) {
            require([
        "esri/map", "esri/toolbars/draw",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/PictureFillSymbol", "esri/symbols/CartographicLineSymbol",
        "esri/graphic",
        "esri/Color", "dojo/dom", "dojo/on", "dojo/domReady!"
      ], function (
        Map, Draw,
        SimpleMarkerSymbol, SimpleLineSymbol,
        PictureFillSymbol, CartographicLineSymbol,
        Graphic,
        Color, dom, on
      ) {

          var markerSymbol = new SimpleMarkerSymbol();
          markerSymbol.setPath("M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z");
          markerSymbol.setColor(new Color("#00FFFF"));

          markerSymbol = new SimpleMarkerSymbol(
              SimpleMarkerSymbol.STYLE_CIRCLE,
              20, new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 5, 5, 0.5]),
                10
              ),
              new Color([255, 5, 5, 0.9]));
          map.graphics.clear();
          map.graphics.add(new Graphic(results.features[0].geometry, markerSymbol));
          map.centerAt(results.features[0].geometry);
      });
        }
}

function showResultsXZ(results) {
    if (results.length > 0) {
        require([
        "esri/map", "esri/toolbars/draw",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/PictureFillSymbol", "esri/symbols/CartographicLineSymbol",
        "esri/graphic",
        "esri/Color", "dojo/dom", "dojo/on", "dojo/domReady!"
      ], function (
        Map, Draw,
        SimpleMarkerSymbol, SimpleLineSymbol,
        PictureFillSymbol, CartographicLineSymbol,
        Graphic,
        Color, dom, on
      ) {

          var markerSymbol = new SimpleMarkerSymbol();
          markerSymbol.setPath("M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z");
          markerSymbol.setColor(new Color("#00FFFF"));

          markerSymbol = new SimpleMarkerSymbol(
              SimpleMarkerSymbol.STYLE_CIRCLE,
              20, new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 5, 5, 0.5]),
                10
              ),
              new Color([255, 5, 5, 0.9]));
          map.graphics.clear();
          map.graphics.add(new Graphic(results[0].feature.geometry, markerSymbol));
          map.centerAt(results[0].feature.geometry);
      });
    }
  else {
      alert("没有查询到相关结果！");
    }
}

//    query.text = word;
//    queryTask.execute(query, showResults);
    }
}