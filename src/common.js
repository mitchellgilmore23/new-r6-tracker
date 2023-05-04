import * as Dom_Handler from './DOM Handler.js';
import Error_Toast from "./Error Toast";

export const $ = require("jquery"); window.$= $
export const bootstrap = require("bootstrap");

export function errorHandler(message,currentPlayerCol) {
  Dom_Handler.hideCard(currentPlayerCol)
	$(`div[player=${currentPlayerCol}] [attr=input-group-button-refresh]`).attr('hidden','')
  console.log(message,currentPlayerCol)
	Error_Toast(message)


}
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
}
export function focusNextInput(currentPlayerCol,inMobileView) { // to do
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
}


