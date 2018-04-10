//获取项目根目录
function getRootPath(){
    var strFullPath=window.document.location.href;
    var strPath=window.document.location.pathname;
    var pos=strFullPath.indexOf(strPath);
    var prePath=strFullPath.substring(0,pos);
    var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
    return(prePath+postPath);
}
//var basepath = getRootPath();
var basepath = 'http://10.1.150.147:8080';


//数据加载中图片
var img_mT = $("#Mask").height()/2-25;
$("#Mask img").css("margin-top",img_mT+"px");
//金额采用千分位，保留两位小数
/* 
将数值四舍五入后格式化. 
@param num 数值(Number或者String) 
@param cent 要保留的小数位(Number) 
@param isThousand 是否需要千分位 0:不需要,1:需要(数值类型); 
@return 格式的字符串,如'1,234,567.45' 
@type String 
*/ 
function formatNumber(num,cent,isThousand){ 
	num = num.toString().replace(/$|,/g,''); 
	if(isNaN(num))//检查传入数值为数值类型. 
	num = "0"; 
	if(isNaN(cent))//确保传入小数位为数值型数值. 
	cent = 0; 
	cent = parseInt(cent); 
	cent = Math.abs(cent);//求出小数位数,确保为正整数. 
	if(isNaN(isThousand))//确保传入是否需要千分位为数值类型. 
	isThousand = 0; 
	isThousand = parseInt(isThousand); 
	if(isThousand < 0) 
	isThousand = 0; 
	if(isThousand >=1) //确保传入的数值只为0或1 
	isThousand = 1; 
	sign = (num == (num = Math.abs(num)));//获取符号(正/负数) 
	//Math.floor:返回小于等于其数值参数的最大整数 
	num = Math.floor(num*Math.pow(10,cent)+0.50000000001);//把指定的小数位先转换成整数.多余的小数位四舍五入. 
	cents = num%Math.pow(10,cent); //求出小数位数值. 
	num = Math.floor(num/Math.pow(10,cent)).toString();//求出整数位数值. 
	cents = cents.toString();//把小数位转换成字符串,以便求小数位长度. 
	while(cents.length<cent){//补足小数位到指定的位数. 
		cents = "0" + cents; 
	} 
	if(isThousand == 0){ //不需要千分位符. 
		if(cent==0){
			return (((sign)?'':'-') + num); 
		}else{
			return (((sign)?'':'-') + num + '.' + cents); 
		}
		
	}else{
		//对整数部分进行千分位格式化. 
		for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) 
		num = num.substring(0,num.length-(4*i+3))+','+ 
		num.substring(num.length-(4*i+3)); 
		if(cent==0){
			return (((sign)?'':'-') + num);
		}else{
			return (((sign)?'':'-') + num + '.' + cents);
		}
		 
	}
	
} 


/**
 * 获取对比后的颜色
 * 传入一个值时 直接比较
 * 传入连个值时 相减对比
 * 允许传入带百分号的数字  如100.12%
 * 
 * @param num1
 * @param num2
 * @returns
 */
function bgColor(num1, num2) {
	var num = 0;
	if (arguments.length == 2) {
		num = parseFloat(num1) - parseFloat(num2);
	} else {
		num = parseFloat(num1);
	}
	return num >= 0 ? '#58A14E' : '#E15658'; 
}

/**
 * 获取对比后的颜色 3种颜色  红  黄  绿
 * 允许传入带百分号的数字  如100.12%
 * 
 * @param num1
 * @param num2
 * @returns
 */
function bgColor2(num) {
	num = parseFloat(num);
	return num >= 100 ? '#58A14E' : (num >= 96 ? '#EDC948' : '#E15658'); 
}

/*
 * 数据加载遮罩层
 * id  需要遮挡的部分的id值
 * */
function loadHide(id){
	/*$("<div id='shade' style='opacity:0.5;background:#fff'><img width='60px' style='position:relative;left:45%;top:45%;' src='"+basepath+"/web/img/loading.gif' /></div>").css({
		  position:'absolute', 
		  top:0, 
		  left:0, 
		  zIndex:300,
		  height:'100%',
		  width:'100%'
	}).appendTo('#'+id);*/


    $("<div id='shade' style='opacity:0.5;background:#fff'><img width='60px' style='position:relative;left:45%;top:45%;' src='../img/loading.gif' /></div>").css({
        position:'absolute',
        top:0,
        left:0,
        zIndex:300,
        height:'100%',
        width:'100%'
    }).appendTo('#'+id);
}

function loadHide1(id,id1){
	/*$("<div id='"+id1+"' style='opacity:0.5;background:#fff'><img width='60px' style='position:relative;left:45%;top:45%;' src='"+basepath+"/web/img/loading.gif' /></div>").css({
		  position:'absolute',
		  top:0,
		  left:0,
		  zIndex:300,
		  height:'100%',
		  width:'100%'
	}).appendTo('#'+id);*/

    $("<div id='"+id1+"' style='opacity:0.5;background:#fff'><img width='60px' style='position:relative;left:45%;top:45%;' src='../img/loading.gif' /></div>").css({
        position:'absolute',
        top:0,
        left:0,
        zIndex:300,
        height:'100%',
        width:'100%'
    }).appendTo('#'+id);
}

//获取json对象的length
function getJsonLength(jsonData) {  
	var length=0;  
	for(var ever in jsonData) {  
	    length++;  
	}  
	return length;  
} 