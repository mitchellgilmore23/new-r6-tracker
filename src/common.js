export const $ = require("jquery"); window.$= $
export const bootstrap = require("bootstrap");
export var carouselPage= 1;

const carousel = new bootstrap.Carousel(document.querySelector('#carousel_mobile'));

document.querySelector('#carousel_mobile').addEventListener('slide.bs.carousel',(e) => carouselPage = e.to + 1) // on mobile carousel cycle, change var carouselPage to match

//////////////////////////////
// event listener helpers
export const dropdownTabbing = (i) => i.keyCode !== 9 && i.keyCode !==13 ? $(`[player=${$(i.target).parents('[player]').attr('player')}] [attr=input-group-text]`).eq(0).focus() : null
export const mobileViewSetting = () => $(window).width() < 768 ? true : false
export const mobileAccordionHelper = () => $('.accordion-body .card').css('max-height',$(window).outerHeight() - 474);

export function platformHandler(playerCol,toggle=false){ // toggle or GET platform
	let buttonGroup =$(`[player='${playerCol}']`).children('.input-group').children('button')
	let xbox = buttonGroup.filter('[attr=input-group-button-xbox]')
	let ps = buttonGroup.filter('[attr=input-group-button-ps]')
	let platform = xbox.hasClass('active') && !ps.hasClass('active') ? "xbox" : "psn";
	if (toggle == true) {
		buttonGroup.toggleClass("active")
		return platform;
	}
	else if (toggle == false) xbox.hasClass('active') && !ps.hasClass('active') ? platform = "xbox" : platform = "psn";
		return platform;
};
export function focusNextInput(currentPlayerCol,inMobileView) { // to do
	if (!currentPlayerCol) currentPlayerCol = 0;
	currentPlayerCol = currentPlayerCol * 1
	if (inMobileView){
		carousel.next();
		currentPlayerCol == 5 ? $(`[player=1] [attr=input-group-text]`).eq(1).focus() : $(`[player=${currentPlayerCol +1}] [attr=input-group-text]`).eq(1).focus()
	}
	else {
		if (currentPlayerCol == 5) $(`[player=1] [attr=input-group-text]`).eq(0).focus()
		else $(`[player=${currentPlayerCol +1}] [attr=input-group-text]`).eq(0).focus()
	}
};
export function cycleMobileCarousel(direction){
	direction == 'prev' ? carousel.prev() : carousel.next()
}
export function findFirstAvailableColumn(columnsOccupied){
	if (columnsOccupied[0] == 0) return 1
	if (columnsOccupied[1] == 0) return 2
	if (columnsOccupied[2] == 0) return 3
	if (columnsOccupied[3] == 0) return 4
	if (columnsOccupied[4] == 0) return 5
	else return 1
};