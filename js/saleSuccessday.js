//集团销售达成日报的逻辑
//获取日期,填充日期
var now = new Date();
now = new Date(now.getTime() - 86400000);
var yyyy = now.getFullYear(), mm = (now.getMonth() + 1).toString(),
	dd = now.getDate().toString();
if (mm.length == 1) {
    mm = '0' + mm;
}
if (dd.length == 1) {
    dd = '0' + dd;
}
var time =yyyy+ "-" + mm+ "-" + dd;

//测试的日期时间
time = "2017-12-31";
$("#startTime").val(time);

//定义echart 插件到页面

//各事业部的收成的情况
var myChart = echarts.init(document.getElementById('main'));
//当月全部折前收入进度
var myChart2 = echarts.init(document.getElementById('main2'));
//地图的显示
var myChart3 = echarts.init(document.getElementById('main_map'));

//各事业部的收成的情况页面初始化
//x轴的数据
var x_data = ["液态奶事业部","奶粉事业部","酸奶事业部","冷饮事业部","电商"];
//折前达成进度的y轴
var y1_data = ["0","0","0","0","0"];
//账面达成进度的y轴
var y2_data = ["0","0","0","0","0"];
myChart.setOption(getChart1(x_data,y1_data,y2_data,[]));


//当月全部折前收入进度页面初始化
//当月全部折前收入进度的x轴
var x_data =  ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];

//预算目标的y轴
var y_total_data = ["0","0","0","0"];
//累计收入的y轴
var y_budget_data = ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"];
myChart2.setOption(getJson2(x_data,y_total_data,y_budget_data,"折前收入","全部"));

//中国地图
$.get('../json/china.json', function (chinaJson) {
    echarts.registerMap('china', chinaJson);
    myChart3.setOption(getMapchart("液态奶事业部",[],[],[]),true);
});
//图标内容大小自适应
setTimeout(function () {
    window.onresize = function () {
        myChart.resize();
        myChart2.resize();
        myChart3.resize();
    }
}, 1);

//页面初始化加载数据
init();
function init(){

    console.log('------------进入初始化的方法-----------------');
	//默认的加载的头部的loading图
	loadHide1("h_top","hide1");

	//默认的加载的中间的loading图
	loadHide1("h_middle","hide2");

	//基本数据和柱状图以及2个表格（各事业部折前收入指标和各事业部账面收入指标）的接口
	var jsondata1 = { 'day':time }; //day: 2017-12-31
	getxsdc(jsondata1);

	//地图的显示  day是当前的日期,businessMapName是事业部的名称默认的是液态奶事业部
	var jsondata2 = {
			"day":time,
            "businessMapName":"液态奶事业部"
	};
	getMap(jsondata2);

    //默认的加载的底部的loading图
	loadHide1("h_bottom","hide3");

	//当月全部折前收入进度和全部重点产品折前收入和全部新品折前收入
	/*
	* 参数:
	* day 当前的日期
	* isZQ 是否是折前的收入 true是  false否
	* businessMapName 是事业部的名称的字段
	* bigAreaMapName  这个是大区名称的字段
	*
	* */
	var jsondata3={
			"day":time,
			"isZQ":"true",
			"businessMapName":"",
			"bigAreaMapName":""
	};
	getRightBottom(jsondata3,"折前收入");
}
var businessMapName = "",bigAreaMapName="";
//选择日期查询数据
var times1 = $("#startTime").val();

//这个是日期的点击事件
$("#startTime").off("click").on("click",function(){
    var that = $(this);
    WdatePicker({
        dateFmt: 'yyyy-MM-dd',
        maxDate:'%y-%M-{%d-1}',
        isShowClear: false,
        onpicked:function(){
            var times=that.val();
            if(times != times1){
            	loadHide1("h_top","hide1");
            	loadHide1("h_middle","hide2");
            	loadHide1("h_bottom","hide3");
            	//右侧的日期的显示
            	$(".newyearday").text(times.split("-")[0]+"年"+times.split("-")[1]+"月"+times.split("-")[2]+"日");
                //不是服务器的时间日期，本地的时间
                $("#startTime").val(times.split("-")[0]+"-"+times.split("-")[1]+"-"+times.split("-")[2]);
            	//获取基本数据
            	var jsondata1 = { 'day':times };
            	//基本数据和柱状图以及2个表格（各事业部折前收入指标和各事业部账面收入指标）的接口
            	getxsdc(jsondata1);
            	//获取地图数据的请求
            	var jsondata2 = {
            			"day":times,
            			"businessMapName":businessMapName
            	};
            	if(jsondata2.businessMapName==""){
            		jsondata2.businessMapName="液态奶事业部";
            	}
            	getMap(jsondata2);


            	//获取右下角数据
				/*
				* day:当前日期
				* isZQ: 是否是折前收入
				* businessMapName: 事业部的名称
				* bigAreaMapName: 大区的名称
				*
				* */

            	var isName = $("#sr_typeselect").val();
            	var isZQ = isName=="折前收入" ? "true":"false";
            	var jsondata3={
            			"day":times,
            			"isZQ":"true",
            			"businessMapName":businessMapName,
            			"bigAreaMapName":bigAreaMapName
            	};
            	getRightBottom(jsondata3,isName);
                times1 = times;
            }
        }
    });
});
//点击柱状图x轴的事业部 去请求 地图的接口 和 china.json 和getRightBottom的方法 右下角的3个内容
myChart.on('click', function (params) {
     console.log('点击柱状图x轴的事业部--->');
     console.log(params);
	 if(params.componentType == "xAxis" || params.seriesType=="bar" ){
	 	//出现底部的loading
		loadHide1("h_bottom","hide3");
		//得到当前的时间
		var time = $("#startTime").val();
		//是否是折前收入
		var isName = $("#sr_typeselect").val();
		var isZQ = isName=="折前收入" ? "true":"false";
		//事业部的名称
        if(params.seriesType=="bar"){
             businessMapName = params.name;
         }else if(params.componentType == "xAxis"){
             businessMapName = params.value;
         }
		//请求地图的数据
		var jsondata2={
				"day":time,
				"isZQ":isZQ,
				"businessMapName":businessMapName
		};
		console.log(jsondata2);
		getMap(jsondata2);

		//请求右下角的3块的数据
		var jsondata3={
				"day":time,
				"isZQ":isZQ,
				"businessMapName":businessMapName,
				"bigAreaMapName":""
		};
		//getRightBottom(jsondata3,isName);
	 }
});

