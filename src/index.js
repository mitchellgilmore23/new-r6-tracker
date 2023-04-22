const $ = Common.$; import * as Common from './common.js'; 
import rankImg from './rank-img-fetch.js';
import  * as Class  from "./Auto-Complete Class.js"; 

let AutoComplete;
$(`injectcard`).each((_,v) => {$(v).replaceWith(Common.loadPlayerCards($(v).attr('player')))}); // loads cards for the players

$('[attr=input-group-text]').on('keyup', async v=>{ // text input change
	let lookupName = v.currentTarget.value;	
	let currentPlayerCol= v.currentTarget.parentElement.parentElement.attributes[1].value
	AutoComplete = new Class.autoComplete(lookupName,currentPlayerCol,Common.platformHandler(currentPlayerCol))
})
$("[attr*='input-group-button']").on("click",v=>{ //platform button click
	var lookupName = $(v.currentTarget).siblings('input').val()
  let currentPlayerCol =  v.currentTarget.parentElement.parentElement.attributes[1].value
	Common.platformHandler(currentPlayerCol,true)
	AutoComplete = new Class.autoComplete(lookupName,currentPlayerCol,Common.platformHandler(currentPlayerCol))
})
window.dropdownClicked = async function (v,currentPlayerCol) { //dropdown clicked
  var lookupName = v[0].childNodes[0].data;
  var currentPlayerCol;
  var lookupPlatform = Common.platformHandler(currentPlayerCol)
  AutoComplete.clearResults()
  const a = new Class.getRankedData(lookupName,currentPlayerCol,lookupPlatform)
  console.log(await a)
}





async function exec(url) {
  const { data } = await axios({
    method: "GET",
    url: `https://tracker-proxy.herokuapp.com/` + url,
    headers: {
      "accept-language": "en-US,en;q=0.8,et;q=0.6",
      "cache-control": "max-age=0",
    },
    timeout: 10000,
  }).catch((error) => {
    return error;
  });
  return data
}


// async function request(lookupName, currentPlayerCol,lookupPlatform) {

//   const completeData = await Common.Fetch(lookupName, currentPlayerCol, lookupPlatform).then((response) => response);

//   if (completeData === "TIMEOUT") {
//     $(`#p${player}Spinner`).attr("hidden", "");
//     $(`#p${player}NotFound`).removeAttr("hidden");
//     console.error("TIMED OUT");
//     return;
//   }
//   if (completeData === "FORMAT_ERROR") {
//     $(`#p${player}Spinner`).attr("hidden");
//     console.error("FORMAT ERROR");
//     return;
//   }
//   console.log("completeData: ", completeData); //
//   // data sorting
//   const a = completeData["trn-cards"];
//   function addOffset(array, value, offset = 1) {
//     if (a[array].find((element) => element === value) == "undefined") {
//       return "N/A";
//     }
//     return a[array][a[array].indexOf(`${value}`) + offset];
//   }
//   // check if MMR is highest or if Rank Points is highest
//   const maxRankIsMmr = () => {
//     var maxMMR = Common.StripLetters(a[7][3]) * 1;
//     var maxRankPoints = Common.StripLetters(a[6][3]) * 1;
//     if (maxMMR > maxRankPoints) {
//       return true;
//     } else {
//       return false;
//     }
//   };

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