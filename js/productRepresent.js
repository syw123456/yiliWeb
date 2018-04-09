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
$(".newyearday").text(time.split("-")[0] + "年" + time.split("-")[1] +"月");
//定义echar 插件到页面
var myChart = echarts.init(document.getElementById('main'));
var myChart1 = echarts.init(document.getElementById('main1'));
//图标内容大小自适应
setTimeout(function () {
    window.onresize = function () {
        myChart.resize();
        myChart1.resize();
    }
}, 1);
//获取基本数据和两个条形图数据
loadHide1("h_top","hide1");
loadHide1("h_middle","hide2");
loadHide1("h_bottom","hide3");
var reportJson = {
        "date_day": time,
        "isNew":"0#1#3",
        "isMain":"0#1#3"
    };
getData1();
getData2(reportJson);

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
        	loadHide1("h_top","hide1");
        	loadHide1("h_middle","hide2");
        	loadHide1("h_bottom","hide3");
            var times=that.val();
            $(".newyearday").text(times.split("-")[0] + "年" + times.split("-")[1] +"月");
            //重品
        	var arr_ZP=[];
			for(var i=0;i<$("#isZP .selectBox .inp_b").length;i++){
				if($("#isZP .selectBox .inp_b").eq(i).prop("checked")){
					arr_ZP.push($("#isZP .selectBox .inp_b").eq(i).val());
				}
			}
			var isMain = "";
			if(arr_ZP.length != 0){
				isMain = arr_ZP.join("#");
				if(arr_ZP.length == 3){
					$("#isZP .inp_val").val("(全部)");
				}else if(arr_ZP.length == 2){
					$("#isZP .inp_val").val("(多个值)");
				}else if(arr_ZP.length == 1){
					for(var i=0;i<$("#isZP .selectBox .inp_b").length;i++){
						if($("#isZP .selectBox .inp_b").eq(i).prop("checked")){
							$("#isZP .inp_val").val("("+$("#isZP .selectBox .inp_b").eq(i).parent().text()+")");
						}
					}
				}
			}else{
				$("#isZP .inp_val").val("(无)");
			}
			//新品
			var arr_XP=[];
			for(var i=0;i<$("#isXP .selectBox .inp_b").length;i++){
				if($("#isXP .selectBox .inp_b").eq(i).prop("checked")){
					arr_XP.push($("#isXP .selectBox .inp_b").eq(i).val());
				}
			}
			var isNew = "";
			if(arr_XP.length != 0){
				isNew = arr_XP.join("#");
				if(arr_XP.length == 3){
					$("#isXP .inp_val").val("(全部)");
				}else if(arr_XP.length == 2){
					$("#isXP .inp_val").val("(多个值)");
				}else if(arr_XP.length == 1){
					for(var i=0;i<$("#isXP .selectBox .inp_b").length;i++){
						if($("#isXP .selectBox .inp_b").eq(i).prop("checked")){
							$("#isXP .inp_val").val("("+$("#isXP .selectBox .inp_b").eq(i).parent().text()+")");
						}
					}
				}
			}else{
				$("#isXP .inp_val").val("(无)");
			}
            if(times != times1){
            	$(".newyearday").text(times.split("-")[0]+"年"+times.split("-")[1]+"月");
            	var reportJson = {
            	        "date_day": times,
            	        "isNew":isNew,
            	        "isMain":isMain
            	    };
            	getData1();
            	getData2(reportJson);            	
                times1 = times;
            }            
        }
    });     
});
//点击新品下拉选择框
$("#isXP .inp_val").off("click").on("click",function(){ 
    $("#isXP .selectBox").show();
    var times = $("#startTime").val();
	$(".newyearday").text(times.split("-")[0]+"年"+times.split("-")[1]+"月");
	$("#isXP .selectBox .inp_A").off("click").on("click",function(){
		loadHide1("h_bottom","hide3");
		//获取重品选中
		var isMain="";
		if($("#isZP .selectBox .inp_A").prop("checked")){
			isMain="0#1#3"
		}else{
			var arr_ZP=[];
			for(var i=0;i<$("#isZP .selectBox .inp_b").length;i++){
				if($("#isZP .selectBox .inp_b").eq(i).prop("checked")){
					arr_ZP.push($("#isZP .selectBox .inp_b").eq(i).val());
				}
			}
			isMain = arr_ZP.join("#");
		}
		//如果新品全选选中		
		if($(this).prop("checked")){
			$("#isXP .selectBox .inp_b").prop("checked",true);
			$("#isXP .inp_val").val("(全部)");
			var reportJson = {
			        "date_day": times,
			        "isNew":"0#1#2",
			        "isMain":isMain
			    };
			getData2(reportJson);
		}else{
			$("#isXP .selectBox .inp_b").prop("checked",false);
			$("#isXP .inp_val").val("(无)");
			var reportJson = {
			        "date_day": times,
			        "isNew":"",
			        "isMain":isMain
			    };
			getData2(reportJson);
		}
	});	
	$("#isXP .selectBox .inp_b").off("click").on("click",function(){
		loadHide1("h_bottom","hide3");
		//获取重品选中
		var isMain="";
		if($("#isZP .selectBox .inp_A").prop("checked")){
			isMain="0#1#3"
		}else{
			var arr_ZP=[];
			for(var i=0;i<$("#isZP .selectBox .inp_b").length;i++){
				if($("#isZP .selectBox .inp_b").eq(i).prop("checked")){
					arr_ZP.push($("#isZP .selectBox .inp_b").eq(i).val());
				}
			}
			isMain = arr_ZP.join("#");
		}
		var arr_XP=[];
		for(var i=0;i<$("#isXP .selectBox .inp_b").length;i++){
			if($("#isXP .selectBox .inp_b").eq(i).prop("checked")){
				arr_XP.push($("#isXP .selectBox .inp_b").eq(i).val());
			}
		}
		if(arr_XP.length == 3){
			$("#isXP .selectBox .inp_A").prop("checked",true);
			$("#isXP .inp_val").val("(全部)");
		}else{
			$("#isXP .selectBox .inp_A").prop("checked",false);
			if(arr_XP.length == 2){
				$("#isXP .inp_val").val("(多个值)");
			}else if(arr_XP.length == 0){
				$("#isXP .inp_val").val("(无)");
			}else if(arr_XP.length == 1){
				for(var i=0;i<$("#isXP .selectBox .inp_b").length;i++){
					if($("#isXP .selectBox .inp_b").eq(i).prop("checked")){
						$("#isXP .inp_val").val("("+$("#isXP .selectBox .inp_b").eq(i).parent().text()+")");
					}
				}
				
			}
		}
		var isNew = arr_XP.join("#");
		var reportJson = {
		        "date_day": times,
		        "isNew":isNew,
		        "isMain":isMain
		    };
		getData2(reportJson);
	});
});
var obj = document.getElementById("XP_box");
var oBtn = document.getElementById("XP_btn");
var obj1 = document.getElementById("ZP_box");
var oBtn1 = document.getElementById("ZP_btn");
document.onclick=function(event){
    var e=event || window.event;//兼容ie和非ie的event
    var aim=e.srcElement || e.target; //兼容ie和非ie的事件源
    if(e.srcElement){
     var aim=e.srcElement;
      if(aim!=oBtn && aim!=obj){
        obj.style.display="none";
      }
      if(aim!=oBtn1 && aim!=obj1){
          obj1.style.display="none";
        }
    }else{
      var aim=e.target;
      if(aim!=oBtn && aim!=obj){
        obj.style.display="none";
      }
      if(aim!=oBtn1 && aim!=obj1){
          obj1.style.display="none";
        }
    }
  };
