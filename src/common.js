const axios = require('axios'); const moment = require('moment');const cheerio = require("cheerio");
export const $ = require("jquery"); window.$= $
export const bootstrap = require("bootstrap");
import rankImg from './Rank-Img.js'


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


