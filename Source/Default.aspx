<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
 <meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title> <%=SysName %> </title>
<link rel="stylesheet" type="text/css" href="css/main.css" />
<script src="js/jquery-2.2.2.min.js"></script> 
<script src="js/jquery.mloading.js"></script> 
<script type="text/javascript" src="js/jquery-ui.min.js"></script> 
<script type="text/javascript" src="js/jquery.simplesidebar.js"></script>
<meta name="description" content="Blueprint: Slide and Push Menus" />
<meta name="keywords" content="sliding menu, pushing menu, navigation, responsive, menu, css, jquery" />
<meta name="author" content="Codrops" />
<link rel="stylesheet" href="3.20/esri/themes/calcite/dijit/calcite.css" />
<link rel="stylesheet" href="3.20/esri/themes/calcite/esri/esri.css" />
<script src="js/layer.js"></script> 
<script src="3.20/init.js"></script> 
<script src="js/esri.symbol.MultiLineTextSymbol.js"></script>
<link rel="shortcut icon" href="../favicon.ico" />
<link rel="stylesheet" type="text/css" href="css/default.css" />
<link rel="stylesheet" type="text/css" href="css/component.css" />
<script src="js/modernizr.custom.js"></script>
<link rel="stylesheet" type="text/css" href="js/jquery.mloading.css" />
<link rel="stylesheet" type="text/css" href="js/themes/bootstrap/easyui.css" />
<script src="js/jquery.easyui.min.js"></script> 
<script src="js/classie.js"></script>
<link href="css/wll.css" rel="stylesheet" />
<link href="css/zzsc.css" rel="stylesheet" />
<!--<link href="css/all.css" rel="stylesheet" />--> 
<script src="js/daohang.js"></script> 
<script src="js/My97DatePicker/WdatePicker.js"></script> 
<!--导航引用样式--> 
<script>
    $(document).ready(function () {
        //选项卡tab
        $(".yyui_tab_title , .yyui_tab_title_this ").click(function () {
            $(this).siblings('li').attr('class', 'yyui_tab_title');
            $(this).attr('class', 'yyui_tab_title_this');
            //alert($(this).index()); 选项卡序号编号从0开始
            $(this).parent().siblings('div').attr('class', 'yyui_tab_content');
            $(this).parent().siblings('div').eq($(this).index()).attr('class', 'yyui_tab_content_this');
        });
        //////////////////////////


        //到底了///////////////////////
    });
    function yyui_menu(ulclass) {
        $(document).ready(function () {
            $(ulclass + ' li').hover(function () {
                $(this).children("ul").show(); //mouseover
            }, function () {
                $(this).children("ul").hide(); //mouseout
            });
        });
    }
    yyui_menu('.yyui_menu1');
	</script>
<script src="js/msg.js"></script>	
<style>
.cbp-spmenu {
	overflow-y: auto;
}
</style>
<style>
#map {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	position: inherit;
}
#currentxy {
	position: absolute;
	z-index: 9;
	bottom: 0px;
	left: 10px;
	float: none;
	white-space: nowrap;
}
.container, .action, .zoomTo {
	float: left;
	position: fixed;
	height: 100%;
}
.esriIconFallbackText, .actionList {
	display: none;
}
#toolbutton {
	width: 100%;
	position: absolute;
	z-index: 9;
	top: -5px;
	left: 50px;
	float: none;
	white-space: nowrap;
}
#toolbutton.item {
	display: inline-block;
	box-sizing: border-box;
	width: 33%;
}
/*  主要样式 */
.yyui_menu1 {
	height: 40px;
	line-height: 40px;
	font-size: 14px;
	background-color: #007cc1;
	border-radius: 10px;
	position: absolute;
	z-index: 1200;
	left: 30%;
	top: 15px;

}
.yyui_menu1 li {
	float: left;
	position: relative;
} /*这一级是导航*/
.yyui_menu1 li a {
	display: block;
	line-height: 40px;
	text-decoration: none;
	padding: 0px 20px;
	color: #fff;
	border-right: #fff solid 1px;
}
.yyui_menu1 li a.more:after {
	font-weight: bold;
}
.yyui_menu1 li ul {
	position: absolute;
	float: left;
	display: none;
	background-color: #f2f2f2;
	z-index: 9999;
} /*这是第二级菜单*/
.yyui_menu1 li ul a {
	width: 160px;
	text-decoration: none;
	color: #333;
	font-weight: bold;
	border-top: #007cc1 dashed 1px;
	border-bottom: #007cc1 dashed 1px;
	border-left: #007cc1 solid 1px;
	border-right: #007cc1 solid 1px;
}
.yyui_menu1 li ul a:hover {
	background: #ddd;
	color: #333;
}	
.yyui_menu1 li ul ul {
	top: 0;
	left: 160px;
} /*从第三级菜单开始,所有的子级菜单都相对偏移*/
	
