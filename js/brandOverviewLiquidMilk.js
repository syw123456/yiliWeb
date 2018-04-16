/****获取日期 S***/
var now = new Date();
//alert(now.toLocaleString());
now = new Date(now.getTime() - 86400000);
var yyyy = now.getFullYear(), mm = (now.getMonth() + 1).toString(), dd = now.getDate().toString();
if (mm.length == 1) {
    mm = '0' + mm;
}
if (dd.length == 1) {
    dd = '0' + dd;
}
var time =yyyy+ "-" + mm+ "-" + dd;
var isName =$("#businessIndicators").val();
//time = "2018-04-01";
//当前的时间今天
$("#startTime").val(time);
//console.log(time);

//达成进度的折线图
var myChart2 = echarts.init(document.getElementById('eBar2'));

//日销售趋势折线图
var myChart4 = echarts.init(document.getElementById('eBar4'));

//地图的显示
var myChart3 = echarts.init(document.getElementById('eMap'));

//中国地图
$.get('../json/china.json', function (chinaJson) {
    echarts.registerMap('china', chinaJson);
    myChart3.setOption(getMapchart("西南",[],[],[]),true);
});

//图标内容大小自适应
setTimeout(function () {
    window.onresize = function () {
        myChart4.resize();
        myChart2.resize();
        myChart3.resize();
    }
}, 1);



//页面初始化加载数据
init();
function init(){

    console.log('------------进入初始化的方法-----------------');
    //默认的加载的头部的loading图
    // loadHide1("h_top","hide1");
    //默认的加载的中间的loading图
    //loadHide1("h_middle","hide2");
    //默认的加载的底部的loading图
    //loadHide1("h_bottom","hide3");


    //默认的初始化的json   传参  日期
    var jsondata1 = {"day": time};//day: 2017-12-31
    console.log('页面初始化的json');
    console.log(jsondata1);
    //基本数据的,    达成进度  日销售趋势 的2个折线图  chart图
    getxsdc(jsondata1);

    /******地图 S*******/
    //地图   传参  时间  大区
    var jsondata2 = {"day":time};
    getMap(jsondata2);
    /******地图 E*******/


    //大区及区域折前收入增长及达成的表格的填充这个与地图联动
    getRightBottom(jsondata1);

    // 最后的表格   最下面的table  产品折前收入增长及达成
    getDataBottom(jsondata1);

}



/***日期的点击事件S***/
var times1 = $("#startTime").val();
var bigAreaMapName=""; //大区名称
$("#startTime").off("click").on("click",function(){
    var that = $(this);
    WdatePicker({
        dateFmt: 'yyyy-MM-dd',
        maxDate:'%y-%M-{%d-1}',
        isShowClear: false,
        onpicked:function(){
            //得到用户选择的时间不是今天则出现loading，请求数据
            var times = that.val();
            if (times != time) {
                //出现loading
                loadHide1("h_body","hide1");
                time = times;
                //数据截止时间设置时间
                $(".newyearday").text(times.split("-")[0]+"年"+times.split("-")[1]+"月"+times.split("-")[2]+"日");


                var dataJson = {
                    day: time  //日

                };
                //扩充json对象
                setDataJson({ year: times.split("-")[0], month: times.split("-")[1], day: times.split("-")[2]});
                //基本数据的,达成进度chart图,日销售趋势
                getxsdc(dataJson);

                //请求地图的数据
                var jsondata2 = {
                    "day":times,
                    "bigAreaMapName":bigAreaMapName
                };
                if(jsondata2.bigAreaMapName==""){
                    jsondata2.bigAreaMapName="西南";
                }
                getMap(jsondata2);

                //大区及区域折前收入增长及达成的表格的填充（待完成）
                getRightBottom(dataJson);


                //产品折前收入增长及达成
                getDataBottom(dataJson);


            }
        }
    });
});
/***日期的点击事件E***/


/*****  达成进度的折线图  S****/

