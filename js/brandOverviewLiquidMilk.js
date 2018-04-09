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
//time = "2018-04-01";
//当前的时间今天
$("#startTime").val(time);
console.log(time);
$(".newyearday").text(time);
/****获取日期 E***/

var dataJson = {
    year: time.split("-")[0], // 年
    month: time.split("-")[1], //月
    day: time.split("-")[2],  //日
    businessIndicators: "折前收入", //经营指标
    salesTarget: "销售任务", // 销售目标
    productType: "全部", // 产品类型
    subbrand: "全部", // 子品牌
    classBrandFourth: "全部", // 品类四级
    classBrandFifth: "全部", // 品类五级
    productItem: "全部", // 品项
    isCurrentMonth: "true" //是否是当前的月份
};
//选择日期查询数据
/***日期的点击事件S***/
var times1 = $("#startTime").val();
var businessMapName = "",//事业部名称
    bigAreaMapName=""; //大区名称
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
                    year: time.split("-")[0], // 年
                    month: time.split("-")[1], //月
                    day: time.split("-")[2],  //日
                    businessIndicators: "折前收入", //经营指标
                    salesTarget: "销售任务", // 销售目标
                    productType: "全部", // 产品类型
                    subbrand: "全部", // 子品牌
                    classBrandFourth: "全部", // 品类四级
                    classBrandFifth: "全部", // 品类五级
                    productItem: "全部", // 品项
                    isCurrentMonth: "true" //是否是当前的月份
                };
                //扩充json对象
                setDataJson({ year: times.split("-")[0], month: times.split("-")[1], day: times.split("-")[2]});
                //基本数据的,达成进度chart图,日销售趋势
                getData1(dataJson);

                //请求地图的数据
                var jsondata2 = {
                    "day":times,
                    "bigAreaMapName":bigAreaMapName
                }
                if(jsondata2.bigAreaMapName==""){
                    jsondata2.bigAreaMapName="西南";
                }
                getMap(jsondata2);

                //大区及区域折前收入增长及达成的表格的填充（待完成）
                getData2(dataJson);


                //产品折前收入增长及达成
                getData3(dataJson);


            }
        }
    });
});
/***日期的点击事件E***/


