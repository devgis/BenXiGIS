//需要获取到的json格式
var visible = [];

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
dojo.require("esri/InfoTemplate");
dojo.require("dijit/Menu");
dojo.require("dijit/MenuItem");
dojo.require("esri/geometry/jsonUtils");
var mapServiceURL = "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer";
//mapServiceURL = "http://localhost:6080/arcgis/rest/services/yingkou/MapServer";
mapServiceURL = "http://wangpan.chengtianhuiju.com:6080/arcgis/rest/services/yingkou/MapServer";
var searchNear;
var showFunc;
var map;
var unLayer; //保存信息的图层
var hlLayer, skLayer, ggzLayer, yifaqu1Layer, yifaqu3Layer, yifaqu4Layer, yifaqu5Layer, yifaqu6Layer, yifaqu7Layer, yifaquLayerCanshu0, yifaquLayerCanshu1; //水库图层
var yifaquLayerCanshu2, yifaquLayerCanshu3, yifaquLayerCanshu4, yifaquLayerCanshu5, yifaquLayerCanshu6, yifaquLayerCanshu8, yifaquLayerCanshu9, yifaquLayerCanshu10;
var yifaquLayerCanshu11, yifaquLayerCanshu12, yifaquLayerCanshu16, yifaquLayerCanshu17, yifaquLayerCanshu18;
var shuikuLayerCanshu1, shuikuLayerCanshu2, shuikuLayerCanshu3, shuikuLayerCanshu4, shuikuLayerCanshu5
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
        center: [122.479000,40.416100], // lon, lat
        sliderPosition: "bottom-right", //bottom-left //top-right
        zoom:9,
        logo: false,
    });


     map.enableScrollWheelZoom();


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

    var tiled = new ArcGISTiledMapServiceLayer(mapServiceURL);
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
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://218.60.146.154/sqother/stcdshow.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
        }
    }));
    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "雨量柱状图",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://218.60.146.154/SQother/SQ_Map_chaoyang_1d_canshu.aspx?stcd=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
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
        label: "基础数据",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://218.60.146.154/echarts/sk.aspx?stcd=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
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
    //按钮菜单
    ctxMenuForGraphics_hl = new dijit.Menu({});
    ctxMenuForGraphics_hl.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            window.open("http://218.60.146.154/sqother/stcdshow.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
        }
    }));
    ctxMenuForGraphics_hl.addChild(new dijit.MenuItem({
        label: "雨量柱状图",
        onClick: function () {
            window.open("http://218.60.146.154/SQother/SQ_Map_chaoyang_1d_canshu.aspx?stcd=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
        }
    }));
    ctxMenuForGraphics_hl.addChild(new dijit.MenuItem({
        label: "流量雨量关系图",
        onClick: function () {
            window.open("http://218.60.146.154/echarts/lljy.aspx?pstcds=" + selected.attributes["STCD"], "newwindow", "height=326, width=710, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
        }
    }));

    ctxMenuForGraphics_hl.startup();
    dojo.connect(hlLayer, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_hl.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(hlLayer, "onMouseOut", function (e) {
        ctxMenuForGraphics_hl.unBindDomNode(e.graphic.getDojoShape().getNode());
    });




    //灌溉站
    ggzLayer = new esri.layers.GraphicsLayer("ggzLayer");
    map.addLayer(ggzLayer);
    //按钮菜单
    ctxMenuForGraphics_ggz = new dijit.Menu({});
    ctxMenuForGraphics_ggz.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_GuanGaiZhanShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")


        }
    }));
    ctxMenuForGraphics_ggz.startup();
    dojo.connect(ggzLayer, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_ggz.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(ggzLayer, "onMouseOut", function (e) {
        ctxMenuForGraphics_ggz.unBindDomNode(e.graphic.getDojoShape().getNode());
    });



    //泥石流易发区
    yifaqu1Layer = new esri.layers.GraphicsLayer("yifaqu1Layer");
    map.addLayer(yifaqu1Layer);
    //按钮菜单
    ctxMenuForGraphics_yifaqu = new dijit.Menu({});
    ctxMenuForGraphics_yifaqu.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaqu.startup();
    dojo.connect(yifaqu1Layer, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaqu.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaqu1Layer, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaqu.unBindDomNode(e.graphic.getDojoShape().getNode());
    });



    //山体滑坡易发区
    yifaqu3Layer = new esri.layers.GraphicsLayer("yifaqu3Layer");
    map.addLayer(yifaqu3Layer);
    //按钮菜单
    ctxMenuForGraphics_yifaqu3 = new dijit.Menu({});
    ctxMenuForGraphics_yifaqu3.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaqu3.startup();
    dojo.connect(yifaqu3Layer, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaqu3.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaqu3Layer, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaqu3.unBindDomNode(e.graphic.getDojoShape().getNode());
    });



    //崩塌易发区
    yifaqu4Layer = new esri.layers.GraphicsLayer("yifaqu4Layer");
    map.addLayer(yifaqu4Layer);
    //按钮菜单
    ctxMenuForGraphics_yifaqu4 = new dijit.Menu({});
    ctxMenuForGraphics_yifaqu4.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaqu4.startup();
    dojo.connect(yifaqu4Layer, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaqu4.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaqu4Layer, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaqu4.unBindDomNode(e.graphic.getDojoShape().getNode());
    });



    //地面塌陷易发区
    yifaqu5Layer = new esri.layers.GraphicsLayer("yifaqu5Layer");
    map.addLayer(yifaqu5Layer);
    //按钮菜单
    ctxMenuForGraphics_yifaqu5 = new dijit.Menu({});
    ctxMenuForGraphics_yifaqu5.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaqu5.startup();
    dojo.connect(yifaqu5Layer, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaqu5.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaqu5Layer, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaqu5.unBindDomNode(e.graphic.getDojoShape().getNode());
    });




    //地面裂缝易发区
    yifaqu6Layer = new esri.layers.GraphicsLayer("yifaqu6Layer");
    map.addLayer(yifaqu6Layer);
    //按钮菜单
    ctxMenuForGraphics_yifaqu6 = new dijit.Menu({});
    ctxMenuForGraphics_yifaqu6.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaqu6.startup();
    dojo.connect(yifaqu6Layer, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaqu6.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaqu6Layer, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaqu6.unBindDomNode(e.graphic.getDojoShape().getNode());
    })




    //海水入侵区
    yifaqu7Layer = new esri.layers.GraphicsLayer("yifaqu7Layer");
    map.addLayer(yifaqu7Layer);
    //按钮菜单
    ctxMenuForGraphics_yifaqu7 = new dijit.Menu({});
    ctxMenuForGraphics_yifaqu7.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaqu7.startup();
    dojo.connect(yifaqu7Layer, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaqu7.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaqu7Layer, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaqu7.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //特大型泥石流易发区
    yifaquLayerCanshu0 = new esri.layers.GraphicsLayer("yifaquLayerCanshu0");
    map.addLayer(yifaquLayerCanshu0);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu0 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu0.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu0.startup();
    dojo.connect(yifaquLayerCanshu0, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu0.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu0, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu0.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //大型泥石流易发区
    yifaquLayerCanshu1 = new esri.layers.GraphicsLayer("yifaquLayerCanshu1");
    map.addLayer(yifaquLayerCanshu1);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu1 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu1.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu1.startup();
    dojo.connect(yifaquLayerCanshu1, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu1.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu1, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu1.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //中型泥石流易发区
    yifaquLayerCanshu2 = new esri.layers.GraphicsLayer("yifaquLayerCanshu2");
    map.addLayer(yifaquLayerCanshu2);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu2 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu2.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu2.startup();
    dojo.connect(yifaquLayerCanshu2, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu2.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu2, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu2.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //小型泥石流易发区
    yifaquLayerCanshu3 = new esri.layers.GraphicsLayer("yifaquLayerCanshu3");
    map.addLayer(yifaquLayerCanshu3);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu3 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu3.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu3.startup();
    dojo.connect(yifaquLayerCanshu3, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu3.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu3, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu3.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //潜在大型泥石流易发区
    yifaquLayerCanshu4 = new esri.layers.GraphicsLayer("yifaquLayerCanshu4");
    map.addLayer(yifaquLayerCanshu4);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu4 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu4.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu4.startup();
    dojo.connect(yifaquLayerCanshu4, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu4.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu4, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu4.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //潜在中型泥石流易发区
    yifaquLayerCanshu5 = new esri.layers.GraphicsLayer("yifaquLayerCanshu5");
    map.addLayer(yifaquLayerCanshu5);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu5 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu5.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu5.startup();
    dojo.connect(yifaquLayerCanshu5, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu5.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu5, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu5.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //潜在小型泥石流易发区
    yifaquLayerCanshu6 = new esri.layers.GraphicsLayer("yifaquLayerCanshu6");
    map.addLayer(yifaquLayerCanshu6);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu6 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu6.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu6.startup();
    dojo.connect(yifaquLayerCanshu6, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu6.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu6, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu6.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //大型山体滑坡易发区
    yifaquLayerCanshu8 = new esri.layers.GraphicsLayer("yifaquLayerCanshu8");
    map.addLayer(yifaquLayerCanshu8);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu8 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu8.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu8.startup();
    dojo.connect(yifaquLayerCanshu8, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu8.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu8, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu8.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //中型山体滑坡易发区
    yifaquLayerCanshu9 = new esri.layers.GraphicsLayer("yifaquLayerCanshu9");
    map.addLayer(yifaquLayerCanshu9);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu9 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu9.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu9.startup();
    dojo.connect(yifaquLayerCanshu9, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu9.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu9, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu9.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //小型山体滑坡易发区
    yifaquLayerCanshu10 = new esri.layers.GraphicsLayer("yifaquLayerCanshu10");
    map.addLayer(yifaquLayerCanshu10);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu10 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu10.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu10.startup();
    dojo.connect(yifaquLayerCanshu10, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu10.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu10, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu10.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //潜在崩塌易发区
    yifaquLayerCanshu11 = new esri.layers.GraphicsLayer("yifaquLayerCanshu11");
    map.addLayer(yifaquLayerCanshu11);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu11 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu11.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu11.startup();
    dojo.connect(yifaquLayerCanshu11, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu11.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu11, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu11.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //崩塌易发区
    yifaquLayerCanshu12 = new esri.layers.GraphicsLayer("yifaquLayerCanshu12");
    map.addLayer(yifaquLayerCanshu12);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu12 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu12.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu12.startup();
    dojo.connect(yifaquLayerCanshu12, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu12.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu12, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu12.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //水闸
    yifaquLayerCanshu16 = new esri.layers.GraphicsLayer("yifaquLayerCanshu16");
    map.addLayer(yifaquLayerCanshu16);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu16 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu16.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu16.startup();
    dojo.connect(yifaquLayerCanshu16, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu16.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu16, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu16.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //防汛抗旱物资仓库
    yifaquLayerCanshu17 = new esri.layers.GraphicsLayer("yifaquLayerCanshu17");
    map.addLayer(yifaquLayerCanshu17);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu17 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu17.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu17.startup();
    dojo.connect(yifaquLayerCanshu17, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu17.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu17, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu17.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //尾矿库
    yifaquLayerCanshu18 = new esri.layers.GraphicsLayer("yifaquLayerCanshu18");
    map.addLayer(yifaquLayerCanshu18);
    //按钮菜单
    ctxMenuForGraphics_yifaquLayerCanshu18 = new dijit.Menu({});
    ctxMenuForGraphics_yifaquLayerCanshu18.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_YiFaQuFShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_yifaquLayerCanshu18.startup();
    dojo.connect(yifaquLayerCanshu18, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_yifaquLayerCanshu18.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(yifaquLayerCanshu18, "onMouseOut", function (e) {
        ctxMenuForGraphics_yifaquLayerCanshu18.unBindDomNode(e.graphic.getDojoShape().getNode());
    })


    //*******************************************************************

    //大I型水库
    shuikuLayerCanshu1 = new esri.layers.GraphicsLayer("shuikuLayerCanshu1");
    map.addLayer(shuikuLayerCanshu1);
    //按钮菜单
    ctxMenuForGraphics_shuikuLayerCanshu1 = new dijit.Menu({});
    ctxMenuForGraphics_shuikuLayerCanshu1.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://218.60.146.154/sqother/stcdshow.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_shuikuLayerCanshu1.startup();
    dojo.connect(shuikuLayerCanshu1, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_shuikuLayerCanshu1.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(shuikuLayerCanshu1, "onMouseOut", function (e) {
        ctxMenuForGraphics_shuikuLayerCanshu1.unBindDomNode(e.graphic.getDojoShape().getNode());
    })


    //大II型水库
    shuikuLayerCanshu2 = new esri.layers.GraphicsLayer("shuikuLayerCanshu2");
    map.addLayer(shuikuLayerCanshu2);
    //按钮菜单
    ctxMenuForGraphics_shuikuLayerCanshu2 = new dijit.Menu({});
    ctxMenuForGraphics_shuikuLayerCanshu2.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://218.60.146.154/sqother/stcdshow.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_shuikuLayerCanshu2.startup();
    dojo.connect(shuikuLayerCanshu2, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_shuikuLayerCanshu2.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(shuikuLayerCanshu2, "onMouseOut", function (e) {
        ctxMenuForGraphics_shuikuLayerCanshu2.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //中型水库
    shuikuLayerCanshu3 = new esri.layers.GraphicsLayer("shuikuLayerCanshu3");
    map.addLayer(shuikuLayerCanshu3);
    //按钮菜单
    ctxMenuForGraphics_shuikuLayerCanshu3 = new dijit.Menu({});
    ctxMenuForGraphics_shuikuLayerCanshu3.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://218.60.146.154/sqother/stcdshow.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_shuikuLayerCanshu3.startup();
    dojo.connect(shuikuLayerCanshu3, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_shuikuLayerCanshu3.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(shuikuLayerCanshu3, "onMouseOut", function (e) {
        ctxMenuForGraphics_shuikuLayerCanshu3.unBindDomNode(e.graphic.getDojoShape().getNode());
    })


    //小一型水库
    shuikuLayerCanshu4 = new esri.layers.GraphicsLayer("shuikuLayerCanshu4");
    map.addLayer(shuikuLayerCanshu4);
    //按钮菜单
    ctxMenuForGraphics_shuikuLayerCanshu4 = new dijit.Menu({});
    ctxMenuForGraphics_shuikuLayerCanshu4.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://218.60.146.154/sqother/stcdshow.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_shuikuLayerCanshu4.startup();
    dojo.connect(shuikuLayerCanshu4, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_shuikuLayerCanshu4.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(shuikuLayerCanshu4, "onMouseOut", function (e) {
        ctxMenuForGraphics_shuikuLayerCanshu4.unBindDomNode(e.graphic.getDojoShape().getNode());
    })



    //小二型水库
    shuikuLayerCanshu5 = new esri.layers.GraphicsLayer("shuikuLayerCanshu5");
    map.addLayer(shuikuLayerCanshu5);
    //按钮菜单
    ctxMenuForGraphics_shuikuLayerCanshu5 = new dijit.Menu({});
    ctxMenuForGraphics_shuikuLayerCanshu5.addChild(new dijit.MenuItem({
        label: "基本信息",
        onClick: function () {
            //按钮点击事件 selected就是选择的
            window.open("http://218.60.146.154/sqother/stcdshow.aspx?STCD=" + selected.attributes["STCD"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")

        }
    }));
    ctxMenuForGraphics_shuikuLayerCanshu5.startup();
    dojo.connect(shuikuLayerCanshu5, "onMouseOver", function (e) {
        selected = e.graphic;
        ctxMenuForGraphics_shuikuLayerCanshu5.bindDomNode(e.graphic.getDojoShape().getNode());
    });
    dojo.connect(shuikuLayerCanshu5, "onMouseOut", function (e) {
        ctxMenuForGraphics_shuikuLayerCanshu5.unBindDomNode(e.graphic.getDojoShape().getNode());
    })

    getAlarmData();

});

//初始化界面空间
function init() {
    for (var i = 0; i < 24; i++) { //循环添加多个值
        $("#starthour").append("<option value='" + i + "'>" + i + ":00</option>");
        $("#endhour").append("<option value='" + i + "'>" + i + ":00</option>");
        $("#endhour1").append("<option value='" + i + "'>" + i + ":00</option>");
        $("#endhour2").append("<option value='" + i + "'>" + i + ":00</option>");
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
    $('#enddate1').val(today);
    $('#enddate2').val(today);
    $('#enddate').val(today);

    $("#endhour").val(now.getHours())
    $("#endhour1").val(now.getHours())
    $("#endhour2").val(now.getHours())
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
    var root = { "id": "rootnode", "text": "地图图层", "children": [] }; //增加一个根节点
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

    var ss = [
    {
        "id": 1,
        "text": "水库图层",
        "iconCls": "icon-save",
        "children": [
            { "text": "大Ⅰ型水库", "checked": true }, { "text": "大Ⅱ型水库", "checked": true }, { "text": "中型水库", "checked": true },
            { "text": "小一型水库", "checked": true }, { "text": "小二型水库", "checked": true }
        ]
    }, {
        "text": "灌溉站",
        "state": "closed",
        "children": [
            { "text": "灌溉站", "checked": true }
        ]
    }, {
        "text": "水闸",
        "state": "closed",
        "children": [
            { "text": "水闸", "checked": true }
        ]
    }, {
        "text": "防汛抗旱物资仓库",
        "state": "closed",
        "children": [
            { "text": "防汛抗旱物资仓库", "checked": true }
        ]
    }, {
        "text": "泥石流易发区",
        "state": "closed",
        "children": [
            { "text": "特大型泥石流易发区", "checked": true }, { "text": "大型泥石流易发区", "checked": true },
            { "text": "中型泥石流易发区", "checked": true }, { "text": "小型泥石流易发区", "checked": true },
            { "text": "潜在大型泥石流易发区", "checked": true }, { "text": "潜在中型泥石流易发区", "checked": true },
            { "text": "潜在小型泥石流易发区", "checked": true },
        ]
    }, {
        "text": "山体滑坡易发区",
        "state": "closed",
        "children": [
            { "text": "大型山体滑坡易发区", "checked": true }, { "text": "中型山体滑坡易发区", "checked": true },
            { "text": "小型山体滑坡易发区", "checked": true }
        ]
    }, {
        "text": "崩塌易发区",
        "state": "closed",
        "children": [
            { "text": "潜在崩塌易发区", "checked": true }, { "text": "崩塌易发区", "checked": true }
        ]
    }, {
        "text": "地面塌陷易发区",
        "state": "closed",
        "children": [
            { "text": "地面塌陷易发区", "checked": true }
        ]
    }, {
        "text": "地面裂缝易发区",
        "state": "closed",
        "children": [
            { "text": "地面裂缝易发区", "checked": true }
        ]
    }, {
        "text": "海水入侵区",
        "state": "closed",
        "children": [
            { "text": "海水入侵区", "checked": true }
        ]
    }, {
        "text": "尾矿库",
        "state": "closed",
        "children": [
            { "text": "海水入侵区", "checked": true }
        ]
    }, {
        "text": "清除所有",
        "state": "closed",
        "children": [
            { "text": "清除所有", "checked": true }
        ]
    }
    ];

    $('#treeLbt').tree({
        data: ss,
        checkbox: true, //使节点增加选择框
        onCheck: function (node, checked) {//更新显示选择的图层
            //var visible = [];

            //var nodes = $('#toc').tree("getChecked");
            //dojo.forEach(nodes, function (node) {
            //    visible.push(node.id);
            //});
            ////if there aren't any layers visible set the array to be -1
            //if (visible.length === 0) {
            //    visible.push(-1);
            //}
            //layer.setVisibleLayers(visible);
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
    var dataurl = "./data.ashx?sd=" + startdate + "&ed=" + enddate + "&sh=" + starthour + "&eh=" + endhour;
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: dataurl,
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            unLayer.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);

                var max = 0;
                for (var i = 0; i < result.list.length; i++) {
                    if (parseFloat(result.list[i].jll) > max) {
                        max = result.list[i].jll;
                    }
                }


                for (var i = 0; i < result.list.length; i++) {

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
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");


                    //文本标注
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].stnm + "\n" + result.list[i].jll);
                    textSymbol.setColor(new esri.Color([220, 25, 125, 0.5]));

                    if (result.list[i].jll == max) {
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
                    graphicText.setAttributes(result.list[i]);
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
function searchdatawdcl() {
    var startdate = $('#startdate').val();
    var enddate = $('#enddate').val();
    var starthour = $('#starthour').val();
    var endhour = $('#endhour').val();
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");
    //ajax请求
    //请求数据
    //从后台获取gps数据
    var dataurl = "./data.ashx?sd=" + startdate + "&ed=" + enddate + "&sh=" + starthour + "&eh=" + endhour;
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
                    //                    if (result.oprates[i].DYP >= 50) {
                    //                        pSymbol = esri.symbol.PictureMarkerSymbol("img/red.png", 27, 31);
                    //                    }
                    //                    else if (result.oprates[i].DYP < 50 && result.oprates[i].jll >= 10) {
                    //                        pSymbol = esri.symbol.PictureMarkerSymbol("img/yello.png", 27, 31);
                    //                    }
                    //                    else {
                    //                        pSymbol = esri.symbol.PictureMarkerSymbol("img/green.png", 27, 31); 
                    //                    }
                    //                    var geometry = new esri.geometry.Point(result.oprates[i].LGTD, result.oprates[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    //                    graphic = new esri.Graphic(geometry, pSymbol);
                    //                    graphic.attributes = result.oprates[i];

                    //文本
                    //车号
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.oprates[i].Pic, 16, 16);
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
                    textSymbol.setOffset(25, -25);
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
    var startdate = "";
    var enddate = $('#enddate1').val();
    var starthour = "";
    var endhour = $('#endhour1').val();
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
    var startdate = "";
    var enddate = $('#enddate2').val();
    var starthour = "";
    var endhour = $('#endhour2').val();
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

                    //文本标注
                    var textSymbol = new esri.symbol.TextSymbol(result.oprates[i].STNM + "\n RZ =" + result.oprates[i].RZ + "\n W =" + result.oprates[i].W + "\n OTQ =" + result.oprates[i].OTQ + "\n INQ =" + result.oprates[i].INQ);
                    textSymbol.setColor(new esri.Color([100, 120, 200, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -50);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.oprates[i]);
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
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    ggzLayer.add(graphicText);

                    //按钮菜单
                    ctxMenuForGraphics_ggz = new dijit.Menu({});
                    ctxMenuForGraphics_ggz.addChild(new dijit.MenuItem({
                        label: "基本信息",
                        onClick: function () {
                            window.open("http://jiekou.chengtianhuiju.com/ZhanWang/Reservoir/ST_GuanGaiZhanShow.aspx?id=" + selected.attributes["ID"], "newwindow", "height=446, width=711, top=400, left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")


                        }
                    }));
                    ctxMenuForGraphics_ggz.startup();
                    dojo.connect(ggzLayer, "onMouseOver", function (e) {
                        selected = e.graphic;
                        ctxMenuForGraphics_ggz.bindDomNode(e.graphic.getDojoShape().getNode());
                    });
                    dojo.connect(ggzLayer, "onMouseOut", function (e) {
                        ctxMenuForGraphics_ggz.unBindDomNode(e.graphic.getDojoShape().getNode());
                    });

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

function tongyong1() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=yifaqu1",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaqu1Layer.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaqu1Layer.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaqu1Layer.add(graphicText);
                }
            }
            yifaqu1Layer.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}
function tongyong3() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=yifaqu3",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaqu3Layer.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaqu3Layer.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaqu3Layer.add(graphicText);
                }
            }
            yifaqu3Layer.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

function tongyong4() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=yifaqu4",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaqu4Layer.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaqu4Layer.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaqu4Layer.add(graphicText);
                }
            }
            yifaqu4Layer.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

function tongyong5() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=yifaqu5",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaqu5Layer.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaqu5Layer.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaqu5Layer.add(graphicText);
                }
            }
            yifaqu5Layer.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

function tongyong6() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=yifaqu6",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaqu6Layer.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaqu6Layer.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaqu6Layer.add(graphicText);
                }
            }
            yifaqu6Layer.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

function tongyong7() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=yifaqu7",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaqu7Layer.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaqu7Layer.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaqu7Layer.add(graphicText);
                }
            }
            yifaqu7Layer.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//特大型泥石流易发区
function tongyongCanshu0() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli0",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu0.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu0.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu0.add(graphicText);
                }
            }
            yifaquLayerCanshu0.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//大型泥石流易发区
function tongyongCanshu1() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli1",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu1.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu1.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu1.add(graphicText);
                }
            }
            yifaquLayerCanshu1.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}
//中型泥石流易发区
function tongyongCanshu2() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli2",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu2.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu2.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu2.add(graphicText);
                }
            }
            yifaquLayerCanshu2.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//小型泥石流易发区
function tongyongCanshu3() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli3",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu3.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu3.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu3.add(graphicText);
                }
            }
            yifaquLayerCanshu3.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//潜在大型泥石流易发区
function tongyongCanshu4() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli4",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu4.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu4.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu4.add(graphicText);
                }
            }
            yifaquLayerCanshu4.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}
//潜在中型泥石流易发区
function tongyongCanshu5() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli5",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu5.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu5.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu5.add(graphicText);
                }
            }
            yifaquLayerCanshu5.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//潜在小型泥石流易发区