option2 = {
    title: {
        text: '',
        textStyle: {
            color: '#fff',
            rich:{
                a: {
                    color: '#ffaa00',
                    fontSize:16,
                    fontWeight:700
                }
            }
        },
        subtext:"单位:万元",
        subtextStyle:{
            color:"#fff",
            fontSize:16,
            fontWeight:700
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter:function(params){

        }
    },
    legend: {
        icon:'rect',
        // data: ['2017', '2018'],
        textStyle: {
            color: ['#fff']
        },
        itemWidth: 10,
        itemHeight: 10,
        y: 'top',
        x: 'right'/*,
         orient: 'horizontal',*/
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: [{
        show: true,
        type: 'category',
        data: ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"],
        axisLine: {//x轴
            lineStyle: {
                color: '#fff'
            }
        },
        axisTick: {//x轴小标记不显示
            show: false,
        },
        axisLabel: {//x轴文字
            textStyle: {
                color: '#fff'
            },
            interval: 0,
            margin: 10,
        },
        clickable: {//x轴文字是否可以点击
            show: true,
        },
        splitLine: {//分隔线
            show: false
        },
        splitArea: {//x轴分段的横线
            show: false
        },
    }],
    yAxis: [{

        type: 'value',
        axisLine: {//y轴
            lineStyle: {
                color: '#fff'
            }
        },
        clickable: {//x轴文字是否可以点击
            show: true,
        },
        axisTick: {//y轴小标记不显示
            show: true,
        },
        axisLabel: {//y轴文字
            textStyle: {
                color: '#fff'
            },
            interval: 0,
            formatter: '{value}',
        },
        splitLine: {//分隔线
            show: false,
        }
    }],
    series: [
        {
            name: '实际完成率',
            type: 'line',
            symbol:'circle',
            //smooth:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#4e79ab',
                        width:7,
                        borderColor: '#4e79ab'
                    },
                    color: '#4e79ab'
                }
            },
            data: ["50","70","80","10","5","19","20","10","40","20","70","40","30","10","3","3","6","10"]
        },
        {
            name: '计划完成率',
            type: 'line',
            symbol:'circle',
            //smooth:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#f28e2b',
                        width:3,
                        borderColor: '#f28e2b'
                    },
                    color: '#f28e2b'
                }
            },
            data: ["40","60","10","40","20","10"]/*,
         //系列中的数据标线内容
         markLine: {
         symbol:"circle",
         symbolSize:0,
         lineStyle:{
         color:"#8cd17d",
         width:2,
         type:"solid"
         },
         data: [
         // {type: 'average', name: '平均值'},
         {name: '标注1',symbolSize:0, yAxis: 13}

         ]

         } */
        },
        {
            name: '预计计划完成率',
            type: 'line',
            symbol:'circle',
            //smooth:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#e15759',
                        width:2,
                        borderColor: '#e15759'
                    },
                    color: '#e15759'
                }
            },
            data: ["100","40","50","70","0","0","10","30","20","60","80","30"]
        }

    ],
    itemStyle: {
        normal: {
            label: {
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },
        },
        emphasis: {
            label: {
                show: false,
                textStyle: {
                    color: '#fff'
                }
            },
            nodeStyle: {
                // r: 30
            },
            linkStyle: {}
        }
    },
};
myChart2.setOption(option2);
/*****  达成进度的折线图  E****/



/*****  日销售趋势折线图  S****/

option4 = {
    title: {
        text: '',
        textStyle: {
            color: '#fff',
            rich:{
                a: {
                    color: '#ffaa00',
                    fontSize:16,
                    fontWeight:700
                }
            }
        },
        subtext:"单位:万元",
        subtextStyle:{
            color:"#fff",
            fontSize:16,
            fontWeight:700
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter:function(params){

        }
    },
    legend: {
        icon:'rect',
        // data: ['2017', '2018'],
        textStyle: {
            color: ['#fff']
        },
        itemWidth: 10,
        itemHeight: 10,
        y: 'top',
        x: 'right'/*,
         orient: 'horizontal',*/
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: [{
        show: true,
        type: 'category',
        data: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"],
        axisLine: {//x轴
            lineStyle: {
                color: '#fff'
            }
        },
        axisTick: {//x轴小标记不显示
            show: false,
        },
        axisLabel: {//x轴文字
            textStyle: {
                color: '#fff'
            },
            interval: 0,
            margin: 10,
        },
        clickable: {//x轴文字是否可以点击
            show: true,
        },
        splitLine: {//分隔线
            show: false
        },
        splitArea: {//x轴分段的横线
            show: false
        },
    }],
    yAxis: [{

        type: 'value',
        axisLine: {//y轴
            lineStyle: {
                color: '#fff'
            }
        },
        clickable: {//x轴文字是否可以点击
            show: true,
        },
        axisTick: {//y轴小标记不显示
            show: true,
        },
        axisLabel: {//y轴文字
            textStyle: {
                color: '#fff'
            },
            interval: 0,
            formatter: '{value}',
        },
        splitLine: {//分隔线
            show: false,
        }
    }],
    series: [
        {
            name: '本期销售',
            type: 'line',
            symbol:'circle',
            //smooth:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#4e79ab',
                        width:7,
                        borderColor: '#4e79ab'
                    },
                    color: '#4e79ab'
                }
            },
            data: ["20","7","8","16","5","79","20","10","10","20","70","40","30","10","3","3","6","30", "40","30","10","3","3","6","40","30","10","3","3","6"]
        },

        {
            name: '同期销售',
            type: 'line',
            symbol:'circle',
            //smooth:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#e15759',
                        width:2,
                        borderColor: '#e15759'
                    },
                    color: '#e15759'
                }
            },
            data: ["10","50","10","80","4","89","20","30","80","60","80","30"]
        }

    ],
    itemStyle: {
        normal: {
            label: {
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },
        },
        emphasis: {
            label: {
                show: false,
                textStyle: {
                    color: '#fff'
                }
            },
            nodeStyle: {
                // r: 30
            },
            linkStyle: {}
        }
    },
};
myChart4.setOption(option4);
/*****   日销售趋势折线图  E****/