/*****  达成进度的折线图  S****/
var myChart2 = echarts.init(document.getElementById('eBar2'));
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
var myChart4 = echarts.init(document.getElementById('eBar4'));
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
var myChart5 = echarts.init(document.getElementById('eMap'));
function getMapchart(data,datas1){
	var option5 = {
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
		            var myseries=option5.series;
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
	return option5;
}
//地图


// 测试的接口中国地图
$.get('../ynjson/china.json', function (chinaJson) {
    echarts.registerMap('china', chinaJson);
    myChart5.setOption(getMapchart([]),true);
});
/*****地图 E*   ******/


//页面初始化加载数据
init();
function init(){
    //默认出现加载的loading图片
    loadHide1("h_body","hide1");
    //默认的初始化的json
    
    console.log(dataJson);
    //基本数据的,达成进度chart图,日销售趋势
    getData1(dataJson);

    //地图
    var jsondata2 = {
        "day":time,
        "bigAreaMapName":"西南"
    }
    getMap(jsondata2);
    loadHide1("h_bottom","hide3");

    //大区及区域折前收入增长及达成的表格的填充（待完成）
    getData2(dataJson);

    //产品折前收入增长及达成
    getData3(dataJson);

}


// 提取ajax公用代码  urlSuffix这个是请求的子路径 , 请求成功的回调函数 succFun
function ajaxReq(urlSuffix, succFun) {

    //请求的接口 dataJson是默认的初始化的数据
    var url ="/yiliReport/month/ppzl/" + urlSuffix;
	$.ajax({
		url: url,
		data: dataJson,
		dataType: "JSON",
		type: "POST",
		success: function(data) {
			succFun(data);
		},
		error: function(){
		    //如果失败的情况提示信息
			//alert("数据查询失败");
            //弹窗删除
			$("#hide1").remove();
		}
	});
}
//数据的颜色
function bgColor3(num) {
    num = parseFloat(num);
    return num >= 0 ? '#58A14E' : '#E15658';
}
//基本数据的,达成进度chart图,日销售趋势
function getData1(jsonData) {
    console.log('基本数据的,达成进度chart图,日销售趋势的参数的传递: ');
    console.log(jsonData);
    // 这个接口是液奶日达成总额的头部和达成进度的接口
    ajaxReq("summary",jsonData,function(data) {
        console.log('这个是chart的 summary 接口------>');
        /****基本数据的填充页面 S　*****/
        //注意 i表示当前的编号 r 是标签 <b class="ppzl-summary">36.61亿</b>
        //bgColor2   获取对比后的颜色 3种颜色  红  黄  绿
        $(".ppzl-summary").each(function(i, r) {
            console.log('基本数据的渲染:' +i);
            //给数据添加颜色
            $(r).css("background-color", bgColor2(data.summary[i]));
            //给b标签填充数据
            $(r).text(data.summary[i]);

        });
        /****基本数据的填充页面 E　*****/


        /****填充达成进度的图表  需要改动 S *****/
        option2.title.text = data.year + '年'+ data.month +'月{a|'+ data.businessName +'}折前收入趋势';
        option2.series[0].name = (data.year - 1) + "年";
        option2.series[1].name = data.year + "年";
        option2.series[0].data = data.prevYear;
        option2.series[1].data = data.yearData;
        option2.series[2].data = data.yearTarget;
        option2.tooltip.formatter = function(params){
            var relVal = jsonData.year+'年'+jsonData.month+'月'+params[0].name+"日";
            for (var i = 0, l = params.length; i < l; i++) {
                if(i==2){
                    relVal += '<br/>' + params[i].marker +  "目标 : " +formatNumber(params[i].value,1,1);
                }else{
                    relVal += '<br/>' + params[i].marker +  "销售指标 : " +formatNumber(params[i].value,1,1);
                }
            }
            return relVal;
        };
        myChart2.setOption(option2);


        /****填充达成进度的图表 E *****/

        /****填充日销售趋势的图表 需要改动 S *****/
        option4.title.text = data.year + '年'+ data.month +'月{a|'+ data.businessName +'}折前收入趋势';
        option4.series[0].name = (data.year - 1) + "年";
        option4.series[1].name = data.year + "年";
        option4.series[0].data = data.prevYear;
        option4.series[1].data = data.yearData;
        option4.series[2].data = data.yearTarget;
        option4.tooltip.formatter = function(params){
            var relVal = jsonData.year+'年'+jsonData.month+'月'+params[0].name+"日";
            for (var i = 0, l = params.length; i < l; i++) {
                if(i==2){
                    relVal += '<br/>' + params[i].marker +  "目标 : " +formatNumber(params[i].value,1,1);
                }else{
                    relVal += '<br/>' + params[i].marker +  "销售指标 : " +formatNumber(params[i].value,1,1);
                }
            }
            return relVal;
        };
        myChart4.setOption(option4);
        /****填充日销售趋势的图表 E *****/
        //隐藏loading
        $("#hide1").remove();
    });
}
/*
 * 这个请求包含map的数据，参数isLineageMap表示是否联动地图数据 初始加载时 联动地图数据，
 * 地图数据显示未添加
 */
function getMap(jsonData) {
    ajaxReq("getMap", function(data) {
        console.log('这个是地图的接口------>');
        console.log(jsonData);
        if (jsonData) { // 如果存在数据


            //地图
            var data_sjjd = [],data_yjdcl=[],data_zq=[];
            //map 地图
            //areaName 大区名称
            //areaZQIncomeCompletePercent 实际达成进度
            //areaZQIncomeShouldCompletePercent 预计达成率
            //areaZQIncome 折前收入

            $.each(data.map,function(k,v){
                var jsons = {
                    "name":v.areaName,
                    "value":v.areaZQIncomeCompletePercent
                }
                data_sjjd.push(jsons);
                var jsons1 = { "name":v.areaName,"value":v.areaZQIncomeShouldCompletePercent }
                data_yjdcl.push(jsons1);
                var jsons2 = { "name":v.areaName,"value":v.areaZQIncome }
                data_zq.push(jsons2);
            });
            myChart3.clear();

            //得到是事务部的名称
            var b_name = jsonData.businessMapName;
            var json = "ynjson";
            if(b_name.indexOf("液态奶事业部")!=-1){
                json = "ynjson";
            }else if(b_name.indexOf("奶粉事业部")!=-1){
                json = "nfjson";
            }else if(b_name.indexOf("酸奶事业部")!=-1){
                json = "snjson";
            }else if(b_name.indexOf("冷饮事业部")!=-1){
                json = "lyjson";
            }else{
                json = "json";
            }

            //请求不同的地图的接口,渲染地图
            $.get(basepath+'/web/'+json+'/china.json', function (chinaJson) {
                echarts.registerMap('china', chinaJson);
                myChart5.setOption(getMapchart(b_name,data_sjjd,data_yjdcl,data_zq),true);
            });
        }
        //关闭loading
        $("#hide1").remove();
    });
}

//大区及区域折前收入增长及达成的表格的填充（待完成）
function getData2(jsonData){

    ajaxReq("bigArea",jsonData,function(data) {

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
                };
            };
        });
        $("#hide1").remove()
    });

}

