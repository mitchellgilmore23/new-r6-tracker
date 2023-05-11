require('./Local Storage'); 
import * as Class  from "./Auto-Complete Class"; 
import * as Dom_Handler from "./DOM Handler";
import * as Fetch from "./Fetch"; 
import * as Parser from "./Parser"; 
import * as Local_Storage from "./Local Storage"; 
import * as Favorite_Toast from './Favorite Toast';
import * as Off_Canvas from './Off Canvas'; 
import Swipe from './Swipe'; 
import Welcome_Modal from './Welcome Modal'
import ErrorToast from './Error Toast';

var completeArray = {'axiosData': {},'cheerioData': {}}, AutoComplete, columnsOccupied;
var inMobileView = () => $(window).width() < 768 ? true : false;
$(window).on('load resize',(i) => { // set inMobileView based on window size and focus first input box
  if(i.type =='load') {
    Dom_Handler.initializeDOM();

    if (!inMobileView) focusNextInput(null,inMobileView)
    localStorage.removeItem('showWelcomeModal')// TO REMOVE. just clear old local storage if already stored
    if (localStorage.getItem('showWelcomeModal2') !== 'false') Welcome_Modal().show()
    Off_Canvas.refresh();
    AutoComplete = new Class.autoComplete(); window.AutoComplete = AutoComplete;
    columnsOccupied = [0,0,0,0,0];
  };
  $('div[mobile] .accordion-body .card').css('max-height',$(window).outerHeight() - 465);
  $('div[desktop] .accordion-body .card').css('max-height',$(window).outerHeight() - 453);
  if (i.type == 'resize') {
    inMobileView();
  };
});

Swipe(document, 'swipeLeft'); Swipe(document, 'swipeRight');

$(document).on('keyup', (event) => { 
  let target = $(event.target)
  let lookupName = target.val();
  let lookupColumn= target.parents('[player]').attr('player') * 1;
  let lookupPlatform = platformHandler(lookupColumn);
  if (target.is('[attr=input-group-text]')) { // text input change autocomplete event
    if (event.originalEvent.keyCode == 192) { // ` Key
      AutoComplete.controller.abort();
      $(`[attr='autocomplete-dropdown-items-to-delete']`).remove();
      platformHandler(lookupColumn,true); // switch DOM button
      lookupPlatform =platformHandler(lookupColumn)
      lookupName = target.val().slice(0,target.val().length-1) // remove ` char from name
      target.val(lookupName);
      AutoComplete = new Class.autoComplete(lookupName,lookupColumn,lookupPlatform);
      return false;
    }
    if (lookupName.length < 2) { //dont run until more than 2 chars are entered, else remove autocomplete
      AutoComplete.controller.abort();
      $(`[attr='autocomplete-dropdown-items-to-delete']`).remove();
      return false;
    } 
    else { // run autocomplete with normal characters
      AutoComplete.controller.abort();
      AutoComplete = new Class.autoComplete(lookupName,lookupColumn,lookupPlatform);
    }
  }
  if (target.is('.list-group-item')) { // if tabbing through autocomplete dropdown, text change returns to text box
    if (event.originalEvent.keyCode !== 9 && event.originalEvent.keyCode !== 13)  $(`[player=${lookupColumn * 1}] [attr=input-group-text]`).eq(0).focus()
  }
});

