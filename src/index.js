const $ = Common.$; import * as Common from './common'; 
import rankImg from './rank-img-fetch';
import  * as Class  from "./Auto-Complete Class";
import * as Fetch from "./Fetch";
import * as Parser from "./Parser";
import * as Dom_Handler from "./DOM Handler";
const axios = require('axios');
var AutoComplete = new Class.autoComplete()
$('inject[attr=buttonGroup]').each((_,v) => $(v).replaceWith(Common.domElements.buttonGroup()))
$(`inject[attr=accordionCard1]`).each((i,v) => $(v).replaceWith(Common.domElements.accordionCard1(i)))
$(`inject[attr=accordionCard2]`).each((i,v) => $(v).replaceWith(Common.domElements.accordionCard2(i))) 
$(`inject[attr=accordionCard3]`).each((i,v) => $(v).replaceWith(Common.domElements.accordionCard3(i))) 
$(`inject[attr=accordionCard4]`).each((i,v) => $(v).replaceWith(Common.domElements.accordionCard4(i))) 

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
  fetchRankedData(lookupName,currentPlayerCol,lookupPlatform)
}

const completeArray = {'axiosData': {},'cheerioData': {}}
function fetchRankedData (lookupName,currentPlayerCol,lookupPlatform) {
  Fetch.main(lookupName,lookupPlatform)
    .then(response => {
      completeArray.axiosData.main =  response.data
      Parser.main(completeArray)
    })
    .then(() => {
    Dom_Handler.main(lookupName,currentPlayerCol,lookupPlatform,completeArray)
  })
  Fetch.matches(lookupName,lookupPlatform)
    .then(response => {
      completeArray.axiosData.matchHistory= response.data
      Parser.matches(completeArray)
    })
    .then(() => {
      Dom_Handler.matches(lookupName,currentPlayerCol,lookupPlatform,completeArray)
  })
  Fetch.seasons(lookupName,lookupPlatform)
    .then(response => {
      completeArray.axiosData.seasonsHistory = response.data
      Parser.seasons(completeArray)  
    }).then(()=>{
      Dom_Handler.seasons(lookupName,currentPlayerCol,lookupPlatform,completeArray)
  })
}




//   const data = {
//     header: {
//       url: completeData["playerInfo"]["url"],
//       name: name.toUpperCase(),
//     },
//     card1: {
//       season: a[4][0],
//       kd: () => {
//         return addOffset(4, "K/D");
//       },
//       rank: () => {
//         return addOffset(4, "Rank");
//       },
//       rankImg: rankImg(addOffset(4, "Rank")),
//       mmr: () => {
//         var ending = " MMR";
//         if (a[4].indexOf("Rank Points") !== -1) {
//           return addOffset(4, "Rank Points") + ending;
//         }
//         if (a[4].indexOf("MMR") !== -1) {
//           return addOffset(4, "MMR") + ending;
//         }
//       },
//       seasonalRecordRank: () => {
//         return addOffset(4, "Max Rank");
//       },
//       seasonalRecordMMR: () => {
//         if (a[4].indexOf("Max Rank Points") !== -1) {
//           return addOffset(4, "Max Rank Points") + " MMR";
//         }
//         if (a[4].indexOf("Max MMR") !== -1) {
//           return addOffset(4, "Max MMR") + " MMR";
//         }
//       },
//       seasonalRecordImg: rankImg(addOffset(4, "Max Rank")),
//       matches: Common.StripLetters(a[4][1]),
//       wins: addOffset(4, "Wins"),
//       losses: addOffset(4, "Losses"),
//       winPercent: addOffset(4, "Win %"),
//     },
//     card2: {
//       maxRankImgSource: () => {
//         if (maxRankIsMmr()) {
//           return a[7][0].src;
//         }
//         return a[6][0].src;
//       },
//       killsPerMatch: addOffset(2, "Kills/match"),
//       killsPerMinute: addOffset(2, "Kills/min"),
//       timePlayed: addOffset(2, "Time Played"),
//       averageKd: addOffset(2, "KD"),
//       totalKills: addOffset(2, "Kills"),
//       totalDeaths: addOffset(2, "Deaths"),
//       personalRecordSeason: () => {
//         if (maxRankIsMmr()) {
//           return addOffset(7, "Personal Record", 2);
//         }
//         return addOffset(6, "Personal Record", 2);
//       },
//       personalRecordMmr: () => {
//         if (maxRankIsMmr()) {
//           return addOffset(7, "Personal Record");
//         }
//         return addOffset(6, "Personal Record");
//       },
//       matches: addOffset(2, "Matches"),
//       wins: addOffset(2, "Wins"),
//       losses: addOffset(2, "Matches"),
//       winPercent: addOffset(2, "Win %"),
//     },
//     card3: completeData["seasons"],
//     card4: completeData.matchHistory,
//   };

// }


// Clear All button
// $("#clearForm").on("click", (i) => {
//   Common.ClearAll("all");
// });
//Refresh button
// $(`#p1Refresh,#p2Refresh,#p3Refresh,#p4Refresh,#p5Refresh`).on("click", (i) => {
//   console.log(i);
//   let player = Common.StripLetters(i.target.attributes[2].nodeValue);
//   let name = $("#p" + player + "name").text();
//   request(name, platform, player);
// });