//产品折前收入增长及达成(未完成)
function getData3(jsonData){

    ajaxReq("ZQData",jsonData,function(data) {

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
                };
            };
        });
        //$("#hide1").remove()
    });

}

// 绑定切换 经营指标 下拉框事件  刷新页面数据
$("#businessIndicators").on({
    change: function (event) {
        //加载的loading图片
        loadHide1("h_body","hide1");
        //得到当前选择的经营指标的名称
        var businessIndicators = this.value;
        console.log('用户选择的经营指标的名称：  '+businessIndicators);
        //扩充json对象
        setDataJson({businessIndicators: businessIndicators});
        //请求填充达成进度chart图
        getData1(dataJson);
        console.log('经营指标 下拉框事件的json');
        console.log(dataJson);
        //请求地图的数据
        getMap(dataJson);
        //大区及区域折前收入增长及达成的表格的填充（待完成）
        getData2(dataJson);
        //产品折前收入增长及达成
        getData3(dataJson);

    }
});

// 绑定切换 销售目标 下拉框事件  刷新页面数据
$("#salesTarget").on({
    change: function (event) {
        //加载的loading图片
        loadHide1("h_body","hide1");
        //得到当前选择的销售目标的名称
        var salesTarget = this.value;
        console.log('用户选择的销售目标的名称：  '+salesTarget);
        //扩充json对象
        setDataJson({salesTarget: salesTarget});
        //请求填充达成进度chart图
        getData1(dataJson);
        console.log('销售目标 下拉框事件的json');
        console.log(dataJson);
        //请求地图的数据
        getMap(dataJson);
        //大区及区域折前收入增长及达成的表格的填充（待完成）
        getData2(dataJson);
        //产品折前收入增长及达成
        getData3(dataJson);
    }
});

// 绑定切换 产品类型 下拉框事件  刷新页面数据
$("#productType").on({
    change: function (event) {
        //加载的loading图片
        loadHide1("h_body","hide1");
        //得到当前选择的产品类型的名称
        var productType = this.value;
        console.log('用户选择的产品类型的名称：  '+productType);
        //扩充json对象
        setDataJson({productType: productType});

        //请求填充达成进度chart图
        getData1(dataJson);
        console.log('产品类型 下拉框事件的json');
        console.log(dataJson);
        //请求地图的数据
        getMap(dataJson);
        //大区及区域折前收入增长及达成的表格的填充（待完成）
        getData2(dataJson);
        //产品折前收入增长及达成
        getData3(dataJson);
    }
});