$(document).on('keydown', (event) => {
  let target = $(event.target)
  if (target.is('[attr=input-group-text]')) { ///////////////////////////////////////////////////////////////// text input change autocomplete event
    let lookupName = target.val();
    let lookupColumn= target.parents('[player]').attr('player') * 1;
    let lookupPlatform = platformHandler(lookupColumn);
    if (event.originalEvent.keyCode == 13){ /////////////////////////////////////////////////////////////////Enter Key
      AutoComplete.controller.abort();
      $(`[attr='autocomplete-dropdown-items-to-delete']`).remove();
      if (lookupName.length > 0) fetchRankedData(lookupName,lookupColumn,lookupPlatform);
      focusNextInput(lookupColumn); 
    };
    if (event.originalEvent.keyCode == 9) {////////////////////////////////////////////////////////////////// Tab Key
      AutoComplete.controller.abort();
      if (inMobileView) {
        if ($(`[player=${lookupColumn}] ul`).eq(1).children().length > 0) return;
        else {
          event.preventDefault();
          focusNextInput(lookupColumn,true); 
        }
        return;
      }
      if (!inMobileView) {
        if ($(`[player=${lookupColumn}] ul`).eq(0).children().length > 0) return;
        else {
          focusNextInput(lookupColumn); 
          event.preventDefault();
        }
      }
    }
  }
});

