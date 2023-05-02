const $ = Common.$; import * as Common from './common'; 
import  * as Class  from "./Auto-Complete Class";
import * as Fetch from "./Fetch";
import * as Parser from "./Parser";
import * as Dom_Handler from "./DOM Handler";
var AutoComplete = new Class.autoComplete()
Dom_Handler.initializeDOM();
var oldTextForInputChange;
$('[attr=input-group-text]').on('keyup', async v => { // text input change
	const newText = String(v.currentTarget.value).toLowerCase()
  if (oldTextForInputChange === newText || newText.length < 1 ) {
    AutoComplete.clearResults(); return;
  }
  var lookupName = newText;
  oldTextForInputChange = newText;
	var currentPlayerCol= v.currentTarget.parentElement.parentElement.attributes[1].value
  var lookupPlatform = Common.platformHandler(currentPlayerCol)
	AutoComplete = new Class.autoComplete(lookupName,currentPlayerCol,lookupPlatform)
})

$("[attr*='input-group-button']").on("click",v=>{ //platform button click
	var lookupName = $(v.currentTarget).siblings('input').val()
  var currentPlayerCol =  v.currentTarget.parentElement.parentElement.attributes[1].value
	Common.platformHandler(currentPlayerCol,true)
	AutoComplete = new Class.autoComplete(lookupName,currentPlayerCol,Common.platformHandler(currentPlayerCol))
})

window.dropdownClicked = async function (v,currentPlayerCol) { //dropdown clicked
  var lookupName = v[0].childNodes[0].data;
  var currentPlayerCol;
  var lookupPlatform = Common.platformHandler(currentPlayerCol)
  AutoComplete.clearResults()
  Dom_Handler.clearPlayer(currentPlayerCol)
  fetchRankedData(lookupName,currentPlayerCol,lookupPlatform)
}

const completeArray = {'axiosData': {},'cheerioData': {}}
function fetchRankedData (lookupName,currentPlayerCol,lookupPlatform) {
  Dom_Handler.initializeDOM();
  Dom_Handler.togglePlaceholder(currentPlayerCol,true)
  Fetch.main(lookupName,lookupPlatform).then(response => {
    completeArray.axiosData.main = response.data
    Parser.main(completeArray)
    completeArray.cheerioData.main[0].unshift(response.request.responseURL)
    completeArray.cheerioData.main[0].unshift(lookupName.toUpperCase())
  }).then(() => Dom_Handler.main(currentPlayerCol,completeArray.cheerioData,lookupName))
  .catch(message => { errorHandler(message,currentPlayerCol) })
  
  Fetch.seasons(lookupName,lookupPlatform).then(response => {
    completeArray.axiosData.seasonsHistory = response.data
    Parser.seasons(completeArray)  
  }).then(() => Dom_Handler.seasons(currentPlayerCol,completeArray.cheerioData))
   .catch(message => {errorHandler(message,currentPlayerCol)})
  
  Fetch.matches(lookupName,lookupPlatform).then(response => {
    completeArray.axiosData.matchHistory = response.data
    Parser.matches(completeArray)
  })
  .then(() => Dom_Handler.matches(currentPlayerCol,completeArray.cheerioData))
  .catch(message => {
    errorHandler(message,currentPlayerCol)
  })
};
function errorHandler(message,currentPlayerCol) {
  console.log(message,currentPlayerCol)
}



// Clear All button
$("#clearForm").on("click", (i) => {
Dom_Handler.togglePlaceholder()

});
//Refresh button
// $(`#p1Refresh,#p2Refresh,#p3Refresh,#p4Refresh,#p5Refresh`).on("click", (i) => {
//   console.log(i);
//   let player = Common.StripLetters(i.target.attributes[2].nodeValue);
//   let name = $("#p" + player + "name").text();
//   request(name, platform, player);
// });