/*****    地图 S  *******/

function getMapchart(data,datas1){
	var option3 = {
		    title: {
		        text: '', //'液态奶事业部折前收入',
		        x: 'left',
		        textStyle: {
		            color: '#fff'
		        },
		        padding: [30, 10],
		    },
		    dataRange: {
		        x: 'left',
		        y: 'top',
		        itemWidth: 10,
		        itemHeight: 10,
		        textStyle: {
		            color: '#fff'
		        },
		        orient: 'horizontal',
		        splitList:[
		            {end: 95.99999, label: '达成率<96%', color:'#b44647'},
		            {start: 95.99999, end: 99.99999, label: '96%<=达成率<100%', color: '#bea13a'},
		            {start: 99.99999, end:100000000,label: '达成率=>100%', color: '#47813f'}   
		        ]
		    },
		    tooltip: {
		        trigger: 'item',
		        //formatter:"{b0}: {c0}<br />{b1}: {c1}"
		        formatter:function(params){
		            //定义一个res变量来保存最终返回的字符结果,并且先把地区名称放到里面
		            var res="大区名称:"+params.name+'<br />';
		            //定义一个变量来保存series数据系列
		            var myseries=option3.series;
		            //循环遍历series数据系列
		            for(var i=0;i<myseries.length;i++){
		                //在内部继续循环series[i],从data中判断：当地区名称等于params.name的时候就将当前数据和名称添加到res中供显示
		                for(var k=0;k<myseries[i].data.length;k++){
		                    //console.log(myseries[i].data[k].name);
		                    //如果data数据中的name和地区名称一样
		                    if(myseries[i].data[k].name==params.name){
		                        //将series数据系列每一项中的name和数据系列中当前地区的数据添加到res中
		                    	if(i ==0){
		                    		res+= "折前剔税收入"+'：'+formatNumber(datas1[k].value,0,1)+'<br />'
		                    		    +myseries[i].name+'：'+formatNumber(myseries[i].data[k].value,1,0)+'%<br />';
		                    	}		                        
		                    }
		                }
		            }
		            //返回res
		            //console.log(res);
		            return res;                
		        }
		    },
		    series: [{
		        name: "实际达成率",
		        type: 'map',
		        map: 'china',
		        itemStyle: {
		            //normal 是图形在默认状态下的样式
		            normal: {
		                show: true,
		                areaColor:"#59a14f",
		                // borderColor:"#FCFCFC",
		                borderWidth: "0",
		                label: {
		                    show: true,
		                    textStyle: {
		                        color: "#fff"
		                    }
		                }
		            },
		            //emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
		            emphasis: {
		                show: true,
		                areaColor: "#C8A5DF",
		                label: {
		                    show: true,
		                    textStyle: {
		                        color: "#fff"
		                    }
		                }
		            }
		        },
		        // data: data
                data: [
                 {name:"东北",value:73},
                 {name:"京津",value:98},
                 {name:"河南",value:95.6},
                 {name:"山东",value:99},
                 {name:"西南",value:101},
                 {name:"西北",value:100},
                 {name:"晋冀蒙",value:73}
                 ]
		    }]
		};
	return option3;
}
//地图


