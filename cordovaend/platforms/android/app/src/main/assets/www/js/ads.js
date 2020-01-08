//initialize the goodies
function showBannerFunc(){
	admob.banner.show();
};

function destroyBanner() {
	admob.banner.hide();
};

function showInterstitialFunc(){
	admob.interstitial.show();
};

function loadAds() {
	admob.banner.config({
		id: admobid.banner,
		isTesting: isTesting,
		overlap: true,
		autoShow: false,
	});
	admob.banner.prepare();

	admob.interstitial.config({
		id: admobid.interstitial,
		isTesting: isTesting,
		autoShow: false,
	});
	admob.interstitial.prepare();
};

var admobid = {};
if (/(android)/i.test(navigator.userAgent)) {  // for android & amazon-fireos
  admobid = {
    banner: 'ca-app-pub-3940256099942544/6300978111', //'ca-app-pub-1760533820203815/9424177616', // 
    interstitial: 'ca-app-pub-3940256099942544/1033173712', //'ca-app-pub-1760533820203815/1545687592',
  };
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {  // for ios
  admobid = {
    banner: 'ca-app-pub-3940256099942544/2934735716', //'ca-app-pub-1760533820203815/9970972528',
    interstitial: 'ca-app-pub-3940256099942544/4411468910', //'ca-app-pub-1760533820203815/3405564176',
  };
};

document.addEventListener('admob.interstitial.events.CLOSE', function(event) {
	admob.interstitial.prepare();
});