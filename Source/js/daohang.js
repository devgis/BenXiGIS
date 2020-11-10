


$(function () {
    //menu
    $(".shop_menu").on("click", clickMenu);//点击显示分类
    $(".menu_bc").on("click", clickMenu);//点击黑色遮罩,关闭分类

    $(".drop_open").children(".menu_list_tt").addClass("has_drop");//默认展开

    function clickMenu() {//菜单
        if ($(".menu_box").is(":hidden")) {//菜单是否显示
            $(".menu_box").show();
            var w = $(".menu_nav_box").outerWidth();
            $(".menu_nav_box").css("right", -w);
            $(".menu_btn_box").css("right", -w);
            $(".menu_nav_box").animate({ right: 0 }, 300);
            $(".menu_btn_box").animate({ right: 0 }, 300);
            $(".menu_bc").animate({ opacity: 1 }, 300);
        } else {
            var w = $(".menu_nav_box").outerWidth();
            $(".menu_nav_box").animate({ right: -w }, 300);
            $(".menu_btn_box").animate({ right: -w }, 300);
            $(".menu_bc").animate({ opacity: 0 }, 300, function () {
                $(".menu_box").hide();
            });
        }
    }






});

//var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
//var myDate = new Date();
//date = myDate.getFullYear() + '' + myDate.getMonth() + '' + myDate.getDate();
//g.type = 'text/javascript';
//g.defer = true;
//g.async = true;
//g.src = "//analytics.jiuzhilan.com/codes/jiuzhilan_6496.js?" + date;
//s.parentNode.insertBefore(g, s);




(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth >= 640) {
                docEl.style.fontSize = '100px';
            } else {
                docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);



/*统计*/
var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?cf1a95e2dca724c68f1da310f4ce2be1";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();



(function () {
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();