#downmsg_emessage{position: fixed;_position:absolute; z-index:100; bottom:0;right:1%;top: 30%; background:url("img/down_msg_bg.gif") no-repeat left top;width:400px;}
#donwmsg_head{float:left; display:inline; font-size:16px;color:#004a90;margin-left: 45px;margin-top: 10px;font-weight: bold;}
#downmsgBar{height:25px;}
#donwmsg_content{height:162px;overflow:hidden;}
#donwmsg_content ul{font-size:12px;color:#007cc1;top: 0px;padding:0px 2px 0 6px;left: 6px;line-height:180%; height:250px; overflow:hidden;}
#donwmsg_content ul li{background:url(img/down_msg_bg.gif) no-repeat -100px -245px;text-indent:13px;}
#donwmsg_content ul li a{color:#007cc1;}
#donwmsg_content ul .ll a{color:#a10000;font-weight:bold;}
#donwmsg_content p{position:absolute;left: 13px;top: 50px;font-size: 14px;color: #666;}
#donwmsg_content .lb{padding:0px; text-align:center;}
#donwmsg_content .lb a{font-size:12px;color:Blue}
a.msg-hidden-btn-2{width:20px; height:20px;overflow:hidden;float:right;display:block;margin-right:8px;margin-top:12px;background:url("img/down_msg_bg1_02.png") no-repeat 0 0;}
a.msg-hidden-btn-1{ width:20px; height:20px;overflow:hidden;float:right;display:block;margin-right:8px;margin-top:12px;background:url("img/down_msg_bg1_05.png") no-repeat 0 0;}
	
.titlelogo img{width: 8%;padding-right: 10px;padding-top: 5px;margin-top: 5px;margin-left: 15px;}	
</style>
</head>
<body class="calcite cbp-spmenu-push">
<form name="form1" method="post" action="./Default.aspx" id="form1">
	<div class="titlelogo" style="color: #2279b5;font-size: 24px;font-weight: bold;float: left;height: 40px;padding: 0;"><img src="img/7.png">本溪市山洪灾害及农村基层防讯体系平台</div>	
	<ul class="yyui_menu1">
   <%-- <li><a href="#">气象平台</a></li>
    <li><a href="#">雨情平台</a>
      <ul class="one">
        <li><a href="#" class="more">分布图 <input type="checkbox"></a>
          <ul class="two">
            <li><a href="#">雨情分布图 <input type="checkbox" id="CkboxYq"></a></li>
            <li><a href="#">墒情分布图 <input type="checkbox"></a></li>
          </ul>
        </li>
        <li><a href="#" class="more">等值面（线）<input type="checkbox"></a>
          <ul class="two">
            <li><a href="#">降雨等值面 <input type="checkbox"></a></li>
            <li><a href="#">降雨等值线 <input type="checkbox"></a></li>
            <li><a href="#">墒情等值面 <input type="checkbox"></a></li>
            <li><a href="#">墒情等值线 <input type="checkbox"></a></li>
          </ul>
        </li>
        <li><a href="#">Pa计算 <input type="checkbox"></a></li>
        <li><a href="#" class="more">统计报表 <input type="checkbox"></a>
          <ul class="two">
            <li><a href="#">降雨量统计表 <input type="checkbox"></a></li>
            <li><a href="#">墒情统计表 <input type="checkbox"></a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><a href="#">河道平台</a>
      <ul class="one">
        <li><a href="#">水情分布图 <input type="checkbox" id="CkboxHD"></a></li>
      </ul>
    </li>
    <li><a href="#">水库平台</a>
      <ul class="one">
        <li><a href="#">水情分布图 <input type="checkbox" id="CkboxSK"></a></li>
      </ul>
    </li>
    <li><a href="#">视频监控</a>
      <ul class="one">
        <li><a href="#">自建视频 <input type="checkbox"></a></li>
        <li><a href="#">大江大河 <input type="checkbox"></a></li>
      </ul>
    </li>
    <li><a href="#">报表平台</a></li>
    <li><a href="#">管理平台</a></li>--%>
    <%=SysCaidan%>
  </ul>
  <div>
    <input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="/wEPDwUKLTEyNTMwOTYwMWRk438AFwhjwiIaXRYQdsf6F1c9TAgvh4hnfTFANxA6BnM=" />
  </div>
  <div>
    <input type="hidden" name="__VIEWSTATEGENERATOR" id="__VIEWSTATEGENERATOR" value="CA0B0334" />
  </div>
  <div class="container">
    <div id="map"></div>
  </div>
	
  <div class="toolbar"> 
    <div id="open-sb" class="menu-button menu-left shop_menu"></div>   
    <div id="toolbutton">
      <div style="position:fixed;right:10px;top: 40px;">
        <input id='tbWords' type="text" value="" style="float:left;margin-top:30px;margin-right:5px;height:25px;border-radius:6px;outline:none;">
        <input type="button" onclick="searchWords();" value="模糊查找" style="float:left;margin-top:30px;margin-right:5px;height:25px;border-radius:6px;outline:none;padding:0 10px;color:#2279b5">
        &nbsp;
        <!--<input type="button" onclick="clearall();" value="清除所有" style="float:left;margin-top:30px;margin-right:5px;height:25px;border-radius:6px;outline:none;padding:0 10px;color:#2279b5">-->
      </div>
    </div>
  </div>
  
  
  <!--<section class="sidebar">
        <div id="layerTitle" class="subNav"><h2>图层控制</h2></div>
        <hr />
        <ul id="toc" class="easyui-tree"></ul>
    </section>-->
	<div id="downmsg_emessage" style="display: block;">
  <div id="downmsgBar">
    <div id="donwmsg_head">报警窗口</div><a class="msg-hidden-btn-1" id="msg_hidden_btn" href="javascript:showHideDiv()"> </a>
  </div>
        <div id="donwmsg_content" style="display:block;">
						<p style="overflow-y: auto;height: 400px;width: 385px;"><iframe name="right" src="http://yingyong1.chengtianhuiju.com/message/device.aspx?branchid=342"  scrolling="auto" width="375px;" height="265px"></iframe></p>
	   </div>