// 测试的接口中国地图
$.get('../ynjson/china.json', function (chinaJson) {
    echarts.registerMap('china', chinaJson);
    myChart3.setOption(getMapchart([]),true);
});
/*****地图 E*   ******/


// 提取ajax公用代码  urlSuffix这个是请求的子路径 , 请求成功的回调函数 succFun
function ajaxReq(urlSuffix,jsonData,succFun) {

    //请求的接口 dataJson是默认的初始化的数据
    var url ="/yiliReport/month/ppzl/" + urlSuffix;
	$.ajax({
		url: url,
        type:"POST",
        contentType:'application/json;charset=utf-8',
        dataType:"json",
        data:JSON.stringify(jsonData),
		success: function(data) {
			succFun(data);
		},
		error: function(){
		    //如果失败的情况提示信息
			//alert("数据查询失败");
            //弹窗删除
			//$("#hide1").remove();
		}
	});
}

//基本数据的,达成进度chart图,日销售趋势
function getxsdc(jsonData) {
    console.log('基本数据、达成进度、日销售趋势的传递参数: ');
    console.log(jsonData);
    // 这个接口是液奶日达成总额的头部和达成进度的接口
    ajaxReq("getxsdc",jsonData,function(data) {

        console.log('基本数据的,达成进度chart图,日销售趋势 成功的回调---succeed--->');
        console.log(data);
        /****基本数据的填充页面 S　*****/
        if(isName =='折前收入'){
            //日销售
            $("#daybefore").html(formatNumber(data.top.daybefore,2,1));
            //月累计
            $("#monthbefore").html(formatNumber(data.top.monthbefore,2,1));
            //月目标
            $("#monthLJbefore").html(formatNumber(data.top.monthLJbefore,2,1));
            //月达成
            $("#monthbefore_reach").html(formatNumber(data.top.monthbefore_reach,2,1));
            //同期月累计
            $("#YAGO_monthLJbefore").html(formatNumber(data.top.YAGO_monthLJbefore,2,1));
            //月同比
            $("#monthLJbefore_TB").html(formatNumber(data.top.monthLJbefore_TB,2,1));
            //月时间进度
            $("#monthTimePercentBefore").html(formatNumber(data.top.monthTimePercentBefore,2,1));
            //年累计
            $("#yearbefore").html(formatNumber(data.top.yearbefore,2,1));
            //年达成
            $("#yearbefore_reach").html(formatNumber(data.top.yearbefore_reach,2,1));

        }else{
            //日销售
            $("#daybefore").html(formatNumber(data.top.daybook,2,1));
            //月累计
            $("#monthbefore").html(formatNumber(data.top.monthbook,2,1));
            //月目标
            $("#monthLJbefore").html(formatNumber(data.top.monthLJbook,2,1));
            //月达成
            $("#monthbefore_reach").html(formatNumber(data.top.monthbook_reach,2,1));
            //同期月累计
            $("#YAGO_monthLJbefore").html(formatNumber(data.top.YAGO_monthLJbook,2,1));
            //月同比
            $("#monthLJbefore_TB").html(formatNumber(data.top.monthLJbook_TB,2,1));
            //月时间进度
            $("#monthTimePercentBefore").html(formatNumber(data.top.monthTimePercentBook,2,1));
            //年累计
            $("#yearbefore").html(formatNumber(data.top.yearbook,2,1));
            //年达成
            $("#yearbefore_reach").html(formatNumber(data.top.yearbook_reach,2,1));

        }
        /****基本数据的填充页面 E　*****/


        /******************   日销售趋势的折线图  everyDayLJIncome  S*******/


        //day 天
        //dayZQIncome   折前本期销售
        //YAGO_dayZQIncome 折前同期销售
        //dayZMIncome   账面本期销售
        //YAGO_dayZMIncome 账面同期销售
        /*
        * x1_data:     //当月全部折前收入进度的x轴   表示的日期
        * y_total_data://预算目标的y轴    累计收入
        * y_budget_data://累计收入的y轴   预算目标
        *
        * */
        //折前收入的渲染
        if(isName == "折前收入"){
            var x1_data=[],dayZQIncome=[],YAGO_dayZQIncome=[];
            // 渲染右侧的折线图   大对象 everyDayLJIncome
            $.each(data.everyDayLJIncome,function(k,v){

                var N = Number(jsonData.day.split("-")[2]);
                x1_data.push(v.day);
                YAGO_dayZQIncome.push(formatNumber(v.YAGO_dayZQIncome,1,0));
                if(k < N){
                    dayZQIncome.push(formatNumber(v.dayZQIncome,1,0));
                }
            });

            // 设置折线图的数据
            myChart4.setOption(getJson4(x1_data,dayZQIncome,YAGO_dayZQIncome));

        }
        //折面收入的渲染
        else{
            var x1_ZM__data=[],y_ZM_dayZMIncome=[],y_ZM_YAGO_dayZMIncome=[];
            // 渲染右侧的折线图 大对象 everyDayLJIncome
            $.each(data.everyDayLJIncome,function(k,v){
                var N = Number(jsonData.day.split("-")[2]);
                x1_ZM__data.push(v.day);


                y_ZM_YAGO_dayZMIncome.push(formatNumber(v.YAGO_dayZMIncome,1,0));
                if(k < N){
                    y_ZM_dayZMIncome.push(formatNumber(v.dayZMIncome,1,0));
                }
            });
            // 设置折线图的数据
            myChart4.setOption(getJson4(x1_ZM__data,y_ZM_dayZMIncome,y_ZM_YAGO_dayZMIncome));

        }
        /*****************  日销售趋势的折线图  (折线图)everyDayLJIncome  E****/

        /*****************  达成进度的折线图 (折线图) S*********/

        //myChart2.setOption(getJson2());

        //折前收入的渲染
        if(isName == "折前收入"){

            var x1_data=[],  //x轴的天数
                sjdayZQIncomeCompletePercent=[],  //实际完成率
                jhdayZQIncomeCompletePercent=[];  //计划完成率
                yjdayZQIncomeCompletePercent=[];  //预计完成率
            // 渲染右侧的折线图   大对象 everyDayLJIncome
            $.each(data.everyDayLJIncome,function(k,v){

                var N = Number(jsonData.day.split("-")[2]);
                x1_data.push(v.day);

                //实际只到今天
                if(k < N){
                    sjdayZQIncomeCompletePercent.push(formatNumber(v.dayZQIncomeCompletePercent,1,0)); // 实际完成率
                }

                //计划完成率只到今天
                if(k < N){
                    jhdayZQIncomeCompletePercent.push(formatNumber(v.jhdayZQIncomeCompletePercent,1,0));
                }
                //预计完成率

                yjdayZQIncomeCompletePercent.push(formatNumber(v.yjdayZQIncomeCompletePercent,1,0));

            });

            // 设置折线图的数据
            myChart2.setOption(getJson2(x1_data,sjdayZQIncomeCompletePercent,jhdayZQIncomeCompletePercent,yjdayZQIncomeCompletePercent));

        }

        //账面收入
        else{

            var x1_ZM_data=[],  //x轴的天数
                sjdayZMIncomeCompletePercent=[],  //实际完成率
                jhdayZMIncomeCompletePercent=[];  //计划完成率
                yjdayZMIncomeCompletePercent=[];  //预计完成率
            // 渲染右侧的折线图   大对象 everyDayLJIncome
            $.each(data.everyDayLJIncome,function(k,v){

                var N = Number(jsonData.day.split("-")[2]);
                x1_ZM_data.push(v.day);

                //实际只到今天
                if(k < N){
                    sjdayZMIncomeCompletePercent.push(formatNumber(v.dayZQIncomeCompletePercent,1,0)); // 实际完成率
                }

                //计划完成率只到今天
                if(k < N){
                    jhdayZMIncomeCompletePercent.push(formatNumber(v.jhdayZQIncomeCompletePercent,1,0));
                }
                //预计完成率

                yjdayZMIncomeCompletePercent.push(formatNumber(v.yjdayZQIncomeCompletePercent,1,0));

            });

            // 设置折线图的数据
            myChart2.setOption(getJson2(x1_ZM_data,sjdayZMIncomeCompletePercent,jhdayZMIncomeCompletePercent,yjdayZMIncomeCompletePercent));

        }

        /***************** 达成进度的折线图 (折线图) E*********/

    });


}

