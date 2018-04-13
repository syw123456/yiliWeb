史跃伟
http://10.60.138.210/yili/login
kj_fujl/yili2017!!
mac地址：18:65:90:d5:f8:d1
IP地址：10.1.150.144


echarts 版本报表部署需求：
前后端独立部署，需要开启前端端口（默认开启80或者8080）
前端服务器需要访问后端，后端需要开启端口（同一台服务器部署不用新开）


页面构成
saleSuccess          销售达成
saleIncrease         销售增长
productRepresent     产品表现
brandOverview        品牌总览
saleDaily            集团销售增长日报
saleSuccessday       集团销售达成日报
jquery的版本          v1.11.1 
echart的版本          v4.0.2
日期选择器             WdatePicker
服务器的地址           1564行
基本数据和柱状图以及2个表格的接口   169行
地图的接口                      452行
获取右下角的3块的数据             506行

1.集团日报的报表
接口1 基本数据柱状图以及 2个表格的接口
basepath+"/SalesReached/getxsdc
参数 day: 2017-04-08
返回--

接口2 获取地图的接口
basepath+"/SalesReached/getMap
day: 2017-12-31
businessMapName :液态奶事业部
返回--

接口3 获取右下角的数据
basepath+"/SalesReached/getRightBottom
day: 2017-12-07  //日期
isZQ: true    //是否是折前收入  ture是  fasle 不是
businessMapName: 事业部名称
bigAreaMapName:  大区名称
返回--

接口4 重点产品和新品的加号
basepath+"/SalesReached/ getProductByBusinessName
day: 2017-12-07  日期
isZQ: false   //是否是折前收入  ture是  fasle 不是
businessMapName: 事业部名称
bigAreaMapName:  大区名称
isMainProduct: false  是否是重点的产品  ture是  false 不是
返回--


接口5 SKU的加号的接口
basepath+"/SalesReached/ getSkuByProductName
day: 2017-12-31  日期
isZQ: true  //是否是折前收入  ture是  fasle 不是
businessMapName: 事业部名称
bigAreaMapName:  大区名称
isMainProduct: true是否是重点的产品  ture是  false 不是
返回--

http://10.60.138.106/trusted/MnysXKyUQ-a1NdIoBe1JDw==:3yS21__9Q7xcyJkOBJfOPb8e/views/--_10/-?:embed=y&:showAppBanner=false&:showShareOptions=true&:display_count=no&:showVizHome=no&:toolbar=no

数据的展现
Echarts  做报表
BIEE集成echats 做报表
Zeppelin 可以做报表
TableAU的使用可以做表格和柱状图的结合的图形化  可以做报表

BIEE的开发
http://10.119.1.179:9502/analytics/saw.dll?PortalPages&PortalPath=/shared/POC/_portal/POC&Page=page1&NQUser=weblogic&NQPassword=admin123&lang=zh