// 绑定切换 子品牌 下拉框事件  刷新页面数据
$("#busi-subbrand").on({
    change: function (event) {
        //加载的loading图片
        loadHide1("h_body","hide1");
        //得到当前选择的子事业部的名称
        var subbrandName = this.value;
        console.log('用户选择的子品牌的名称：  '+subbrandName);
        //扩充json对象   subbrandName 这个是向后台传的对象名字
        setDataJson({subbrandName: subbrandName});

        //请求填充达成进度chart图
        getData1(dataJson);
        console.log('子品牌 下拉框事件的json');
        console.log(dataJson);
        //请求地图的数据
        getMap(dataJson);
        //大区及区域折前收入增长及达成的表格的填充（待完成）
        getData2(dataJson);
        //产品折前收入增长及达成
        getData3(dataJson);
    }
});


// 绑定切换  品类四级 下拉框事件  刷新页面数据
$("#classBrandFourth").on({
    change: function (event) {
        //加载的loading图片
        loadHide1("h_body","hide1");
        //得到当前选择的品类四级的名称
        var classBrandFourth = this.value;
        console.log('用户选择的品类四级的名称：  '+classBrandFourth);
        //扩充json对象   classBrandFourth 这个是向后台传的对象名字
        setDataJson({classBrandFourth: classBrandFourth});
        //请求填充达成进度chart图
        getData1(dataJson);
        console.log('品类四级 下拉框事件的json');
        console.log(dataJson);
        //请求地图的数据
        getMap(dataJson);
        //大区及区域折前收入增长及达成的表格的填充（待完成）
        getData2(dataJson);
        //产品折前收入增长及达成
        getData3(dataJson);
    }
});

// 绑定切换  品类五级 下拉框事件  刷新页面数据
$("#classBrandFifth").on({
    change: function (event) {
        //加载的loading图片
        loadHide1("h_body","hide1");
        //得到当前选择的品类五级的名称
        var classBrandFifth = this.value;
        console.log('用户选择的品类五级的名称：  '+classBrandFifth);
        //扩充json对象   classBrandFifth 这个是向后台传的对象名字
        setDataJson({classBrandFifth: classBrandFifth});

        //请求填充达成进度chart图
        getData1(dataJson);
        console.log('品类五级 下拉框事件的json');
        console.log(dataJson);
        //请求地图的数据
        getMap(dataJson);
        //大区及区域折前收入增长及达成的表格的填充（待完成）
        getData2(dataJson);
        //产品折前收入增长及达成
        getData3(dataJson);

    }
});

// 绑定切换  品项 下拉框事件  刷新页面数据
$("#productItem").on({
    change: function (event) {
        //加载的loading图片
        loadHide1("h_body","hide1");
        //得到当前选择的 品项 的名称
        var productItem = this.value;
        console.log('用户选择的 品项 的名称：  '+productItem);
        //扩充json对象   productItem 这个是向后台传的对象名字
        setDataJson({productItem: productItem});

        //请求填充达成进度chart图
        getData1(dataJson);
        console.log('品项 下拉框事件的json');
        console.log(dataJson);
        //请求地图的数据
        getMap(dataJson);
        //大区及区域折前收入增长及达成的表格的填充（待完成）
        getData2(dataJson);
        //产品折前收入增长及达成
        getData3(dataJson);
    }
});

// 在原来的json上面添加新的json
function setDataJson(newDataJson) {
    console.log('扩充后的JSON：  ');
    console.log($.extend(dataJson, newDataJson));
	return $.extend(dataJson, newDataJson);
};
