/*String.prototype*/;
~function (pro) {
	function queryURLParameter() {
		//?a=1&b=2&c=3
		var reg = /([^?=&#]+)=([^?=&#]+)/g;
		var obj = {};
		this.replace(reg, function () {
			obj[arguments[1]] = arguments[2];
		});
		return obj;
	}
	pro.queryURLParameter = queryURLParameter;
}(String.prototype);
/*loading显示 单利模式*/
var loadingRender = function () {
	var ary = ["icon.png", "zf_concatAddress.png", "zf_concatInfo.png", "zf_concatPhone.png", "zf_course.png", "zf_course1.png", "zf_course2.png", "zf_course3.png", "zf_course4.png", "zf_course5.png", "zf_course6.png", "zf_cube1.png", "zf_cube2.png", "zf_cube3.png", "zf_cube4.png", "zf_cube5.png", "zf_cube6.png", "zf_cubeBg.jpg", "zf_cubeTip.png", "zf_emploment.png", "zf_messageArrow1.png", "zf_messageArrow2.png", "zf_messageChat.png", "zf_messageKeyboard.png", "zf_messageLogo.png", "zf_messageStudent.png", "zf_outline.png", "zf_phoneBg.jpg", "zf_phoneDetail.png", "zf_phoneListen.png", "zf_phoneLogo.png", "zf_return.png", "zf_style1.jpg", "zf_style2.jpg", "zf_style3.jpg", "zf_styleTip1.png", "zf_styleTip2.png", "zf_teacher1.png", "zf_teacher2.png", "zf_teacher3.jpg", "zf_teacher4.png", "zf_teacher5.png", "zf_teacher6.png", "zf_teacherTip.png"];

	//获取当前区域中所需要的元素
	var $loading = $('#loading');
	var $progressBox = $loading.find(".progressBox");
	var step = 0;
	var total = ary.length;

	return {
		init: function () {
			$loading.css("display", "block");
			//循环加载所有的图片控制进度条的宽度
			$.each(ary, function (index, item) {
				var oImg = new Image();
				oImg.src = "img/" + item;
				oImg.onload = function () {
					step++;
					$progressBox.css("width", step / total * 100 + "%");
					//当图片都加载完成，进度条也就完成了，关闭当前loading页面，显示phone页面
					if (step == total) {
						//方便开发或者是浏览当前页 当page=0就只是想显示当前loading页面，不想跳转
						if (page === 0) return;
						window.setTimeout(function () {
							$loading.css("display", "none");
							phoneRender.init();
						}, 2000);
					}
				};
			});
		}
	};
}();

/*phone显示 单例模式*/
var phoneRender = function () {
	var $phone = $("#phone"),
	    $listen = $phone.children(".listen"),
	    $listenTouch = $listen.children(".touch"),
	    $detail = $phone.children(".details"),
	    $detailTouch = $detail.children(".touch"),
	    $time = $phone.children(".time");
	var listenMusic = $("#listenMusic")[0],
	    detailsMusic = $("#detailsMusic")[0],
	    musicTimer = null;
	//播放自我介绍的音频，并且计算时间（真实音频的播放进度detailsMusic.currentTime 这个方法就是表示当前播放的进度，单位是秒s）
	function detailMusicPlay() {
		detailsMusic.play();
		musicTimer = window.setInterval(function () {
			var curTime = detailsMusic.currentTime,
			    minute = Math.floor(curTime / 60),
			    second = Math.floor(curTime - minute * 60);
			minute < 10 ? minute = "0" + minute : null;
			second < 10 ? second = "0" + second : null;
			$time.html(minute + ":" + second);
			//当音频播放完成，关闭当前phone页面，打开message页面
			//detailsMusic.duration 这个音频的总时间
			if (curTime === detailsMusic.duration) {
				window.clearInterval(musicTimer);
				closePhone();
			}
		}, 1000);
	}

	function closePhone() {
		detailsMusic.pause();
		if (page == 1) return;
		$phone.css("transform", "translateY(" + document.documentElement.clientHeight + "px)").on("webkitTransitionEnd", function () {
			//当过渡完成之后触发该时间
			$phone.css("display", "none");
		});
		messageRender.init();
	}

	return {
		init: function () {
			$phone.css("display", "block");
			listenMusic.play();
			//给listenTouch绑定接听事件，在移动端事件中click会有300ms的延迟 我们可以用移动端专门的原生事件 touchstart touchmove  touchend来进行模拟，zepto中给你做了处理封装好了一个方法 singleTap（单击事件）
			$listenTouch.singleTap(function () {
				console.log(1);
				$listen.css("display", "none");
				listenMusic.pause(); //停止音频播放
				$detail.css("transform", "translateY(0)");
				$time.css("display", "block");
				detailMusicPlay();
			});
			$detailTouch.singleTap(closePhone);
		}
	};
}();

/*message显示 单例模式*/
var messageRender = function () {
	var $message = $("#message"),
	    $messageList = $(".messageList"),
	    $list = $messageList.children("li"),
	    $keyBoard = $message.children(".keyBoard"),
	    $textTip = $keyBoard.children(".textTip"),
	    $submit = $keyBoard.children(".submit");
	var autoTimer = null,
	    step = -1,
	    total = $list.length,
	    bounceTop = 0;
	var messageMusic = $("#messageMusic")[0];
	//消息列表的发送
	function messageMove() {
		autoTimer = window.setInterval(function () {
			step++;
			var $cur = $list.eq(step);
			$cur.css({
				opacity: 1,
				transform: "translateY(0)"
			});
			//显示到第三个消息的时候，让键盘显示,消息停止发送
			if (step == 2) {
				window.clearInterval(autoTimer);
				$keyBoard.css("transform", "translateY(0)");
				$textTip.css("display", "block");
				textMove();
			}
			//从第四条消息开始，整个消息框整体上移
			if (step >= 3) {
				bounceTop -= $cur[0].offsetHeight + 10;
				$messageList.css("transform", "translateY(" + bounceTop + "px)");
			}
			//当消息发送完成
			console.log(step, total - 1);
			if (step == total - 1) {
				window.clearInterval(autoTimer);
				if (page == 2) return;
				$message.css("display", "none");
				messageMusic.pause();
				cubeRender.init();
			}
		}, 1500);
	}
	//textMove实现文字打印效果
	function textMove() {
		var text = "都学会了！ 可还是找不到工作呀！",
		    n = -1,
		    result = "";
		var textTimer = window.setInterval(function () {
			n++;
			result += text[n];
			$textTip.html(result);
			if (n == text.length - 1) {
				window.clearInterval(textTimer);
				//输入完成后显示发送按钮submit,绑定单击事件
				$submit.css("display", "block").singleTap(function () {
					$textTip.css("display", "none");
					$keyBoard.css("transform", "translateY(3.7rem)");
					messageMove();
				});
			}
		}, 200);
	}
	return {
		init: function () {
			$message.css("display", "block");
			messageMove();
			messageMusic.play();
		}
	};
}();

/*cube显示 单例模式*/
var cubeRender = function () {
	var $cube = $("#cube"),
	    $cubeBox = $cube.children(".cubeBox"),
	    $cubeBoxLis = $cubeBox.children("li");
	//处理移动端滑屏事件
	function isSwipe(changeX, changeY) {
		return Math.abs(changeX) > 30 || Math.abs(changeY) > 30;
	}

	function start(e) {
		//touchstart,记录当前一个指头的信息，e是事件对象，touch事件类型的中，事件对象e中有个属性touches表示在屏幕上所有的指头信息，这里只选取一个touchs[0],记录一下当前的clientX，clientY
		var point = e.touches[0];
		$(this).attr({
			strX: point.clientX,
			strY: point.clientY,
			changeX: 0,
			changeY: 0
		});
	};

	function move(e) {
		//在屏幕上滑动的时候记录changeX，changeY
		var point = e.touches[0];
		var changeX = point.clientX - $(this).attr("strX"),
		    changeY = point.clientY - $(this).attr("strY");
		$(this).attr({
			changeX: changeX,
			changeY: changeY
		});
	};

	function end(e) {
		//指头离开屏幕的时候，根据你滑动的距离，让cubeBox旋转一定的角度
		//attr这个方法获取出来的属性值都是字符串
		var changeX = parseFloat($(this).attr("changeX")),
		    changeY = parseFloat($(this).attr("changeY"));
		var rotateX = parseFloat($(this).attr("rotateX")),
		    rotateY = parseFloat($(this).attr("rotateY"));
		//判断，如果changeX。changeY没有大于30的，就不让魔法转动了
		if (!isSwipe(changeX, changeY)) return;
		rotateX = rotateX - changeY / 3;
		rotateY = rotateY + changeX / 3;

		$(this).attr({
			rotateX: rotateX,
			rotateY: rotateY
		}).css("transform", "scale(0.6) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)");
	};
	return {
		init: function () {
			$cube.css("display", "block");
			//记录初始旋转的角度
			$cubeBox.attr({
				rotateX: -30,
				rotateY: 45
			}).on("touchstart", start).on("touchmove", move).on("touchend", end);
			//给魔方的每个面绑定单击事件
			$cubeBoxLis.singleTap(function () {
				$cube.css("display", "none");
				swiperRender.init($(this).index());
			});
		}
	};
}();

/*swiper显示 单例模式*/
var swiperRender = function () {
	var $swiper = $("#swiper"),
	    $makisu = $("#makisu"),
	    $return = $swiper.children(".return");

	function change(example) {
		//只要当前切换的操作结束（不管是切换到下一个区域或者是→切回本区域都会触发swiper中内置的一个css3的过渡动画效果）同样也会触发onTransitionEnd这个回调函数
		//example：是当前创建的这个sweiper的一个实例
		//example.slides:这里记录了所有的slide切换的块；
		//example.activeIndex:记录当前正在展示的块的索引
		var slidesAry = example.slides;
		//当example.activeIndex===0就是折叠效果展示的时候
		if (example.activeIndex === 0) {
			$makisu.makisu({
				selector: "dd",
				overlap: 0.6,
				speed: 0.8
			});
			//展开
			$makisu.makisu("open");
		} else {
			$makisu.makisu({
				selector: "dd",
				overlap: 0.6,
				speed: 0
			});
			//收起来
			$makisu.makisu("close");
		}

		$.each(slidesAry, function (index, item) {
			if (index == example.activeIndex) {
				item.id = "page" + (index + 1);
				return;
			}
			item.id = null;
		});
	}
	return {
		init: function (index) {
			$swiper.css("display", "block");
			//初始化swiper实现六个面之间的切换
			var mySwiper = new Swiper(".swiper-container", {
				effect: "coverflow",
				onTransitionEnd: change,
				onInit: change
			});
			//可以手动控制展示的页面
			index = index || 0;
			mySwiper.slideTo(index, 0);
			//给return绑定单击事件
			$return.singleTap(function () {
				$swiper.css("display", "none");
				$("#cube").css("display", "block");
			});
		}
	};
}();

/*控制哪个page页显示*/
var urlObj = window.location.href.queryURLParameter();
var page = parseFloat(urlObj["page"]);
page === 0 || isNaN(page) ? loadingRender.init() : null;
page === 1 ? phoneRender.init() : null;
page === 2 ? messageRender.init() : null;
page === 3 ? cubeRender.init() : null;
page === 4 ? swiperRender.init() : null;

//# sourceMappingURL=index-compiled.js.map