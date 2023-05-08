export function addSwipeEvent(theDom, eventName, handleEvent) {
	var swipeAmt = 150
	var eStart=0, eEnd=0;
	theDom.addEventListener('touchstart',(e) =>  eStart = e.targetTouches[0].clientX)
	theDom.addEventListener('mousedown', (e) => eStart = e.clientX)
	theDom.addEventListener('touchend',(e) => {
		eEnd = e.changedTouches[0].clientX;
		var moveVal = eEnd-eStart;
		var moveAbsVal = Math.abs(moveVal);
		if (moveVal < 0 && moveAbsVal > swipeAmt && eventName=="swipeLeft") handleEvent();
		if (moveVal>0 && moveAbsVal> swipeAmt && eventName=="swipeRight") handleEvent();
		$('[attr=input-group-text]').text(moveVal)
		console.log(moveVal)
	});
	theDom.addEventListener('mouseup', (e) => {
		var moveVal = eEnd-eStart;
		eEnd = e.clientX
		var moveAbsVal = Math.abs(eEnd-eStart);
		if (moveVal<0 && moveAbsVal>30 && eventName=="swipeLeft") handleEvent();
		if (moveVal>0 && moveAbsVal>30 && eventName=="swipeRight") handleEvent();
	});
};