/******日销售趋势的折线图  S*********/
function getJson4(x_data,y_total_data,y_budget_data){
    var option4 = {
        title: {
            text:  '单位：万元',
            textStyle: {
                color: '#fff',
                fontSize:16,
                fontWeight:600,
                fontFamily:'冬青黑体简体中文'
            },
            subtext: '',
            subtextStyle: {
                coloe: '#fff'
            },
            padding: 30,
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            icon:'rect',
            //data: ['累计收入', '预算目标'],
            textStyle: {
                color: ['#fff']
            },
            itemWidth: 10,
            itemHeight: 10,
            y: 'top',
            x: 'middle',
            orient: 'horizontal'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: x_data,
            axisLine: { //x轴
                lineStyle: {
                    color: '#fff'
                }
            },
            axisTick: { //x轴小标记显示
                show: true,
            },
            axisLabel: { //x轴文字
                textStyle: {
                    color: '#fff'
                },
                interval: 0
            },
            clickable: { //x轴文字是否可以点击
                show: true,
            },
            splitLine: { //分隔线
                show: false,
            },
            splitArea: { //x轴分段的横线
                show: false
            },
        },
        yAxis: {
            type: 'value',
            axisLine: { //x轴
                lineStyle: {
                    color: '#fff'
                }
            },
            axisTick: { //x轴小标记不显示
                show: true,
            },
            axisLabel: { //x轴文字
                textStyle: {
                    color: '#fff'
                },
                interval: 0,
            },
            splitLine: { //分隔线
                show: false,
            }
        },
        series: [{
            name: '预算目标',
            type: 'line',
            //stack: '总量',
            symbol:'circle',
            smooth:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width:8,
                        color: '#76b7b2'
                    },
                    color: '#76b7b2'
                }
            },
//	                label:{
//	                	show:true,
//	                	formatter:function(params){
//	                           /*var relVal = params[0].name;
//	                           for (var i = 0, l = params.length; i < l; i++) {
//	                                relVal += '<br/>' + params[i].marker +  params[i].seriesName + ' : ' + params[i].value+"%";
//	                            }*/
//	                           return console.log(params);
//	                        }
//	                },
            data: y_budget_data
        },{
            name: '累计收入',
            type: 'line',
            //stack: '总量',
            symbol:'circle',
            smooth:true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#f28e2b',
                        width:3
                    },
                    color: '#f28e2b'
                }
            },
            label:{
                show:false/*,
	                	formatter:function(){
	                           var relVal = option2.series[1].data;
	                           var datas = "";
	                           for (var i = 0; i<relVal.length; i++) {
	                        	   datas =  relVal[i];
	                            }
	                           return datas;
	                        } */
            },
            data: y_total_data
        }
        ]
    };
    return option4;
}
/******日销售趋势的折线图  E*********/

