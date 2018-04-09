//获取日期
var now = new Date();
var nowMonth = now.getMonth()+1-1;
var nowYear = now.getFullYear();
if(nowMonth<10){
    nowMonth="0"+nowMonth;
}
var time =nowYear + "-" + nowMonth;
time = "2017-12";
//选择的日期
$("#startTime").val(time);
//右侧的显示
$(".newyearday").text(time.split("-")[0]+"年"+time.split("-")[1]+"月");



//定义echar 插件到页面

//左侧的柱状图 main 各事业部收成情况
var myChart = echarts.init(document.getElementById('main'));

//main2当年全部折前收入进度 main2
var myChart2 = echarts.init(document.getElementById('main2'));

//地图的显示
var myChart3 = echarts.init(document.getElementById('main_map'));

//柱状图的全部数据
var x1 =  ["冷饮事业部","奶粉事业部","液态奶事业部","电商","酸奶事业部"];
var y1_data1 = ["0","0","0","0","0"];
var y1_data2 = ["0","0","0","0","0"];
var max_y = 100;
myChart.setOption(getJson(x1,y1_data1,y1_data2,max_y));

//条形图的全部的数据
var x_data =  ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];
var y_total_data = ["0","0","0","0"];
var y_budget_data = ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"];
var y_future_data = ["0","0","0"];
var a = "0",b="0";
myChart2.setOption(getJson2(x_data,y_total_data,y_budget_data,y_future_data,"全部","折前收入",0,0));

//地图
$.get(basepath+'/web/json/china.json', function (chinaJson) {
    echarts.registerMap('china', chinaJson);
    myChart3.setOption(getJson3("液态奶事业部",[],[]),true);
});
//chart设置自适应
setTimeout(function () {
    window.onresize = function () {
        myChart.resize();
        myChart2.resize();
        myChart3.resize();
    }
}, 1);


//页面初始化加载数据
init();

//初始化页面的函数
function init(){
    //loading
	loadHide1("h_top","hide1");
	loadHide1("h_middle","hide2");
	loadHide1("h_bottom","hide3");


	var jsondata1 = { 
			"year":time.split("-")[0],
		    "month": time.split("-")[1]
		}
	getxsdc(jsondata1);
	var jsondata2 = {
			"year":time.split("-")[0],
		    "month": time.split("-")[1],
			"businessMapName":"液态奶事业部"
	}
	getMap(jsondata2);
	var jsondata3={
			"year":time.split("-")[0],
		    "month": time.split("-")[1],
			"isZQ":"true",
			"businessMapName":"",
			"bigAreaMapName":""
	}
	getRightBottom(jsondata3,"折前收入");
}
var businessMapName = "",bigAreaMapName="";

