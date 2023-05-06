const $ = Common.$; import * as Common from './common'; import  * as Class  from "./Auto-Complete Class"; import * as Dom_Handler from "./DOM Handler";
import * as Fetch from "./Fetch"; import * as Parser from "./Parser"; import * as Local_Storage from "./Local Storage"; import * as Favorite_Toast from './Favorite Toast';
import * as Off_Canvas from './Off Canvas'; require('./Local Storage');

Off_Canvas.refresh();
Dom_Handler.initializeDOM();
const completeArray = {'axiosData': {},'cheerioData': {}}
var AutoComplete = new Class.autoComplete(); window.AutoComplete = AutoComplete;
var columnsOccupied = [0,0,0,0,0];
var inMobileView;
$(window).on('load resize',(i) => { // set inMobileView based on window size and focus first input box
  inMobileView = Common.mobileViewSetting();
  i.type =='load' && !inMobileView ? Common.focusNextInput(null,inMobileView) : null;
  Common.mobileAccordionHelper() 
});

$('.dropdown-menu').on('keydown',(i)=>  Common.dropdownTabbing) // edit input while tabbing dropdown menu
$('[attr=input-group-text]').on('keyup keydown', v => { // text input change autocomplete event
  Common.platformHandler(currentPlayerCol,true); // switch DOM button
  $(v.currentTarget).val( $(v.currentTarget).val() + 'Test');
})
$('[attr=input-group-text]').on('keyup keydown', v => { // text input change autocomplete event
  let lookupName = $(v.currentTarget).val();
	let currentPlayerCol= $(v.currentTarget).parents('[player]').attr('player') * 1;
  let lookupPlatform = Common.platformHandler(currentPlayerCol);
  if (v.type == 'keyup') {
    if (v.keyCode == 192) { // ` Key
      AutoComplete.controller.abort();
      $(`[attr='autocomplete-dropdown-items-to-delete']`).remove();
      Common.platformHandler(currentPlayerCol,true); // switch DOM button
      lookupPlatform =Common.platformHandler(currentPlayerCol)
      lookupName = $(v.currentTarget).val().slice(0,$(v.currentTarget).val().length-1)// remove ` char from name
      $(v.currentTarget).val(lookupName);
      AutoComplete = new Class.autoComplete(lookupName,currentPlayerCol,lookupPlatform);
    }
    else if (lookupName.length < 2) { //dont run until more than 2 chars are entered, else remove autocomplete
      AutoComplete.controller.abort();
      $(`[attr='autocomplete-dropdown-items-to-delete']`).remove();
    } 
    else if (v.keyCode == 32 || v.keyCode >= 65 && v.keyCode <= 90 || v.keyCode >= 48 && v.keyCode <= 57 || v.keyCode == 16 || v.keyCode == 189) { ///A-z a-z 1-9 " " - _
      AutoComplete.controller.abort();
      AutoComplete = new Class.autoComplete(lookupName,currentPlayerCol,lookupPlatform);
    }
  }
  else if (v.type == 'keydown') {
    if (v.keyCode == 13){ //Enter Key
      AutoComplete.controller.abort();
      $(`[attr='autocomplete-dropdown-items-to-delete']`).remove();
      if (lookupName.length > 0 ) {
        fetchRankedData(lookupName,currentPlayerCol,lookupPlatform);
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
	var lookupName = $(v.currentTarget).siblings('input').val();
	let currentPlayerCol= $(v.currentTarget).parents('[player]').attr('player') * 1;
	Common.platformHandler(currentPlayerCol,true);
  AutoComplete.controller.abort();
  if (lookupName.length < 1) return;
	AutoComplete = new Class.autoComplete(lookupName,currentPlayerCol,Common.platformHandler(currentPlayerCol));
});

$(`button[attr='input-group-button-submit']`).on("click", (i) => { //Submit button click
  let currentPlayerCol = $(i.currentTarget).parents('[player]').attr("player") * 1
  let lookupName = inMobileView ? $(`[player=${currentPlayerCol}] [attr=input-group-text]`).eq(1) : $(`[player=${currentPlayerCol}] [attr=input-group-text]`).eq(0);
  let lookupPlatform = Common.platformHandler(currentPlayerCol);
  if (lookupName.val().length < 1) return;
  fetchRankedData(lookupName.val(),currentPlayerCol,lookupPlatform)
});
$("#clearForm").on("click", () => { // Clear Form button click
  Dom_Handler.initializeDOM();
  $(`.card`).attr('hidden',true);
  $('[attr="input-group-button-refresh"]').attr('hidden','');
  columnsOccupied = [0,0,0,0,0];
});

$(`button[attr='input-group-button-refresh']`).on("click", (i) => { //Refresh button click
  let currentPlayerCol = $(i.currentTarget).parents('[player]').attr("player") * 1
  let lookupPlatform = Common.platformHandler(currentPlayerCol);
  let lookupName = $(i.currentTarget).parents('[player]').find('[attr=card-header]').text();
  fetchRankedData(lookupName,currentPlayerCol,lookupPlatform);
});

$('html').on("click",(i) =>{ // clear dropdown on window click
  AutoComplete.controller.abort();
  if ($(`[attr=autocomplete-dropdown-items-to-delete]`).length > 0) {
    $(`[attr=autocomplete-dropdown-items-to-delete]`).remove()
  };
});

window.dropdownClicked = async function (v,currentPlayerCol) { //Dropdown Click
  let lookupName = v[0].childNodes[0].data;
  let lookupPlatform = Common.platformHandler(currentPlayerCol);
  AutoComplete.controller.abort();
  fetchRankedData(lookupName,currentPlayerCol,lookupPlatform);
  Common.focusNextInput(currentPlayerCol);
};

$('[attr=favorite-star-on-card').on('click', (i) => Favorite_Toast.main(i));  // Display favorite toast AND save Local Storage on Fav click
$(document).on('click','[attr=offCanvas-player-button]', (i) =>{ // off-canvas favorite player clicked
  let {lookupName,lookupPlatform} = Off_Canvas.playerClicked(i);
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
}); 
$(document).on('click', '[attr=offCanvas-trash-button]',(i) => { // offcanvas player delete button press
  let {lookupName,type} = Off_Canvas.trashClicked(i);
  Local_Storage.removeStorage(lookupName,type);
});




function fetchRankedData (lookupName,currentPlayerCol,lookupPlatform) {
  Dom_Handler.initializeDOMForNewPlayer(currentPlayerCol,inMobileView) 
  Dom_Handler.togglePlaceholder(currentPlayerCol,true);

  Fetch.main(lookupName,lookupPlatform).then(response => {
    completeArray.axiosData.main = response.data
    Parser.main(completeArray)
    completeArray.cheerioData.main[0].unshift(response.request.responseURL)
    completeArray.cheerioData.main[0][0] = completeArray.cheerioData.main[0][0].replace('https://tracker-proxy.herokuapp.com/','')
    Off_Canvas.refresh();
    Local_Storage.setStorage(completeArray.cheerioData.main[0][1],lookupPlatform,'recents');
    Favorite_Toast.handleFavoriteStarOnLoad(currentPlayerCol,completeArray.cheerioData.main[0][1],lookupPlatform);
    columnsOccupied[currentPlayerCol -1] = 1;
  }).then(() => Dom_Handler.main(currentPlayerCol,completeArray.cheerioData,lookupName))
  .catch(error => Common.errorHandler(error,currentPlayerCol))

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