function tongyongCanshu6() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli6",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu6.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu6.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu6.add(graphicText);
                }
            }
            yifaquLayerCanshu6.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}
//大型山体滑坡易发区
function tongyongCanshu8() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli8",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu8.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu8.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu8.add(graphicText);
                }
            }
            yifaquLayerCanshu8.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//中型山体滑坡易发区
function tongyongCanshu9() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli9",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu9.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu9.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu9.add(graphicText);
                }
            }
            yifaquLayerCanshu9.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//小型山体滑坡易发区
function tongyongCanshu10() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli10",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu10.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu10.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu10.add(graphicText);
                }
            }
            yifaquLayerCanshu10.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//潜在崩塌易发区
function tongyongCanshu11() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli11",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu11.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu11.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu11.add(graphicText);
                }
            }
            yifaquLayerCanshu11.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//崩塌易发区
function tongyongCanshu12() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli12",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu12.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu12.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu12.add(graphicText);
                }
            }
            yifaquLayerCanshu12.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//水闸
function tongyongCanshu16() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli16",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu16.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu16.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu16.add(graphicText);
                }
            }
            yifaquLayerCanshu16.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//防汛抗旱物资仓库
function tongyongCanshu17() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli17",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu17.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu17.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu17.add(graphicText);
                }
            }
            yifaquLayerCanshu17.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//尾矿库