function getxsdc(jsonData){
	ajaxReq("getxsdc",jsonData,function(data) {
		//基本数据
        $(".monthGrossIncome").text(formatNumber(data.monthZQIncome,2,0)+"亿");
        $(".monthLadgerIncome").text(formatNumber(data.monthZMIncome,2,0)+"亿");
        $(".monthGrossLv").text(formatNumber(data.monthZQIncomeCompletePercent,2,0) + "%");
        $(".monthGrossLv").parent("p").css("background-color",bgColor2(data.monthZQIncomeCompletePercent));
        $(".monthLadgerLv").text(formatNumber(data.monthZMIncomeCompletePercent,2,0) + "%");
        $(".monthLadgerLv").parent("p").css("background-color",bgColor2(data.monthZMIncomeCompletePercent));
        $(".yearGrossIncome").text(formatNumber(data.yearZQIncome,2,0)+"亿");
        $(".yearLadgerIncome").text(formatNumber(data.yearZMIncome,2,0)+"亿");
        $(".yearGrossLv").text(formatNumber(data.yearZQIncomeCompletePercent,2,0) + "%");
        $(".yearGrossLv").parent("p").css("background-color",bgColor2(data.yearZQIncomeCompletePercent));
        $(".yearLadgerLv").text(formatNumber(data.yearZMIncomeCompletePercent,2,0) + "%");
        $(".yearLadgerLv").parent("p").css("background-color",bgColor2(data.yearZMIncomeCompletePercent));
        //各事业部折前收入指标
        var businessIncome = data.businessIncomeCompleteMap;            
        var tiao1=[],tiao2=[],tiao3=[],tiao4=[];
        $.each(businessIncome,function(k,v){
        	tiao1.push(v.monthZQIncome);
        	tiao2.push(v.yearZQIncome);
        	tiao3.push(v.monthZMIncome);
        	tiao4.push(v.yearZMIncome);            	
        });
        var tiaomax1 = Math.max.apply(null,tiao1);
        var tiaomax2 = Math.max.apply(null,tiao2);
        var tiaomax3 = Math.max.apply(null,tiao3);
        var tiaomax4 = Math.max.apply(null,tiao4);
        var x1=[],y1_data1=[],y1_data2=[];
        var str1_1='',str1_2="";
        $.each(businessIncome,function(k,v){
        	//各事业部收成情况  (条形图)
        	x1.push(v.bG_NAME);
        	y1_data1.push(formatNumber(v.monthZQIncomeCompletePercent,1,0));
        	y1_data2.push(formatNumber(v.monthZMIncomeCompletePercent,1,0));            	
        	//各事业部折前收入指标
        	var color1 = bgColor2(v.monthZQIncomeCompletePercent);            	
        	var color2 = bgColor2(v.yearZQIncomeCompletePercent);
        	var imgs1 = v.monthZQIncomeIncreasePercent >=0 ? "up":"down"
        	var imgs2 = v.yearZQIncomeIncreasePercent>=0 ? "up":"down"
        	var width1 = tiaomax1 === 0 ? 0 : (v.monthZQIncome/tiaomax1)*100 ;
        	var width2 = tiaomax2 === 0 ? 0 : (v.yearZQIncome/tiaomax2)*100 ;
        	str1_1+='<tr>'
						+'<td onclick="cause_click($(this),"1")">'+v.bG_NAME+'</td>'
						+'<td><span class="table_bg4A7EBE" style="width:'+width1+'%;"></span>'+formatNumber(v.monthZQIncome,1,1)+'</td>'
						+'<td style="text-align:center;font-weight:bold;color:'+color1+';">'+formatNumber(v.monthZQIncomeCompletePercent,2,0)+'%</td>'
						+'<td style="text-align:center;">'+formatNumber(v.monthZQIncomeIncreasePercent,1,0)+'%<img src="../img/'+imgs1+'.png" alt="" height="20px" style="vertical-align: top;"></td>'
						+'<td><span class="table_bg4A7EBE" style="width:'+width2+'%;"></span>'+formatNumber(v.yearZQIncome,1,0)+'</td>'
						+'<td style="text-align:center;font-weight:bold;color:'+color2+';">'+formatNumber(v.yearZQIncomeCompletePercent,2,0)+'%</td>'
						+'<td style="text-align:center;">'+formatNumber(v.yearZQIncomeIncreasePercent,1,0)+'%<img src="../img/'+imgs2+'.png" alt="" height="20px" style="vertical-align: top;"></td>'
					+'</tr>';  
        	//各事业部账面收入指标
        	var color3 = bgColor2(v.monthZMIncomeCompletePercent);            	
        	var color4 = bgColor2(v.yearZMIncomeCompletePercent);
        	var imgs3 = v.yearZMIncomeCompletePercent >=0 ? "up":"down";
        	var imgs4 = v.yearZMIncomeIncreasePercent>=0 ? "up":"down";
        	var width3 = tiaomax3 === 0 ? 0 : (v.monthZMIncome/tiaomax3)*100 ;
        	var width4 = tiaomax3 === 0 ? 0 : (v.yearZMIncome/tiaomax4)*100 ;
        	str1_2+='<tr>'
						+'<td onclick="cause_click($(this),"1")">'+v.bG_NAME+'</td>'
						+'<td><span class="table_bg4A7EBE" style="width:'+width3+'%;"></span>'+formatNumber(v.monthZMIncome,1,1)+'</td>'
						+'<td style="text-align:center;font-weight:bold;color:'+color3+';">'+formatNumber(v.monthZMIncomeCompletePercent,2,0)+'%</td>'
						+'<td style="text-align:center;">'+formatNumber(v.monthZMIncomeIncreasePercent,1,0)+'%<img src="../img/'+imgs3+'.png" alt="" height="20px" style="vertical-align: top;"></td>'
						+'<td><span class="table_bg4A7EBE" style="width:'+width4+'%;"></span>'+formatNumber(v.yearZMIncome,1,0)+'</td>'
						+'<td style="text-align:center;font-weight:bold;color:'+color4+';">'+formatNumber(v.yearZMIncomeCompletePercent,2,0)+'%</td>'
						+'<td style="text-align:center;">'+formatNumber(v.yearZMIncomeIncreasePercent,1,0)+'%<img src="../img/'+imgs4+'.png" alt="" height="20px" style="vertical-align: top;"></td>'
					+'</tr>';
        	
        });
        $("#d_zqsrzb tbody").html(str1_1);
        $(".d_zmsr tbody").html(str1_2);
        //各事业部收成情况  (条形图)
        var max_y=Math.max.apply(null,y1_data1.concat(y1_data2));
        max_y = 100 > max_y ? 100 : null;
        myChart.setOption(getJson(x1,y1_data1,y1_data2,max_y));
        $("#hide1").remove();
        $("#hide2").remove();
	});
}


