//获取日期
var now = new Date();
var nowMonth = now.getMonth()+1-1;
var nowYear = now.getFullYear();
if(nowMonth<10){
    nowMonth="0"+nowMonth;
}
var time =nowYear + "-" + nowMonth;
time = "2017-12";
$("#startTime").val(time);
$(".newyearday").text(time.split("-")[0]+"年"+time.split("-")[1]+"月");
init();
function init(){
	var jsonData = {
			year: time.split("-")[0],
			month: time.split("-")[1],
			businessName: "液态奶事业部"
	};
	loadHide("h_body");
	getData1(jsonData);
	getData2(jsonData);
	getData3(jsonData);
	getData4(jsonData);
	getData5(jsonData);
}
var myChart = echarts.init(document.getElementById('main'));
var option = {
    title: {
        text: '{a|液态奶事业部}折前收入趋势',
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
        data: ["1","2","3","4","5","6","7","8","9","10","11","12"],
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
            name: '2017',
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
            data: ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]
        },
        {
            name: '2018',
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
            data: ["0","0","0","0","0","0"]/*,
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
            name: '今年目标',
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
            data: ["0","0","0","0","0","0","0","0","0","0","0","0"]
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
myChart.setOption(option);
//var businessName = "液态奶事业部", nowYear = "2017", nowMonth = "12";

function ajaxReq(urlSuffix,jsonData,func) {	
	$.ajax({
		 url: "/yiliReport/month/xszz/" + urlSuffix,
		 data: jsonData,
		 dataType: "JSON",
		 type: "POST",
		 success: function(data) {
			 func(data);
		 },
		 error:function(){
			 alert("数据查询错误");
			 $("#shade").remove();
		 }
	});
};

function cause_click(type, busi, subb, sku) {
	loadHide("h_zx");
	var timess = $("#startTime").val();
	var jsonsData = {
			year: timess.split("-")[0],
			month: timess.split("-")[1],
			businessName: busi,
			type: type
	};
	$.extend(jsonsData, { subbrand: subb, sku: sku });
	getData3(jsonsData);
}
//选择日期查询数据
var times1 = $("#startTime").val();
$("#startTime").off("click").on("click",function(){    
    var that = $(this);
    WdatePicker({
        dateFmt: 'yyyy-MM',
        maxDate:'%y-{%M-1}',
        isShowClear: false,
        onpicked:function(){
            var times=that.val();
            if(times != times1){
            	loadHide("h_body");
            	$(".newyearday").text(times.split("-")[0]+"年"+times.split("-")[1]+"月");
                var jsonData = {
                		year: times.split("-")[0],
                		month: times.split("-")[1],
                		businessName: "液态奶事业部"	
                };
                $(".newyearday").text(times.split("-")[0]+"年"+times.split("-")[1]+"月");
            	getData1(jsonData);
                getData2(jsonData);
                getData3(jsonData);
                getData4(jsonData);
                getData5(jsonData);
                times1 = times;
            }            
        }
    });     
});
/*基本数据*/
function getData1(jsonData){
	// 统计数据指标 12个值
	ajaxReq("summary",jsonData,function (data) {
		 var summaryVals = data.summary;
		 $(".summary").each(function(i, r) {
			 if (i == 2 || i == 3 || i == 8 || i == 9) {
				 $(r).parent().css("background-color", bgColor(summaryVals[i], summaryVals[i + 2]));
			 }
			 $(r).text(summaryVals[i]);
		 });
	});
}
/*各事业部收入金额增长*/
function getData2(jsonData){
	//各事业部收入金额增长 
	ajaxReq("increase",jsonData,function (data) {
		 $(".business-dep tr").remove();
		 var arr1=[],arr2=[];
		 $.each(data.increase, function (i, r) {
			 arr1.push(r[1]);
			 arr1.push(r[2]);
			 arr2.push(r[6]);
			 arr2.push(r[7]);
		 });
		 var max_width1 =  Math.max.apply(null,arr1);
		 var max_width2 =  Math.max.apply(null,arr2);
		 function upDownImg(num1, num2) {
			 var num = parseFloat(num1) - parseFloat(num2);
			 console.log(parseFloat(num1) - parseFloat(num2));
			 return num >= 0 ? 'up.png' : 'down.png'; 
		 }
		 $.each(data.increase, function (i, r) {
			var width11 = max_width1==0?0 : (r[1]/max_width1)*20;
			var width12 = max_width1==0?0 : (r[2]/max_width1)*20;
			var width21 = max_width2==0?0 : (r[6]/max_width2)*20;
			var width22 = max_width2==0?0 : (r[7]/max_width2)*20;
			var tr = '<tr>'
					+'<td>'+ r[0] +'</td>'
					+'<td>'
						+'<p class="w100b over-hide">'
							+'<span style="float: left;width:'+width11+'%; height: 16px;margin-top:3px;background-color: #4e79a7;"></span>'
							+'<span style="float: left;">'+ formatNumber(r[1],1,1) +'</span>'
						+'</p>'
						+'<p class="w100b over-hide" style="margin-top: 5px;">'
							+'<span style="float: left;width: '+width12+'%; height: 16px;margin-top:3px;background-color: #a0cbe8;"></span>'
							+'<span style="float: left;">'+ formatNumber(r[2],1,1) +'</span>'
						+'</p>'
					+'</td>'
					+'<td>'+ r[3] +'%</td>'
					+'<td style="font-weight: bold; color: '+ bgColor(r[4], r[3]) +'">'+ r[4] +'%</td>'
					+'<td>'+ r[5] +'%<img src="../img/'+ upDownImg(r[5], 0) +'" alt="" height="20px" style="vertical-align: top;"></td>'
					+'<td>'
						+'<p class="w100b over-hide">'
							+'<span style="float: left;width: '+width21+'%; height: 16px;margin-top:3px;background-color: #4e79a7;"></span>'
							+'<span style="float: left;">'+formatNumber(r[6],1,1) +'</span>'
						+'</p>'
						+'<p class="w100b over-hide" style="margin-top: 5px;">'
							+'<span style="float: left;width: '+width22+'%; height: 16px;margin-top:3px;background-color: #a0cbe8;"></span>'
							+'<span style="float: left;">'+ formatNumber(r[7],1,1) +'</span>'
						+'</p>'
					+'</td>'
					+'<td>'+ r[8] +'%</td>'
					+'<td style="font-weight: bold; color: '+ bgColor(r[9], r[8]) +'">'+ r[9] +'%</td>'
					+'<td>'+ r[10] +'%<img src="../img/'+ upDownImg(r[10], 0) +'" alt="" height="20px" style="vertical-align: top;"></td>'
				+'</tr>';
			$(".business-dep").append(tr);
		 });
	});
}
/*折前收入趋势*/
function getData3(jsonData){
	// 折线图数据
	ajaxReq("linechart",jsonData,function (data) {
		 option.title.text = data.year + '年'+ data.month +'月{a|'+ data.businessName +'}折前收入趋势';
		 option.series[0].name = (data.year - 1) + "年";
		 option.series[1].name = data.year + "年";
		 option.series[0].data = data.prevYear;
		 option.series[1].data = data.yearData;
		 option.series[2].data = data.yearTarget;
		 option.tooltip.formatter = function(params){
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
		 myChart.setOption(option);
		 $("#shade").remove();
	});
}
/*重点产品 折前收入*/
function getData4(jsonData){
	//重点产品
	ajaxReq("keyproduct",jsonData,function(data) {
		var str_head='<tr>'
					+'<th><span class="add_zp">+</span></th>'
					+'<th>月累计折前收入</th>'
					+'<th>销售占比</th>'
					+'<th>折前同比增长率</th>'
				+'</tr>';
		$(".T_zd thead").html(str_head);
		//console.log(data);
		 var arr = [];
		 $.each(data.list, function(k,v) {
			 arr.push(v[1]);		 
		 });
		 var max = Math.max.apply(null,arr);
		 $(".key-produc-sum").each(function(i, r) {
			 if(i==0){
				 $(r).text(formatNumber(data.counts[i],0,1)); 
			 }else{
				 $(r).text(data.counts[i]); 
			 }			
		 });
		 $(".key-produc-detail tr").remove();
		 $.each(data.list, function(i, r) {
			 var width = max === 0 ? 0 : (r[1]/max)*100 ;
			 var imgs = r[3] >=0 ? "up":"down";
			 var tr = '<tr>'
							+'<td onclick="cause_click(\'main\', \''+ r[0] +'\')">'+ r[0] +'</td>'
							+'<td><span class="table_bg4A7EBE" style="width:'+width+'%;"></span>'+ formatNumber(r[1],1,1) +'</td>'
							+'<td>'+ r[2] +'%</td>'
							+'<td>'+ r[3] +'%<img src="../img/'+imgs+'.png" alt="" height="20px" style="vertical-align: top;"</td>'
						+'</tr>';
			 $(".key-produc-detail").append(tr);
		 });
		 $("#shade").remove();
	});
}
/* 新品 折前收入 */
function getData5(jsonData){
	ajaxReq("newproduct",jsonData,function(data) {
		var str_head='<tr>'
							+'<th><span class="add_xp">+</span></th>'
							+'<th>月累计折前收入</th>'
							+'<th>销售占比</th>'
						+'</tr>';
		$(".T_xp thead").html(str_head);
		//新品
		var arr = [];
		 $.each(data.list, function(k,v) {
			 arr.push(v[1]);		 
		 });
		 var max = Math.max.apply(null,arr);
		 $(".new-produc-sum").each(function(i, r) {
			if(i==0){
				 $(r).text(formatNumber(data.counts[i],0,1)); 
			 }else{
				 $(r).text(formatNumber(data.counts[i],1,1)); 
			 }
		 });
		 $(".new-produc-detail tr").remove();
		 $.each(data.list, function(i, r) {
			 var width = max === 0 ? 0 : (r[1]/max)*100 ;
			 var tr = '<tr>'
						 +'<td onclick="cause_click(\'new\',\''+r[0]+'\')">'+ r[0] +'</td>'
						 +'<td><span class="table_bg4A7EBE" style="width:'+width+'%;"></span>'+ formatNumber(r[1],1,1) +'</td>'
						 +'<td>'+ r[2] +'%</td>'
						+'</tr>';
			 $(".new-produc-detail").append(tr);
		 });
		 $("#shade").remove();
	});
}
//重点产品下钻
$(".T_zd").on("click",".add_zp",function(){
	loadHide("h_zp");
	var timess = $("#startTime").val();
	var jsonData = {
			year: timess.split("-")[0],
			month: timess.split("-")[1],
			businessName: "液态奶事业部"
	};
	var that = $(this);
	ajaxReq("keysubbrand",jsonData,function(data) {
		var head_str = "<tr>" 
							+"<th><span class='remove_zp'>-</span></th>"
							+"<th><span class='add_zp_sku'>+</span></th>"
							+"<th>月累计折前收入</th>"
							+"<th>销售占比</th>"
							+"<th>折前同比增长率</th>"
						+"</tr>";
		$(".T_zd thead").html(head_str);
		$(".key-produc-detail").html(getStr1(data));
		$("#shade").remove();
		//获取sku
		$(".T_zd").on("click",".add_zp_sku",function(){
			loadHide("h_zp");
			var thats = $(this);	
			$(".key-produc-detail").html("");
			var timesss = $("#startTime").val();
			var jsonsData = {
					year: timesss.split("-")[0],
					month: timesss.split("-")[1],
					businessName: "液态奶事业部"
			};
			ajaxReq("keysku",jsonsData,function(data) {
				var head_str1 = "<tr>" 
					+"<th><span class='remove_zp'>-</span></th>"
					+"<th><span class='remove_zp_sku'>-</span></th>"
					+"<th></th>"
					+"<th>月累计折前收入</th>"
					+"<th>销售占比</th>"
					+"<th>折前同比增长率</th>"
				+"</tr>";
				$(".T_zd thead").html(head_str1);							
				$(".key-produc-detail").html(getstr2(data));
				$("#shade").remove();
			});
		});			
	});
});

$(".T_zd").on("click",".remove_zp_sku",function(){
	loadHide("h_zp");
	var timess = $("#startTime").val();
	var jsonData = {
			year: timess.split("-")[0],
			month: timess.split("-")[1],
			businessName: "液态奶事业部"
	};
	$(".key-produc-detail").html("");
	ajaxReq("keysubbrand",jsonData,function(data) {
		var head_str1 = "<tr>" 
			+"<th><span class='remove_zp'>-</span></th>"
			+"<th><span class='add_zp_sku'>+</span></th>"
			+"<th>月累计折前收入</th>"
			+"<th>销售占比</th>"
			+"<th>折前同比增长率</th>"
		+"</tr>";
		$(".T_zd thead").html(head_str1);
		$(".key-produc-detail").html(getStr1(data));
		$("#shade").remove();
	});
});
$(".T_zd").on("click",".remove_zp",function(){
	loadHide("h_zp");
	var timess = $("#startTime").val();
	var jsonData = {
			year: timess.split("-")[0],
			month: timess.split("-")[1],
			businessName: "液态奶事业部"
	};
	$(".key-produc-detail").html("");
	var head_str1 = "<tr>" 
						+"<th><span class='add_zp'>+</span></th>"
						+"<th>月累计折前收入</th>"
						+"<th>销售占比</th>"
						+"<th>折前同比增长率</th>"
					+"</tr>";
	$(".T_zd thead").html(head_str1);
	getData4(jsonData);
});
//重品下钻到子品牌
function getStr1(data){
	delete data["businessName"];
	delete data["month"];
	delete data["year"];
	var arr = [];
	$.each(data,function(k,v){
		$.each(v,function(s,t){
			arr.push(t[1]);
		});		
	});
	var max_zp = Math.max.apply(null,arr);
	var str = "";
	$.each(data,function(k,v){
		str+="<tr><td rowspan='"+v.length+"' onclick='cause_click(\"main\",\""+k+"\")'>"+k+"</td>";
		$.each(v,function(s,t){
			var imgs = t[3]<0 ? "down" : "up"; 
			var widths = max_zp<=0 ? "0":(t[1]/max_zp)*100;
			var m=0;
			if(m!=0){
				str+="<tr>";
			}
			str+="<td onclick='cause_click(\"main\",\""+k+"\",\""+t[0]+"\")' style='cursor:pointer;'>"+t[0]+"</td>"
				+"<td align='left'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(t[1],1,1)+"</td>"
				+"<td>"+formatNumber(t[2],2,0)+"%</td>"
				+"<td>"+formatNumber(t[3],1,0)+"%<img src='../img/"+imgs+".png' alt='' height='20px' style='vertical-align: top;'/></td>"
				+"</tr>";
			m++;
		});
	});
	return str;
}
//重品下钻到sku
function getstr2(data){
	delete data["businessName"];
	delete data["month"];
	delete data["year"];
	var arr=[];	
	$.each(data,function(k,v){
		$.each(v,function(s,t){
			$.each(t,function(m,n){
				arr.push(n[1]);
			});
		});
	});
	var max_zp = Math.max.apply(null,arr);
	var str="";
	$.each(data,function(k,v){
		var len=0;
		$.each(v,function(s,t){
			len+=t.length;		
		});
		str+="<tr><td rowspan='"+len+"' onclick='cause_click(\"main\",\""+k+"\")'>"+k+"</td>";
		$.each(v,function(s,t){
			str+="<td rowspan='"+getJsonLength(t)+"' onclick='cause_click(\"main\",\""+k+"\",\""+s+"\")' style='cursor:pointer;'>"+s+"</td>";
			var m=0;
			$.each(t,function(m,n){
				var imgs = n[3]<0 ? "down" : "up"; 
				var widths = max_zp<=0 ? "0":(n[1]/max_zp)*100;
				var m=0;
				if(m!=0){
					str+="<tr>";
				}
				str+="<td title='"+n[0]+"' style='width:300px;text-align:left;cursor:pointer;' onclick='cause_click(\"main\",\""+k+"\",\""+s+"\",\""+n[0]+"\")'>"+n[0]+"</td>"
					+"<td align='left'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(n[1],1,1)+"</td>"
					+"<td>"+formatNumber(n[2],2,0)+"%</td>"
					+"<td>"+formatNumber(n[3],1,0)+"%<img src='../img/"+imgs+".png' alt='' height='20px' style='vertical-align: top;'/></td>"
					+"</tr>";
				m++;
			});
		});
	});
	return str;
}

//新品下钻
$(".T_xp").on("click",".add_xp",function(){
	loadHide("h_xp");
	var timess = $("#startTime").val();
	var jsonData = {
			year: timess.split("-")[0],
			month: timess.split("-")[1],
			businessName: "液态奶事业部"
	};
	var that = $(this);
	ajaxReq("newsubbrand",jsonData,function(data) {
		var head_str = "<tr>" 
							+"<th><span class='remove_xp'>-</span></th>"
							+"<th><span class='add_xp_sku'>+</span></th>"
							+"<th>月累计折前收入</th>"
							+"<th>销售占比</th>"
						+"</tr>";
		$(".T_xp thead").html(head_str);
		$(".new-produc-detail").html(getStr3(data));
		$("#shade").remove();
		//获取sku
		$(".T_xp").on("click",".add_xp_sku",function(){
			loadHide("h_xp");
			var thats = $(this);	
			$(".new-produc-detail").html("");
			var timesss = $("#startTime").val();
			var jsonsData = {
					year: timesss.split("-")[0],
					month: timesss.split("-")[1],
					businessName: "液态奶事业部"
			};
			ajaxReq("newsku",jsonsData,function(data) {
				var head_str1 = "<tr>" 
					+"<th><span class='remove_xp'>-</span></th>"
					+"<th><span class='remove_xp_sku'>-</span></th>"
					+"<th></th>"
					+"<th>月累计折前收入</th>"
					+"<th>销售占比</th>"
				+"</tr>";
				$(".T_xp thead").html(head_str1);							
				$(".new-produc-detail").html(getstr4(data));
				$("#shade").remove();
			});
		});			
	});
});
$(".T_xp").on("click",".remove_xp_sku",function(){
	loadHide("h_xp");
	var that = $(this);
	$(".new-produc-detail").html("");
	var timess = $("#startTime").val();
	var jsonData = {
			year: timess.split("-")[0],
			month: timess.split("-")[1],
			businessName: "液态奶事业部"
	};
	ajaxReq("newsubbrand",jsonData,function(data) {
		var head_str1 = "<tr>" 
			+"<th><span class='remove_xp'>-</span></th>"
			+"<th><span class='add_xp_sku'>+</span></th>"
			+"<th>月累计折前收入</th>"
			+"<th>销售占比</th>"
		+"</tr>";
		$(".T_xp thead").html(head_str1);
		$(".new-produc-detail").html(getStr3(data));
		$("#shade").remove();
	});
});
$(".T_xp").on("click",".remove_xp",function(){
	loadHide("h_xp");
	var that = $(this);	
	$(".new-produc-detail").html("");
	var timess = $("#startTime").val();
	var jsonData = {
			year: timess.split("-")[0],
			month: timess.split("-")[1],
			businessName: "液态奶事业部"
	};
	var head_str1 = "<tr>" 
		+"<th><span class='add_xp'>+</span></th>"
		+"<th>月累计折前收入</th>"
		+"<th>销售占比</th>"
	+"</tr>";
	$(".T_xp thead").html(head_str1);
	getData5(jsonData);
});
function getStr3(data){
	delete data["businessName"];
	delete data["month"];
	delete data["year"];
	var arr = [];
	$.each(data,function(k,v){
		$.each(v,function(s,t){
			arr.push(t[1]);
		});		
	});
	var max_zp = Math.max.apply(null,arr);
	var str = "";
	$.each(data,function(k,v){
		str+='<tr><td rowspan="'+v.length+'" onclick="cause_click(\'new\',\''+k+'\')">'+k+'</td>';
		$.each(v,function(s,t){
			var widths = max_zp<=0 ? "0":(t[1]/max_zp)*100;
			var m=0;
			if(m!=0){
				str+="<tr>";
			}
			str+='<td onclick="cause_click(\'new\',\''+k+'\',\''+t[0]+'\')" style="cursor:pointer;">'+t[0]+'</td>'
				+"<td align='left'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(t[1],1,1)+"</td>"
				+"<td>"+formatNumber(t[2],2,0)+"%</td>"
				+"</tr>";
			m++;
		});
	});
	return str;
}
function getstr4(data){
	delete data["businessName"];
	delete data["month"];
	delete data["year"];
	var arr=[];	
	$.each(data,function(k,v){
		$.each(v,function(s,t){
			$.each(t,function(m,n){
				arr.push(n[1]);
			});
		});
	});
	var max_zp = Math.max.apply(null,arr);
	var str="";
	$.each(data,function(k,v){
		var len=0;
		$.each(v,function(s,t){
			len+=t.length;
		});
		str+='<tr><td rowspan="'+len+'" onclick="cause_click(\'new\',\''+k+'\')">'+k+'</td>';
		$.each(v,function(s,t){
			str+='<td rowspan="'+getJsonLength(t)+'" onclick="cause_click(\'new\',\''+k+'\',\''+s+'\')" style="cursor:pointer;">'+s+'</td>';
			var m=0;
			$.each(t,function(m,n){
				var widths = max_zp<=0 ? "0":(n[1]/max_zp)*100;
				var m=0;
				if(m!=0){
					str+="<tr>";
				}
				str+='<td title="'+n[0]+'" style="cursor:pointer;width:300px;text-align:left;" onclick="cause_click(\'new\',\''+k+'\',\''+s+'\',\''+n[0]+'\')">'+n[0]+'</td>'
					+"<td align='left'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(n[1],1,1)+"</td>"
					+"<td>"+formatNumber(n[2],2,0)+"%</td>"
					+"</tr>";
				m++;
			});
		});
	});
	return str;
}