function tongyongCanshu18() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载灌溉站信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=fenli18",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            yifaquLayerCanshu18.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    yifaquLayerCanshu18.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    //{"mc":"金厂沟村大石头沟","leibie":"潜在小型","fzr":"","lxdh":"","bz":"","xian":"盖州市","xiangzhen":"卧龙泉镇","Pic":"/img/6.png","LGTD":"122.732554","LTTD":"40.217264"}
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    yifaquLayerCanshu18.add(graphicText);
                }
            }
            yifaquLayerCanshu18.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//大I型水库
function shuikuCanshu1() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载水库信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=sk1",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            shuikuLayerCanshu1.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    shuikuLayerCanshu1.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    // ":[{"STNM":"大伙房水库 ","STCD":"21100150","STLC":"辽宁省抚顺市露天区心太和街 ","ATCUNIT":"水文 ","LOCALITY":"辽宁水文 ","Pic":"/img/sk.gif","LGTD":"124.083333","LTTD":"41.883333"},{"
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    shuikuLayerCanshu1.add(graphicText);
                }
            }
            shuikuLayerCanshu1.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//大II型水库
function shuikuCanshu2() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载水库信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=sk2",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            shuikuLayerCanshu2.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    shuikuLayerCanshu2.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    // ":[{"STNM":"大伙房水库 ","STCD":"21100150","STLC":"辽宁省抚顺市露天区心太和街 ","ATCUNIT":"水文 ","LOCALITY":"辽宁水文 ","Pic":"/img/sk.gif","LGTD":"124.083333","LTTD":"41.883333"},{"
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    shuikuLayerCanshu2.add(graphicText);
                }
            }
            shuikuLayerCanshu2.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}


