//获取日期
var now = new Date();
var nowMonth = now.getMonth()+1-1;
var nowYear = now.getFullYear();
if(nowMonth<10){
    nowMonth="0"+nowMonth;
}
var time = nowYear + "-" + nowMonth;
time = "2017-12"; // 暂时将默认数据呈现为 2017年12月  正式运行后删除此段代码
$("#startTime").val(time);
//选择日期查询数据
$("#startTime").off("click").on("click",function(){
    var that = $(this);
    WdatePicker({
        dateFmt: 'yyyy-MM',
        maxDate:'%y-{%M-1}',
        isShowClear: false,
        onpicked:function(){
            var times = that.val();
            if (times != time) {
                loadHide1("h_body","hide1");
                time = times;
                setDataJson({ year: times.split("-")[0], month: times.split("-")[1] });
                getData1();
                getData2(true);
            }
        }
    });
});

// 安慕希 整体收入三年增长趋势
var myChart1 = echarts.init(document.getElementById('eBar1'));
option1 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
        	return "年月 ：" + params[0].name +"<br/>折前销售收入(万元)： " + formatNumber(params[0].value,2,1) 
        		+ "<br/>折前销售收入增长率：" + formatNumber(params[1].value[1],2,0) + "%";
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top:"8%",
        containLabel: true,
    },
    xAxis: [{
        show: true,
        type: 'category',
        data: ["201601","201602","201603","201604","201605","201606","201607","201608"],
        boundaryGap : true, 
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
            rotate:-90
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
            show:false,
            lineStyle: {
                color: '#fff'
            }
        },
        clickable: {//x轴文字是否可以点击
            show: true,
        },
        axisTick: {//y轴小标记不显示
            show: false,
        },
        axisLabel: {//y轴文字
            show:false,
            textStyle: {
                color: '#fff'
            },
            interval: 0,
            formatter: '{value}%'
        },
        splitLine: {//分隔线
            show: true
        },
        splitNumber:4
    },{
        type: 'value',
        name: '温度',
        min: 0,
        max: 100,
        axisLabel: {
        	show:false,
            textStyle: {
                color: '#fff'
            },
            interval: 0,
            formatter: '{value}%'
        },
        splitLine: {//分隔线
            show: false
        }
    }],
    series: [
        {
            name: '1',
            type: 'bar',
            barWidth:"50%",
            /*label:{
                show:true,
                position:"top",
                color:"#fff",
                formatter:"{c}%"      
            },*/
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#4e79a7'
                    },
                    color: '#4e79a7'
                }
            },
            data: ["0","0","0","0","0","0","0","0"],
            markPoint : {
                symbol:"line",
                symbolSize:1,
                label:{
                    position:"bottom",
                    color:"#fff"
                },
                data : [{
                    type : 'max',
                    name : 'max'
                    },{
                    type : 'min',
                    name : 'min'
                }]
            }
        },{
            name: '2',
            type: 'line',
            symbolSize:5,
            symbol:'circle',
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#005400',
                        width:3
                    },
                    color: '#005400'
                }
            },
            yAxisIndex: 1,
            data: ["0","0","0","0","0","0","0","0"],
            markPoint : {
                symbol:"line",
                symbolSize:1,
                label:{
                    position:"inside",
                    color:"#fff"
                },
                data : [{
                    type : 'max',
                    name : 'max'
                    },{
                    type : 'min',
                    name : 'min'
                }]
            }
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
myChart1.setOption(option1);

//成人常温酸奶 销额同比增长率
var myChart2 = echarts.init(document.getElementById('eBar2'));
option2 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top:"8%",
        containLabel: true,
    },
    xAxis: [{
        show: true,
        boundaryGap : true,
        type: 'category',
        data: ["201601","201602","201603","201604","201605","201606","201607","201608"],
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
            rotate:-90
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
            formatter: '{value}'
        },
        splitLine: {//分隔线
            show: false
        }
    }],
    series: [
        {
            name: '1',
            type: 'bar',
            barWidth:"50%",
            /*label:{
                show:true,
                position:"top",
                color:"#fff",
                formatter:"{c}%"      
            },*/
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#4472c4'
                    },
                    color: '#4472c4'
                }
            },
            data: ["10","20","30","40","50","30","20","10"]
        },{
            name: '2',
            type: 'line',
            symbolSize:5,
            symbol:'circle',
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#005400',
                        width:3
                    },
                    color: '#005400'
                }
            },
            data: ["10","20","30","40","30","20","10","0"],
            markPoint : {
                symbol:"line",
                symbolSize:1,
                label:{
                    position:"inside",
                    color:"#fff"
                },
                data : [{
                    type : 'max',
                    name : 'max'
                    },{
                    type : 'min',
                    name : 'min'
                }]
            }
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
myChart2.setOption(option2);

