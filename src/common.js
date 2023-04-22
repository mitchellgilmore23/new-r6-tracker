const axios = require('axios'); const moment = require('moment');const cheerio = require("cheerio");
export const $ = require("jquery"); window.$= $
export const bootstrap = require("bootstrap");
import rankImg from './rank-img-fetch.js'

export function loadPlayerCards(i) {
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

	<ul class="list-group dropdown-menu p-0"></ul>

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
            <img attr="accordion-title-rank-img" style="height: 46px" src="./media/UNRANKED.PNG" />
            <p class="m-0" attr="accordion-title-url"></p>
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


export async function Fetch(name, platform, player) {
  const a = { playerInfo: [], "trn-cards": [], matchHistory: [], seasons: [] };

  if (typeof name !== "string") return "FORMAT_ERROR";
  let url = `https://r6.tracker.network/profile/${platform}/${name}/`;
  let matchHistoryUrl = `https://r6.tracker.network/profile/${platform}/${name}/mmr-history`;
  let seasonHistoryUrl = `https://r6.tracker.network/profile/${platform}/${name}/seasons`;
  const data = await exec(url);
  if (!data) return "TIMEOUT";

 
  // push all recent matches into array a subarray matchHistory
  const matchHistory = await exec(matchHistoryUrl);
  const matches = cheerio.load(matchHistory);

  
  // function for converting time into human readable time
  function humanTime(binding) {
    var date = moment.utc(binding);
    if (date == null) return;
    var newDate = date.fromNow();
    return newDate;
  }

  a["matchHistory"].shift();
  // get individual max ranking from attribute of card
  let recordMmrRank = $("#profile > div.trn-scont.trn-scont--swap > div.trn-scont__aside > div:nth-child(3) > div > div:nth-child(1) > div.r6-quickseason__image > img").attr();
  a["trn-cards"][7].unshift(recordMmrRank);
  let recordRankPointsRank = $("#profile > div.trn-scont.trn-scont--swap > div.trn-scont__aside > div:nth-child(2) > div > div:nth-child(1) > div.r6-quickseason__image > img").attr();
  a["trn-cards"][6].unshift(recordRankPointsRank);

  // push all recent matches into array a subarray matchHistory
  const seasonHistory = await exec(seasonHistoryUrl);
  const seasons = cheerio.load(seasonHistory);
  seasons(".trn-card").each(function (i, elem) {
    a["seasons"][i] = filterArray($(this).text().trim().split("\n"));
  });
  a["seasons"].shift();
  return a;
}

export function LoadSeasonalData(d, p) {
const addOffsettoSeasonal = (array, value, offset = 1) => (d["card3"][array].indexOf(`${value}`) == -1) ? "N/A" : d["card3"][array][d["card3"][array].indexOf(`${value}`) + offset]

  function seasonsTemplate(seasonName, KD, Rank, Matches, imgSource) {
    return `<div class="container border-1 border-bottom mt-2" attr="p${p}Jquery">
    <p class="m-0 text-decoration-underline">${seasonName}</p>
    <div class="row p-1 align-items-center">
    <div class="col">
    <p class="card-text fw-bold m-0">K/D: ${KD}</p>
    <p class="m-0 text-primary">${Rank}</p>
    <p class="mb-2">${Matches} Matches</p>
    </div>
    <div class="col align-items-center">
    <img src=${imgSource} class="" style="width: 50px" alt="..." />
    </div>
    </div>
    </div>`;
  }
  d["card3"].forEach((v, i, a) => {
    var seasonName = v[0];
    var KD = addOffsettoSeasonal(i, "K/D");
    var rank = addOffsettoSeasonal(i, "Max Rank");
    var Matches = StripLetters(v[1]);
    var imgSource = rankImg(addOffsettoSeasonal(i, "Max Rank"));
    $(`#p${p}seasons`).before(seasonsTemplate(seasonName, KD, rank, Matches, imgSource, i));
  });
}

export function LoadRecentMatches(d, p) {
  function template(date, mmr, mmrChange, result, imgSource, KD, humanTime) {
    if (mmrChange.includes("+")) {
      var color = "chartreuse";
    } else {
      var color = "red";
    }
    return `
    <div class="row align-items-center mx-0 border-bottom mb-2 g-0" attr="p${p}Jquery">
    <div class="col-3">
    <p class="p-0 m-0 mb-1">${date}</p>
    <p class="p-0 m-0 mb-1" style="font-size: .75em" >${humanTime}</p>
    </div>
    <div class="col-3">
    <p class="p-0 m-0 mb-1" style="font-size: .75em">${result}</p>
    <p class="p-0 m-0 fw-bold">${KD}</p>
    </div>
    <div class="col-3">
    <p class="p-0 m-0">${mmr}</p>
    <p class="p-0 m-0" style="font-size: .85em; color: ${color};">${mmrChange}</p>
    </div>
    <div class="col">
    <img class="p-0 m-0"src="${imgSource}" style="width: 40px" />
    </div>
    </div>
    `;
  }
  d["card4"].forEach((v, i) => {
    var date = d["card4"][i][0];
    var mmr = d["card4"][i][3];
    var mmrChange = d["card4"][i][4];
    var KD = d["card4"][i][5];
    var humanTime = d["card4"][i][8];
    var result = () => {
      if (d["card4"][i][2].includes("!")) {
        return d["card4"][i][2];
      } else {
        var a = StripLetters(d["card4"][i][2]).toString();
        return a.slice(0, 1) + ` W's | ` + a.slice(1, 2) + ` L's`;
      }
    };
    if (d["card4"][i].length > 6) {
      var imgSource = d["card4"][i][6];
    } else {
      var imgSource = "https://imgur.com/PvLQN8r.png";
    }
    $(`#p${p}matchHistory`).before(template(date, mmr, mmrChange, result(), imgSource, KD, humanTime));
  });
}
// clear All elements on page
export function ClearAll(player) {
  switch (player) {
    case "all":
      for (var i = 1; i <= 5; i++) {
        $(`#p${i}Dropdown`).removeClass("show");
        $(`#p${i}DataCard`).attr("hidden", "");
        $(`#p${i}NotFound`).attr("hidden", "");
        $(`#p${i}Input`).val("");
        $(`#p${i}Refresh`).attr("hidden", "");
        $(`#p${i}Submit`).addClass("w-100");
        $(`#p${i}Spinner`).attr("hidden", "");
      }
      break;
    default:
      $(`#p${player}Input`).val("");

      $(`[attr=player${player}AutoData]`).remove();
      $(`#p${player}Submit`).removeAttr("hidden", "");
      $(`#p${player}DropdownClass`).removeClass("show");
  }
}
// imported from r6s-stats-api
function filterArray(clearArray) {
  let index = -1,
    arrayLength = clearArray ? clearArray.length : 0,
    resIndex = -1,
    result = [];

  while (++index < arrayLength) {
    let value = clearArray[index];
    if (value != null && value !== "" && value !== undefined && value !== false && value !== 0 && value != "," && value != " " && value != "•") {
      result[++resIndex] = value;
    }
  }
  return result;
}
//Strip alphabetical values from string, return only numbers
export const StripLetters = (a) => a.replace(/[^\d.-]/g, "") * 1;

export const RemoveWhitespace = (a) => a.replace(/\s/g, "");