//选择指标销售的下拉的列表  获取折线图和两个表格的信息
$("#sr_typeselect").on("change",function(){
	loadHide1("h_rightL","hide3");
	var times=$("#startTime").val(),isZQ='';
	var isName = $("#sr_typeselect").val();
	var isZQ = isName=="折前收入" ? "true":"false";

	//得到又下角的3块的数据
	var jsondata3={
			"day":times,
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName
	};

    getRightBottom(jsondata3,isName);

});
//获取基本数据和柱状图
function getxsdc(jsonData){
    //console.log('--------------获取基本数据和柱状图以及2个表格---------------');
    //console.log(jsonData);
	// 基本数据和柱状图以及2个表格的接口 getxsdc
	ajaxReq("getxsdc",jsonData,function(data) {
        //console.log('getxsdc接口返回的数据：');
		//console.log(data);
		//判断json是否为空
        var flagJSON=JSON.stringify(data)=="{}";
        if(!flagJSON) {
            /***基本数据 S***/

            //日折前收入

            $("#daybefore").html(formatNumber(data.top.daybefore,2,1));
            //日账面收入
            $("#daybook").html(formatNumber(data.top.daybook,2,1));

            //月度累计折前收入
            $("#monthbefore").html(formatNumber(data.top.monthbefore,2,1));

            //月度累计账面收入
            $("#monthbook").html(formatNumber(data.top.monthbook,2,1));

            //月累计折前达成进度
            $("#monthbefore_reach").html(formatNumber(data.top.monthbefore_reach,2,1));

            //月累计折前达成进度的数字的颜色
            $("#monthbefore_reach").parent("div").css("background-color",bgColor2(data.top.monthbefore_reach));


            //月累计账面达成进度
            $("#monthbook_reach").html(formatNumber(data.top.monthbook_reach,2,1));

            //月累计账面达成进度的数字的颜色
            $("#monthbook_reach").parent("div").css("background-color",bgColor2(data.top.monthbook_reach));

            //年累计折前收入
            $("#yearbefore").html(formatNumber(data.top.yearbefore,2,1));

            //年累计账面收入
            $("#yearbook").html(formatNumber(data.top.yearbook,2,1));

            //年累计折前达成率
            $("#yearbefore_reach").html(formatNumber(data.top.yearbefore_reach,2,1));
            //年累计折前达成率的数据的颜色
            $("#yearbefore_reach").parent("div").css("background-color",bgColor2(data.top.yearbefore_reach));


            //年累计账面达成率
            $("#yearbook_reach").html(formatNumber(data.top.yearbook_reach,2,1));
            //年累计账面达成率的数据的颜色
            $("#yearbook_reach").parent("div").css("background-color",bgColor2(data.top.yearbook_reach));
            /***基本数据 E***/


            //各事业部折前收入指标
            /*
            //液态奶事业部
            $("#ytn_daybefore").html(data.ytn_daybefore);
            //奶粉事业部
            $("#nf_daybefore").html(data.nf_daybefore);

            //酸奶事业部
            $("#sn_daybefore").html(data.sn_daybefore);

            //冷饮事业部
            $("#ly_daybefore").html(data.ly_daybefore);

            //电商
            $("#ds_daybefore").html(data.ds_daybefore);
            */


            /******各事业部收成情况 S******/
            /*
            * 参数的含义:
            * x_data 这个是X轴
            * y1_data 折前达成进度的y轴
            * y2_data 账面达成进度的y轴
            * data_bs 当月计划进度
            *
            * */

            var x_data = [], y1_data = [], y2_data = [], data_bs = [];


            //businessIncomeComplete  各事业部的收成的情况
            //bG_NAME  液态奶事业部 事业部的名称
            //dayZQIncomeCompletePercent 折前达成进度
            //dayZMIncomeCompletePercent 折面达成进度
            //jzx  当月计划进度

            $.each(data.bgIncome,function(k,v){
                x_data.push(v.bgName);
                y1_data.push(formatNumber(v.monthZQCompletePercent,1,0));
                y2_data.push(formatNumber(v.monthZMCompletePercent,1,0));
                //液态奶事业部
                if(k==0){

                	if(v.jzx!=0){
                        var chart_arr=[{
                            x: "10%",
                            yAxis: v.jzx,
                            value:formatNumber(v.jzx,1,0)+"%"
                        },
                            {
                                x: "26.5%",
                                yAxis: v.jzx
                            }];
                        data_bs.push(chart_arr);
					}else{
                        var chart_arr=[{

                            x: "10%",
                            yAxis: v.jzx,
                            value:"0%"
                            },
                            {
                                x: "26.5%",
                                yAxis: '0%'
                            }];
                        data_bs.push(chart_arr);
					}
                }
                //奶粉事业部
                else if(k==1){
                	if(v.jzx!=0){
                        var chart_arr=[{
                            x: "26.5%",
                            yAxis: v.jzx,
                            value:formatNumber(v.jzx,1,0)+"%"
                        },
                            {
                                x: "43%",
                                yAxis: v.jzx
                            }];
                        data_bs.push(chart_arr);
					}else{
                        var chart_arr=[{
                            x: "26.5%",
                            yAxis: v.jzx,
                            value:"0%"
                        },
                            {
                                x: "43%",
                                yAxis: '0%'
                            }];
                        data_bs.push(chart_arr);
					}

                }
                //酸奶事业部
                else if(k==2){

                    if(v.jzx!=0){
                        var chart_arr=[{
                            x: "43%",
                            yAxis: v.jzx,
                            value:formatNumber(v.jzx,1,0)+"%"
                        },
                            {
                                x: "59.5%",
                                yAxis: v.jzx
                            }];
                        data_bs.push(chart_arr);
                    }else{
                        var chart_arr=[{
                            x: "43%",
                            yAxis: v.jzx,
                            value:"0%"
                        },
                            {
                                x: "59.5%",
                                yAxis: '0%'
                            }];
                        data_bs.push(chart_arr);
                    }

                }
                //冷饮事业部
                else if(k==3){

                    if(v.jzx!=0){
                        var chart_arr=[{
                            x: "59.5%",
                            yAxis: v.jzx,
                            value:formatNumber(v.jzx,1,0)+"%"
                        },
                            {
                                x: "76%",
                                yAxis: v.jzx
                            }];
                        data_bs.push(chart_arr);
                    }else{
                        var chart_arr=[{
                            x: "59.5%",
                            yAxis: v.jzx,
                            value:"0%"
                        },
                            {
                                x: "76%",
                                yAxis: '0%'
                            }];
                        data_bs.push(chart_arr);
                    }

                }
                //电商
                else if(k==4){

                    if(v.jzx!=0){
                        var chart_arr=[{
                            x: "76%",
                            yAxis: v.jzx,
                            value:formatNumber(v.jzx,1,0)+"%"
                        },
                            {
                                x: "92.5%",
                                yAxis: v.jzx
                            }];
                        data_bs.push(chart_arr);
                    }else{
                        var chart_arr=[{
                            x: "76%",
                            yAxis: v.jzx,
                            value:"0%"
                        },
                            {
                                x: "92.5%",
                                yAxis: '0%'
                            }];
                        data_bs.push(chart_arr);
                    }
                }
            });
            myChart.setOption(getChart1(x_data,y1_data,y2_data,data_bs));


            //头部的当前的日期
            $(".char_date").text(jsonData.day.split("-")[0]+"年" + jsonData.day.split("-")[1]+"月"+ jsonData.day.split("-")[2]+"日");
            //各事业部的收成情况的时间进度
            $(".char_timePercent").text(formatNumber(data.timePercent,1,0)+"%");

            /******各事业部收成情况 E******/


            /******各事业部折前收入指标 S******/

            //bgIncome
            //bgName事业部名称
            //dayZQIncome 日折前收入
            //monthZQIncome  月折前收入
            //monthZQCompletePercent 月折前达成进度
            //monthZQIncomeIncrease  月折前收入增长
            //yearZQLJIncome 年折前累计收入
            //yearZQIncomeCompletePercent 年折前达成率
            //yearZQLJIncomeIncrease 年折前累计增长
            //monthZQCompletePercentColor 月折前达成进度颜色

            /**求月度折前收入的最大值和年累计折前收入的最大值**/
            var tiao1 = [], tiao2 = [],tiao5=[];
            $.each(data.bgIncome, function (k, v) {
                tiao1.push(v.monthZQIncome);
                tiao2.push(v.yearZQLJIncome);
                tiao5.push(v.dayZQIncome);
            });

            var tiaomax1 = Math.max.apply(null, tiao1);//月度折前收入的最大值
            var tiaomax2 = Math.max.apply(null, tiao2);//年累计折前收入的最大值
            var tiaomax5 = Math.max.apply(null,tiao5); //日折前收入的最大值

            var str_zqsr = "";
            $.each(data.bgIncome, function (k, v) {
                var rzmsr = v.dayZQIncome,   //日折前收入
                    ydzmsr = v.monthZQIncome,//月度折前收入
                    yzmdcjd = v.monthZQCompletePercent,//月折前达成进度
                    yljzz = v.monthZQIncomeIncrease,//月累计增长
                    nljzmsr = v.yearZQLJIncome,//年折前累计收入
                    nzmdcl = v.yearZQIncomeCompletePercent,//年折前达成率
                    nljzz = v.yearZQLJIncomeIncrease;//年折前累计增长

                var color1 = bgColor2(v.monthZQCompletePercent); //月折前达成进度颜色
                var color2 = bgColor2(nzmdcl);            //年折前达成率的颜色
                var imgs1 = yljzz >= 0 ? "up" : "down";   //月累计增长的向上或者向下的箭头
                var imgs2 = nljzz >= 0 ? "up" : "down";   //年累计增长的向上或者向下的箭头
                var width1 = tiaomax1 === 0 ? 0 : (ydzmsr / tiaomax1) * 100; //月度折前收入的宽度
                var width2 = tiaomax2 === 0 ? 0 : (nljzmsr / tiaomax2) * 100; //年折前累计收入的宽度
                var width5 = tiaomax5 === 0 ? 0 : (rzmsr/tiaomax5)*100;//日折前收入的宽度

                  // 8个字段
                  str_zqsr += '<tr>'
					+ '<td onclick="cause_click($(this),"1")">' + v.bgName + '</td>'  //事业部的名称
					+ '<td class="hide">0</td>'
					+ '<td align="left"><span class="table_bg4A7EBE" style="width:' +width5+'%;"></span>' + formatNumber(rzmsr, 1, 1) + '</td>'  //日折前收入
					+ '<td align="left"><span class="table_bg4A7EBE" style="width:' +width1+'%;"></span>' + formatNumber(ydzmsr, 1, 1) + '</td>'  //月度折前收入
					+ '<td style="font-weight:bold;color:' + color1 + ';">' + formatNumber(yzmdcjd, 2, 0) + '%</td>'                   //月折前达成进度颜色
					+ '<td>' + formatNumber(yljzz, 1, 0) + '%<img src="../img/' + imgs1 + '.png" alt="" height="20px" style="vertical-align: top;"></td>' //月累计增长
					+ '<td align="left"><span class="table_bg4A7EBE" style="width:' + width2 + '%;"></span>' + formatNumber(nljzmsr, 1, 1) + '</td>' //年折前累计收入
					+ '<td style="font-weight:bold;color:' + color2 + ';">' + formatNumber(nzmdcl, 2, 0) + '%</td>'  //年折前达成率
					+ '<td>' + formatNumber(nljzz, 1, 0) + '%<img src="../img/' + imgs2 + '.png" alt="" height="20px" style="vertical-align: top;"></td>'  //年折前累计增长
					+ '</tr>'


            });
            $(".d_zqsrT tbody").html(str_zqsr);
            /******各事业部折前收入指标 E******/


            /******各事业部账面收入指标 S******/
			//各事业部账面收入指标
			//bgIncome  各事业部账面收入指标
			//dayZMIncome 日账面收入
			//monthZMIncome 月度账面收入
			//monthZMCompletePercent 月账面达成进度
			//monthZMIncomeIncrease  月累计增长
			//yearZMLJIncome 年累计账面收入
			//yearZMIncomeCompletePercent  年账面达成率
			//yearZMLJIncomeIncrease 年累计增长


            var tiao3 = [], tiao4 = [],tiao6=[];
            $.each(data.bgIncome, function (k, v) {
                tiao3.push(v.monthZMIncome);
                tiao4.push(v.yearZMLJIncome);
                tiao6.push(v.dayZMIncome);
            });
            var tiaomax3 = Math.max.apply(null, tiao3);//月度账面收入的最大值
            var tiaomax4 = Math.max.apply(null, tiao4);//年累计账面收入的最大值
            var tiaomax6 = Math.max.apply(null,tiao6);//日账面收入的最大值
			var str_zmsr = "";
            $.each(data.bgIncome, function (k, v) {

                var rzmsr = v.dayZMIncome,//日账面收入
                    ydzmsr = v.monthZMIncome,//月账面收入
                    yzmdcjd = v.monthZMCompletePercent,//月账面达成进度
                    yljzz = v.monthZMIncomeIncrease,//月累计增长
                    nljzmsr = v.yearZMLJIncome,//年累计账面收入
                    nzmdcl = v.yearZMIncomeCompletePercent,//年账面达成率
                    nljzz = v.yearZMLJIncomeIncrease;//年累计增长
					if('undefined'==typeof(v.bgName)){
						v.bgName = '';
					}
					if('undefined'==typeof(v.dayZMIncome)){
						rzmsr    = '';
					}
					if('undefined'==typeof(v.monthZMIncome)){
						ydzmsr   = '';
					}
					if('undefined'==typeof(v.monthZMCompletePercent)){
						yzmdcjd  = '';
					}
					if('undefined'==typeof(v.monthZMIncomeIncrease)){
						yljzz    = '';
					}
					if('undefined'==typeof(v.yearZMLJIncome)){
						nljzmsr  = '';
					}
					if('undefined'==typeof(v.yearZMIncomeCompletePercent)){
						nzmdcl   = '';
					}
					if('undefined'==typeof(v.yearZMLJIncomeIncrease)){
						nljzz    = '';
					}
                var color1 = bgColor2(v.monthZMCompletePercent);  //月账面达成进度的颜色
                var color2 = bgColor2(nzmdcl); //年账面达成率颜色
                var imgs1 = yljzz >= 0 ? "up" : "down";//月累计增长的箭头
                var imgs2 = nljzz >= 0 ? "up" : "down";//年累计增长的箭头
                var width3 = tiaomax3 === 0 ? 0 : (ydzmsr / tiaomax3) * 100;  //月度账面收入的宽度
                var width4 = tiaomax4 === 0 ? 0 : (nljzmsr / tiaomax4) * 100; //年累计账面收入的宽度
                var width6 = tiaomax6 < 0 ? 0 : (rzmsr/tiaomax6)*100; //日账面收入的宽度

				str_zmsr += '<tr>'
                    + '<td onclick="cause_click($(this),"1")">' + v.bgName + '</td>' //事业部的名称
                    + '<td class="hide">0</td>'
                    + '<td align="left"><span class="table_bg4A7EBE" style="width:'+width6+'%;"></span>' + formatNumber(rzmsr, 1, 1) + '</td>' //日账面收入
                    + '<td align="left"><span class="table_bg4A7EBE" style="width:'+width3+'%;"></span>' + formatNumber(ydzmsr, 1, 1) + '</td>'  //月账面收入
                    + '<td style="font-weight:bold;color:'+color1+';">' + formatNumber(yzmdcjd, 2, 0) + '%</td>' //月账面达成进度
                    + '<td>' + formatNumber(yljzz, 1, 0) + '%<img src="../img/' + imgs1 + '.png" alt="" height="20px" style="vertical-align: top;"></td>' //月累计增长
                    + '<td align="left"><span class="table_bg4A7EBE" style="width:' + width4 + '%;"></span>' + formatNumber(nljzmsr, 1, 1) + '</td>'  //年累计账面收入
                    + '<td style="font-weight:bold;color:' + color2 + ';">' + formatNumber(nzmdcl, 2, 1) + '%</td>' //年账面达成率
                    + '<td>' + formatNumber(nljzz, 1, 0) + '%<img src="../img/' + imgs2 + '.png" alt="" height="20px" style="vertical-align: top;"></td>' //年累计增长
                    + '</tr>'
            });
            $(".d_zmsrT tbody").html(str_zmsr);

            /******各事业部账面收入指标 E******/
            $("#hide1").remove();
            $("#hide2").remove();
        }
	});

}

