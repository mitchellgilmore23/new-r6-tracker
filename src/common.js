import * as Dom_Handler from './DOM Handler';
import Error_Toast from "./Error Toast";
export const $ = require("jquery"); window.$= $
export const bootstrap = require("bootstrap");
export var carouselPage= 1;
new bootstrap.Carousel(document.querySelector('#carousel_mobile'),{touch:true});

document.querySelector('#carousel_mobile').addEventListener('slide.bs.carousel',(e) => carouselPage = e.to + 1) // on mobile carousel cycle, change var carouselPage to match

//////////////////////////////
// event listener helpers
export const dropdownTabbing = (i) => i.keyCode !== 9 && i.keyCode !==13 ? $(`[player=${$(i.target).parents('[player]').attr('player')}] [attr=input-group-text]`).eq(0).focus() : null
export const mobileViewSetting = () => $(window).width() < 768 ? true : false
export const mobileAccordionHelper = () =>   $('.accordion-body .card').css('max-height',$(window).outerHeight() - 474);

export function errorHandler(message,currentPlayerCol) {
  Dom_Handler.hideCard(currentPlayerCol)
	$(`div[player=${currentPlayerCol}] [attr=input-group-button-refresh]`).attr('hidden','')
	Error_Toast(message)
};
export function platformHandler(playerCol,toggle=false){ // toggle or GET platform
	let buttonGroup =$(`[player='${playerCol}']`).children('.input-group').children('button')
	let xbox = buttonGroup.filter('[attr=input-group-button-xbox]')
	let ps = buttonGroup.filter('[attr=input-group-button-ps]')
	let platform;
	if (toggle == true){
		buttonGroup.each((_,v) => $(v).toggleClass("active"))
		return;
	}
	else if (toggle == false) xbox.hasClass('active') && !ps.hasClass('active') ? platform = "xbox" : platform = "psn";
	return platform;
};
export function focusNextInput(currentPlayerCol,inMobileView) { // to do
	if (!currentPlayerCol) currentPlayerCol = 0;
	currentPlayerCol = currentPlayerCol * 1
	if (inMobileView){
		new bootstrap.Carousel($('#carousel_mobile')).next()
		if (currentPlayerCol == 5) $(`[player=1] [attr=input-group-text]`).eq(1).focus()
		else $(`[player=${currentPlayerCol +1}] [attr=input-group-text]`).eq(1).focus()
	}
	else {
		if (currentPlayerCol == 5) $(`[player=1] [attr=input-group-text]`).eq(0).focus()
		else $(`[player=${currentPlayerCol +1}] [attr=input-group-text]`).eq(0).focus()
	}
};
export function findFirstAvailableColumn(columnsOccupied){
if (columnsOccupied[0] == 0) return 1
if (columnsOccupied[1] == 0) return 2
if (columnsOccupied[2] == 0) return 3
if (columnsOccupied[3] == 0) return 4
if (columnsOccupied[4] == 0) return 5
else return 1
}