//点击重品下拉选择框
$("#isZP .inp_val").off("click").on("click",function(){    
    $("#isZP .selectBox").show();
    var times = $("#startTime").val();
	$(".newyearday").text(times.split("-")[0]+"年"+times.split("-")[1]+"月");
	$("#isZP .selectBox .inp_A").off("click").on("click",function(){
		loadHide1("h_bottom","hide3");
		//获取新品选中
		var isMain="";
		if($("#isXP .selectBox .inp_A").prop("checked")){
			isMain="0#1#3"
		}else{
			var arr_ZP=[];
			for(var i=0;i<$("#isXP .selectBox .inp_b").length;i++){
				if($("#isXP .selectBox .inp_b").eq(i).prop("checked")){
					arr_ZP.push($("#isXP .selectBox .inp_b").eq(i).val());
				}
			}
			isMain = arr_ZP.join("#");
		}
		//如果重品全选选中		
		if($(this).prop("checked")){
			$("#isZP .selectBox .inp_b").prop("checked",true);
			$("#isZP .inp_val").val("(全部)");
			var reportJson = {
			        "date_day": times,
			        "isNew":"0#1#2",
			        "isMain":isMain
			    };
			getData2(reportJson);
		}else{
			$("#isZP .selectBox .inp_b").prop("checked",false);
			$("#isZP .inp_val").val("(无)");
			var reportJson = {
			        "date_day": times,
			        "isNew":"",
			        "isMain":isMain
			    };
			getData2(reportJson);
		}
	});	
	$("#isZP .selectBox .inp_b").off("click").on("click",function(){
		loadHide1("h_bottom","hide3");
		//获取新品选中
		var isNew="";
		if($("#isXP .selectBox .inp_A").prop("checked")){
			isNew="0#1#3"
		}else{
			var arr_ZP=[];
			for(var i=0;i<$("#isXP .selectBox .inp_b").length;i++){
				if($("#isXP .selectBox .inp_b").eq(i).prop("checked")){
					arr_ZP.push($("#isXP .selectBox .inp_b").eq(i).val());
				}
			}
			isNew = arr_ZP.join("#");
		}
		//获取重品选中
		var arr_ZP=[];
		for(var i=0;i<$("#isZP .selectBox .inp_b").length;i++){
			if($("#isZP .selectBox .inp_b").eq(i).prop("checked")){
				arr_ZP.push($("#isZP .selectBox .inp_b").eq(i).val());
			}
		}
		if(arr_ZP.length == 3){
			$("#isZP .selectBox .inp_A").prop("checked",true);
			$("#isZP .inp_val").val("(全部)");
		}else{
			$("#isZP .selectBox .inp_A").prop("checked",false);
			if(arr_ZP.length == 2){
				$("#isZP .inp_val").val("(多个值)");
			}else if(arr_ZP.length == 0){
				$("#isZP .inp_val").val("(无)");
			}else if(arr_ZP.length == 1){
				for(var i=0;i<$("#isZP .selectBox .inp_b").length;i++){
					if($("#isZP .selectBox .inp_b").eq(i).prop("checked")){
						$("#isZP .inp_val").val("("+$("#isZP .selectBox .inp_b").eq(i).parent().text()+")");
					}
				}
				
			}
		}
		var isMain = arr_ZP.join("#");
		var reportJson = {
		        "date_day": times,
		        "isNew":isNew,
		        "isMain":isMain
		    };
		getData2(reportJson);
	});
});
//获取kpi数据
function getData1(){
	var reportJson = {"date_day": $("#startTime").val(),"isKpi":"Y"};
    $.ajax({
        url: basepath + "/CpbxReport",
        data:reportJson,
        dataType: "json",
        type: "post",
        success: function (data) {
        	//基本数据
        	var A_amt_main_dis_bef_rate = data.p_all.A_amt_main_dis_bef_rate;
        	var A_amt_new_dis_bef_val = data.p_all.A_amt_new_dis_bef_val;
        	$(".A_amt_main_dis_bef").text(formatNumber(data.p_all.A_amt_main_dis_bef,2,0)+"亿");
        	$(".A_amt_main_dis_bef_rate").text(formatNumber(A_amt_main_dis_bef_rate,2,0)+"%");
        	$(".A_amt_main_dis_bef_rate").parent("span").css("background-color",bgColor2(A_amt_main_dis_bef_rate));
        	$(".A_amt_new_dis_bef").text(formatNumber(data.p_all.A_amt_new_dis_bef,2,0)+"亿");
        	$(".A_amt_new_dis_bef_val").text(formatNumber(formatNumber(A_amt_new_dis_bef_val,2,0),2,1)+"%");
        	$(".A_amt_new_dis_bef_val").parent("span").css("background-color",bgColor2(A_amt_new_dis_bef_val));
        	//当月重品产品达成
        	var x1_data=[],y1_data=[];
        	$.each(data.p_B_main_rat,function(k,v){
        		x1_data.push(k);
        		var json = {value:formatNumber(v,2,0),itemStyle:{ color:bgColor2(v)}};
        		y1_data.push(json);
        	});
        	myChart.setOption(getJson(x1_data,y1_data,data.p_main_new_all.A_amt_main_dis_bef_rat));
        	
        	//当月新品销售占比
        	var x2_data=[],y2_data=[],data_bs=[];
        	var s_time=Number($("#startTime").val().split("-")[1]);
        	var s=0,t_bs=[];
        	$.each(data.p_B_new_rat,function(k,v){        		
        		x2_data.push(k);
        		var y2={};
        		var s_bs=0;
        		var bs=[];
        		if(k == "液态奶事业部"){
        			s_bs = 12;
        			y2={ "value":formatNumber(v.amt_dis_rat,2,0),itemStyle:{ color:bgColor(v.amt_dis_rat,s_bs)}};
        			bs=[{  
		                     x: "7%",  
		                     yAxis: s_bs,
		                     value:formatNumber(s_bs,2,0)+"%"
		                 },  
		                 {  
		                     x: "25%",  
		                     yAxis: s_bs
		                 }]
        		}else if(k=="奶粉事业部"){
        			if(s_time<=3){
        				s_bs = 15.9;
        			}else if(s_time>3 && s_time<=6){
        				s_bs = 18;
        			}else if(s_time>6 && s_time<=9){
        				s_bs = 20.2;
        			}else if(s_time>9 && s_time<=12){
        				s_bs = 21.5;
        			}
        			y2={ "value":formatNumber(v.amt_dis_rat,2,0),itemStyle:{ color:bgColor(v.amt_dis_rat,s_bs)}};
        			bs=[{  
	                     x: "25%",  
	                     yAxis: s_bs,
	                     value:formatNumber(s_bs,2,0)+"%"
	                 },  
	                 {  
	                     x: "42.5%",  
	                     yAxis: s_bs
	                 }]
        			
        		}else if(k== "酸奶事业部"){
        			s_bs = 15;
        			y2={ "value":formatNumber(v.amt_dis_rat,2,0),itemStyle:{ color:bgColor(v.amt_dis_rat,s_bs)}};
        			bs=[{  
	                     x: "42.5%",  
	                     yAxis: s_bs,
	                     value:formatNumber(s_bs,2,0)+"%"
	                 },  
	                 {  
	                     x: "60%",  
	                     yAxis: s_bs
	                 }]
        		}else if(k=="冷饮事业部"){
        			if(s_time<=3){
        				s_bs = 7.51;
        			}else if(s_time>3 && s_time<=6){
        				s_bs = 7.10;
        			}else if(s_time>6 && s_time<=9){
        				s_bs = 10.67;
        			}else if(s_time>9 && s_time<=12){
        				s_bs = 12;
        			}
        			y2={ "value":formatNumber(v.amt_dis_rat,2,0),itemStyle:{ color:bgColor(v.amt_dis_rat,s_bs)}};
        			bs=[{  
	                     x: "60%",  
	                     yAxis: s_bs,
	                     value:formatNumber(s_bs,2,0)+"%"
	                 },  
	                 {  
	                     x: "78%",  
	                     yAxis: s_bs
	                 }]
        		}else if(k=="电商"){
        			y2={ "value":formatNumber(v.amt_dis_rat,2,0),itemStyle:{ color:"#bab0ac"}};
        			s_bs="";
        		}     
        		y2_data.push(y2);
        		if(k!="电商"){
        			data_bs.push(bs);
        		}
        		t_bs.push(s_bs);
        	});
        	myChart1.setOption(getJson1(x2_data,y2_data,data.p_main_new_all.A_amt_new_dis_bef_rat,data_bs,t_bs));
        	$("#hide1").remove();
        	$("#hide2").remove();
        },
        error:function(){
            alert("数据请求失败");
            $("#hide1").remove();
        	$("#hide2").remove();
        }
    });
} 
//获取明细数据
function getData2(reportJson){
    $.ajax({
        url: basepath + "/CpbxReport",
        data: reportJson,
        dataType: "json",
        type: "post",
        success: function (data) {
        	//产品销量与增长明细
        	var arr1=[],arr2=[];
        	$.each(data.p_B_sal_detail,function(k,v){
        		arr1.push(v.amt_dis_bef);
        		arr2.push(v.amt_year_dis_bef);
        	});
        	var max1 = Math.max.apply(null,arr1);
        	var max2 = Math.max.apply(null,arr2);
        	var str = "";
        	$.each(data.p_B_sal_detail,function(k,v){
        		var color1 = bgColor2(v.amt_dis_bef_rat);
        		var color2 = bgColor2(v.amt_year_dis_bef_rat);
        		var imgs1 = v.amt_dis_bef_inc_rat>=0 ? "up":"down";
        		var imgs2 = v.amt_year_dis_inc_rat>=0 ? "up":"down";
        		var width1 = max1 === 0 ? 0 : (v.amt_dis_bef/max1)*100 ;
        		var width2 = max2 === 0 ? 0 : (v.amt_year_dis_bef/max2)*100 ;
        		str+='<tr>'
					+'<td onclick="cause_click($(this),"1")">'+k+'</td>'				
					+'<td class="hide">0</td>'
					+'<td><span class="table_bg4A7EBE" style="width:'+width1+'%;"></span>'+formatNumber(v.amt_dis_bef,1,1)+'</td>'
					+'<td style="font-weight:bold;color:'+color1+';">'+formatNumber(v.amt_dis_bef_rat,2,0)+'%</td>'
					+'<td>'+formatNumber(v.amt_dis_bef_inc_rat,1,0)+'% <img src="../img/'+imgs1+'.png" alt="" height="20px" style="vertical-align: middle;"></td>'
					+'<td><span class="table_bg4A7EBE" style="width:'+width2+'%;"></span>'+formatNumber(v.amt_year_dis_bef,1,1)+'</td>'
					+'<td style="font-weight:bold;color:'+color2+';">'+formatNumber(v.amt_year_dis_bef_rat,2,0)+'%</td>'
					+'<td>'+formatNumber(v.amt_year_dis_inc_rat,1,0)+'% <img src="../img/'+imgs2+'.png" alt="" height="20px" style="vertical-align: middle;"></td>'
					+'<td>'+formatNumber(v.amt_year_sku_count,0,1)+'</td>'
					+'<td>'+formatNumber(v.amt_year_sku_amt,0,1)+'</td>'
					+'<td>'+formatNumber(v.amt_dis_bef_sal_rat,1,0)+'%</td>'
					+'<td>'+formatNumber(v.amt_year_dis_inc_cont,1,0)+'%</td>'
					+'</tr>'
        	});
        	$(".d_cpT tbody").html(str);
        	$("#hide3").remove();
        },
        error:function(){
            alert("数据请求失败");
            $("#hide3").remove();
        }
    });
}

