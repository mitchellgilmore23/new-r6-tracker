import * as Common from './common.js'; import rankImg from './rank-img-fetch.js'
const $ = Common.$;
import { default as AutoCompleteClass } from "./Auto-Complete Class.js";
var AutoComplete = {}
function loadPlayerCards(i) {
  const data = `
  <div class="btn-group w-100">
    <button class="btn rounded-2 btn-outline-success my-2 w-50" type="button" attr="input-group-button-submit" tabindex="-1">Submit</button>
    <button class="btn w-50 rounded-2 btn-outline-info my-2 w-50" type="button" attr="input-group-button-refresh" tabindex="-1" hidden>Refresh</button>
  </div>
  <div class="input-group mb-1 mt-1">
    <input type="text" class="form-control" placeholder="Enter name.." attr="input-group-text" tabindex="-1" />
    <button class="btn btn-outline-secondary active" type="button" attr="input-group-button-xbox" tabindex="-1" data-bs-title="Use the backquote key (~) to change platforms on the fly!">
      XBOX
    </button>
    <button class="btn btn-outline-secondary" type="button" tabindex="-1" attr="input-group-button-ps">PS</button>
  </div>

	<ul class="list-group dropdown-menu p-0" style="opacity: 0.85" hidden>
		<div attr="autofill-dropdown" desktop></div>
	</ul>

	<div attr="notFound" class="container w-100 bg-warning p-2 my-3 rounded-3 opacity-50" hidden><p>Player Not Found..</p></div>

	<div attr="notRanked" class="container w-100 bg-warning p-2 my-3 rounded-3 opacity-50" hidden><p>Player Not Ranked..</p></div>

	<div attr="Spinner" class="spinner-border m-4 text-white" hidden style="width: 2.5rem; height: 2.5rem" role="status"></div>

	<div class="card border-light lh-sm text-center mt-3 z-1">
		<a class="card-body link-info fs-5 my-2" attr="card-header" target="_blank" tabindex="-1"></a>
		<div class="accordion text-white">

    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}1" aria-expanded="true" aria-controls="collapse${i}1" tabindex="-1">
          <div class="hstack gap-3">
            <img attr="accordion-header-img" class="" style="height: 46px" src="./media/UNRANKED.PNG" />
            <p class="m-0" attr="accordion-card-1-header-text"></p>
          </div>
        </button>
      </h2>
      <div id="collapse${i}1" class="accordion-collapse collapse show" data-bs-parent="#accordion${i}">
        <div class="accordion-body p-0">
          <div class="card m-0 rounded-0" style="max-width: 740px; min-width: 100px">
            <p class="fs-4 my-2 text-decoration-underline">Current</p>
            <div class="row p-2 m-2 align-items-center">
              <div class="col">
                <p attr="accordion-card-1-kd" class="fw-bold mb-2 fs-5"></p>
                <p attr="accordion-card-1-rank" class="mb-2 text-primary fs-5 text-nowrap"></p>
                <p attr="accordion-card-1-mmr" class="mb-2 fs-5"></p>
              </div>
              <div class="col align-items-center">
                <img src="./media/UNRANKED.PNG" attr="accordion-card-1-img" class="" style="width: 70px" alt="..." />
              </div>
            </div>
            <p class="fs-4 my-2 text-decoration-underline">Seasonal Record</p>
            <div class="row p-2 m-2 align-items-center">
              <div class="col">
                <p attr="accordion-card-1-max-rank" class="mb-2 text-primary fs-5 text-nowrap"></p>
                <p attr="accordion-card-1-max-mmr" class="mb-2 fs-5"></p>
              </div>
              <div class="col">
                <img attr="accordion-card-1-img" src="./media/UNRANKED.PNG" class="" style="width: 60px" alt="..." />
              </div>
            </div>
            <div class="hstack m-2 p-2">
              <div class="vstack">
                <p class="card-text mb-0">Matches:</p>
                <p attr="accordion-card-1-matches" class="card-text"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Wins:</p>
                <p attr="accordion-card-1-wins" class="card-text"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Losses:</p>
                <p attr="accordion-card-1-losses" class="card-text"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Win %</p>
                <p attr="accordion-card-1-win_" class="card-text"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}2" aria-expanded="false" aria-controls="collapse${i}2" tabindex="-1">
          <div class="hstack gap-3">
            <img id="p${i}card2HeaderImg" src="./media/UNRANKED.PNG" style="height: 46px" alt="..." />
            <p class="m-0" attr="accordion-card-2-header-text"></p>
          </div>
        </button>
      </h2>

      <div id="collapse${i}2" class="accordion-collapse collapse" data-bs-parent="#accordion${i}">
        <div class="accordion-body p-0">
          <div class="card m-0 rounded-0" style="max-width: 740px; min-width: 100px">
            <p class="fs-4 my-2 text-decoration-underline">Overall Ranked</p>
            <div class="row p-2 m-2 align-items-center">
              <div class="col">
                <p class="mb-0 text-decoration-underline">Kills/Match:</p>
                <p attr="accordion-card-2-kills-match" class="mb-3 fs-5"></p>

                <p class="mb-0 text-decoration-underline">Kills/Min:</p>
                <p attr="accordion-card-2-kills-min" class="mb-3 fs-5"></p>

                <p class="mb-0 text-decoration-underline">Time Played:</p>
                <p attr="accordion-card-2-time-played" class="fs-5"></p>
              </div>
              <div class="col align-items-center">
                <p class="mb-0 text-decoration-underline">Average K/D:</p>
                <p attr="accordion-card-2-average-kd" class="mb-3 fs-5"></p>

                <p class="mb-0 text-decoration-underline">Total Kills:</p>
                <p attr="accordion-card-2-total-kills" class="mb-3 fs-5"></p>

                <p class="mb-0 text-decoration-underline">Total Deaths:</p>
                <p attr="accordion-card-2-total-deaths" class="fs-5"></p>
              </div>
            </div>

            <p class="fs-4 my-2 text-decoration-underline">Personal Record</p>

            <div class="row p-2 m-2 align-items-center">
              <div class="col">
                <p attr="accordion-card-2-record-season" class="mb-2"></p>

                <p attr="accordion-card-2-record-rank" class="mb-2 text-primary"></p>
                <p attr="accordion-card-2-record-mmr" class="mb-2"></p>
              </div>
              <div class="col align-items-center">
                <img src="" attr="accordion-card-2-record-img" class="" style="width: 80px" alt="..." />
              </div>
            </div>

            <div class="hstack m-2 p-2">
              <div class="vstack">
                <p class="card-text mb-0">Matches:</p>
                <p attr="accordion-card-2-matches" class="card-text"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Wins:</p>
                <p attr="accordion-card-2-wins" class="card-text"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Losses:</p>
                <p attr="accordion-card-2-losses" class="card-text"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Win %</p>
                <p attr="accordion-card-2-win_" class="card-text"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Third Tab -->
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}3" aria-expanded="false" aria-controls="collapse${i}3" tabindex="-1">
          <div class="hstack gap-3">
            <i class="fa-solid fa-trophy" style="height: 35px"></i>
            <p class="m-0">Previous Seasons</p>
          </div>
        </button>
      </h2>

      <div id="collapse${i}3" class="accordion-collapse collapse" data-bs-parent="#accordion${i}">
        <div class="accordion-body p-0">
          <div class="card m-0 rounded-0" style="max-width: 740px; min-width: 100px"><div attr="accordion-card-3"></div></div>
        </div>
      </div>
    </div>
    <!-- Fourth Tab -->
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}4" aria-expanded="false" aria-controls="collapse${i}4" tabindex="-1">
          <div class="hstack gap-3">
            <i class="fa-solid fa-clock-rotate-left" style="height: 35px"></i>
            <p class="m-0">Recent Matches</p>
          </div>
        </button>
      </h2>

      <div id="collapse${i}4" class="accordion-collapse collapse" data-bs-parent="#accordion${i}">
        <div class="accordion-body p-0">
          <div class="card m-0 rounded-0" style="max-width: 740px; min-width: 100px">
            <div class="row mx-0 py-1 border-bottom text-info-emphasis">
              <div class="col"><p class="p-0 m-0">Date</p></div>
              <div class="col">
                <p class="p-0 m-0" style="font-size: 0.75em">Result (W,L)</p>
                <p class="p-0 m-0 fw-bold" style="font-size: 0.75em">K/D</p>
              </div>
              <div class="col">
                <p class="p-0 m-0" style="font-size: 0.75em">RP</p>
                <p class="p-0 m-0" style="font-size: 0.75em">RP Change</p>
              </div>
              <div class="col">
                <p class="p-0 m-0">Rank</p>
              </div>
            </div>
            <div attr="accordion-card-4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  `;
  return data;
}

