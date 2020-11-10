var oBox10 = document.getElementById('Checkbox10'); //水库
oBox10.onclick = function () {
    if (this.checked) {
        searchskdatawdcl(); //选中后需要执行的方法
    } else {
        //  LayerShuiKuClear();
    }
}