//安慕希 分渠道趋势
var myChart3 = echarts.init(document.getElementById('eBar3'));
option3 = {
    title:{
        show:false
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        show:false
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top:"6%",
        containLabel: true
    },
    xAxis : [
        {        		
            type : 'category',
            boundaryGap : false,
            data : ['周一','周二','周三','周四']
        }
    ],
    yAxis : [{
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
            formatter: '{value}'
        },
        splitLine: {//分隔线
            show: false
        }
    }],
    series : [
        {
            name:'超市',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[10, 20, 30, 40, 0, 0, 0],
            areaStyle:{
                color:"#893536"
            },
            lineStyle:{
                color:"#e69169",
            }
        },{
            name:'大卖场',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[5, 10, 15, 20, 0, 0, 0],
            areaStyle:{
                color:"#9b734c"
            },
            lineStyle:{
                color:"#e69441",
            }
        },{
            name:'食杂店',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[10, 20, 30, 40, 50, 60, 70],
            areaStyle:{
                color:"#93561a"
            },
            lineStyle:{
                color:"#9eb8c5",
            }
        },{
            name:'',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[10, 70, 80, 90, 50, 30, 40],
            areaStyle:{
                color:"#597081"
            },
            lineStyle:{
                color:"#94bcd7",
            }
        }
    ]
};
myChart3.setOption(option3);
//安慕希 市场占有率
var myChart4 = echarts.init(document.getElementById('eBar4'));
option4 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top:"8%",
        containLabel: true,
    },
    xAxis: [{
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
            formatter: '{value}'
        },
        splitLine: {//分隔线
            show: false
        }
    }],
    yAxis: [{
        show: true,
        type: 'category',
        data: ["安慕希","纯甄"],
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
        }        
    }],
    series: [
        {
            name: '1',
            type: 'bar',
            barWidth:"60%",
            label:{
                show:true,
                color:"#fff",
                position:"right",
                formatter:"{c}%"      
            },
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#4472c4'
                    },
                    color: '#4472c4'
                }
            },
            data: [{value:"40",itemStyle:{ color:"#f28e2b"}},
                   {value:"60",itemStyle:{ color:"#4e79a7"}}],
        },{
            name: '2',
            type: 'bar',
            barWidth:"40%",
            barGap:"-85%",
            label:{
                show:true,
                color:"#fff",
                position:"right",
                formatter:"{c}%"      
            },
            itemStyle: {
                normal: {
                    lineStyle: {
                        width:3
                    }
                }
            },
            data: [{value:"10",itemStyle:{ color:"#b54648"}},
                   {value:"20",itemStyle:{ color:"#005500"}}],
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
myChart4.setOption(option4);
//地图
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
		};
	return option5;
}
//地图
$.get(basepath+'/web/json/china.json', function (chinaJson) {
    echarts.registerMap('china', chinaJson);
    myChart5.setOption(getMapchart([]),true);
});

var dataJson = { 
	year: time.split("-")[0], 
	month: time.split("-")[1], 
	businessName: "液态奶事业部", 
	subbrand: "安慕希",
	isCurrentMonth: "true"
};
loadHide1("h_body","hide1");
var busiData = [];
getData3();
getData1();
getData2(true);

// 提取ajax公用代码
function ajaxReq(urlSuffix, succFun) {
	$.ajax({
		url: "/yiliReport/month/ppzl/" + urlSuffix,
		data: dataJson,
		dataType: "JSON",
		type: "POST",
		success: function(data) {
			succFun(data);
		},
		error: function(){
			alert("数据查询失败");
			$("#hide1").remove();
		}
	});
}

function bgColor3(num) {
	num = parseFloat(num);
	return num >= 0 ? '#58A14E' : '#E15658';
}
// 请求kpi 地图数据  三年增长趋势数据
function getData1() {
	ajaxReq("summary", function(data) {
		// 统计数据
		$(".curr-time").text(data.year+"年"+data.month+"月");
		$(".curr-name").text(data.subbrand+"品牌总览");
		$(".subbrand-name").text(data.subbrand);
		$(".ppzl-summary").each(function(i, r) {
			if (i == 1 || i == 4) {
				$(r).css("background-color", bgColor2(data.summary[i]));
			} else if (i == 2 || i == 5) {
				$(r).css("background-color", bgColor3(data.summary[i]));
			}
			$(r).text(data.summary[i]); 
		});
		//整体收入三年增长趋势
		option1.xAxis[0].data = data.growthTrend[0];
		var data0 = []; data1 = [];
		$.each(data.growthTrend[1], function(i, r) {
			data0[i] = r[1];
			data1[i] = data.growthTrend[2][i];
		});
		option1.series[0].data = data0;
		option1.series[1].data = data1;
		myChart1.setOption(option1);
		$("#hide1").remove()
	});
}