/******达成进度的折线图  S*********/
function  getJson2(x_data,sjdayIncomeCompletePercent,jhdayIncomeCompletePercent,yjdayIncomeCompletePercent) {


    console.log('***********达成进度的折线图*********');
    var option2 = {
        title: {
            text: '',
            textStyle: {
                color: '#fff',
                rich:{
                    a: {
                        color: '#ffaa00',
                        fontSize:16,
                        fontWeight:700
                    }
                }
            },
            subtext:"单位:万元",
            subtextStyle:{
                color:"#fff",
                fontSize:16,
                fontWeight:700
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter:function(params){

            }
        },
        legend: {
            icon:'rect',
            // data: ['2017', '2018'],
            textStyle: {
                color: ['#fff']
            },
            itemWidth: 10,
            itemHeight: 10,
            y: 'top',
            x: 'right'/*,
         orient: 'horizontal',*/
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: [{
            show: true,
            type: 'category',
            data: x_data,
            //x轴的日期
            //data: ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"],
            axisLine: {//x轴
                lineStyle: {
                    color: '#fff'
                }
            },
            axisTick: {//x轴小标记不显示
                show: false,
            },
            axisLabel: {//x轴文字
                textStyle: {
                    color: '#fff'
                },
                interval: 0,
                margin: 10,
            },
            clickable: {//x轴文字是否可以点击
                show: true,
            },
            splitLine: {//分隔线
                show: false
            },
            splitArea: {//x轴分段的横线
                show: false
            },
        }],
        yAxis: [{

            type: 'value',
            axisLine: {//y轴
                lineStyle: {
                    color: '#fff'
                }
            },
            clickable: {//x轴文字是否可以点击
                show: true,
            },
            axisTick: {//y轴小标记不显示
                show: true,
            },
            axisLabel: {//y轴文字
                textStyle: {
                    color: '#fff'
                },
                interval: 0,
                formatter: '{value}',
            },
            splitLine: {//分隔线
                show: false,
            }
        }],
        series: [
            {
                name: '实际完成率',
                type: 'line',
                symbol:'circle',
                //smooth:true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#4e79ab',
                            width:7,
                            borderColor: '#4e79ab'
                        },
                        color: '#4e79ab'
                    }
                },
                //y轴的实际完成率
                data:sjdayIncomeCompletePercent
                //data: ["50","70","80","10","5","19","20","10","40","20","70","40","30","10","3","3","6","10"]
            },
            {
                name: '计划完成率',
                type: 'line',
                symbol:'circle',
                //smooth:true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#f28e2b',
                            width:3,
                            borderColor: '#f28e2b'
                        },
                        color: '#f28e2b'
                    }
                },
                //y轴的计划完成率
                data:jhdayIncomeCompletePercent
                //data: ["40","60","10","40","20","10"],
            },
            {
                name: '预计计划完成率',
                type: 'line',
                symbol:'circle',
                //smooth:true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#e15759',
                            width:2,
                            borderColor: '#e15759'
                        },
                        color: '#e15759'
                    }
                },
                //预计计划完成率
                data:yjdayIncomeCompletePercent
                //data: ["100","40","50","70","0","0","10","30","20","60","80","30"]
            }

        ],
        itemStyle: {
            normal: {
                label: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                },
            },
            emphasis: {
                label: {
                    show: false,
                    textStyle: {
                        color: '#fff'
                    }
                },
                nodeStyle: {
                    // r: 30
                },
                linkStyle: {}
            }
        },
    }
    return  option2;
}
/******达成进度的折线图  E*********/


