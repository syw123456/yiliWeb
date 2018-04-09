//获取日期
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
time = "2017-12-31";
$("#startTime").val(time);
var times_day = yyyy+ "年" + mm+ "月" + dd +"日" ;
$(".newyearday").text(time.split("-")[0]+"年"+time.split("-")[1]+"月"+time.split("-")[2]+"日");
var myChart = echarts.init(document.getElementById('main'));
loadHide1("h_body","hide1");
getData1(time);
getData4(time);
getData5(time);
//选择日期查询数据
var times1 = $("#startTime").val();
$("#startTime").off("click").on("click",function(){    
    var that = $(this);
    WdatePicker({
        dateFmt: 'yyyy-MM-dd',
        maxDate:'%y-%M-{%d-1}',
        isShowClear: false,
        onpicked:function(){
        	loadHide1("h_body","hide1");
            var times=that.val();
            if(times != times1){
            	$(".newyearday").text(times.split("-")[0]+"年"+times.split("-")[1]+"月"+times.split("-")[2]+"日");
                getData1(times);
                /*getData2(times);*/                
                getData4(times);
                getData5(times);
                times1 = times;
            }            
        }
    });     
});
function cause_click(a,b){
	var reportJson={
			day_data:"20171231",
			businessName: "奶粉事业部",
			type: "main"
	}
	$.ajax({
	    url: basepath + "/day/xszz/linechartsales",
	    // url: basepath + "/web/json/data1.json",
	    data: reportJson,
	    dataType: "json",
	    async:true,
	    //contentType: "application/json;charset=utf-8",
	    type: "post",
	    success: function (data) {
	    	//console.log(data);
	    }
	})
}
//获取基本数据---折线图
function getData1(time){
	var reportJson = {
			date_day: time
	};
	$.ajax({
        url: basepath + "/SalesGrowthDay",
        // url: basepath + "/web/json/data1.json",
        data: reportJson,
        dataType: "json",
        async:true,
        //contentType: "application/json;charset=utf-8",
        type: "post",
        success: function (data) {
        	//基本数据
        	var zqtbzzl = data.title_month.zqtbzzl,
        	    zqzzmb = data.title_month.zqzzmb,
        	    zmtbzzl = data.title_month.zmtbzzl,
        	    zmzzmb = data.title_month.zmzzmb;
        	$(".yljzqsr").text(+formatNumber(data.title_month.yljzqsr,2,0)+"亿");
        	$(".yljzmsr").text(formatNumber(data.title_month.yljzmsr,2,0)+"亿");
        	$(".zqtbzzl").text(formatNumber(zqtbzzl,2,0)+"%");
        	$(".zqtbzzl").parent("p").css("background-color",bgColor(zqtbzzl,zqzzmb));
        	$(".zmtbzzl").text(formatNumber(zmtbzzl,2,0)+"%");
        	$(".zmtbzzl").parent("p").css("background-color",bgColor(zmtbzzl,zmzzmb));
        	$(".zqzzmb").text(formatNumber(zqzzmb,2,0)+"%");
        	$(".zmzzmb").text(formatNumber(zmzzmb,2,0)+"%");
        	$(".nljzqsr").text(formatNumber(data.title_year.yljzqsr,2,0)+"亿");
        	$(".nljzmsr").text(formatNumber(data.title_year.yljzmsr,2,0)+"亿");
        	var nljzqtbzzl = data.title_year.zqtbzzl,
        		nljzqzzmb = data.title_year.zqzzmb,
        		nljzmtbzzl = data.title_year.zmtbzzl,
        		nljzmzzmb = data.title_year.zmzzmb;
        	$(".nljzqtbzzl").text(formatNumber(nljzqtbzzl,2,0)+"%");
        	$(".nljzqtbzzl").parent("p").css("background-color",bgColor(nljzqtbzzl,nljzqzzmb));
        	$(".nljzmtbzzl").text(formatNumber(nljzmtbzzl,2,0)+"%");
        	$(".nljzmtbzzl").parent("p").css("background-color",bgColor(nljzmtbzzl,nljzmzzmb));
        	$(".nljzqzzmb").text(formatNumber(nljzqzzmb,2,0)+"%");
        	$(".nljzmzzmb").text(formatNumber(nljzmzzmb,2,0)+"%");        	
        	//各事业部收入金额增长
        	var arrs1 = [],arrs2=[],arrs3=[],arrs4=[];
        	$.each(data.syb,function(k,v){
        		arrs1.push(v.bqzqsr);
        		arrs2.push(v.tqzqsr);
        		arrs3.push(v.bqzmsr);
        		arrs4.push(v.tqzmsr);
        	});
        	var maxs1 = Math.max.apply(null,arrs1);
        	var maxs2 = Math.max.apply(null,arrs2);
        	var maxs3 = Math.max.apply(null,arrs3);
        	var maxs4 = Math.max.apply(null,arrs4);
        	var tables = "";
        	$.each(data.syb,function(k,v){
        		var width1 = maxs1 === 0 ? 0 : (v.bqzqsr/maxs1)*45 ;
        		var width2 = maxs2 === 0 ? 0 : (v.tqzqsr/maxs2)*45 ;
        		var width3 = maxs3 === 0 ? 0 : (v.bqzmsr/maxs3)*45 ;
        		var width4 = maxs4 === 0 ? 0 : (v.tqzmsr/maxs4)*45 ;
        		var color1 = bgColor(v.zqsjzz,v.zqmbzz);
        		var color2 = bgColor(v.zmsjzz,v.zmmbzz);
        		var zqsjzz = v.zqsjzz !="null"?v.zqsjzz+"%" :"";
        		var zmsjzz = v.zmsjzz !="null"?v.zmsjzz+"%" :"";
        		tables += '<tr>'
								+'<td onclick="cause_click($(this),"1")">'+k+'</td>'
								+'<td>'
									+'<p class="w100b over-hide">'
										+'<span style="float: left;width: '+width1+'%; height: 16px;margin-top:3px;background-color: #4e79a7;"></span>'
										+'<span style="float: left;">'+formatNumber(v.bqzqsr,0,1)+'</span>'
									+'</p>'
									+'<p class="w100b over-hide" style="margin-top: 5px;">'
										+'<span style="float: left;width: '+width2+'%; height:16px;margin-top:3px;background-color: #a0cbe8;"></span>'
										+'<span style="float: left;">'+formatNumber(v.tqzqsr,0,1)+'</span>'
									+'</p>'
								+'</td>'
								+'<td>'+v.zqmbzz+'%</td>'
								+'<td style="color:'+color1+';font-weight:bold;">'+zqsjzz+'</td>'
								+'<td>'
									+'<p class="w100b over-hide">'
										+'<span style="float: left;width: '+width3+'%; height:16px;margin-top:3px;background-color: #4e79a7;"></span>'
										+'<span style="float: left;">'+formatNumber(v.bqzmsr,0,1)+'</span>'
									+'</p>'
									+'<p class="w100b over-hide" style="margin-top: 5px;">'
										+'<span style="float: left;width: '+width4+'%; height:16px;margin-top:3px;background-color: #a0cbe8;"></span>'
										+'<span style="float: left;">'+formatNumber(v.tqzmsr,0,1)+'</span>'
									+'</p>'
								+'</td>'
								+'<td>'+v.zmmbzz+'%</td>'
								+'<td style="color:'+color2+';font-weight:bold;">'+zmsjzz+'</td>'
							+'</tr>';
        	});
        	$(".d_sybT tbody").html(tables);
        	//折线图
        	var x_data = data.line.xDate;
        	var y1_data = data.line.tqzqsr;
        	var y2_data = data.line.zqsr;
        	myChart.setOption(getchart1(time,x_data,y1_data,y2_data,data.line.yqzqsr));
            $("#hide1").remove();
        },
        error:function(){
        	alert("数据请求失败");
            $("#hide1").remove();
        }
	});
}
function getchart1(time,x_data,y1_data,y2_data,yqzqsr){
	var option = {
		    title: {
		        text: time.split("-")[0]+'年'+time.split("-")[1]+'月'+'{a|液态奶事业部}折前收入趋势',
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
		        },
		        subtext:"单位:万元",
		        subtextStyle:{
		        	color: '#fff',
                    fontSize:16,
                    fontWeight:600
		        }
		    },
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
		            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        },
		        formatter:function(params){  
                   var relVal = time.split("-")[0]+'年'+time.split("-")[1]+'月'+params[0].name+"日";  
                   for (var i = 0, l = params.length; i < l; i++) {  
                        relVal += '<br/>' + params[i].marker +  "销售 : " +formatNumber(params[i].value,1,1);
                   }  
                   return relVal;  
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
		    series: [{
		            name: Number(time.split("-")[0])+"",
		            type: 'line',
		            symbol:'none',  //这句就是去掉点的  
		       		//smooth:true, 
		            itemStyle: {
		                normal: {
		                    lineStyle: {
		                        color: '#2D63A1',
		                        width:5
		                    },
		                    color: '#2D63A1'
		                }
		            },
		            data: y2_data,
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
		                     {name: '标注1',symbolSize:0, yAxis: Number(yqzqsr),label:{show:true,position:"middle"}}
		                     
		                ]

		             } 
		        },{
		            name: (Number(time.split("-")[0])-1)+"",
		            type: 'line',
		            symbol:'none',  //这句就是去掉点的  
		       		//smooth:true, 
		            itemStyle: {
		                normal: {
		                    lineStyle: {
		                        color: '#f28e2b',
		                        width:2
		                    },
		                    color: '#f28e2b'
		                }
		            },
		            data: y1_data
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
	return option;
}
//
function ajaxReq(urlSuffix, jsonData, func) {	
	
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
		 }
	});
};
//获取重品表格
function getData4(times) {
	//重点产品
	ajaxReq("keyproduct", { date_day: times }, function(data) {
		var str_head = '<tr>'
						+'<th><span class="add_zp">+</span></th>'
						+'<th>月累计折前收入</th>'
						+'<th>销售占比</th>'
						+'<th>折前同比增长率</th>'
					+'</tr>'
		$(".d_zdcpT thead").html(str_head);
		 var arr = [];
		 $.each(data.list, function(k,v) {
			 arr.push(v[1]);		 
		 });
		 var max = Math.max.apply(null,arr);
		 $(".key-produc-sum").each(function(i, r) {
			 if(i==0){
				 $(r).text(formatNumber(data.counts[i],0,1)); 
			 }else if(i==1){
				 $(r).text(formatNumber(data.counts[i],2,0)+"%"); 
			 }else{
				 $(r).text(formatNumber(data.counts[i],1,0)+"%"); 
			 }				
		 });
		 $(".key-produc-detail tr").remove();
		 $.each(data.list, function(i, r) {
			 var width = max === 0 ? 0 : (r[1]/max)*100 ;
			 var imgs = r[3] >=0 ? "up":"down";
			 var tr = '<tr>'
							+'<td onclick="cause_click($(this), 1)">'+ r[0] +'</td>'
							/*+'<td class="hide">0</td>'*/
							+'<td align="left"><span class="table_bg4A7EBE" style="width:'+width+'%;"></span>'+ formatNumber(r[1],1,1) +'</td>'
							+'<td>'+ r[2] +'%</td>'
							+'<td>'+ r[3] +'%<img src="../img/'+imgs+'.png" alt="" height="20px" style="vertical-align: top;"</td>'
						+'</tr>';
			 $(".key-produc-detail").append(tr);
		 });
         $("#hide1").remove();
	});
}
//获取新品表格
function getData5(times){
	ajaxReq("newproduct", { date_day: times }, function(data) {
		var str_head = '<tr>'
							+'<th><span class="add_xp">+</span></th>'
							+'<th>月累计折前收入</th>'
							+'<th>销售占比</th>'
						+'</tr>'
		$(".d_xpT thead").html(str_head);
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
				 $(r).text(formatNumber(data.counts[i],2,0)+"%"); 
			 }
		 });
		 $(".new-produc-detail tr").remove();
		 $.each(data.list, function(i, r) {
			 var width = max === 0 ? 0 : (r[1]/max)*100 ;
			 var tr = '<tr>'
						 +'<td onclick="cause_click($(this),1)">'+ r[0] +'</td>'
						/* +'<td class="hide">0</td>'*/
						 +'<td align="left"><span class="table_bg4A7EBE" style="width:'+width+'%;"></span>'+ formatNumber(r[1],1,1) +'</td>'
						 +'<td>'+ r[2] +'%</td>'
						+'</tr>';
			 $(".new-produc-detail").append(tr);
		 });
		 $("#hide1").remove();
	});
}
//重点产品下钻
$(".T_zd").on("click",".add_zp",function(){
	loadHide1("h_zp","hide2");
	var timess = $("#startTime").val();
	var jsonData = {
			year: timess.split("-")[0],
			month: timess.split("-")[1],
			businessName: "液态奶事业部"
	}
	var that = $(this);
	ajaxReq("keysubbrand",jsonData,function(data) {
		var head_str = "<tr>" 
							+"<th><span class='remove_zp'>-</span></th>"
							+"<th><span class='add_zp_sku'>+</span></th>"
							+"<th>月累计折前收入</th>"
							+"<th>销售占比</th>"
							+"<th>折前同比增长率</th>"
						+"</tr>"
		$(".T_zd thead").html(head_str);
		$(".key-produc-detail").html(getStr1(data));
		$("#hide2").remove();
		//获取sku
		$(".T_zd").on("click",".add_zp_sku",function(){
			loadHide1("h_zp","hide2");
			var thats = $(this);	
			$(".key-produc-detail").html("");
			ajaxReq("keysku",jsonData,function(data) {
				var head_str1 = "<tr>" 
					+"<th><span class='remove_zp'>-</span></th>"
					+"<th><span class='remove_zp_sku'>-</span></th>"
					+"<th></th>"
					+"<th>月累计折前收入</th>"
					+"<th>销售占比</th>"
					+"<th>折前同比增长率</th>"
				+"</tr>"
				$(".T_zd thead").html(head_str1);							
				$(".key-produc-detail").html(getstr2(data));
				$("#hide2").remove();
			});
		});			
	});
});