$(`injectcard`).each((_,v) => {$(v).replaceWith(loadPlayerCards($(v).attr('player')))}); // loads cards for the players

$('[attr=input-group-text]').on('keyup keydown', async v=>{ // text input change
	let lookupName = v.currentTarget.value;	
	let currentPlayerCol= v.currentTarget.parentElement.parentElement.attributes[1].value
	AutoComplete = new AutoCompleteClass(lookupName,currentPlayerCol,platformHandler(currentPlayerCol))
	if (v.type === 'keyup') {
		AutoComplete.fetch()
	}
	})


$("[attr*='input-group-button']").on("click",v=>{ //platform button click
	let currentPlayerCol =  v.currentTarget.parentElement.parentElement.attributes[1].value
	platformHandler(currentPlayerCol,true)
	AutoComplete = new AutoCompleteClass(lookupName,currentPlayerCol,platformHandler(currentPlayerCol))
})

function platformHandler(playerCol,toggle=false){ // toggle or GET platform
	let buttonGroup =$(`[player='${playerCol}']`).children('.input-group').children('button')
	let xbox = buttonGroup.filter('[attr=input-group-button-xbox]')
	let ps = buttonGroup.filter('[attr=input-group-button-ps]')
	let platform;
	if (toggle == true){
		buttonGroup.each((_,v) => $(v).toggleClass("active"))
		return;
	}
	else if (toggle == false){ //
		xbox.hasClass('active') && !ps.hasClass('active') ? platform = "xbox" : platform = "psn";	
	}
	return platform;
}