</div>
	
	<script>
	    var popupfather = document.getElementById('downmsg_emessage');
	    var popupson = document.getElementById('downmsgBar');

	    popupson.onmousedown = function (event) {
	        var event = event || window.event;
	        var that = this;
	        var x = event.clientX - popupfather.offsetLeft - 0; //当前鼠标点击处相对于popupfather所在位置x ， -150 是处理margin值
	        var y = event.clientY - popupfather.offsetTop - 0; //当前鼠标点击处相对于popupfather所在位置y
	        document.onmousemove = function (event) {
	            var event = event || window.event;
	            popupfather.style.left = event.clientX - x + "px";
	            popupfather.style.top = event.clientY - y + "px";
	            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

	        }
	    }
	    document.onmouseup = function () {
	        document.onmousemove = null;
	    }
	</script>
  
  <div class="menu_box" style="display: block;">
    <div class="menu_wrap">
      <div class="menu_bc"></div>
      <div class="menu_nav_box">
        <div class="menu_list has_drop">
          <div class="iconfont_menu"></div>
          <div class="menu_list_item clear">
            <section class="sidebar">
              <div id="layerTitle" class="subNav" style=" display:none;">
                <h2>图层控制</h2>
              </div>
              <div class="zytc" style="margin-top:20px; display: none;">
                <h3>基础图层</h3>
              </div>
              <ul id="toc" class="easyui-tree">
              </ul>
              <div class="zytc" style=" display:none;">
                <h3>专业图层</h3>
              </div>
              <!--<div id="treeLbt" class="easyui-tree"></div>-->
              <div id="firstpane" class="menu_list" style=" display:none;"> </div>
              <div class="zytc" style="display: none;">
                <h3>专业工具</h3>
              </div>
              <div id="firstpane1" class="menu_list" style="display: none;">
                <p class="menu_head" id="Checkbox15"> 气象分析 </p>
                <p class="menu_head">
                  <input type="checkbox" id="Checkbox9" />
                  雨情信息 </p>
                <p class="menu_head" id="bjsz"> 报警设置 </p>
                <p class="menu_head">
                  <input type="checkbox" id="Checkbox10" />
                  水库站点 </p>
                <p class="menu_head">
                  <input type="checkbox" id="Checkbox14" />
                  河道站点 </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="conditionsset" id="conditionsset" style="display:none;">
    <div class="set_0">降雨时间设定：</div>
    <div class="set_2">
      <div id="startTime" class="tan_shuju_star">
        <div class="tan_shuju_star_bt">起始时间：</div>
        <div class="tan_shuju_star_bg">
          <input id="startdate" type="datetime" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" class="tan_kk" />
          <img src="images/rili.png" width="20" height="20" alt="" class="put1">
          <select id="starthour" class="tan_kk2">
          </select>
        </div>
      </div>
      <div class="tan_shuju_star">
        <div class="tan_shuju_star_bt">结束时间：</div>
        <div class="tan_shuju_star_bg">
          <input id="enddate" type="datetime" onclick="WdatePicker({skin:'whyGreen', dateFmt: 'yyyy-MM-dd' })" class="tan_kk" />
          <img src="images/rili.png" width="20" height="20" alt="" class="put1">
          <select id="endhour" class="tan_kk2">
          </select>
        </div>
      </div>
    </div>
    <div class="set_0">降雨阈值设定：</div>
    <div class="set_2">
      <input id="jyzdz" type="text" style="margin-top:15px;height:25px;" />
      <input type="button" value="确 定" class="sure" onclick="getAlarmData()" />
    </div>
  </div>
  <script type=text/javascript>
      $(document).ready(function () {
          //$("#firstpane .menu_body:eq(0)").show();
          $("#firstpane p.menu_head").click(function () {
              $(this).addClass("current").next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
              $(this).siblings().removeClass("current");
          });
          $("#secondpane .menu_body:eq(0)").show();
          $("#secondpane p.menu_head").mouseover(function () {
              $(this).addClass("current").next("div.menu_body").slideDown(500).siblings("div.menu_body").slideUp("slow");
              $(this).siblings().removeClass("current");
          });
      });
    </script>
  <div style="position:fixed;bottom:0px;right:0px;cursor:pointer;width: 0px;
    height: 0px;border-width: 15px;border-style: solid;border-color: #F8F8F8 lightblue lightblue #F8F8F8;" id="tuli"></div>
  <!--<div style="background-color:rgba(0,0,0,0.8);z-index:-10;position:fixed;width:100%;height:100%;display:flex;opacity:0;" id="tulid">
        <div style="text-align:center;width:80%;margin:0 auto;height:auto;align-self:center;">
            <img src="img/图例.jpg" style="align-self:center;text-align:center;width:100%;height:100%;" />
        </div>
    </div>-->
  <div class="tuli" id="tulid" aid="1"> <img src="img/图例.jpg" /> </div>
  <script type="text/javascript" src="js/dt.js"></script> 
  <script type="text/javascript" src="js/alarm.js"></script> 
  <script>
      $(function () {
          $("#bjsz").click(function () {
              clickMenus();
              layer.open({
                  type: 1,
                  title: '报警设置',
                  skin: 'layui-layer-rim',
                  area: ['280px', '360px'],
                  content: $("#conditionsset")
              });
          });
          //$("#tuli").click(function () {
          //    var aid = $("#tuli").attr("aid");
          //    if (aid == 1) {
          //        $("#tuli").attr("aid", "2");
          //        $(".tuli").css({ "width": "50vh", "height": "27.875vh" });
          //    }
          //    else if (aid == 2) {
          //        $("#tuli").attr("aid", "1");
          //        $(".tuli").css({ "width": "25vh", "height": "13.9375vh" });
          //    }
          //});
          $("#tuli").click(function () {
              $("#tulid").show();
              $("#tuli").hide();
          });
          $("#tulid").click(function () {
              $("#tulid").hide();
              $("#tuli").show();
          });
      });
      function clickMenus() {
          var w = $(".menu_nav_box").outerWidth();
          $(".menu_nav_box").animate({ right: -w }, 300);
          $(".menu_btn_box").animate({ right: -w }, 300);
          $(".menu_bc").animate({ opacity: 0 }, 300, function () {
              $(".menu_box").hide();
          });
      }
    </script> 
  <script>

      var oBox10 = document.getElementById('CkboxSK'); //水库
      oBox10.onclick = function () {
          if (this.checked) {
              searchskdatawdcl(); //选中后需要执行的方法
          } else {
              LayerShuiKuClear();
          }
      }

      var oBox14 = document.getElementById('CkboxHD'); //河道水情
      oBox14.onclick = function () {
          if (this.checked) {
              searchhldata(); //选中后需要执行的方法
          } else {
              heliuClear();
          }
      }

      var oBox15 = document.getElementById('Checkbox15'); //气象分析
      oBox15.onclick = function () {
          clickMenus();
          window.open("http://60.22.24.120:12122/ykqx/login_new.jsp", "newwindow", "height=600, width=900, top=400, left=400, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no");

      }



      var oBox9 = document.getElementById('CkboxYq'); //雨情信息
      oBox9.onclick = function () {
          if (this.checked) {
              getAlarmData(); //选中后需要执行的方法
          } else {
              clearall();
          }
      }

      yyui_menu('.yyui_menu1');
	  

    </script>
</form>
</body>
</html>