//获取地图
function getMap(jsonData){
	ajaxReq("getMap",jsonData,function(data) {
		var datas = [],datas2=[];
		$.each(data.map,function(k,v){
			var jsons = {
					"name":v.areaName,
					"value":v.areaZQIncomeCompletePercent
			}
			datas.push(jsons);
			var jsons2 = {
					"name":v.areaName,
					"value":v.areaZQIncome
			}
			datas2.push(jsons2);
		});
		myChart3.clear();
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
		$.get(basepath+'/web/'+json+'/china.json', function (chinaJson) {
		    echarts.registerMap('china', chinaJson);
		    myChart3.setOption(getJson3(b_name,datas,datas2),true);
		});
	});
}
//获取右下角数据
/*
 * time   选择的日期
 * isZQ   是否是折前收入"true" or "false"
 * isName "折前收入" or "账面收入"
 * businessMapName   事业部名称  若为空   则默认全部
 * */
function getRightBottom(jsonData,isZQ_name){
	ajaxReq("getRightBottom",jsonData,function(data) {
		
		 if(jsonData.businessMapName == ""){
			 jsonData.businessMapName = "全部";
		}
		$(".businessMapName").text(jsonData.businessMapName);
 	   //当月全部折前收入进度(折线图)
        var x_data=[],y_total_data=[],y_budget_data=[],y_future_data=[];
        $.each(data.monthData.monthMap,function(k,v){
        	x_data.push(v.month);
        	y_total_data.push(formatNumber(v.incomeShouldCompletePercent,1,0));//应达成进度
        	y_budget_data.push(formatNumber(v.incomeCompletePercent,1,0));//实际达成进度
        	var b={"value":formatNumber(v.monthIncomeCompletePercent,1,0),itemStyle:{color:bgColor2(v.monthIncomeCompletePercent)}};
        	y_future_data.push(b);//折前dachenglv
        });
        var a = formatNumber(data.monthData.yearIncomeShouldCompletePercent,2,0), b = formatNumber(data.monthData.yearIncomeCompletePercent,2,0);            
        myChart2.setOption(getJson2(x_data,y_total_data,y_budget_data,y_future_data,isZQ_name,jsonData.businessMapName,a,b));
        
        //全部重点产品折前收入
        $(".d_month1").text(data.zpxp.monthMainProductCompletePercent+"%");
        var arr_zp=[];
        $.each(data.zpxp.businessZPBeanMap,function(k,v){
        	arr_zp.push(v.monthLJIncome)
        });
        var max_zp = Math.max.apply(null,arr_zp);
        var str2_1="";
        $.each(data.zpxp.businessZPBeanMap,function(k,v){
        	var color = bgColor2(v.monthCompletePercent);
        	var imgs = v.monthIncreasePercent >=0 ? "up":"down";
        	var width = max_zp === 0 ? 0 : (v.monthLJIncome/max_zp)*100 ;
        	str2_1+='<tr>'
							+'<td onclick="cause_click($(this),"1")">'+v.bgName+'</td>'
							+'<td class="hide">0</td>'
							+'<td><span class="table_bg4A7EBE" style="width:'+width+'%;"></span>'+formatNumber(v.monthLJIncome,1,1)+'</td>'
							+'<td>'+formatNumber(v.sellPercent,2,0)+'%</td>'
							+'<td style="font-weight:bold;color:'+color+';">'+formatNumber(v.monthCompletePercent,2,0)+'%</td>'
							+'<td>'+formatNumber(v.monthIncreasePercent,1,0)+'%<img src="../img/'+imgs+'.png" alt="" height="20px" style="vertical-align: top;"></td>'
						+'</tr>'
        });
        $(".d_zdcpT tbody").html(str2_1);
        //全部新品折前收入
        $(".d_month2").text(data.zpxp.monthNewProductCompletePercent+"%");
        var arr_xp=[];
        $.each(data.zpxp.businessZPBeanMap,function(k,v){
        	arr_xp.push(v.monthLJIncome)
        });
        var max_xp = Math.max.apply(null,arr_xp);
        var str2_2="";
        $.each(data.zpxp.businessXPBeanMap,function(k,v){
        	var color = bgColor2(v.monthCompletePercent);
        	var width = max_xp === 0 ? 0 : (v.monthLJIncome/max_xp)*100 ;
        	str2_2+='<tr>'
							+'<td onclick="cause_click($(this),"1")">'+v.bgName+'</td>'
							+'<td class="hide">0</td>'
							+'<td><span class="table_bg4A7EBE" style="width:'+width+'%;"></span>'+formatNumber(v.monthLJIncome,1,1)+'</td>'
							+'<td>'+formatNumber(v.sellPercent,2,0)+'%</td>'
							+'<td style="font-weight:bold;color:'+color+';">'+formatNumber(v.monthCompletePercent,2,0)+'%</td>'
						+'</tr>'
        });
        $(".d_xpT tbody").html(str2_2);
		$("#hide3").remove();
	});
}
$("#sr_typeselect").on("change",function(){
	loadHide1("h_rightL","hide3");
	var times=$("#startTime").val(),isZQ='';
	var isName = $("#sr_typeselect").val();
	var isZQ = isName=="折前收入" ? "true":"false";
	var jsondata3={
			"year":times.split("-")[0],
		    "month": times.split("-")[1],
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName
	}
	getRightBottom(jsondata3,isName);
});
//选择日期查询数据
var times1 = $("#startTime").val();
$("#startTime").off("click").on("click",function(){    
    var that = $(this);
    WdatePicker({
    	dateFmt: 'yyyy-MM',
        maxDate:'%y-{%M-1}',
        isShowClear: false,
        isShowToday:false,
        readOnly:true,
        onpicked:function(){
            var times=that.val();
            if(times != times1){
            	loadHide1("h_top","hide1");
            	loadHide1("h_middle","hide2");
            	loadHide1("h_bottom","hide3");
            	$(".newyearday").text(times.split("-")[0]+"年"+times.split("-")[1]+"月");
            	//获取基本数据
            	var jsondata1 = { 
            			"year":times.split("-")[0],
            		    "month": times.split("-")[1]
            			}
            	getxsdc(jsondata1);
            	//获取地图数据
            	var jsondata2 = {
            			"year":times.split("-")[0],
            		    "month": times.split("-")[1],
            			"businessMapName":businessMapName
            	}
            	if(jsondata2.businessMapName==""){
            		jsondata2.businessMapName="液态奶事业部";
            	}
            	getMap(jsondata2);
            	//获取右下角数据
            	var isName = $("#sr_typeselect").val();
            	var isZQ = isName=="折前收入" ? "true":"false";
            	var jsondata3={
            			"year":times.split("-")[0],
            		    "month": times.split("-")[1],
            			"isZQ":isZQ,
            			"businessMapName":businessMapName,
            			"bigAreaMapName":bigAreaMapName
            	}
            	getRightBottom(jsondata3,isName);
                times1 = times;
            }            
        }
    });     
});

