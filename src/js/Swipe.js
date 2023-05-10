const carousel = new bootstrap.Carousel(document.querySelector('#carousel_mobile'))
var carouselPage = 1;
document.querySelector('#carousel_mobile').addEventListener('slide.bs.carousel',(e) => carouselPage = e.to + 1 ); 
export default function(theDom, eventName) {
	if (theDom && eventName){	
		var swipeAmt = 170
		var eStart=0, eEnd=0;
		theDom.addEventListener('touchstart',(e) =>  eStart = e.targetTouches[0].clientX)
		theDom.addEventListener('mousedown', (e) => eStart = e.clientX)
		theDom.addEventListener('touchend',(e) => {
			eEnd = e.changedTouches[0].clientX;
			var moveVal = eEnd-eStart;
			var moveAbsVal = Math.abs(moveVal);
			if (moveVal < 0 && moveAbsVal > swipeAmt && eventName=="swipeLeft") carousel.next();
			if (moveVal>0 && moveAbsVal> swipeAmt && eventName=="swipeRight") carousel.prev();
		});
		theDom.addEventListener('mouseup', (e) => {
			var moveVal = eEnd-eStart;
			eEnd = e.clientX
			var moveAbsVal = Math.abs(eEnd-eStart);
			if (moveVal<0 && moveAbsVal>30 && eventName=="swipeLeft") carousel.next();
			if (moveVal>0 && moveAbsVal>30 && eventName=="swipeRight") carousel.prev();
		});
	}
	else return carouselPage;
};