/*
 * 这个请求包含map的数据，参数isLineageMap表示是否联动地图数据 初始加载时 联动地图数据，
 * 地图数据显示未添加
 */
function getMap(jsonData) {


    console.log('中国地图的显示的后台的返回的数据：');
    ajaxReq("getMap", jsonData,function(data) {
        console.log('地图的接口-------succeed--->');
        console.log(data);
        if (jsonData) { // 如果存在数据

            //地图
            var data_sjjd = [],//实际达成进度放在数组中
                data_yjdcl=[],//预计达成率
                data_zq=[];//折前收入
            //map 地图
            //areaName 大区名称
            //areaZQIncomeCompletePercent 实际达成进度
            //areaZQIncomeShouldCompletePercent 预计达成率
            //areaZQIncome 折前收入

            $.each(data.map,function(k,v){

                console.log(v.areaZQIncomeCompletePercent);
                //异常数据的处理
                if(v.areaZQIncomeCompletePercent == 'NaN' || v.areaZQIncomeCompletePercent == 'Infinity'){
                    var jsons = {"name":v.areaName, "value":'暂无数据'};//NaN
                    data_sjjd.push(jsons);//实际达成进度放在数组中
                }else{
                    var jsons = {"name":v.areaName, "value":v.areaZQIncomeCompletePercent};//NaN
                    data_sjjd.push(jsons);//实际达成进度放在数组中
                }

                //异常数据的处理
                if(v.areaZQIncomeShouldCompletePercent == 'NaN'||v.areaZQIncomeShouldCompletePercent == 'Infinity'){
                    var jsons1 = {"name":v.areaName,"value":'暂无数据'}; //NaN
                    data_yjdcl.push(jsons1);//预计达成率
                }else{
                    var jsons1 = {"name":v.areaName,"value":v.areaZQIncomeShouldCompletePercent }; //NaN
                    data_yjdcl.push(jsons1);//预计达成率
                }

                var jsons2 = { "name":v.areaName,"value":v.areaZQIncome };
                data_zq.push(jsons2);  //折前收入

            });


            myChart3.clear();

            //得到是事务部的名称
            var b_name = jsonData.businessMapName;

            var json = "ynjson";//只是液奶事业部
            //请求不同的地图的接口,渲染地图
            $.get(basepath+'/web/'+json+'/china.json', function (chinaJson) {
                echarts.registerMap('china', chinaJson);
                myChart3.setOption(getMapchart(b_name,data_sjjd,data_yjdcl,data_zq),true);
            });
        }
        //关闭loading
        $("#hide2").remove();
    });
}