/*
 * 各事业部收成情况--条形图
 * x1   x轴data
 * y1   
 * */
function getJson(x1,y1_data1,y1_data2,max_y){
	var option = {
            title: {
                text: '各事业部收成情况',
                textStyle: {
                    color: '#fff',
                    fontSize:15
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
                    }  
                   return relVal;  
                }  
            },
            legend: {
//                data: ['折前达成进度', '账面达成进度'],
                textStyle: {
                    color: ['#fff']
                },
                itemWidth: 12,
                itemHeight: 12,
                y: 'bottom',
                x: 'left',
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
                data: x1,
                triggerEvent:true,
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
                    fontSize:11
                },
                clickable: {//x轴文字是否可以点击
                    show: true,
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
                max:max_y,
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
                        color: '#fff',
                        fontSize:11
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
                    data: y1_data1
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
                    data: y1_data2,
                    markLine: {
                        symbol:"circle",
                        symbolSize:0,
                        lineStyle:{
                            color:"#edc948",
                            width:2,
                            type:"solid"
                        },
                         data: [
                             // {type: 'average', name: '平均值'},
                             {name: '标注1',symbolSize:0, yAxis: 100,label:{show:true,position:"end",formatter:"{c}%"}}
                        ]
                     } 
                },
            ],
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            color: '#fff',
                            fontSize:11
                        }
                    },
                },
                emphasis:{show:false}
            }
        }
	return option;
}



