//rem 动态计算根元素的字体大小
function refreshRem(){
    var dewS=750,
        winW=document.documentElement.clientWidth,
        ratio=winW/dewS;
    document.documentElement.style.fontSize =ratio*100+'px'
}
refreshRem();
window.addEventListener('resize',refreshRem,false);

//时间 取的几月几号的时间
function changeTime(time){
    if(time){
        var str=time;
        var str1 =str.substr(5,2);
        var str2 =str.substr(8,2);
        return str=str1+'-'+str2;
    }
}



//第二步:通过ajax获取我们需要的数据
$.ajax({
    url:'http://api.iclient.ifeng.com/ClientNews?id=SYLB10,SYDT10&gv=5.4.0&os=ios&uid=8jWzrXDWQeep2Nw4AZYzmHxkbneHy4Fj',
    type:'get',
    dataType:'jsonp',
    callback:'jsonp',
    success:bindHtml
});

function bindHtml(data){
    console.log(data);//list focus
    for(var i=0;i<data.length;i++){
        if(data[i].type=='list'){
            listData=data[i].item;
        }else{
            focusData=data[i].item;
        }
    }
    console.log(focusData); //3
    console.log(listData); //20

    //ejs第四步 ejs.render 把模板的html结构 模板的数据以及ajax获取到的数据渲染到页面中
    var focusHTML=$('#focusTemplate').html();
    var result=ejs.render(focusHTML,{data:focusData});
    console.log(result);
    $('.swiper-wrapper').html(result);

    //中间内容的第四步：
    //ejs.render(模板的html结构,{模板的数据名称:ajax获取的内容部分的数据})
    var listHTML=$('#listTemplate').html();
    var listResult=ejs.render(listHTML,{dataList:listData});
    //console.log(listResult); //20
    $('.col').html(listResult);

    //swiper
    var mySwiper=new Swiper('.swiper-container',{
//    参数配置
        pagination:'.swiper-pagination',
        //分页器默认是小圆点  fraction 分式
        paginationType:'fraction',
        //无缝循环滚动
        loop:true,
        //自动切换
        autoplay:2000,
        //用户操作会autoplay失效 重新开启自动轮播的效果
        autoplayDisableOnInteraction:false,
        //阻止touch的冒泡事件
        touchMoveStopPropagation:false
    });
}


//上拉刷新 下拉加载
var myScroll,
    pullDownEl, pullDownOffset,
    pullUpEl, pullUpOffset,
    generatedCount = 0;

//下拉刷新
function pullDownAction() {
    console.log('我是下拉刷新的文字内容');
}

//上推加载
function pullUpAction() {
    console.log('我是上推加载的文字内容');
}

//初始化绑定iScroll控件
//解决卡顿
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);


function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;

    /**
     * 初始化iScroll控件
     * onRefresh
     * onScrollMove
     * onScrollEnd
     */
    myScroll = new iScroll('wrapper', {
        vScrollbar: false,
        topOffset: pullDownOffset,
/*        useTransition: false,
        hScrollbar:true,
        lockDirection:true,
        hScroll:true,
        momentum:true,*/
        checkDOMChanges:true, //监听数据变化
        onRefresh: function () {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
            }
        },
        onScrollMove: function () {
            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                this.minScrollY = 0;
            } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
            }
        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                pullDownAction();
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                pullUpAction();
            }
        }
    });
}