function getJson(x_data,y_data,title_a){
	var option = {
        title: {
            text: '当月{a|重点产品}达成 {a|'+title_a+'%}',
            textStyle: {
                color: '#fff',
                fontSize:16,
                rich:{
                    a: {
                        color: '#ffaa00',
                        fontSize:16,
                        fontWeight:700
                    }
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        /*legend: {
            data: ['折前达成进度', '账面达成进度'],
            textStyle: {
                color: ['#fff']
            },
            itemWidth: 10,
            itemHeight: 10,
            y: 'top',
            x: 'right',
            orient: 'horizontal',
        },*/
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
                formatter: '{value}%'
            },
            splitLine: {//分隔线
                show: false
            }
        }],
        series: [
            {
                name: '重品达成率',
                type: 'bar',
                barWidth:"50%",
                label:{
                    show:true,
                    position:"top",
                    color:"#fff",
                    formatter:"{c}%"      
                },
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#b5b5b6'
                        },
                        color: '#59a14f'
                    }
                },
                data: y_data
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
function getJson1(x_data,y_data,title_a,data_bs,t_bs){
	var option1 = {
        title: {
            text: '当月{a|新品}销售占比 {a|'+title_a+'%}',
            textStyle: {
                color: '#fff',
                fontSize:16,
                rich:{
                    a: {
                        color: '#ffaa00',
                        fontSize:16,
                        fontWeight:700
                    }
                }
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
                	var t_s= t_bs[params[i].dataIndex]=="" ? "" : formatNumber(t_bs[params[i].dataIndex],2,0)+"%";
                    relVal += '<br/>新品占比目标：'+t_s
                    		+'<br/>' + params[i].marker +  params[i].seriesName + ' : ' + params[i].value+"%";
                }
            	return relVal;
            }
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
            //boundaryGap: false,
            data: x_data,
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
                interval: 0
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
                formatter: '{value}%'
            },
            splitLine: {//分隔线
                show: false
            }
        }],
        series: [
            {
                name: '新品销售占比',
                type: 'bar',
                barWidth:"50%",
                label:{
                    show:true,
                    color:"#fff",
                    formatter:"{c}%"      
                },
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#b5b5b6'
                        },
                        color: '#e15759'
                    }
                },
                data:y_data,
                markLine:{
                	symbolSize:0,
                    animation:false,
                    lineStyle:{
                        color:"#fff",
                        width:2,
                        type:"solid"
                    },
                    label:{
                    	show:true,
                        position:"middle"
                    },
                    data:data_bs
                }
            }

        ]
    };
	return option1;
}