$(document).on('click', event => {

  let target = $(event.target)
  let lookupName = target.parents('[player]').find('[attr=input-group-text]');
  let lookupColumn = target.parents('[player]')
  let lookupPlatform = platformHandler(lookupColumn.attr('player'));

  if (target.filter('div.input-group > [attr*=input-group-button],div.input-group > [attr*=input-group-button] > img').length > 0) { //Platform Button
    AutoComplete.controller.abort(); // stop auto-complete
    platformHandler(lookupColumn.attr('player'),true); // toggle Physical platform button and return new platform
    if (lookupName.val().length < 1) return;
    AutoComplete = new Class.autoComplete(lookupName.val(),lookupColumn.attr('player'),lookupPlatform);
  }
  if (target.filter('#clearForm').length > 0){ ////////////////////////////////////////////////////////////////////////////////////////Clear All Button
    $(`.card`).attr('hidden',true);
    $('[attr="input-group-button-refresh"]').attr('hidden','');
    $(`[aria-label^=Slide]`).text('');//carousel indicators set empty
    columnsOccupied = [0,0,0,0,0];
  }
  if (target.filter('button[attr=input-group-button-submit]').length > 0) { ///////////////////////////////////////////////////////////Submit Button
    if (lookupName.val().length < 1) return;
    fetchRankedData(lookupName.val(),lookupColumn.attr('player') * 1,lookupPlatform);
  }
  if (target.filter('button[attr=input-group-button-refresh]').length > 0) { //////////////////////////////////////////////////////////Refresh Button
    fetchRankedData(lookupColumn.find('[attr=card-header]').text(),lookupColumn.attr('player') * 1,lookupPlatform)
  }
  if (target.filter('button[attr=favorite-star-on-card],button[attr=favorite-star-on-card] > img').length > 0) { /////////////////////Save favorite Button
    Favorite_Toast.main(lookupColumn.find('[attr=card-header]').text(),lookupColumn,lookupPlatform)
  }
  if (target.filter('button[attr=offCanvas-player-button]').length > 0) { //////////////////////////////////////////////////////////////Off-Canvas Player Button
    lookupName = target.text();
    lookupPlatform = target.attr('platform');
    if (!inMobileView) fetchRankedData(lookupName,findFirstAvailableColumn(),lookupPlatform);
    else fetchRankedData(lookupName,Swipe(),lookupPlatform);
    Off_Canvas.offCanvas.hide();
  }
  if (target.filter('button[attr=offCanvas-trash-button],button[attr=offCanvas-trash-button] > img').length > 0) { /////////////////////Off-Canvas Delete Button
    let lookupName = target.parents('.row').find('[platform]').text();
    let type = target.parents('[attr=offCanvas-recent-players],[attr=offCanvas-favorites]').attr('attr') == 'offCanvas-favorites' ? 'favorites' : 'recents';
    Local_Storage.removeStorage(lookupName,type);
  }
  if (target.filter('ul.dropdown-menu > button, ul.dropdown-menu > button > p, ul.dropdown-menu > button > span').length > 0) { /////// Dropdown Menu
    if (target.filter('button').length > 0) {
      lookupName = target.children('p').text()
      lookupColumn = target.children('p').attr('col')
    }
    if (target.filter('p').length > 0) {
      lookupName = target.text()
      lookupColumn = target.attr('col')
    }
    if (target.filter('span').length > 0) {
      lookupName = target.siblings('p').text()
      lookupColumn = target.siblings('p').attr('col')
    }   
    $('[attr=autocomplete-dropdown-items-to-delete]').remove();
    AutoComplete.controller.abort();
    fetchRankedData(lookupName,lookupColumn * 1,lookupPlatform)
    focusNextInput(lookupColumn); 
  }
  if (target.filter('[welcomemodal=dontShowAgain]').length > 0){ ////////////////////////////////////////////////////////////////////// Welcome Modal Dont show again Button
    localStorage.setItem('showWelcomeModal2','false')
  }
  else {  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ELSE clean up.. 
    AutoComplete.controller.abort();
    $(`[attr=autocomplete-dropdown-items-to-delete]`).length >0 ? $(`[attr=autocomplete-dropdown-items-to-delete]`).remove() : null;
  } 
});
export function fetchRankedData (lookupName,currentPlayerCol,lookupPlatform) {
  if (!lookupName || !currentPlayerCol || !lookupPlatform) return;

  Dom_Handler.showPlaceholder(currentPlayerCol)   
  Fetch.main(lookupName,lookupPlatform).then(response => {
    completeArray.axiosData.main = response.data
    Parser.main(completeArray);
    completeArray.cheerioData.main[0].unshift(response.request.responseURL)
    completeArray.cheerioData.main[0][0] = completeArray.cheerioData.main[0][0].replace('https://tracker-proxy.herokuapp.com/','')
    Off_Canvas.refresh();
    Local_Storage.setStorage(completeArray.cheerioData.main[0][1],lookupPlatform,'recents');
    // Local_Storage.setPersistentStorage(completeArray.cheerioData.main[0][1],lookupPlatform,currentPlayerCol)
    Favorite_Toast.handleFavoriteStarOnLoad(currentPlayerCol,completeArray.cheerioData.main[0][1]);
    columnsOccupied[currentPlayerCol-1] = 1;
  }).then(() => {
    Dom_Handler.main(currentPlayerCol,completeArray.cheerioData,lookupName,inMobileView)
  
  })
  .catch(error => {
    ErrorToast(error,lookupName,lookupPlatform);
    columnsOccupied[currentPlayerCol -1] = 0;
    $(`div[player=${currentPlayerCol}] [attr=input-group-button-refresh]`).attr('hidden',''); // hide the refresh button
    $(`[player=${currentPlayerCol}]`).find('.card').attr('hidden',''); // hide the card with no results

  })

  Fetch.seasons(lookupName,lookupPlatform).then(response => {
    completeArray.axiosData.seasonsHistory = response.data
    Parser.seasons(completeArray)  
  }).then(() => Dom_Handler.seasons(currentPlayerCol,completeArray.cheerioData))
  .catch(err => null)
  
  Fetch.matches(lookupName,lookupPlatform).then(response => {
    completeArray.axiosData.matchHistory = response.data
    Parser.matches(completeArray)
  }).then(() => Dom_Handler.matches(currentPlayerCol,completeArray.cheerioData))
  .catch(err => null)
};

function platformHandler(playerCol,toggle=false) {
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
function focusNextInput(currentPlayerCol,inMobileView) { // to do
  const carousel = new bootstrap.Carousel($('#carousel_mobile'))
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
function findFirstAvailableColumn(columnsOccupied){
	if (columnsOccupied[0] == 0) return 1
	if (columnsOccupied[1] == 0) return 2
	if (columnsOccupied[2] == 0) return 3
	if (columnsOccupied[3] == 0) return 4
	if (columnsOccupied[4] == 0) return 5
	else return 1
};