//大区及区域折前收入增长及达成的表格的填充（待完成）
function getRightBottom(jsonData){
    console.log('大区及区域折前收入增长及达成的表格的填充的传递参数: ');
    console.log(jsonData);
    ajaxReq("bigArea",jsonData,function(data) {

        console.log('大区及区域折前收入增长及达成的表格-------succeed--->');
        console.log(data);
       //大区及区域折前收入增长及达成的表格的填充  8个字段
        $("#table2 tr").remove();
        //data.salesDetail 后台的返回的值（待确定）
        $.each(data.salesDetail, function(i, r) {
            var color = bgColor2(r[3]);
            var imgs = r[4]<0 ? "down" :"up";
            var tr = '<tr>'
                +'<td onclick="cause_click($(this),1)">'+ r[0] +'</td>' //大区
                +'<td class="hide">0</td>'
                +'<td>'+ formatNumber(r[1],1,1) +'</td>' //月销售目标
                +'<td>'+ formatNumber(r[2],2,0) +'%</td>' //日销售
                +'<td>'+ formatNumber(r[2],2,0) +'%</td>' //月累计销售
                +'<td style="color:'+color+'; font-weight: bold;">'+ r[3] +'%</td>' //月销售达成进度
                +'<td>'+ r[4] +'%<img src="../img/'+imgs+'.png" alt="" height="20px" style="vertical-align: top;"></td>'//月同比增长
                +'<td>'+ formatNumber(r[2],2,0) +'%</td>' //年累计销售
                +'<td>'+ formatNumber(r[2],2,0) +'%</td>' //年销售达成进度

                +'</tr>';
            $("#table2").append(tr);

            //设置表格的宽度
            for(var i=0;i<$("#table1 tr th").length;i++){
                var widths = $("#table2 tr td").eq(i).width();
                var height1 = $("#table2").height();
                var height2 = $("#table2_d").height();
                if(i == $("#table1 tr th").length-1 && height1>height2){
                    $("#table1 tr").find("th").eq(i).css("width",(widths+17)+"px");
                }else{
                    $("#table1 tr").find("th").eq(i).css("width",widths+"px");
                }
            }
        });
        $("#hide1").remove()
    });

}

//产品折前收入增长及达成(未完成)
function getDataBottom(jsonData){
    console.log('产品折前收入增长及达成传递参数: ');
    console.log(jsonData);
    ajaxReq("ZQData",jsonData,function(data) {
        console.log('产品折前收入增长及达成-------succeed--->');
        console.log(data);
        //产品折前收入增长及达成   9个字段
        $("#table4 tr").remove();
        //data.salesDetail 后台的返回的值（待确定）
        $.each(data.salesDetail, function(i, r) {
            var color = bgColor2(r[3]);
            var imgs = r[4]<0 ? "down" :"up";
            var tr = '<tr>'
                +'<td onclick="cause_click($(this),1)">'+ r[0] +'</td>' //产品类型
                +'<td class="hide">0</td>'
                +'<td>'+ formatNumber(r[1],1,1) +'</td>'  //子品牌
                +'<td>'+ formatNumber(r[2],2,0) +'%</td>' //月销售目标
                +'<td>'+ formatNumber(r[2],2,0) +'%</td>' //日销售
                +'<td>'+ formatNumber(r[2],2,0) +'%</td>' //月累计销售
                +'<td style="color:'+color+'; font-weight: bold;">'+ r[3] +'%</td>' //月销售达成进度
                +'<td>'+ r[4] +'%<img src="../img/'+imgs+'.png" alt="" height="20px" style="vertical-align: top;"></td>'//月同比增长
                +'<td>'+ formatNumber(r[2],2,0) +'%</td>' //年累计销售
                +'<td>'+ formatNumber(r[2],2,0) +'%</td>' //年销售达成进度

                +'</tr>';
            $("#table4").append(tr);

            //设置表格的宽度
            for(var i=0;i<$("#table3 tr th").length;i++){
                var widths = $("#table4 tr td").eq(i).width();
                var height1 = $("#table4").height();
                var height2 = $("#table4_d").height();
                if(i == $("#table3 tr th").length-1 && height1>height2){
                    $("#table3 tr").find("th").eq(i).css("width",(widths+17)+"px");
                }else{
                    $("#table3 tr").find("th").eq(i).css("width",widths+"px");
                }
            }
        });
        //$("#hide1").remove()
    });

}


// 在原来的json上面添加新的json
function setDataJson(newDataJson) {
    console.log('扩充后的JSON：  ');
    console.log($.extend(dataJson, newDataJson));
	return $.extend(dataJson, newDataJson);
}
