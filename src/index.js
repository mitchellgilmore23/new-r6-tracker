const $ = Common.$; import * as Common from './common'; import  * as Class  from "./Auto-Complete Class"; import * as Dom_Handler from "./DOM Handler";
import * as Fetch from "./Fetch"; import * as Parser from "./Parser"; import * as Local_Storage from "./Local Storage"; import * as Favorite_Toast from './Favorite Toast';
import * as Off_Canvas from './Off Canvas'; require('./Local Storage'); import * as Swipe from './Swipe'; import * as Welcome_Modal from './Welcome Modal'
import ErrorToast from './Error Toast';

Dom_Handler.initializeDOM();
Off_Canvas.refresh();
const completeArray = {'axiosData': {},'cheerioData': {}}
var AutoComplete = new Class.autoComplete(); window.AutoComplete = AutoComplete;
var columnsOccupied = [0,0,0,0,0];
var inMobileView;

$(window).on('load resize',(i) => { // set inMobileView based on window size and focus first input box
  inMobileView = Common.mobileViewSetting();
  i.type =='load' && !inMobileView ? Common.focusNextInput(null,inMobileView) : null;
  Common.mobileAccordionHelper();
  $(`inject[attr=buttonGroup]`).replaceWith(Dom_Handler.defaultElements.buttonGroup())
  localStorage.getItem('showWelcomeModal') == 'false' ? null: Welcome_Modal.welcomeModal.show();
});

$(document).on('keyup', (event) => { 
  let target = $(event.target)
  if (target.is('[attr=input-group-text]')) { // text input change autocomplete event
    let lookupName = target.val();
    let lookupColumn= target.parents('[player]').attr('player');
    let lookupPlatform = Common.platformHandler(lookupColumn);
    if (event.originalEvent.keyCode == 192) { // ` Key
      AutoComplete.controller.abort();
      $(`[attr='autocomplete-dropdown-items-to-delete']`).remove();
      Common.platformHandler(lookupColumn,true); // switch DOM button
      lookupPlatform =Common.platformHandler(lookupColumn)
      lookupName = target.val().slice(0,target.val().length-1) // remove ` char from name
      target.val(lookupName);
      AutoComplete = new Class.autoComplete(lookupName,lookupColumn,lookupPlatform);
      event.stopPropagation();
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
    Common.dropdownTabbing(event);
  }
});

$(document).on('keydown', (event) => {
  let target = $(event.target)
  if (target.is('[attr=input-group-text]')) { // text input change autocomplete event
    let lookupName = target.val();
    let lookupColumn= target.parents('[player]').attr('player') * 1;
    let lookupPlatform = Common.platformHandler(lookupColumn);
    if (event.originalEvent.keyCode == 13){ //Enter Key
      AutoComplete.controller.abort();
      $(`[attr='autocomplete-dropdown-items-to-delete']`).remove();
      if (lookupName.length > 0) fetchRankedData(lookupName,lookupColumn,lookupPlatform);
      Common.focusNextInput(lookupColumn); 
    };
    if (event.originalEvent.keyCode == 9) {    // Tab Key
      AutoComplete.controller.abort();
      if (inMobileView) {
        if ($(`[player=${lookupColumn}] ul`).eq(1).children().length > 0) return;
        else {
          event.preventDefault();
          Common.focusNextInput(lookupColumn,true); 
        }
        return;
      }
      if (!inMobileView) {
        if ($(`[player=${lookupColumn}] ul`).eq(0).children().length > 0) return;
        else {
          Common.focusNextInput(lookupColumn); 
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
  let lookupPlatform = Common.platformHandler(lookupColumn.attr('player'));

  if (target.filter('div.input-group > [attr*=input-group-button],div.input-group > [attr*=input-group-button] > img').length > 0) { //Platform Button
    AutoComplete.controller.abort(); // stop auto-complete
    Common.platformHandler(lookupColumn.attr('player'),true); // toggle Physical platform button and return new platform
    if (lookupName.val().length < 1) return;
    AutoComplete = new Class.autoComplete(lookupName.val(),lookupColumn.attr('player'),lookupPlatform);
  }
  if (target.filter('#clearForm').length > 0){ ////////////////////////////////////////////////////////////////////////////////////////Clear All Button
    $(`.card`).attr('hidden',true);
    $('[attr="input-group-button-refresh"]').attr('hidden','');
    columnsOccupied = [0,0,0,0,0];
  }
  if (target.filter('button[attr=input-group-button-submit]').length > 0) { ///////////////////////////////////////////////////////////Submit Button
    if (lookupName.val().length < 1) return;
    fetchRankedData(lookupName.val(),lookupColumn.attr('player'),lookupPlatform);
  }
  if (target.filter('button[attr=input-group-button-refresh]').length > 0) { //////////////////////////////////////////////////////////Refresh Button
    fetchRankedData(lookupColumn.find('[attr=card-header]').text(),lookupColumn.attr('player'),lookupPlatform)
  }
  if (target.filter('button[attr=favorite-star-on-card],button[attr=favorite-star-on-card] > img').length > 0) { /////////////////////Save favorite Button
    Favorite_Toast.main(lookupColumn.find('[attr=card-header]').text(),lookupColumn,lookupPlatform)
  }
  if (target.filter('button[attr=offCanvas-player-button]').length > 0) { //////////////////////////////////////////////////////////////Off-Canvas Player Button
    lookupName = target.text();
    lookupPlatform = target.attr('platform');
    if (!inMobileView){
      let columnToInject = Common.findFirstAvailableColumn(columnsOccupied);
      fetchRankedData(lookupName,columnToInject,lookupPlatform);
      Off_Canvas.offCanvas.hide();
    }
    else { // do this for mobile devices
      let columnToInject = Common.carouselPage
      fetchRankedData(lookupName,columnToInject,lookupPlatform);
      Off_Canvas.offCanvas.hide();
    }  
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
    fetchRankedData(lookupName,lookupColumn,lookupPlatform)
  }
  if (target.filter('[welcomemodal=dontShowAgain]').length > 0){
    localStorage.setItem('showWelcomeModal','false')
  }
  else {  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ELSE clean up.. 
    AutoComplete.controller.abort();
    $(`[attr=autocomplete-dropdown-items-to-delete]`).length >0 ? $(`[attr=autocomplete-dropdown-items-to-delete]`).remove() : null;
  }

 
});

Swipe.addSwipeEvent(document, 'swipeLeft',() => Common.cycleMobileCarousel('next'));
Swipe.addSwipeEvent(document, 'swipeRight',() => Common.cycleMobileCarousel('prev'));

function fetchRankedData (lookupName,currentPlayerCol,lookupPlatform) {
  Dom_Handler.showPlaceholder(currentPlayerCol)   
  Fetch.main(lookupName,lookupPlatform).then(response => {
    completeArray.axiosData.main = response.data
    Parser.main(completeArray)
    completeArray.cheerioData.main[0].unshift(response.request.responseURL)
    completeArray.cheerioData.main[0][0] = completeArray.cheerioData.main[0][0].replace('https://tracker-proxy.herokuapp.com/','')
    Off_Canvas.refresh();
    Local_Storage.setStorage(completeArray.cheerioData.main[0][1],lookupPlatform,'recents');
    Favorite_Toast.handleFavoriteStarOnLoad(currentPlayerCol,completeArray.cheerioData.main[0][1],lookupPlatform);
    columnsOccupied[currentPlayerCol -1] = 1;
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