$(".T_zd").on("click",".remove_zp_sku",function(){
	loadHide1("h_zp","hide2");
	var that = $(this);
	var timess = $("#startTime").val();
	var jsonData = {
			year: timess.split("-")[0],
			month: timess.split("-")[1],
			businessName: "液态奶事业部"
	}
	$(".key-produc-detail").html("");
	ajaxReq("keysubbrand",jsonData,function(data) {
		var head_str1 = "<tr>" 
			+"<th><span class='remove_zp'>-</span></th>"
			+"<th><span class='add_zp_sku'>+</span></th>"
			+"<th>月累计折前收入</th>"
			+"<th>销售占比</th>"
			+"<th>折前同比增长率</th>"
		+"</tr>"
		$(".T_zd thead").html(head_str1);
		$(".key-produc-detail").html(getStr1(data));
		$("#hide2").remove();
	});
});
$(".T_zd").on("click",".remove_zp",function(){
	loadHide1("h_zp","hide1");
	var that = $(this);	
	var timess = $("#startTime").val();
	$(".key-produc-detail").html("");
	var head_str1 = "<tr>" 
						+"<th><span class='add_zp'>+</span></th>"
						+"<th>月累计折前收入</th>"
						+"<th>销售占比</th>"
						+"<th>折前同比增长率</th>"
					+"</tr>";
	$(".T_zd thead").html(head_str1);
	getData4(timess);
});
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
		str+="<tr><td rowspan='"+v.length+"'>"+k+"</td>"
		$.each(v,function(s,t){
			var imgs = t[3]<0 ? "down" : "up"; 
			var widths = max_zp<=0 ? "0":(t[1]/max_zp)*100;
			var m=0;
			if(m!=0){
				str+="<tr>"
			}
			str+="<td>"+t[0]+"</td>"
				+"<td align='left'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(t[1],1,1)+"</td>"
				+"<td>"+formatNumber(t[2],2,0)+"%</td>"
				+"<td>"+formatNumber(t[3],1,0)+"%<img src='../img/"+imgs+".png' alt='' height='20px' style='vertical-align: top;'/></td>"
				+"</tr>"
			m++;
		});
	});
	return str;
}
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
		str+="<tr><td rowspan='"+len+"'>"+k+"</td>"
		$.each(v,function(s,t){
			str+="<td rowspan='"+getJsonLength(t)+"'>"+s+"</td>"
			var m=0;
			$.each(t,function(m,n){
				var imgs = n[3]<0 ? "down" : "up"; 
				var widths = max_zp<=0 ? "0":(n[1]/max_zp)*100;
				var m=0;
				if(m!=0){
					str+="<tr>"
				}
				str+="<td title='"+n[0]+"' style='width:300px;text-align:left;'>"+n[0]+"</td>"
					+"<td align='left'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(n[1],1,1)+"</td>"
					+"<td>"+formatNumber(n[2],2,0)+"%</td>"
					+"<td>"+formatNumber(n[3],1,0)+"%<img src='../img/"+imgs+".png' alt='' height='20px' style='vertical-align: top;'/></td>"
					+"</tr>"
				m++;
			});
		});
	});
	return str;
}
//新品下钻
$(".T_xp").on("click",".add_xp",function(){
	loadHide1("h_xp","hide2");
	var timess = $("#startTime").val();
	var jsonData = {
			year: timess.split("-")[0],
			month: timess.split("-")[1],
			businessName: "液态奶事业部"
	}
	var that = $(this);
	ajaxReq("newsubbrand",jsonData,function(data) {
		var head_str = "<tr>" 
							+"<th><span class='remove_xp'>-</span></th>"
							+"<th><span class='add_xp_sku'>+</span></th>"
							+"<th>月累计折前收入</th>"
							+"<th>销售占比</th>"
						+"</tr>"
		$(".T_xp thead").html(head_str);
		$(".new-produc-detail").html(getStr3(data));
		$("#hide2").remove();
		//获取sku
		$(".T_xp").on("click",".add_xp_sku",function(){
			loadHide1("h_xp","hide2");
			var thats = $(this);	
			$(".new-produc-detail").html("");
			ajaxReq("newsku",jsonData,function(data) {
				var head_str1 = "<tr>" 
					+"<th><span class='remove_xp'>-</span></th>"
					+"<th><span class='remove_xp_sku'>-</span></th>"
					+"<th></th>"
					+"<th>月累计折前收入</th>"
					+"<th>销售占比</th>"
				+"</tr>"
				$(".T_xp thead").html(head_str1);							
				$(".new-produc-detail").html(getstr4(data));
				$("#hide2").remove();
			});
		});			
	});
});
$(".T_xp").on("click",".remove_xp_sku",function(){
	loadHide1("h_xp","hide2");
	var that = $(this);
	$(".new-produc-detail").html("");
	var timess = $("#startTime").val();
	var jsonData = {
			year: timess.split("-")[0],
			month: timess.split("-")[1],
			businessName: "液态奶事业部"
	}
	ajaxReq("newsubbrand",jsonData,function(data) {
		var head_str1 = "<tr>" 
			+"<th><span class='remove_xp'>-</span></th>"
			+"<th><span class='add_xp_sku'>+</span></th>"
			+"<th>月累计折前收入</th>"
			+"<th>销售占比</th>"
		+"</tr>"
		$(".T_xp thead").html(head_str1);
		$(".new-produc-detail").html(getStr3(data));
		$("#hide2").remove();
	});
});
$(".T_xp").on("click",".remove_xp",function(){
	loadHide1("h_xp","hide1");
	var that = $(this);	
	$(".new-produc-detail").html("");
	var timess = $("#startTime").val();
//	var jsonData = {
//			year: timess.split("-")[0],
//			month: timess.split("-")[1],
//			businessName: "液态奶事业部"
//	}
	var head_str1 = "<tr>" 
		+"<th><span class='add_xp'>+</span></th>"
		+"<th>月累计折前收入</th>"
		+"<th>销售占比</th>"
	+"</tr>"
	$(".T_xp thead").html(head_str1);
	getData5(timess);
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
		str+="<tr><td rowspan='"+v.length+"'>"+k+"</td>"
		$.each(v,function(s,t){
			var widths = max_zp<=0 ? "0":(t[1]/max_zp)*100;
			var m=0;
			if(m!=0){
				str+="<tr>"
			}
			str+="<td>"+t[0]+"</td>"
				+"<td align='left'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(t[1],1,1)+"</td>"
				+"<td>"+formatNumber(t[2],2,0)+"%</td>"
				+"</tr>"
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
		str+="<tr><td rowspan='"+len+"'>"+k+"</td>"
		$.each(v,function(s,t){
			str+="<td rowspan='"+getJsonLength(t)+"'>"+s+"</td>"
			var m=0;
			$.each(t,function(m,n){
				var widths = max_zp<=0 ? "0":(n[1]/max_zp)*100;
				var m=0;
				if(m!=0){
					str+="<tr>"
				}
				str+="<td title='"+n[0]+"' style='width:300px;text-align:left;'>"+n[0]+"</td>"
					+"<td align='left'><span class='table_bg4A7EBE' style='width:"+widths+"%;'></span>"+formatNumber(n[1],1,1)+"</td>"
					+"<td>"+formatNumber(n[2],2,0)+"%</td>"
					+"</tr>"
				m++;
			});
		});
	});
	return str;
}




 