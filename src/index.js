const $ = Common.$; import * as Common from './common'; 
import  * as Class  from "./Auto-Complete Class";
import * as Fetch from "./Fetch";
import * as Parser from "./Parser";
import * as Dom_Handler from "./DOM Handler";
var AutoComplete = new Class.autoComplete();
const completeArray = {'axiosData': {},'cheerioData': {}}
Dom_Handler.initializeDOM();
var inMobileView;
$(window).on('load resize',(i) => {
  $(window).width() < 768 ? inMobileView = true : inMobileView = false;
  $('[player=1] [attr=input-group-text]').focus()
})
$('.dropdown-menu').on('keydown',(i)=>  i.keyCode !== 9 && i.keyCode !==13 ? $(`[player=${$(i.target).parent().parent().attr('player')}] [attr=input-group-text]`).eq(0).focus() : null) // edit input while tabbing dropdown menu
$('[attr=input-group-text]').on('keyup keydown', v => { // text input change autocomplete event
  let lookupName = $(v.currentTarget).val().toLowerCase() 
	let currentPlayerCol= v.currentTarget.parentElement.parentElement.attributes[1].value
  let lookupPlatform = Common.platformHandler(currentPlayerCol)
  if (v.type == 'keyup') {
    if (lookupName.length < 2) { //dont run until more than 2 chars are entered, else remove autocomplete
      AutoComplete.controller.abort();
      $(`[attr='autocomplete-dropdown-items-to-delete']`).remove();
      return;
    } 
    else if (v.keyCode == 32 || v.keyCode >= 65 && v.keyCode <= 90 || v.keyCode >= 48 && v.keyCode <= 57 || v.keyCode == 16 || v.keyCode == 189) { ///A-z a-z 1-9 " " - _
      AutoComplete.controller.abort();
      AutoComplete = new Class.autoComplete(lookupName,currentPlayerCol,lookupPlatform);
      return;
    }
    else if (v.keyCode == 192) { // ` Key
      AutoComplete.controller.abort();
      $(`[attr='autocomplete-dropdown-items-to-delete']`).remove();
      Common.platformHandler(currentPlayerCol,true); // switch DOM button
      lookupPlatform =Common.platformHandler(currentPlayerCol)
      lookupName = $(v.currentTarget).val().slice(0,$(v.currentTarget).val().length-1)// remove ` char from name
      $(v.currentTarget).val(lookupName);
      AutoComplete = new Class.autoComplete(lookupName,currentPlayerCol,lookupPlatform);
    };
  }
  else if (v.type == 'keydown') {
    if (v.keyCode == 13){ //Enter Key
      AutoComplete.controller.abort();
      $(`[attr='autocomplete-dropdown-items-to-delete']`).remove();
      if (lookupName.length > 1 ) {
        fetchRankedData(lookupName,currentPlayerCol,lookupPlatform);
        Dom_Handler.initializeDOMForNewPlayer(currentPlayerCol,inMobileView);
      } 
      Common.focusNextInput(currentPlayerCol); 
    };
    if (v.keyCode == 9) {// Tab Key
      if (inMobileView) {
        if ($(`[player=${currentPlayerCol}] ul`).eq(1).children().length > 0) return;
        else {
          v.preventDefault();
          Common.focusNextInput(currentPlayerCol,true); 
        }
      }
      else if (!inMobileView) {
        if ($(`[player=${currentPlayerCol}] ul`).eq(0).children().length > 0) return;
        else {
          v.preventDefault();
          Common.focusNextInput(currentPlayerCol); 
        }
      }
    }
  }
});

$("div.input-group [attr*='input-group-button']").on("click",v=>{ //platform button click
	var lookupName = $(v.currentTarget).siblings('input').val()
  var currentPlayerCol =  v.currentTarget.parentElement.parentElement.attributes[1].value
	Common.platformHandler(currentPlayerCol,true)
  AutoComplete.controller.abort();
  if (lookupName.length < 1) return;
	AutoComplete = new Class.autoComplete(lookupName,currentPlayerCol,Common.platformHandler(currentPlayerCol))
});
/*
EVENT LISTENERS
*/

$("#clearForm").on("click", () => { // Clear Form Click
  Dom_Handler.initializeDOM();
  $(`.card`).attr('hidden',true);
  $('[attr="input-group-button-refresh"]').attr('hidden','')
});
window.dropdownClicked = async function (v,currentPlayerCol) { //Dropdown Click
  let lookupName = v[0].childNodes[0].data;
  let lookupPlatform = Common.platformHandler(currentPlayerCol);
  AutoComplete.controller.abort();
  fetchRankedData(lookupName,currentPlayerCol,lookupPlatform);
  Dom_Handler.initializeDOMForNewPlayer(currentPlayerCol,inMobileView);
  Common.focusNextInput(currentPlayerCol);
};
$(`button[attr='input-group-button-submit']`).on("click", (i) => { //Submit button click
  let currentPlayerCol = $(i.currentTarget).parent().parent().attr("player") * 1
  let lookupName = inMobileView ? $(`[player=${currentPlayerCol}] [attr=input-group-text]`).eq(1) : $(`[player=${currentPlayerCol}] [attr=input-group-text]`).eq(0);
  let lookupPlatform = Common.platformHandler(currentPlayerCol);
  if (lookupName.val().length < 1) return;
  AutoComplete.controller.abort();
  fetchRankedData(lookupName.val(),currentPlayerCol,lookupPlatform)
  Dom_Handler.initializeDOMForNewPlayer(currentPlayerCol,inMobileView)
})
$(`button[attr='input-group-button-refresh']`).on("click", (i) => { //Refresh button click
  let currentPlayerCol = $(i.currentTarget).parent().parent().attr("player") * 1
  let lookupPlatform = Common.platformHandler(currentPlayerCol);
  let lookupName = $(i.currentTarget).parent().siblings().eq(2).children().eq(0).text()
  AutoComplete.controller.abort();
  fetchRankedData(lookupName,currentPlayerCol,lookupPlatform);
  Dom_Handler.initializeDOMForNewPlayer(currentPlayerCol,inMobileView)

})
/*
MAIN FETCH
*/
function fetchRankedData (lookupName,currentPlayerCol,lookupPlatform) {
  Dom_Handler.initializeDOM(currentPlayerCol)
  Dom_Handler.togglePlaceholder(currentPlayerCol,true)
  Fetch.main(lookupName,lookupPlatform).then(response => {
    completeArray.axiosData.main = response.data
    Parser.main(completeArray)
    completeArray.cheerioData.main[0].unshift(response.request.responseURL)
    completeArray.cheerioData.main[0][0] = completeArray.cheerioData.main[0][0].replace('https://tracker-proxy.herokuapp.com/','')
  }).then(() => Dom_Handler.main(currentPlayerCol,completeArray.cheerioData,lookupName))
  .catch(message => Common.errorHandler(message,currentPlayerCol))

  Fetch.seasons(lookupName,lookupPlatform).then(response => {
    completeArray.axiosData.seasonsHistory = response.data
    Parser.seasons(completeArray)  
  }).then(() => Dom_Handler.seasons(currentPlayerCol,completeArray.cheerioData))
  .catch(message => Common.errorHandler(message,currentPlayerCol))
  
  Fetch.matches(lookupName,lookupPlatform).then(response => {
    completeArray.axiosData.matchHistory = response.data
    Parser.matches(completeArray)
  }).then(() => Dom_Handler.matches(currentPlayerCol,completeArray.cheerioData))
  .catch(message => Common.errorHandler(message,currentPlayerCol))
};