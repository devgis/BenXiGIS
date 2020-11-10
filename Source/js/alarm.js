var alarmLayer;
function getAlarmData() {
    

    //报警图层
    if (alarmLayer == undefined) {
        alarmLayer = new esri.layers.GraphicsLayer("alarmLayer");
        map.addLayer(alarmLayer);
    }
    alarmLayer.clear();
    alarmLayer.redraw();

    var textSymbol1,textSymbo2;

    var dishiLayerIsShow = true; //控制因为视图变换，而闪烁
    alarmLayer.on("update-end", function () {
        //resizeTime=1000/60;
        //dishiLayerIsShow = false;
    });

    setInterval(function () {
        if (dishiLayerIsShow == true) {
            dishiLayerIsShow = false;


            for (var i = 0; i < alarmLayer.graphics.length; i++) {
                textSymbol1 = new esri.symbol.TextSymbol(alarmLayer.graphics[i].attributes["STNM"] + "\n" + alarmLayer.graphics[i].attributes["DYP"]);
                textSymbol1.setColor(new esri.Color([220, 25, 125, 0.5]));
                textSymbol1.setColor(new esri.Color([255, 0, 0, 1]));
                var font = new esri.symbol.Font();
                font.setSize("20pt");
                font.setFamily("微软雅黑");
                textSymbol1.setFont(font);
                alarmLayer.graphics[i].setSymbol(textSymbol1);
            }
        }
        else {
            dishiLayerIsShow = true;
            for (var i = 0; i < alarmLayer.graphics.length; i++) {
                textSymbol2 = new esri.symbol.TextSymbol(alarmLayer.graphics[i].attributes["STNM"] + "\n" + alarmLayer.graphics[i].attributes["DYP"]);
                textSymbol2.setColor(new esri.Color([220, 255, 125, 0.5]));
                textSymbol2.setColor(new esri.Color([255, 255, 0, 1]));
                var font = new esri.symbol.Font();
                font.setSize("20pt");
                font.setFamily("微软雅黑");
                textSymbol2.setFont(font);
                alarmLayer.graphics[i].setSymbol(textSymbol2);
            }
        }
    }, 500);

    alarmLayer.on("graphic-add", function (evt) {

    });

    //从后台获取gps数据
    var startdate = $('#startdate').val();
    var enddate = $('#enddate').val();
    var starthour = $('#starthour').val();
    var endhour = $('#endhour').val();
    var pjyzdz = $('#jyzdz').val();

    var dataurl = "./data.ashx?t=baojingyuqingcanshu&sd=" + startdate + "&ed=" + enddate + "&sh=" + starthour + "&eh=" + endhour;
    //var dataurl = "./data.ashx?sd=2018-06-01&ed=2018-06-30&sh=0&eh=23";
    $.ajax({
        type: "get",
        //contentType: "application/json",
        url: dataurl,
        //data: "{}",  //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到       
        dataType: 'json',   //WebService 会返回Json类型
        success: function (result) {     //回调函数，result，返回值
            unLayer.clear();
            if (result != null && result.oprates != null && result.oprates.length > 0) {
                for (var i = 0; i < result.oprates.length; i++) {
                    //文本
                    //车号
                    if (parseFloat(result.oprates[i].DYP) >= parseFloat(pjyzdz)) {
                        var geometry = new esri.geometry.Point(result.oprates[i].LGTD, result.oprates[i].LTTD, new esri.SpatialReference({ wkid: 4326 }));
                        var font = new esri.symbol.Font();
                        font.setSize("10pt");
                        font.setFamily("微软雅黑");


                        //文本标注
                        var textSymbol = new esri.symbol.TextSymbol(result.oprates[i].STNM + "\n" + result.oprates[i].DYP);
                        textSymbol.setColor(new esri.Color([220, 25, 125, 0.5]));
                        font.setSize("20pt");
                        textSymbol.setFont(font);
                        //textSymbol.setOffset(0, -25);
                        var graphicText = esri.Graphic(geometry, textSymbol); // ,null
                        graphicText.setAttributes(result.oprates[i]);
                        alarmLayer.add(graphicText);
                    }
                }
            }
            alarmLayer.redraw();
        },
        error: function (err) {     //  出错s
            alert("加载报警数据出错，可能是服务端超时！");
            console.log(err);
        }
    });
}