//中型水库
function shuikuCanshu3() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载水库信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=sk3",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            shuikuLayerCanshu3.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    shuikuLayerCanshu3.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    // ":[{"STNM":"大伙房水库 ","STCD":"21100150","STLC":"辽宁省抚顺市露天区心太和街 ","ATCUNIT":"水文 ","LOCALITY":"辽宁水文 ","Pic":"/img/sk.gif","LGTD":"124.083333","LTTD":"41.883333"},{"
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    shuikuLayerCanshu3.add(graphicText);
                }
            }
            shuikuLayerCanshu3.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}
//小一型水库
function shuikuCanshu4() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载水库信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=sk4",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            shuikuLayerCanshu4.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    shuikuLayerCanshu4.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    // ":[{"STNM":"大伙房水库 ","STCD":"21100150","STLC":"辽宁省抚顺市露天区心太和街 ","ATCUNIT":"水文 ","LOCALITY":"辽宁水文 ","Pic":"/img/sk.gif","LGTD":"124.083333","LTTD":"41.883333"},{"
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    shuikuLayerCanshu4.add(graphicText);
                }
            }
            shuikuLayerCanshu4.redraw();
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");

        },
        error: function (err) {     //  出错s
            $("div.mloading.mloading-full.mloading-mask.active").css("display", "none");
            alert("加载数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}

//小二型水库
function shuikuCanshu5() {
    $("body").mLoading();
    $("div.mloading.mloading-full.mloading-mask.active").css("display", "block");

    //加载水库信息
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: "./data.ashx?t=sk5",
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            shuikuLayerCanshu5.clear();
            if (result != null && result.list != null && result.list.length > 0) {
                //                alert(result);
                //                console.log(result);
                for (var i = 0; i < result.list.length; i++) {
                    var pSymbol = esri.symbol.PictureMarkerSymbol(result.list[i].Pic, 16, 16);
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var graphic = new esri.Graphic(geometry, pSymbol);
                    graphic.attributes = result.list[i];
                    shuikuLayerCanshu5.add(graphic);

                    //文本
                    var geometry = new esri.geometry.Point(result.list[i].LGTD, result.list[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                    var font = new esri.symbol.Font();
                    font.setSize("10pt");
                    font.setFamily("微软雅黑");

                    // ":[{"STNM":"大伙房水库 ","STCD":"21100150","STLC":"辽宁省抚顺市露天区心太和街 ","ATCUNIT":"水文 ","LOCALITY":"辽宁水文 ","Pic":"/img/sk.gif","LGTD":"124.083333","LTTD":"41.883333"},{"
                    //文本标注
                    //var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM + "\n ts=" + result.list[i].ts + " xs=" + result.list[i].xs + " hnnm=" + result.list[i].hnnm + " bsnm=" + result.list[i].bsnm);
                    var textSymbol = new esri.symbol.TextSymbol(result.list[i].STNM);
                    textSymbol.setColor(new esri.Color([20, 20, 20, 1]));
                    textSymbol.setFont(font);
                    textSymbol.setOffset(0, -30);
                    var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                    graphicText.setAttributes(result.list[i]);
                    shuikuLayerCanshu5.add(graphicText);
                }
            }
            shuikuLayerCanshu5.redraw();
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
    yifaqu1Layer.clear();
    yifaqu3Layer.clear();
    yifaqu4Layer.clear();
    yifaqu5Layer.clear();
    yifaqu6Layer.clear();
    yifaqu7Layer.clear();
    yifaquLayerCanshu0.clear();
    yifaquLayerCanshu1.clear();
    yifaquLayerCanshu2.clear();
    yifaquLayerCanshu3.clear();
    yifaquLayerCanshu4.clear();
    yifaquLayerCanshu5.clear();
    yifaquLayerCanshu6.clear();
    yifaquLayerCanshu8.clear();
    yifaquLayerCanshu9.clear();
    yifaquLayerCanshu10.clear();
    yifaquLayerCanshu11.clear();
    yifaquLayerCanshu12.clear();
    yifaquLayerCanshu16.clear();
    yifaquLayerCanshu17.clear();
    yifaquLayerCanshu18.clear();

    shuikuLayerCanshu1.clear();
    shuikuLayerCanshu2.clear();
    shuikuLayerCanshu3.clear();
    shuikuLayerCanshu4.clear();
    shuikuLayerCanshu5.clear();


    unLayer.redraw();
    hlLayer.redraw();
    skLayer.redraw();
    ggzLayer.redraw();
    yifaqu1Layer.redraw();
    yifaqu3Layer.redraw();
    yifaqu4Layer.redraw();
    yifaqu5Layer.redraw();
    yifaqu6Layer.redraw();
    yifaqu7Layer.redraw();
    yifaquLayerCanshu0.redraw();
    yifaquLayerCanshu1.redraw();
    yifaquLayerCanshu2.redraw();
    yifaquLayerCanshu3.redraw();
    yifaquLayerCanshu4.redraw();
    yifaquLayerCanshu5.redraw();
    yifaquLayerCanshu6.redraw();

    yifaquLayerCanshu8.redraw();
    yifaquLayerCanshu9.redraw();
    yifaquLayerCanshu10.redraw();
    yifaquLayerCanshu11.redraw();
    yifaquLayerCanshu12.redraw();

    yifaquLayerCanshu16.redraw();
    yifaquLayerCanshu17.redraw();
    yifaquLayerCanshu18.redraw();

    shuikuLayerCanshu1.redraw();
    shuikuLayerCanshu2.redraw();
    shuikuLayerCanshu3.redraw();
    shuikuLayerCanshu4.redraw();
    shuikuLayerCanshu5.redraw();
}

//小二型水库
function LayerShuiKuCanshu5() {
    shuikuLayerCanshu5.clear();
    shuikuLayerCanshu5.redraw();
}

//小一型水库
function LayerShuiKuCanshu4() {
    shuikuLayerCanshu4.clear();
    shuikuLayerCanshu4.redraw();
}

//中型水库
function LayerShuiKuCanshu3() {
    shuikuLayerCanshu3.clear();
    shuikuLayerCanshu3.redraw();
}


//大II型水库
function LayerShuiKuCanshu2() {
    shuikuLayerCanshu2.clear();
    shuikuLayerCanshu2.redraw();
}

//大I型水库
function LayerShuiKuCanshu1() {
    shuikuLayerCanshu1.clear();
    shuikuLayerCanshu1.redraw();
}


//尾矿库
function LayerCanshu18() {
    yifaquLayerCanshu18.clear();
    yifaquLayerCanshu18.redraw();
}


//防汛抗旱物资仓库
function LayerCanshu17() {
    yifaquLayerCanshu17.clear();
    yifaquLayerCanshu17.redraw();
}


//水闸
function LayerCanshu16() {
    yifaquLayerCanshu16.clear();
    yifaquLayerCanshu16.redraw();
}


//崩塌易发区
function LayerCanshu12() {
    yifaquLayerCanshu12.clear();
    yifaquLayerCanshu12.redraw();
}


//潜在崩塌易发区
function LayerCanshu11() {
    yifaquLayerCanshu11.clear();
    yifaquLayerCanshu11.redraw();
}


//小型山体滑坡易发区
function LayerCanshu10() {
    yifaquLayerCanshu10.clear();
    yifaquLayerCanshu10.redraw();
}



//中型山体滑坡易发区
function LayerCanshu9() {
    yifaquLayerCanshu9.clear();
    yifaquLayerCanshu9.redraw();
}


//大型山体滑坡易发区
function LayerCanshu8() {
    yifaquLayerCanshu8.clear();
    yifaquLayerCanshu8.redraw();
}


//潜在中型泥石流易发区
function LayerCanshu6() {
    yifaquLayerCanshu6.clear();
    yifaquLayerCanshu6.redraw();
}


//潜在中型泥石流易发区
function LayerCanshu5() {
    yifaquLayerCanshu5.clear();
    yifaquLayerCanshu5.redraw();
}


//潜在大型泥石流易发区
function LayerCanshu4() {
    yifaquLayerCanshu4.clear();
    yifaquLayerCanshu4.redraw();
}


//小型泥石流易发区
function LayerCanshu3() {
    yifaquLayerCanshu3.clear();
    yifaquLayerCanshu3.redraw();
}


//中型泥石流易发区
function LayerCanshu2() {
    yifaquLayerCanshu2.clear();
    yifaquLayerCanshu2.redraw();
}


//大型泥石流易发区
function LayerCanshu1() {
    yifaquLayerCanshu1.clear();
    yifaquLayerCanshu1.redraw();
}


//特大型泥石流易发区
function LayerCanshu0() {
    yifaquLayerCanshu0.clear();
    yifaquLayerCanshu0.redraw();
}


//灌溉站信息
function ggzclearall() {
    ggzLayer.clear();
    ggzLayer.redraw();
}
//泥石流易发区
function yifaqu1clearall() {
    yifaqu1Layer.clear();
    yifaqu1Layer.redraw();
}

//山体滑坡易发区
function yifaqu3clearall() {
    yifaqu3Layer.clear();
    yifaqu3Layer.redraw();
}

//崩塌易发区
function yifaqu4clearall() {
    yifaqu4Layer.clear();
    yifaqu4Layer.redraw();
}
//地面塌陷易发区
function yifaqu5clearall() {
    yifaqu5Layer.clear();
    yifaqu5Layer.redraw();
}

//地面塌陷易发区
function yifaqu6clearall() {
    yifaqu6Layer.clear();
    yifaqu6Layer.redraw();
}
//海水入侵区
function yifaqu7clearall() {
    yifaqu7Layer.clear();
    yifaqu7Layer.redraw();
}