function getJson2(x_data,y_total_data,y_budget_data,y_future_data,isName,businessMapName,yd,sd){	
  var option2 = {
        title: {
            text: "当年"+businessMapName+isName+"进度  应达成进度:{a|"+yd+"%}  实际达成进度:{a|"+sd+"%}",
            textStyle: {
                color: '#fff',
                fontSize:16,                
                rich:{
                	a: {
                        color: '#ffaa00',
                        fontSize:15,
                        fontWeight:700
                    }
                }
            },            
            padding: 30,
        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params){  
                var relVal = params[0].name;  
                for (var i = 0, l = params.length; i < l; i++) {  
                     relVal += '<br/>' + params[i].marker +  params[i].seriesName + ' : ' + params[i].value+"%";  
                 }  
                return relVal;  
             }
        },
        legend: {
        	icon:'rect',
            data: ['应达成进度', '实际达成进度'],
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
            // boundaryGap: false,
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
                interval: 0,
                fontSize:11
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
            axisLabel: {//y轴文字
            	textStyle: {
                    color: '#fff',
                    fontSize:11
                },
                interval: 0,
                formatter: '{value}%',
            },
            splitLine: { //分隔线
                show: false,
            }
        },
        series: [{
                name: '月度折前达成率',
                type: 'bar',
                legend: {
                    show:false
                },
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width:"50%",
                            color: '#59a14f'
                        },
                        color: '#59a14f'
                    }
                },
                data: y_future_data
            },{
                name: '实际达成进度',
                type: 'line',
                //stack: '总量',
                symbol:'circle',
                smooth:true,
                label:{
                	show:true,
                	color:"#fff"
                },
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#f28e2b',
                            width:8
                        },
                        color: '#f28e2b'
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                data: y_budget_data
            },{
                name: '应达成进度',
                type: 'line',
                //stack: '总量',
                symbol:'circle',
                smooth:true,
                label:{
                	show:false
                },
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width:3,
                            color: '#76b7b2'
                        },
                        color: '#76b7b2'
                    }
                },
                data:y_total_data 
            }
        ]
    };
    return option2;
}

function getJson3(name,data,data2){
	var option3 = {
	        title: {
	            text: name+'大区折前收入达成', //'液态奶事业部折前收入',
	            x: 'left',
	            textStyle: {
	                color: '#fff',
	                fontSize:16
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
					{end: 95.99999, label: '96%>达成率', color: '#E15658'},
					{start: 95.99999, end: 99.99999, label: '96%<=达成率<100%', color: '#EDC948'},
					{start: 99.99999,label: '达成率>=100%', color: '#58A14E'}
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
	                        		res+='折前剔税收入：'+formatNumber(data2[k].value,2,1)+'<br />'
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
	            data: data/*[                
	                {name:"东北",value:73},
	                {name:"京津",value:98},
	                {name:"河南",value:95.6},
	                {name:"山东",value:99},
	                {name:"西南",value:101},
	                {name:"西北",value:100},
	                {name:"晋冀蒙",value:73}
	               ]*/
	        }]
	    }
	return option3;
}
//重点产品下钻
$(".T_zd").on("click",".add_zp",function(){
	loadHide1("h_zp","hide4");
	var timess = $("#startTime").val();
	var isName = $("#sr_typeselect").val();
	var isZQ = isName=="折前收入"?"true":"false";
	var jsonData = {
			"year":timess.split("-")[0],
		    "month": timess.split("-")[1],
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName,
			"isMainProduct":"true"
	}
	var that = $(this);
	ajaxReq("getProductByBusinessName",jsonData,function(data) {
		var head_str = "<tr>" 
			+"<th><span class='remove_zp'>-</span></th>"
			+"<th><span class='add_zp_sku'>+</span></th>"
			+"<th>月折前收入</th>"
			+"<th>销售占比</th>"
			+"<th>月折前达成进度</th>"
			+"<th>月增长</th>"
		+"</tr>"
		$(".T_zd thead").html(head_str);
		$(".d_zdcpT tbody").html(getStr1(data));
		$("#hide4").remove();
		//获取sku
		$(".T_zd").on("click",".add_zp_sku",function(){
			loadHide1("h_zp","hide4");
			var thats = $(this);	
			$(".d_zdcpT tbody").html("");
			ajaxReq("getSkuByProductName",jsonData,function(data) {
				var head_str1 = "<tr>" 
					+"<th><span class='remove_zp'>-</span></th>"
					+"<th><span class='remove_zp_sku'>-</span></th>"
					+"<th></th>"
					+"<th>月折前收入</th>"
					+"<th>销售占比</th>"
					+"<th>月折前达成进度</th>"
					+"<th>月增长</th>"
				+"</tr>"
				$(".T_zd thead").html(head_str1);							
				$(".d_zdcpT tbody").html(getstr2(data));
				$("#hide4").remove();
			});
		});			
	});
});