/*
 * 这个请求包含map的数据，参数isLineageMap表示是否联动地图数据 初始加载时 联动地图数据，
 * 调整产品明细选项时  当月/YTD 时，不联动地图数据
 * 地图数据显示未添加
*/
function getData2(isLinkageMap) {
	ajaxReq("income", function(data) {
		//console.log(data);
		if (isLinkageMap) { // 联动地图数据
			//销售收入数据
			$(".sales-reach").text(formatNumber(data.sales[0],2,0)+"%");
			$(".sales-inc").text(formatNumber(data.sales[1],2,0)+"%");
			//地图
			var datas = [],datas1=[];
			$.each(data.salesMap,function(k,v){
				var jsons = {
						"name":v[0],
						"value":Number(v[1])
				};
				datas.push(jsons);
				var jsons1 = {
						"name":v[0],
						"value":Number(v[2])
				};
				datas1.push(jsons1);
			});
			var json = "ynjson";
			if(data.businessName == "液态奶事业部"){
				json = "ynjson";
			}else if(data.businessName == "奶粉事业部"){
				json = "nfjson";
			}else if(data.businessName == "酸奶事业部"){
				json = "snjson";
			}else if(data.businessName == "冷饮事业部"){
				json = "lyjson";
			}else if(data.businessName == "电商"){
				json = "json";
			}
			$.get(basepath+'/web/'+json+'/china.json', function (chinaJson) {
			    echarts.registerMap('china', chinaJson);
			    myChart5.setOption(getMapchart(datas,datas1),true);
			});
		}
		//产品收入明细
		 $("#table2 tr").remove();
		 $.each(data.salesDetail, function(i, r) {
			 var color = bgColor2(r[3]); 
			 var imgs = r[4]<0 ? "down" :"up";
			 var tr = '<tr>'
							+'<td onclick="cause_click($(this),1)">'+ r[0] +'</td>'
							+'<td class="hide">0</td>'
							+'<td>'+ formatNumber(r[1],1,1) +'</td>'
							+'<td>'+ formatNumber(r[2],2,0) +'%</td>'
							+'<td style="color:'+color+'; font-weight: bold;">'+ r[3] +'%</td>'
							+'<td>'+ r[4] +'%<img src="../img/'+imgs+'.png" alt="" height="20px" style="vertical-align: top;"></td>'
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

//获取事业部也子品牌的映射数据
function getData3() {
	ajaxReq("busidata", function (data) {
		//存储事业部也子品牌的映射数据
		$.each(data.bg_product, function (i, r) {
			busiData[r.bgName] = r.productNames;
		});
		// 默认呈现液态奶事业部的数据 子品牌的数据
		$("#busi-name option").remove();
		for (var k in busiData) {
			$("#busi-name").append("<option value='"+ k +"'>"+ k +"</option>");
		}
		$("#busi-subbrand option").remove();
		$.each(busiData['液态奶事业部'], function(i, r) {
			if (r !== "缺省") {
				if (r === "安慕希") {
					$("#busi-subbrand").append("<option value='"+ r +"' selected='selected'>"+ r +"</option>");
				} else {
					$("#busi-subbrand").append("<option value='"+ r +"'>"+ r +"</option>");
				}
			}
		});
		$("#hide1").remove()
	});
}

//产品收入明细 当月/YTD切换
$(document).on('change', '#YTD', function (event) {
	setDataJson({isCurrentMonth: this.value });
	getData2(false);
});

// 绑定切换事业部下拉框事件  默认选中第一个子品牌并且刷新页面数据
$("#busi-name").on({
	change: function (event) {
		loadHide1("h_body","hide1");
		var busiName = this.value;
		$("#busi-subbrand option").remove();
		$.each(busiData[busiName], function(i, r) {
			if (r !== "缺省") {
				if (r === "安慕希") {
					$("#busi-subbrand").append("<option value='"+ r +"' selected='selected'>"+ r +"</option>");
				} else {
					$("#busi-subbrand").append("<option value='"+ r +"'>"+ r +"</option>");
				}
			}
		});
		var subbrandName = $("#busi-subbrand").val();
		setDataJson({businessName: busiName, subbrand: subbrandName});
		getData1();
		getData2(true);
	}
});

// 绑定切换子品牌下拉框事件  刷新页面数据
$("#busi-subbrand").on({
	change: function (event) {
		loadHide1("h_body","hide1");
		var subbrandName = this.value;
        console.log('用户选择的子事业部的名称22：'+subbrandName);
		setDataJson({subbrand: subbrandName});
		getData1();
		getData2(true);
	}
});

// 修改json数据
function setDataJson(newDataJson) {
	return $.extend(dataJson, newDataJson);
}