$(window).on("click", function (i) {
  Common.ClearOneAutoComplete("all");
  if (i.target.attributes.length > 3 && i.target.attributes[2].value.includes("AutoData") && i.target.localName === "button") {
    let player = Common.StripLetters(i.target.attributes[2].value);
    request(i.target.childNodes[0].data, platform, player);
  }
});

$(window).on("resize", () => {
  for (let i = 1; i <= 5; i++) {
		let length = $(`#input${i}`).width();
    $(`#p${i}Dropdown`).css("width", length * 1.08 + "px");
  }
})

// XBOX / PS Button Listener
$("button[attr='platform']").on("click", function (i) {
  var lookupColumn = Common.StripLetters(i.target.id);
  var lookupName = $(`#p${lookupColumn}Input`);
  platform == 1 ? (platform = "xbox") : (platform = "psn");
  Common.TogglePlatform(lookupColumn);
  if (lookupName.val().length > 1) {
    platform == "xbox" ? (invertPlatform = "psn") : (invertPlatform = "xbox");
  }
});
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

// async function request(name, platform, player) {
//   $(`#p${player}Dropdown`).removeClass("show");
//   $(`#p${player}NotFound`).attr("hidden", "");
//   $(`#p${player}Input`).val("");
//   $(`#p${player}Submit`).addClass("w-100");
//   Common.ClearOneAutoComplete("player");
//   $(`#p${player}Input`).val("");
//   $(`#p${player}Spinner`).removeAttr("hidden");

//   window.innerWidth > 770 ? $(`#p${player + 1}Input`).focus() : null;
//   //request
//   const completeData = await Common.Fetch(name, platform, player).then((response) => response);
//   //error handling
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
//   $(`[attr='p${player}Jquery']`).remove();
//   Common.LoadDom(data, player);
//   Common.LoadSeasonalData(data, player);
//   Common.LoadRecentMatches(data, player);
//   $(`#p${player}Spinner`).attr("hidden");
//   $(`#p${player}Refresh`).removeAttr("hidden");
// }