$(".T_zd").on("click",".remove_zp_sku",function(){
	loadHide1("h_zp","hide4");
	var timess = $("#startTime").val();
	var isName = $("#sr_typeselect").val();
	var isZQ = isName=="折前收入"?"true":"false";
	var jsonData = {
			"year":timess.split("-")[0],
		    "month": timess.split("-")[1],
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName,
			"isMainProduct":"true"
	}
	ajaxReq("getProductByBusinessName",jsonData,function(data) {
		var head_str = "<tr>" 
			+"<th><span class='remove_zp'>-</span></th>"
			+"<th><span class='add_zp_sku'>+</span></th>"
			+"<th>月折前收入</th>"
			+"<th>销售占比</th>"
			+"<th>月折前达成进度</th>"
			+"<th>月增长</th>"
		+"</tr>"
		$(".T_zd thead").html(head_str);
		$(".d_zdcpT tbody").html(getStr1(data));
		$("#hide4").remove();
	});
});
$(".T_zd").on("click",".remove_zp",function(){
	loadHide1("h_zp","hide4");
	var timess = $("#startTime").val();
	var isName = $("#sr_typeselect").val();
	var isZQ = isName=="折前收入"?"true":"false";
	var jsonData = {
			"year":timess.split("-")[0],
		    "month": timess.split("-")[1],
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName,
			"isMainProduct":"true"
	}
	var head_str1 = "<tr>" 
					+"<th><span class='add_zp'>+</span></th>"
					+"<th>月折前收入</th>"
					+"<th>销售占比</th>"
					+"<th>月折前达成进度</th>"
					+"<th>月增长</th>"
				+"</tr>"
	$(".T_zd thead").html(head_str1);
	ajaxReq("getRightBottom",jsonData,function(data){
		 if(jsonData.businessMapName == ""){
			 jsonData.businessMapName = "全部";
		 }
		 $(".businessMapName").text(jsonData.businessMapName);
		 $(".isName").text(isName);
		 //全部重点折前收入
		 $(".d_zdcpsr").text(data.zpxp.monthMainProductCompletePercent+"%");
		 var tiaos1=[];
         $.each(data.zpxp.businessZPBeanMap,function(k,v){
        	tiaos1.push(v.monthLJIncome);         	
         });
         var tiaomaxs1 = Math.max.apply(null,tiaos1);
        	var str_head1 = '<tr>'
								+'<th>事业部名称<span class="add_zp">+</span></th>'
								+'<th class="hide">SKU</th>'
								+'<th>月折前收入</th>'
								+'<th>销售占比</th>'
								+'<th>月折前达成进度</th>'
								+'<th>月增长</th>'
							+'</tr>'
			$(".d_zdcpT thead").html(str_head1);					
			var str_zdcp = "";
			$.each(data.zpxp.businessZPBeanMap,function(k,v){
				var widths = tiaomaxs1 === 0 ? 0 : (v.monthLJIncome/tiaomaxs1)*100 ;
				var imgs = v.monthIncreasePercent < 0 ? "down" : "up";
				var color = bgColor2(v.monthCompletePercent);
				str_zdcp += '<tr>'
								+'<td onclick="cause_click($(this),"1")">'+v.bgName+'</td>'
								+'<td class="hide">0</td>'
								+'<td><span class="table_bg4A7EBE" style="width:'+widths+'%;"></span>'+formatNumber(v.monthLJIncome,1,1)+'</td>'
								+'<td>'+formatNumber(v.sellPercent,2,0)+'%</td>'
								+'<td style="font-weight:bold;color:'+color+';">'+formatNumber(v.monthCompletePercent,2,0)+'%</td>'
								+'<td>'+formatNumber(v.monthIncreasePercent,1,0)+'%<img src="../img/'+imgs+'.png" alt="" height="20px" style="vertical-align: top;"></td>'
							+'</tr>'
			});
			$(".d_zdcpT tbody").html(str_zdcp);
			$("#hide3").remove();
			$("#hide4").remove();
    });
});
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
	var max_n1 = Math.max.apply(null,arr_width);
	var str="";
	$.each(data,function(k,v){
		$.each(v,function(m,n){
			$.each(n,function(s,t){
				var ss = 0;
				str +="<tr><td rowspan='"+getJsonLength(t)+"'>"+s+"</td>"			
				$.each(t,function(o,p){
					if(ss!=0){
						str+="<tr>"
					}
					var n1 = p.monthIncome,n2 = p.monthCompletePercent,n3 = p.monthIncreasePercent;
					var widths =  max_n1<=0 ? "0":(n1/max_n1)*100;
					var colors = bgColor2(n2);
					var imgs = n3<0 ? "down" : "up"; 
					str+="<td>"+o+"</td>"
						+"<td style='text-align:left;'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(n1,1,1)+"</td>"
						+"<td>"+formatNumber(p.sellPercent,2,0)+"%</td>"
						+"<td style='font-weight:bold;color:"+colors+";'>"+formatNumber(n2,2,0)+"%</td>"
						+"<td>"+formatNumber(n3,1,0)+"%<img src='../img/"+imgs+".png' alt='' height='20px' style='vertical-align: top;'/></td>"
						+"</tr>"
					ss++;
				});				
			});
		});
	});	
	return str;
}
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
						var colors = bgColor2(n2);
						var imgs = n3<0 ? "down" : "up"; 
						str1+="<td title='"+x+"' style='width:250px;text-align:left;'>"+x+"</td>"
							+"<td align='left'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(n1,1,1)+"</td>"
							+"<td>"+formatNumber(y.sellPercent,2,0)+"%</td>"
							+"<td style='font-weight:bold;color:"+colors+";'>"+formatNumber(n2,2,0)+"%</td>"
							+"<td>"+formatNumber(n3,1,0)+"%<img src='../img/"+imgs+".png' alt='' height='20px' style='vertical-align: top;'/></td>"
							+"</tr>"				
						rr++;
					});
				});
			});
		});
	});
	return str1;
}
//新品下钻
$(".T_xp").on("click",".add_xp",function(){
	loadHide1("h_xp","hide4");
	var timess = $("#startTime").val();
	var isName = $("#sr_typeselect").val();
	var isZQ = isName=="折前收入"?"true":"false";
	var jsonData = {
			"year":timess.split("-")[0],
		    "month": timess.split("-")[1],
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName,
			"isMainProduct":"false"
	}
	var that = $(this);
	ajaxReq("getProductByBusinessName",jsonData,function(data) {
		var head_str = "<tr>" 
					+"<th><span class='remove_xp'>-</span></th>"
					+"<th><span class='add_xp_sku'>+</span></th>"
					+"<th>月折前收入</th>"
					+"<th>销售占比</th>"
					+"<th>月折前达成进度</th>"
				+"</tr>"
		$(".T_xp thead").html(head_str);
		$(".d_xpT tbody").html(getStr3(data));
		$("#hide4").remove();
		//获取sku
		$(".T_xp").on("click",".add_xp_sku",function(){
			loadHide1("h_xp","hide4");
			var thats = $(this);	
			$(".d_xpT tbody").html("");		
			ajaxReq("getSkuByProductName",jsonData,function(data) {
				var head_str1 = "<tr>" 
							+"<th><span class='remove_xp'>-</span></th>"
							+"<th><span class='remove_xp_sku'>-</span></th>"
							+"<th></th>"
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
//新品下钻一级
$(".T_xp").on("click",".remove_xp_sku",function(){
	loadHide1("h_xp","hide4");
	var timess = $("#startTime").val();
	var isName = $("#sr_typeselect").val();
	var isZQ = isName=="折前收入"?"true":"false";
	var jsonData = {
			"year":timess.split("-")[0],
		    "month": timess.split("-")[1],
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName,
			"isMainProduct":"false"
	}
	ajaxReq("getProductByBusinessName",jsonData,function(data) {
		var head_str = "<tr>" 
			+"<th><span class='remove_xp'>-</span></th>"
			+"<th><span class='add_xp_sku'>+</span></th>"
			+"<th>月折前收入</th>"
			+"<th>销售占比</th>"
			+"<th>月折前达成进度</th>"
		+"</tr>"
		$(".T_xp thead").html(head_str);
		$(".d_xpT tbody").html(getStr3(data));
		$("#hide4").remove();
	});
});
$(".T_xp").on("click",".remove_xp",function(){
	loadHide1("h_xp","hide4");
	var timess = $("#startTime").val();
	var isName = $("#sr_typeselect").val();
	var isZQ = isName=="折前收入"?"true":"false";
	var jsonData = {
			"year":timess.split("-")[0],
		    "month": timess.split("-")[1],
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName,
			"isMainProduct":"false"
	}
	var head_str1 = "<tr>" 
			+"<th><span class='add_zp'>+</span></th>"
			+"<th>月折前收入</th>"
			+"<th>销售占比</th>"
			+"<th>月折前达成进度</th>"
		+"</tr>"
	$(".T_xp thead").html(head_str1);
	ajaxReq("getRightBottom",jsonData,function(data){
		 if(jsonData.businessMapName == ""){
			 jsonData.businessMapName = "全部";
		}
		$(".businessMapName").text(jsonData.businessMapName);
		$(".isName").text(isName);		
		//全部新品折前收入
		$(".d_xpsr").text(data.zpxp.monthNewProductCompletePercent+"%");
		var tiaos2=[];
        $.each(data.zpxp.businessXPBeanMap,function(k,v){
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
			$.each(data.zpxp.businessXPBeanMap,function(k,v){
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
				str +="<tr><td rowspan='"+getJsonLength(t)+"'>"+s+"</td>"			
				$.each(t,function(o,p){
					if(ss!=0){
						str+="<tr>"
					}
					var n1 = p.monthIncome,n2 = p.monthCompletePercent;
					var widths =  max_n1<=0 ? "0":(n1/max_n1)*100;
					var colors = bgColor2(n2);
					str+="<td>"+o+"</td>"
						+"<td style='text-align:left;'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(n1,1,1)+"</td>"
						+"<td>"+formatNumber(p.sellPercent,2,0)+"%</td>"
						+"<td style='font-weight:bold;color:"+colors+";'>"+formatNumber(n2,2,0)+"%</td>"
						+"</tr>"
					ss++;
				});
				
			});							
			
		});
	});	
	return str;
}
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
						var colors = bgColor2(n2);
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
//获取json对象的length
function getJsonLength(jsonData) {  
	var length=0;  
	for(var ever in jsonData) {  
	    length++;  
	}  
	return length;  
} 
//通用ajax方法
function ajaxReq(urlSuffix,jsonData,func) {	
	//$("#Mask").show();
	$.ajax({
		 url: basepath+"/MonthXSDCServlet/" + urlSuffix,
		 data: jsonData,
		 //dataType: "JSON",
		 type: "post",
		 success: function(data) {
			 func(data);			 
		 },
		 error:function(){
			 alert("数据查询错误");
			 $("#shade").remove();
		 }
	});
};

//地图点击事件
myChart3.on('click', function (params) {
	loadHide1("h_rightB","hide3");
	bigAreaMapName = params.name;
    var time = $("#startTime").val();
	var isName = $("#sr_typeselect").val();
	var isZQ = isName=="折前收入" ? "true":"false";
	if(businessMapName==""){
		businessMapName = "液态奶事业部";
	}
	var jsondata3={
			"year":time.split("-")[0],
		    "month": time.split("-")[1],
			"isZQ":isZQ,
			"businessMapName":businessMapName,
			"bigAreaMapName":bigAreaMapName
	}
	getRightBottom(jsondata3,isName);
});
//点击柱状图x轴标签
myChart.on('click', function (params) {
	 loadHide1("h_bottom","hide3");
	 if(params.componentType == "xAxis"){  
		var time = $("#startTime").val();
		var isName = $("#sr_typeselect").val();
		var isZQ = isName=="折前收入" ? "true":"false";
		businessMapName = params.value;
		var jsondata3={
				"year":time.split("-")[0],
			    "month": time.split("-")[1],
				"isZQ":isZQ,
				"businessMapName":businessMapName,
				"bigAreaMapName":""
		}
		getRightBottom(jsondata3,isName);
		var jsondata2={
				"year":time.split("-")[0],
			    "month": time.split("-")[1],
				"isZQ":isZQ,
				"businessMapName":businessMapName
		}
		getMap(jsondata2);
	 }
}); 