/******获取地图  S*******/
function getMap(jsonData){

	ajaxReq("getMap",jsonData,function(data) {

		console.log('中国地图的显示的后台的返回的数据：');
		//console.log(data);
        /**
         * 参数含义：
         * b_name :表示事业部
         * data_sjjd : 实际达成进度
         * data_yjdcl : 预计达成率
         * data_zq : 折前收入
         *
         * **/
		var data_sjjd = [],//实际达成进度放在数组中
			data_yjdcl=[], //预计达成率
			data_zq=[];    //折前收入

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
		//清除地图
		myChart3.clear();
		//b_name是事业部的名称
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
        //根据事业部的不同加载不同的地图
		$.get('../'+json+'/china.json', function (chinaJson) {
		    echarts.registerMap('china', chinaJson);
		    myChart3.setOption(getMapchart(b_name,data_sjjd,data_yjdcl,data_zq),true);
		});
        $("#hide3").remove();
	});
}
/******获取地图  E*******/


/***获取右下角的3块的数据 当月全部折前收入进度******/
/*
 * time   选择的日期
 * isZQ   是否是折前收入"true" or "false"
 * isName "折前收入" or "账面收入"
 * businessMapName   事业部名称  若为空   则默认全部
 * */
function getRightBottom(jsonData,isName){

     console.log('取右下角的三块的数据显示---->');
	 console.log(jsonData);
	 //请求下面的表格的数据
     ajaxReq("getRightBottom",jsonData,function(data){

         /****当月全部折前收入进度(折线图)everyDayLJIncome  S****/
         //day 天
         //ljBudget 预算目标
         //ljIncome 累计收入
         /*
         * x1_data:     //当月全部折前收入进度的x轴   表示的日期
         * y_total_data://预算目标的y轴    累计收入
         * y_budget_data://累计收入的y轴   预算目标
         *
         * */
         //折前收入的渲染
         if(isName == "折前收入"){
             var x1_data=[],y_total_data=[],y_budget_data=[];
             // 渲染右侧的折线图
             $.each(data.everyDayLJIncome,function(k,v){
                 var N = Number(jsonData.day.split("-")[2]);
                 x1_data.push(v.day);
                 y_budget_data.push(formatNumber(v.dayZQBudget,1,0));
                 if(k < N){
                     y_total_data.push(formatNumber(v.dayZQIncome,1,0));
                 }
             });
             // 设置折线图的数据
             myChart2.setOption(getJson2(x1_data,y_total_data,y_budget_data,isName,jsonData.businessMapName));

         }
         //折面收入的渲染
         else{
             var x1_ZM__data=[],y_ZM_total_data=[],y_ZM_budget_data=[];
             // 渲染右侧的折线图
             $.each(data.everyDayLJIncome,function(k,v){
                 var N = Number(jsonData.day.split("-")[2]);
                 x1_ZM__data.push(v.day);
                 y_ZM_budget_data.push(formatNumber(v.dayZMBudget,1,0));
                 if(k < N){
                     y_ZM_total_data.push(formatNumber(v.dayZMIncome,1,0));
                 }
             });
             // 设置折线图的数据
             myChart2.setOption(getJson2(x1_ZM__data,y_ZM_total_data,y_ZM_budget_data,isName,jsonData.businessMapName));

         }

         /****当月全部折前收入进度(折线图)everyDayLJIncome  E****/
         $("#hide3").remove();

         /*************************全部重点折前收入 S**************************************/
        if(jsonData.businessMapName == ""){
            jsonData.businessMapName = "全部";
        }
        //重点产品的折前收入的文本
        $(".businessMapName").text(jsonData.businessMapName);
        //  data.zpxpIncome.monthMainProductCompletePercent    全部重点产品折前收入  月达成率
        //  mainProduct 全部重点折前收入 表格的内容
        //  bg_name 事业部名称
        //  monthZQIncome 月折前收入
        //  cellPercent 销售占比
        //  monthZQCompletePercent  月折前达成进度
        //  monthZQIncomeIncrease  月增长

        //全部重点产品折前收入  月达成率
        $(".d_zdcpsr").text(data.zpxpIncome.monthMainProductCompletePercent+"%");

        var tiaos1=[];

        $.each(data.zpxpIncome.mainProduct,function(k,v){
            tiaos1.push(v.monthZQIncome);
        });

        //求月折前的收入最大值
        var tiaomaxs1 = Math.max.apply(null,tiaos1);
        //填充表格头部
        var str_head1 = '<tr>'
            //+'<th>事业部名称<span class="add_zp">+</span></th>'
            +'<th>事业部名称</th>'
            +'<th class="hide">SKU</th>'
            +'<th>月折前收入</th>'
            +'<th>销售占比</th>'
            +'<th>月折前达成进度</th>'
            +'<th>月增长</th>'
            +'</tr>';
        $(".d_zdcpT thead").html(str_head1);

        //填充表格的内容
        var str_zdcp = "";
        $.each(data.zpxpIncome.mainProduct,function(k,v){

            var widths = tiaomaxs1 === 0 ? 0 : (v.monthZQIncome/tiaomaxs1)*100 ;
            var imgs = v.monthZQIncomeIncrease < 0 ? "down" : v.monthZQIncomeIncrease ===0 ? "" : "up";
            var color = bgColor2(v.monthZQCompletePercent);
            var str_img = imgs ==="" ? "" : '<img src="../img/'+imgs+'.png" alt="" height="20px" style="vertical-align: top;">'

            str_zdcp += '<tr>'
                +'<td onclick="cause_click($(this),"1")">'+v.bg_name+'</td>'  //事业部名称
                +'<td class="hide">0</td>'  //SKU
                +'<td><span class="table_bg4A7EBE" style="width:'+widths+'%;"></span>'+formatNumber(v.monthZQIncome,1,1)+'</td>'  //月折前收入
                +'<td>'+formatNumber(v.cellpercent,2,0)+'%</td>'  //销售占比
                +'<td style="font-weight:bold;color:'+color+';">'+formatNumber(v.monthZQCompletePercent,2,0)+'%</td>'  //月折前达成进度
                +'<td>'+formatNumber(v.monthZQIncomeIncrease,1,0)+'%'+str_img+'</td>'  //月增长
                +'</tr>'
        });
        $(".d_zdcpT tbody").html(str_zdcp);

        /********************************全部重点折前收入 E********************************/

        /*******全部新品折前收入  E *******/
        // data.zpxpIncome.monthNewProductCompletePercent  全部新品折前收入
        //  newProduct 全部新品折前收入
        //  mainProduct 全部重点折前收入 表格的内容
        //  bg_name 事业部名称
        //  monthZQIncome 月折前收入
        //  cellPercent 销售占比
        //  monthZQCompletePercent  月折前达成进度


        $(".d_xpsr").text(data.zpxpIncome.monthNewProductCompletePercent+"%");
        var tiaos2=[];
        $.each(data.zpxpIncome.newProduct,function(k,v){
            tiaos2.push(v.monthZQIncome);
        });
        //求全部新品折前收入的最大值
        var tiaomaxs2 = Math.max.apply(null,tiaos2);
        //填充表格的头部
        var str_head2 = '<tr>'
            //+'<th>事业部名称<span class="add_xp">+</span></th>'
            +'<th>事业部名称</th>'
            +'<th class="hide">SKU</th>'
            +'<th>月折前收入</th>'
            +'<th>销售占比</th>'
            +'<th>月折前达成进度</th>'
            +'</tr>';
        $(".d_xpT thead").html(str_head2);
        //填充表格的数据
        var str_xp = "";
        $.each(data.zpxpIncome.newProduct,function(k,v){

            var widths = tiaomaxs2 === 0 ? 0 : (v.monthZQIncome/tiaomaxs2)*100; //月折前收入的最大值
            var color = bgColor2(v.monthZQCompletePercent);  //月折前达成进度的颜色
            str_xp += '<tr>'
                +'<td onclick="cause_click($(this),"1")">'+v.bg_name+'</td>' //事业部名称
                +'<td class="hide">0</td>'  //SKU
                +'<td><span class="table_bg4A7EBE" style="width:'+widths+'%;"></span>'+formatNumber(v.monthZQIncome,1,1)+'</td>'  //月折前收入
                +'<td>'+formatNumber(v.cellpercent,2,0)+'%</td>'  //销售占比
                +'<td style="font-weight:bold;color:'+color+';">'+formatNumber(v.monthZQCompletePercent,2,0)+'%</td>'  //月折前达成进度
                +'</tr>'
        });
        $(".d_xpT tbody").html(str_xp);
        /*******全部新品折前收入  E *******/
        $("#hide3").remove();
    });

}
//获取柱形图样式  各事业部收成情况
function getChart1(x_data,y1_data,y2_data,data_bs){

	var option = {
	        title: {
	            text: '各事业部收成情况',
	            textStyle: {
	                color: '#fff',
	                fontSize:16,
	                fontWeight:600,
	                fontFamily:'冬青黑体简体中文'
	            }
	        },
	        tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:function(params){  
                   var relVal = params[0].name;  
                   for (var i = 0, l = params.length; i < l; i++) {  
                        relVal += '<br/>' + params[i].marker +  params[i].seriesName + ' : ' + params[i].value+"%";
                        if(i==1){

                            //console.log(data_bs[params[i].dataIndex][0]);
                            //console.log(data_bs[params[i].dataIndex][0].value);
                            relVal +='<br/>当月计划进度：'+data_bs[params[i].dataIndex][0].value;
                        }
                   }  
                   return relVal;  
                }  
            },
	        legend: {
	            data: ['折前达成进度', '账面达成进度'],
	            textStyle: {
	                color: ['#fff']
	            },
	            itemWidth: 10,
	            itemHeight: 10,
	            y: 'top',
	            x: 'right',
	            orient: 'horizontal',
	        },
	        grid: {
	        	left: '3%',
                right: '8%',
                bottom: '7%',
                containLabel: true,
	        },
	        xAxis: [{
	        	show: true,
                position :"top",
                type: 'category',
	            data: x_data,
	            triggerEvent:true,
	            axisLabel: {//x轴文字
	                textStyle: {
	                    color: '#fff'
	                },
	                interval: 0,
	                margin: 10
	            },
	            axisLine: {//x轴
	                lineStyle: {
	                    color: '#fff'
	                }
	            },
	            axisTick: {//x轴小标记不显示
	                show: false,
	            },	            
	            splitLine: {//分隔线
	                show: true,
	                onGap: null,//是否间隔显示
	                lineStyle: {
	                    color: ['#ccc'],
	                    width: 1,
	                    type: 'solid'
	                }
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
	                formatter: '{value}%',
	            },
	            splitLine: {//分隔线
	                show: false,
	            }
	        }],
	        series: [
	            {
	                name: '折前达成进度',
	                type: 'bar',
	                itemStyle: {
	                    normal: {
	                        lineStyle: {
	                            color: '#b5b5b6'
	                        },
	                        color: '#3C709F',
	                        label: {show: true, position: 'inside',formatter: '{c}%'}
	                    }
	                },
	                data:y1_data 
	            },
	            {
	                name: '账面达成进度',
	                type: 'bar',
	                stack: '广告',
	                itemStyle: {
	                    normal: {
	                        lineStyle: {
	                            color: '#b5b5b6'
	                        },
	                        color: '#AAD1E5',
	                        label: {show: true, position: 'inside',formatter: '{c}%'}
	                    }
	                },
	                data: y2_data,
	                markLine: {
                        symbolSize:0,
                        animation:false,
                        lineStyle:{
                            color:"#edc948",
                            width:2,
                            type:"solid"
                        },
                        label:{
                        	show:true,
                            position:"middle"
                        },
                        data: data_bs/*[
                            [
                            {  
                             
                                x: "10%",  
                                yAxis: 100,
                                value:"100%"
                            },  
                            {  
                                x: "26.5%",  
                                yAxis: 100
                            }
                            ],
                            [
                             {  
                              
                                 x: "26.5%",  
                                 yAxis: 200,
                                 value:"200%"
                             },  
                             {  
                                 x: "43%",  
                                 yAxis: 200
                             }
                             ],
                             [
                              {  
                               
                                  x: "43%",  
                                  yAxis: 300,
                                  value:"300%"
                              },  
                              {  
                                  x: "59.5%",  
                                  yAxis: 300
                              }
                              ],
                              [
                               {  
                                
                                   x: "59.5%",  
                                   yAxis: 300,
                                   value:"300%"
                               },  
                               {  
                                   x: "76%",  
                                   yAxis: 300
                               }
                               ],
                               [
                                {  
                                 
                                    x: "76%",  
                                    yAxis: 100,
                                    value:"100%"
                                },  
                                {  
                                    x: "92.5%",  
                                    yAxis: 100
                                }
                                ]
                        ]*/
                    }
	                //系列中的数据标线内容
//	                 markLine: {
//	                    lineStyle:{
//	                        color:"#edc948",
//	                        type:"solid"
//	                    },
//	                     data: [
//	                         // {type: 'average', name: '平均值'},
//	                         {name: '标注1',symbolSize:0, value: 100, xAxis: '数据1', yAxis: 20},      // 当xAxis为类目轴时，数值1会被理解为类目轴的index
//	                         {name: '标注2',symbolSize:1, value: 100, xAxis: '数据2', yAxis: 10}, // 当xAxis为类目轴时，字符串'周三'会被理解为与类目轴的文本进行匹配
//	                         {name: '标注3',symbolSize:2, value: 200, xAxis: "数据3", yAxis: 17}
//	                         
//	                    ]
//
//	                 } 
	            },
	            {
	                name: '平均值',
	                type: 'parallel',
	                lineStyle: {
	                	normal: {
	                        width: 1,
	                        opacity: 0.5
	                    }
	                },
	                data: ["100","150","200","150","100"]
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
	                    // textStyle: null // 默认使用全局文本样式，详见TEXTSTYLE
	                },
	                nodeStyle: {
	                    // r: 30
	                },
	                linkStyle: {}
	            }
	        },
	    };
	return option;
}
//获取折线图样式当月全部折前收入进度
function getJson2(x_data,y_total_data,y_budget_data,isName,businessMapName){
	var option2 = {
	        title: {
	            text: '当月'+businessMapName+isName+'进度  单位：万元',
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
	 return option2;
}
//地图
function getMapchart(b,data_sjjd,data_yjdcl,data_zq){

	/**
	 * 参数含义：
	 * b :表示事业部
	 * data_sjjd : 实际达成进度
	 * data_yjdcl : 预计达成率
	 * data_zq : 折前收入
	 *
	 * **/
	var option3 = {
		    title: {
		        text: b+'大区折前收入达成', //'液态奶事业部折前收入',
		        x: 'left',
		        textStyle: {
		            color: '#fff',
		            fontSize:16,
		            fontWeight:600,
		            fontFamily:'冬青黑体简体中文'
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
		            {end: 95.99999, label: '96%>预计达成率', color: '#e15759'},
		            {start: 95.99999, end: 99.99999, label: '96%<=预计达成率<100%', color: '#bfa23a'},
		            {start: 99.99999,label: '预计达成率>=100%', color: '#488140'}   
		        ]
		    },
		    tooltip: {
		        trigger: 'item',
				//formatter:"{b0}: {c0}<br />{b1}: {c1}"
		        formatter:function(params){
		            //定义一个res变量来保存最终返回的字符结果,并且先把地区名称放到里面
		            var res="大区名称："+params.name+'<br />';
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
		                    		res+='折前收入：'+formatNumber(data_zq[k].value,2,1)+'<br />'
		                    			+'实际达成进度：'+data_sjjd[k].value+'%<br />'
		                    			+myseries[i].name+'：'+formatNumber(myseries[i].data[k].value,1,0)+'%<br />'
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
			    name: "预计达成率",
			    type: 'map',
			    mapType: 'china',
			    data: data_yjdcl,
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
		        }
			 }]
		};
	return option3;
}

/*******重点产品下钻的功能的加号  S ****************/
//事业部的加号
$(".T_zd").on("click",".add_zp",function(){

    console.log('进入重点产品的加号的点击事件');
	loadHide1("h_zp","hide4");
	var timess = $("#startTime").val();//得到开始的时间
	var isName=$("#sr_typeselect").val(); //得到是否是折前的收入

	//是否是折前的收入
	var isZQ = isName=="折前收入"?"true":"false";
	/*
	* jsonData的参数
	* day 当前的日期
	* isZQ 是否是折前收入
	* businessMapName 事业部的名称
	* bigAreaMapName  大区的名称
	* isMainProduct   是否是重点的产品
	*
	* */
	var jsonData = {
			"day":timess,
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName,
			"isMainProduct":"true"
	};
	var that = $(this);
	/*
	*
	* 这里只有第一次的点击拿数据
	* 以后拿到缓存的数据
	*
	* */

    var   add_zp_data =$(".add_zp").attr("add_zp_data");
    console.log(add_zp_data);
    if(undefined == add_zp_data){

        console.log('进入重点产品的加号的ajax');
        /*var data={'name':'1'};
        $(".add_zp").attr("data",data);*/
        // 重点产品的下钻的功能   加号getProductByBusinessName 调用 getstr2方法
        ajaxReq("getProductByBusinessName",jsonData,function(data) {

            //填充头部的head
            var head_str = "<tr>"
                +"<th>事业部名称<span class='remove_zp'>-</span></th>"    //这个是合并下钻
                +"<th>子品牌<span class='add_zp_sku'>+</span></th>"   //这个是SKU的打开的功能
                +"<th>月折前收入</th>"      //月折前收入
                +"<th>销售占比</th>"        //销售占比
                +"<th>月折前达成进度</th>"   //月折前达成进度
                +"<th>月增长</th>"          //月增长
                +"</tr>";
            $(".T_zd thead").html(head_str);

            //填充表格的内容getStr1(data)
            $(".d_zdcpT tbody").html(getStr1(data));
            $("#hide4").remove();
            //重点产品获取SKU的数据的加号
            $(".T_zd").on("click",".add_zp_sku",function(){
                loadHide1("h_zp","hide4");
                var thats = $(this);
                $(".d_zdcpT tbody").html("");
                //把数据储存在重点产品的下钻的span上
                $(".add_zp").attr("add_zp_data",data);
                //重点产品获取SKU的数据的接口数据
                ajaxReq("getSkuByProductName",jsonData,function(data) {
                    var head_str1 = "<tr>"
                        +"<th>事业部名称<span class='remove_zp'>-</span></th>"      //事业部名称的下钻的减号
                        +"<th>子品牌<span class='remove_zp_sku'>-</span></th>"  //SKU的下钻的减号
                        +"<th>SKU</th>"
                        +"<th>月折前收入</th>"
                        +"<th>销售占比</th>"
                        +"<th>月折前达成进度</th>"
                        +"<th>月增长</th>"
                        +"</tr>";
                    $(".T_zd thead").html(head_str1);
                    $(".d_zdcpT tbody").html(getstr2(data));
                    $("#hide4").remove();
                });
            });
        });
    }else{
        console.log('进入重点产品的加号的缓存');
        var add_zp_cache_data =$(".add_zp").attr("add_zp_data");
        console.log('进入重点产品的加号的缓存的数据');
        console.log(add_zp_cache_data);
    }


});
//SKU的减号
$(".T_zd").on("click",".remove_zp_sku",function(){
	loadHide1("h_zp","hide4");
	var timess = $("#startTime").val();
	var isName=$("#sr_typeselect").val();
	var isZQ = isName=="折前收入"?"true":"false";
	var jsonData = {
			"day":timess,
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName,
			"isMainProduct":"true"
	};
	ajaxReq("getProductByBusinessName",jsonData,function(data) {
		var head_str = "<tr>" 
			+"<th>事业部名称<span class='remove_zp'>-</span></th>"
			+"<th>子品牌<span class='add_zp_sku'>+</span></th>"
			+"<th>月折前收入</th>"
			+"<th>销售占比</th>"
			+"<th>月折前达成进度</th>"
			+"<th>月增长</th>"
		+"</tr>";
		$(".T_zd thead").html(head_str);
		$(".d_zdcpT tbody").html(getStr1(data));
		$("#hide4").remove();
	});
});
//重点产品的减号
$(".T_zd").on("click",".remove_zp",function(){
	loadHide1("h_zp","hide4");
	var timess = $("#startTime").val(); //得到当前的时间
	var isName=$("#sr_typeselect").val(); //指标销售
    var isZQ = isName=="折前收入"?"true":"false";  //是否是折前的收入

	/*
	* 封装JSON对象
	*
	* day 当前日期
	* isZQ 是否是折前收入
	* businessMapName 事业部的名称
	* bigAreaMapName  大区的名称
	* isMainProduct   是否是重点的产品
	*
	* */
	var jsonData = {
			"day":timess,
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName,
			"isMainProduct":"true"
	};
	/**填充表格的头部内容 S**/
	var head_str1 = "<tr>" 
					+"<th>事业部名称<span class='add_zp'>+</span></th>"
					+"<th>月折前收入</th>"
					+"<th>销售占比</th>"
					+"<th>月折前达成进度</th>"
					+"<th>月增长</th>"
				+"</tr>";
	$(".T_zd thead").html(head_str1);
    /**填充表格的头部内容 E**/


    //这个接口这是渲染重点产品的表格
	ajaxReq("getRightBottom",jsonData,function(data){
		 if(jsonData.businessMapName == ""){
			 jsonData.businessMapName = "全部";
		 }
		 $(".businessMapName").text(jsonData.businessMapName);
		 //全部重点折前收入
		 $(".d_zdcpsr").text(data.zpxpIncome.monthMainProductCompletePercent+"%");
		 var tiaos1=[];
         $.each(data.zpxpIncome.mainProduct,function(k,v){
        	tiaos1.push(v.monthLJIncome);         	
         });
         var tiaomaxs1 = Math.max.apply(null,tiaos1);

         /**表格的头部 S**/
         var str_head1 = '<tr>'
							+'<th>事业部名称<span class="add_zp">+</span></th>'
							+'<th class="hide">SKU</th>'
							+'<th>月折前收入</th>'
							+'<th>销售占比</th>'
							+'<th>月折前达成进度</th>'
							+'<th>月增长</th>'
						+'</tr>';
		$(".d_zdcpT thead").html(str_head1);
        /**表格的头部 E**/


		var str_zdcp = "";
		$.each(data.zpxpIncome.mainProduct,function(k,v){
            var widths = tiaomaxs1 === 0 ? 0 : (v.monthLJIncome/tiaomaxs1)*100 ;
            var imgs = v.monthIncreasePercent < 0 ? "down" : "up";
            var color = bgColor2(v.monthCompletePercent);
            str_zdcp += '<tr>'
                +'<td onclick="cause_click($(this),"1")">'+v.bgName+'</td>'
                +'<td class="hide">0</td>'
                +'<td><span class="table_bg4A7EBE" style="width:'+widths+'%;"></span>'+formatNumber(v.monthLJIncome,1,1)+'</td>'
                +'<td>'+formatNumber(v.sellPercent,2,0)+'%</td>'
                +'<td style="font-weight:bold;color:'+color+';">'+formatNumber(v.monthCompletePercent,2,0)+'%</td>';
            if(v.monthIncreasePercent == 0){
                str_zdcp +='<td></td>';
            }else{
                str_zdcp +='<td>'+formatNumber(v.monthIncreasePercent,1,0)+'%<img src="../img/'+imgs+'.png" alt="" height="20px" style="vertical-align: top;"></td>';
            }
            str_zdcp +='</tr>';
		});
		$(".d_zdcpT tbody").html(str_zdcp);

		$("#hide4").remove();
    });
});

//重点产品的下钻的表格的渲染
function getStr1(data){
	var arr_width = [];
	$.each(data,function(k,v){
		$.each(v,function(m,n){
			$.each(n,function(s,t){
				$.each(t,function(o,p){
					arr_width.push(p.monthIncome);
				});				
			});			
		});
	});
	//月折前收入的最大值
	/*
	monthIncome 月折前收入
	monthCompletePercent 月折前达成进度
	monthIncreasePercent 月增长
    monthCompletePercentColor 月折前达成进度的颜色值
    sellPercent 销售占比
	*/
	var max_n1 = Math.max.apply(null,arr_width);

	var str="";
	$.each(data,function(k,v){
		$.each(v,function(m,n){
			$.each(n,function(s,t){
				var ss = 0;
				//合并单元格
				str +="<tr><td rowspan='"+getJsonLength(t)+"'>"+s+"</td>";

				$.each(t,function(o,p){
                    if(ss!=0){
                        str+="<tr>"
                    }
                    var n1 = p.monthIncome,n2 = p.monthCompletePercent,n3 = p.monthIncreasePercent;
                    var widths =  max_n1<=0 ? "0":(n1/max_n1)*100;
                    var colors = bgColor2(p.monthCompletePercent);
                    var imgs = n3<0 ? "down" : n3==0 ? "" : "up";
                    var str_img = imgs==="" ? "" : "<img src='../img/"+imgs+".png' alt='' height='20px' style='vertical-align: top;'/>";
                    str+="<td>"+o+"</td>"
                        +"<td style='text-align:left;'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(n1,1,1)+"</td>"
                        +"<td>"+formatNumber(p.sellPercent,2,0)+"%</td>"
                        +"<td style='font-weight:bold;color:"+colors+";'>"+formatNumber(n2,2,0)+"%</td>"
                    if(n3==0){
                        str+="<td></td>"
                    }else{
                        str+="<td>"+formatNumber(n3,1,0)+"%"+str_img+"</td>"
                    }
                    str+="</tr>"
                    ss++;
				});				
			});
		});
	});	
	return str;
}
//重点产品的SKU的表格渲染
function getstr2(data){
    var str1 = "";
    var arr_width=[];
    $.each(data.skuList,function(k,v){
        $.each(v,function(s,t){
            $.each(t,function(m,n){
                $.each(n,function(o,p){
                    arr_width.push(p.monthIncome);
                });

            });
        });
    });
    var max_n1 = Math.max.apply(null,arr_width);
    $.each(data,function(k,v){
        $.each(v,function(s,t){
            var len=0;
            $.each(t,function(m,n){
                $.each(n,function(o,p){
                    len += getJsonLength(p);
                });
            });
            $.each(t,function(m,n){
                str1 +="<tr><td rowspan='"+len+"'>"+m+"</td>"
                $.each(n,function(o,p){
                    str1 +="<td rowspan='"+getJsonLength(p)+"'>"+o+"</td>";
                    var rr=0;
                    $.each(p,function(x,y){
                        if(rr!=0){
                            str1+="<tr>"
                        }
                        var n1 = y.monthIncome,n2 = y.monthCompletePercent,n3 = y.monthIncreasePercent;
                        var widths =  max_n1<=0 ? "0":(n1/max_n1)*100;
                        var colors = bgColor2(y.monthCompletePercent);
                        var imgs = n3<0 ? "down": n3===0 ? "" : "up";
                        var str_img = imgs === "" ? "" :"<img src='../img/"+imgs+".png' alt='' height='20px' style='vertical-align: top;'/>"
                        str1+="<td title='"+x+"' style='width:250px;text-align:left;'>"+x+"</td>"
                            +"<td align='left'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(n1,1,1)+"</td>"
                            +"<td>"+formatNumber(y.sellPercent,2,0)+"%</td>"
                            +"<td style='font-weight:bold;color:"+colors+";'>"+formatNumber(n2,2,0)+"%</td>"
                        if(n3==0){
                            str1+="<td></td>"
                        }else{
                            str1+="<td>"+formatNumber(n3,1,0)+"%"+str_img+"</td>"
                        }
                        str1+="</tr>"
                        rr++;
                    });
                });
            });
        });
    });
    return str1;
}
/*******重点产品下钻的功能的加号  E ****************/

/*******全部新品折前收入下钻的加号 S****************/

//新品的事业部下钻的加号
$(".T_xp").on("click",".add_xp",function(){
	loadHide1("h_xp","hide4");
	//当前的日期
	var timess = $("#startTime").val();
	//下拉选择的值
	var isName = $("#sr_typeselect").val();
	//是否是折前的收入
	var isZQ = isName=="折前收入"?"true":"false";

	/*
	 timess当前的日期
	 isZQ 是否是折前的收入
	 businessMapName 事业部的名称
	 bigAreaMapName 大区的名称
	 isMainProduct  是否是重点的产品
	  */
	var jsonData = {
			"day":timess,
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName,
			"isMainProduct":"false"
	};
	var that = $(this);

	// 全部新品折前收入下钻的接口
	ajaxReq("getProductByBusinessName",jsonData,function(data) {

	    /**新品的表格的头部**/
		var head_str = "<tr>" 
					+"<th>事业部名称<span class='remove_xp'>-</span></th>"
					+"<th>子品牌<span class='add_xp_sku'>+</span></th>"
					+"<th>月折前收入</th>"
					+"<th>销售占比</th>"
					+"<th>月折前达成进度</th>"
				+"</tr>";
		$(".T_xp thead").html(head_str);
		// 填充新品的表格的内容
		$(".d_xpT tbody").html(getStr3(data));
		$("#hide4").remove();
		//获取sku
		$(".T_xp").on("click",".add_xp_sku",function(){
			loadHide1("h_xp","hide4");
			var thats = $(this);	
			$(".d_xpT tbody").html("");
            ajaxReq("getSkuByProductName",jsonData,function(data) {
                var head_str1 = "<tr>"
                    +"<th>事业部名称<span class='remove_xp'>-</span></th>"
                    +"<th>子品牌<span class='remove_xp_sku'>-</span></th>"
                    +"<th>SKU</th>"
                    +"<th>月折前收入</th>"
                    +"<th>销售占比</th>"
                    +"<th>月折前达成进度</th>"
                    +"</tr>"
                $(".T_xp thead").html(head_str1);
                $(".d_xpT tbody").html(getstr4(data));
                $("#hide4").remove();
            });
		});			
	});
});
//新品下钻的SKU的减号
$(".T_xp").on("click",".remove_xp_sku",function(){
	loadHide1("h_xp","hide4");
	var timess = $("#startTime").val();
	var isName = $("#sr_typeselect").val();
	var isZQ = isName=="折前收入"?"true":"false";
	var jsonData = {
			"day":timess,
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName,
			"isMainProduct":"false"
	};
    ajaxReq("getProductByBusinessName",jsonData,function(data) {
        var head_str = "<tr>"
            +"<th>事业部名称<span class='remove_xp'>-</span></th>"
            +"<th>子品牌<span class='add_xp_sku'>+</span></th>"
            +"<th>月折前收入</th>"
            +"<th>销售占比</th>"
            +"<th>月折前达成进度</th>"
            +"</tr>"
        $(".T_xp thead").html(head_str);
        $(".d_xpT tbody").html(getStr3(data));
        $("#hide4").remove();
    });
});
//新品的事业部的减号
$(".T_xp").on("click",".remove_xp",function(){
	loadHide1("h_xp","hide4");
	var timess = $("#startTime").val();
	var jsonData = {
			"day":timess,
			"isZQ":"true",
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName,
			"isMainProduct":"false"
	};
	var head_str1 = "<tr>" 
			+"<th>事业部名称<span class='add_zp'>+</span></th>"
			+"<th>月折前收入</th>"
			+"<th>销售占比</th>"
			+"<th>月折前达成进度</th>"
		+"</tr>";
	$(".T_xp thead").html(head_str1);
    ajaxReq("getRightBottom",jsonData,function(data){
        if(jsonData.businessMapName == ""){
            jsonData.businessMapName = "全部";
        }
        $(".businessMapName").text(jsonData.businessMapName);
        //全部新品折前收入
        $(".d_xpsr").text(data.zpxpIncome.monthNewProductCompletePercent+"%");
        var tiaos2=[];
        $.each(data.zpxpIncome.newProduct,function(k,v){
            tiaos2.push(v.monthLJIncome);
        });
        var tiaomaxs2 = Math.max.apply(null,tiaos2);
        var str_head2 = '<tr>'
            +'<th>事业部名称<span class="add_xp">+</span></th>'
            +'<th class="hide">SKU</th>'
            +'<th>月折前收入</th>'
            +'<th>销售占比</th>'
            +'<th>月折前达成进度</th>'
            +'</tr>'
        $(".d_xpT thead").html(str_head2);
        var str_xp = "";
        $.each(data.zpxpIncome.newProduct,function(k,v){
            var widths = tiaomaxs2 === 0 ? 0 : (v.monthLJIncome/tiaomaxs2)*100 ;
            var color = bgColor2(v.monthCompletePercent);
            str_xp += '<tr>'
                +'<td onclick="cause_click($(this),"1")">'+v.bgName+'</td>'
                +'<td class="hide">0</td>'
                +'<td><span class="table_bg4A7EBE" style="width:'+widths+'%;"></span>'+formatNumber(v.monthLJIncome,1,1)+'</td>'
                +'<td>'+formatNumber(v.sellPercent,2,0)+'%</td>'
                +'<td style="font-weight:bold;color:'+color+';">'+formatNumber(v.monthCompletePercent,2,0)+'%</td>'
                +'</tr>'
        });
        $(".d_xpT tbody").html(str_xp);
        $("#hide4").remove();
    });
});
/*******全部新品折前收入下钻的加号 E****************/


//新品的表格的内容
function getStr3(data){
	var arr_width = [];
	$.each(data,function(k,v){
		$.each(v,function(m,n){
			$.each(n,function(s,t){
				$.each(t,function(o,p){
					arr_width.push(p.monthIncome);
				});				
			});			
		});
	});
	var max_n1 = Math.max.apply(null,arr_width);
	var str="";
	$.each(data,function(k,v){
		$.each(v,function(m,n){
			$.each(n,function(s,t){
				var ss = 0;
				str +="<tr><td rowspan='"+getJsonLength(t)+"'>"+s+"</td>";
				$.each(t,function(o,p){
					if(ss!=0){
						str+="<tr>"
					}
					var n1 = p.monthIncome,n2 = p.monthCompletePercent;
					var widths =  max_n1<=0 ? "0":(n1/max_n1)*100;
					var colors = bgColor2(p.monthCompletePercent);
					str+="<td>"+o+"</td>"
						+"<td style='text-align:left;'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(n1,1,1)+"</td>"
						+"<td>"+formatNumber(p.sellPercent,2,0)+"%</td>"
						+"<td style='font-weight:bold;color:"+colors+";'>"+formatNumber(n2,2,0)+"%</td>"
						+"</tr>";
					ss++;
				});
			});	
		});
	});	
	return str;
}
//新品的事业部下钻的表格
function getstr4(data){
	var str1 = "";
	var arr_width=[];
	$.each(data.skuList,function(k,v){		
		$.each(v,function(s,t){
			$.each(t,function(m,n){
				$.each(n,function(o,p){
					arr_width.push(p.monthIncome);					
				});
				
			});
		});
	});
	var max_n1 = Math.max.apply(null,arr_width);
	$.each(data,function(k,v){		
		$.each(v,function(s,t){
			var len=0;
			$.each(t,function(m,n){
				$.each(n,function(o,p){
					len += getJsonLength(p);
				});				
			});
            $.each(t,function(m,n){
                str1 +="<tr><td rowspan='"+len+"'>"+m+"</td>"
                $.each(n,function(o,p){
                    str1 +="<td rowspan='"+getJsonLength(p)+"'>"+o+"</td>";
                    var rr=0;
                    $.each(p,function(x,y){
                        if(rr!=0){
                            str1+="<tr>"
                        }
                        var n1 = y.monthIncome,n2 = y.monthCompletePercent,n3 = y.monthIncreasePercent;
                        var widths =  max_n1<=0 ? "0":(n1/max_n1)*100;
                        var colors = bgColor2(y.monthCompletePercent);
                        str1+="<td title='"+x+"' style='width:250px;text-align:left;'>"+x+"</td>"
                            +"<td align='left'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(n1,1,1)+"</td>"
                            +"<td>"+formatNumber(y.sellPercent,2,0)+"%</td>"
                            +"<td style='font-weight:bold;color:"+colors+";'>"+formatNumber(n2,2,0)+"%</td>"
                            +"</tr>"
                        rr++;
                    });
                });
            });

		});
	});
	return str1;
}
//获取json对象的length,用于合并单元格
function getJsonLength(jsonData) {  
	var length=0;  
	for(var ever in jsonData) {  
	    length++;  
	}  
	return length;  
}  
//通用ajax方法  请求的接口的地址ajaxReq  1564
function ajaxReq(urlSuffix,jsonData,func) {
    console.log('---ajax正在请求----');
	$.ajax({
		 url: basepath+"/SalesReached/" + urlSuffix,
         type:"POST",
         contentType:'application/json;charset=utf-8',
         dataType:"json",
         data:JSON.stringify(jsonData),
		 success: function(data) {
             console.log('---AJAX请求成功----');
			 func(data);
		 },
		 error:function(){
			 //alert("数据查询错误");
			 //$("#hide1").remove();
			 //$("#hide2").remove();
			 //$("#hide3").remove();
		 }
	});
}

//地图的每一项点击事件，点击每一个区域然后当月的折前的收入进度
//和重点产品的和新品的收入跟着进行更新
myChart3.on('click', function (params) {
    //重点产品的加号的data点击地图前移除
    $(".add_zp").removeAttr("add_zp_data");
	loadHide1("h_rightB","hide3");
	bigAreaMapName = params.name;
	console.log(bigAreaMapName);
    var time = $("#startTime").val();
	var isName = $("#sr_typeselect").val();
	var isZQ = isName=="折前收入" ? "true":"false";
	if(businessMapName == ""){
		businessMapName = "液态奶事业部";
	}
	var jsondata3={
			"day":time,
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName
	};
	getRightBottom(jsondata3,isName);
});


 