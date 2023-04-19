const axios = require('axios')
const cheerio = require('cheerio')

const cheerio = require("cheerio");
const $ = require("jquery");
const rankImg = require("./rankimg");

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
  return data;
}

async function Fetch(name, platform, player) {
  platform === 1 ? (platform = "xbox") : (platform = "psn");
  console.log("ranking", platform, name);
  const a = { playerInfo: [], "trn-cards": [], matchHistory: [], seasons: [] };

  if (typeof name !== "string") return "FORMAT_ERROR";
  let url = `https://r6.tracker.network/profile/${platform}/${name}/`;
  let matchHistoryUrl = `https://r6.tracker.network/profile/${platform}/${name}/mmr-history`;
  let seasonHistoryUrl = `https://r6.tracker.network/profile/${platform}/${name}/seasons`;

  const data = await exec(url);
  if (!data) {
    a.playerInfo = "timeout";
    return "TIMEOUT";
  }
  //initialize array a
  a["playerInfo"]["url"] = url;

  // push all profile cards into array a subarray trn-cards
  const $ = cheerio.load(data);
  $("#profile .trn-card").each(function (i, elem) {
    a["trn-cards"].push(filterArray($(this).text().trim().split("\n")));
  });

  //remove whitespace from all results
  for (var i = 0; i < a["trn-cards"].length; i++) {
    var newlength = a["trn-cards"][i].length;
    for (var j = 0; j < newlength; j++) {
      a["trn-cards"][i][j] = a["trn-cards"][i][j].trim();
    }
  }
  // push all recent matches into array a subarray matchHistory
  const matchHistory = await exec(matchHistoryUrl);
  const matches = cheerio.load(matchHistory);

  matches(".trn-table__row").each(function (i, elem) {
    if (i < 21) {
      a["matchHistory"][i] = filterArray($(this).text().trim().split("\n"));
      //getting rank pic source from element
      if (i > 0 && $(this)[0].children[7].children[1] !== undefined) {
        a["matchHistory"][i].push($(this)[0].children[7].children[1].attribs["src"]);
        a["matchHistory"][i].push($(this)[0].children[1].children[1].attribs["v-human-time"]);
        a["matchHistory"][i][7] = a["matchHistory"][i][7].replaceAll(`'`, ``);
        a["matchHistory"][i].push(humanTime(a["matchHistory"][i][7]));
      }
    }
  });
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

//Set correct Platform on even
function setPlatform(lookupColumn) {
  var platform;
  switch (lookupColumn) {
    case 1:
      $("#x1").hasClass("active") ? (platform = 1) : (platform = 2);
      break;
    case 2:
      $("#x2").hasClass("active") ? (platform = 1) : (platform = 2);
      break;
    case 3:
      $("#x3").hasClass("active") ? (platform = 1) : (platform = 2);
      break;
    case 4:
      $("#x4").hasClass("active") ? (platform = 1) : (platform = 2);
      break;
    case 5:
      $("#x5").hasClass("active") ? (platform = 1) : (platform = 2);
      break;
    default:
      console.error("Fn setPlatform defaulted with no results found");
      break;
  }
  return platform;
}

// get autocomplete names
async function getAutoComplete(name, platform, player) {
  var length = $(`#p${player}Input`).width();
  $(`#p${player}DropdownClass`).css("width", length * 1.08 + "px");
  if (name.length < 1) {
    $(`#p${player}DropdownClass`).removeClass("show");
    return;
  }
  var url = `https://tracker-proxy.herokuapp.com/https://r6.tracker.network/r6/autocomplete?
			name=${name}&platform=${platform}`;
  const a = await fetch(url);
  const b = await a.json();

  $(`#p${player}DropdownClass > button`).remove();
  b.forEach((item, index, array) => {
    let newHtml = `<button class="list-group-item d-flex justify-content-between align-items-center rounded-2" 
    role="button" 
    attr="player${player}AutoData" 
    tabindex="${index + 1}">${item.name}<span class="badge rounded-pill">
        Level ${item.cl}
      </span>
    </button>
    `;
    $(`#p${player}DropdownDiv`).before(newHtml);
  });
  $(`#p${player}DropdownClass`).removeAttr("hidden");
}
function loadDom(d, p) {
  // card 1
  $(`#p${p}name`).text(d.header.name);
  $(`#p${p}name`).attr("href", d.header.url);

  $(`#p${p}card1HeaderImg`).attr("src", d.card1.rankImg);
  $(`#p${p}card1Header`).text(d.card1.season);
  $(`#p${p}card1KD`).text("KD: " + d.card1.kd());
  $(`#p${p}card1Rank`).text(d.card1.rank());
  $(`#p${p}card1Mmr`).text(d.card1.mmr());
  $(`#p${p}currentRankImg`).attr("src", d.card1.rankImg);

  $(`#p${p}maxRank`).text(d.card1.seasonalRecordRank);
  $(`#p${p}maxMmr`).text(d.card1.seasonalRecordMMR);
  $(`#p${p}maxRankImg`).attr("src", d.card1.seasonalRecordImg);

  $(`#p${p}card1Matches`).text(d.card1.matches);
  $(`#p${p}card1Wins`).text(d.card1.wins);
  $(`#p${p}card1Losses`).text(d.card1.losses);
  $(`#p${p}card1Win_`).text(d.card1.winPercent);
  // card 2
  $(`#p${p}card2HeaderImg`).attr("src", d.card2.maxRankImgSource());
  $(`#p${p}card2Header`).text("Best RP/ General Ranked");
  $(`#p${p}card2KillsPerMatch`).text(d.card2.killsPerMatch);
  $(`#p${p}card2KillsPerMin`).text(d.card2.killsPerMinute);
  $(`#p${p}card2TimePlayed`).text(d.card2.timePlayed);
  $(`#p${p}card2AverageKd`).text(d.card2.averageKd);
  $(`#p${p}card2TotalKills`).text(d.card2.totalKills);
  $(`#p${p}card2TotalDeaths`).text(d.card2.totalDeaths);

  $(`#p${p}card2RecordSeason`).text(d.card2.personalRecordSeason());
  $(`#p${p}card2RecordMmr`).text(d.card2.personalRecordMmr());
  $(`#p${p}card2RecordImg`).attr("src", d.card2.maxRankImgSource);
  $(`#p${p}card2Matches`).text(d.card2.matches);
  $(`#p${p}card2Wins`).text(d.card2.wins);
  $(`#p${p}card2Losses`).text(d.card2.losses);
  $(`#p${p}card2Win_`).text(d.card2.winPercent);

  $(`#p${p}Spinner`).attr("hidden", "");
  $(`#p${p}DataCard`).removeAttr("hidden");
}
function loadSeasonalData(d, p) {
  function addOffsettoSeasonal(array, value, offset = 1) {
    if (d["card3"][array].indexOf(`${value}`) == -1) {
      return "N/A";
    } else {
      return d["card3"][array][d["card3"][array].indexOf(`${value}`) + offset];
    }
  }
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
    var Matches = stripLetters(v[1]);
    var imgSource = rankImg(addOffsettoSeasonal(i, "Max Rank"));
    $(`#p${p}seasons`).before(seasonsTemplate(seasonName, KD, rank, Matches, imgSource, i));
  });
}

function loadRecentMatches(d, p) {
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
        var a = stripLetters(d["card4"][i][2]).toString();
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
function clearAll(player) {
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
const stripLetters = (a) => a.replace(/[^\d.-]/g, "") * 1;

const removeWhitespace = (a) => a.replace(/\s/g, "");

function loadPlayerCards(i) {
  const data = `
  <div class="input-group mb-1 mt-1">
    <input type="text" class="form-control" placeholder="Enter name.." id="p${i}Input" tabindex="-1" />
    <button class="btn btn-outline-secondary active" type="button" id="x${i}" tabindex="-1"
    data-bs-title="Use the backquote key (~) to change platforms on the fly!" attr="platform">XBOX</button>
    <button class="btn btn-outline-secondary" type="button" id="p${i}" tabindex="-1" attr="platform">PS</button>
  </div>

  <ul class="list-group dropdown-menu p-0" id="p${i}DropdownClass" style="opacity:.85" hidden>
    <div id="p${i}DropdownDiv"></div>
  </ul>

  <div id="p${i}NotFound" class="container w-100 bg-warning p-2 my-3 rounded-3 opacity-50" hidden>
    <p>Player Not Found..</p>
  </div>

  <div id="p${i}NotRanked" class="container w-100 bg-warning p-2 my-3 rounded-3 opacity-50" hidden>
    <p>Player Not Ranked..</p>
  </div>

  <div class="spinner-border m-4 text-white" hidden style="width: 2.5rem; height: 2.5rem" role="status" id="p${i}Spinner"></div>


  <div class="card border-light lh-sm text-center mt-3 z-1" id="p${i}DataCard" hidden>
    <a class="card-body link-info fs-5 my-2" id="p${i}name" target="_blank" tabindex="-1"></a>
    <div class="accordion text-white" id="accordion${i}">
    <!--Fist Tab-->
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}1" aria-expanded="true" aria-controls="collapse${i}1" tabindex="-1">
          <div class="hstack gap-3">
            <img id="p${i}card1HeaderImg" class="" style="height: 46px" src="https://imgur.com/PvLQN8r.png" />
            <p class="m-0" id="p${i}card1Header"></p>
          </div>
        </button>
      </h2>
      <div id="collapse${i}1" class="accordion-collapse collapse show" data-bs-parent="#accordion${i}">
        <div class="accordion-body p-0">
          <div class="card m-0 rounded-0" style="max-width: 740px; min-width: 100px">
            <p class="fs-4 my-2 text-decoration-underline">Current</p>
            <div class="row p-2 m-2 align-items-center">
              <div class="col">
                <p id="p${i}card1KD" class="fw-bold mb-2 fs-5"></p>
                <p id="p${i}card1Rank" class="mb-2 text-primary fs-5 text-nowrap"></p>
                <p id="p${i}card1Mmr" class="mb-2 fs-5"></p>
              </div>
              <div class="col align-items-center">
                <img src="https://imgur.com/PvLQN8r.png" id="p${i}currentRankImg" class="" style="width: 70px" alt="..." />
              </div>
            </div>
            <p class="fs-4 my-2 text-decoration-underline">Seasonal Record</p>
            <div class="row p-2 m-2 align-items-center">
              <div class="col">
                <p id="p${i}maxRank" class="mb-2 text-primary fs-5 text-nowrap"></p>
                <p id="p${i}maxMmr" class="mb-2 fs-5"></p>
              </div>
              <div class="col">
                <img id="p${i}maxRankImg" src="https://imgur.com/PvLQN8r.png" class="" style="width: 60px" alt="..." />
              </div>
            </div>
            <div class="hstack m-2 p-2">
              <div class="vstack">
                <p class="card-text mb-0">Matches:</p>
                <p id="p${i}card1Matches" class="card-text"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Wins:</p>
                <p id="p${i}card1Wins" class="card-text"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Losses:</p>
                <p id="p${i}card1Losses" class="card-text"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Win %</p>
                <p id="p${i}card1Win_" class="card-text"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Second Tab -->
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}2" aria-expanded="false" aria-controls="collapse${i}2" tabindex="-1">
          <div class="hstack gap-3">
            <img id="p${i}card2HeaderImg" src="https://imgur.com/PvLQN8r.png" style="height: 46px" alt="..." />
            <p class="m-0" id="p${i}card2Header"></p>
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
                <p id="p${i}card2KillsPerMatch" class="mb-3 fs-5"></p>

                <p class="mb-0 text-decoration-underline">Kills/Min:</p>
                <p id="p${i}card2KillsPerMin" class="mb-3 fs-5"></p>

                <p class="mb-0 text-decoration-underline">Time Played:</p>
                <p id="p${i}card2TimePlayed" class="fs-5"></p>
              </div>
              <div class="col align-items-center">
                <p class="mb-0 text-decoration-underline">Average K/D:</p>
                <p id="p${i}card2AverageKd" class="mb-3 fs-5"></p>

                <p class="mb-0 text-decoration-underline">Total Kills:</p>
                <p id="p${i}card2TotalKills" class="mb-3 fs-5"></p>

                <p class="mb-0 text-decoration-underline">Total Deaths:</p>
                <p id="p${i}card2TotalDeaths" class="fs-5"></p>
              </div>
            </div>

            <p class="fs-4 my-2 text-decoration-underline">Personal Record</p>

            <div class="row p-2 m-2 align-items-center">
              <div class="col">
                <p id="p${i}card2RecordSeason" class="mb-2"></p>

                <p id="p${i}card2RecordRank" class="mb-2 text-primary"></p>
                <p id="p${i}card2RecordMmr" class="mb-2"></p>
              </div>
              <div class="col align-items-center">
                <img src="" id="p${i}card2RecordImg" class="" style="width: 80px" alt="..." />
              </div>
            </div>

            <div class="hstack m-2 p-2">
              <div class="vstack">
                <p class="card-text mb-0">Matches:</p>
                <p id="p${i}card2Matches" class="card-text"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Wins:</p>
                <p id="p${i}card2Wins" class="card-text"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Losses:</p>
                <p id="p${i}card2Losses" class="card-text"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Win %</p>
                <p id="p${i}card2Win_" class="card-text"></p>
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
          <div class="card m-0 rounded-0" style="max-width: 740px; min-width: 100px"><div id="p${i}seasons"></div></div>
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
              <div class="col">
                <p class="p-0 m-0">Date</p>
              </div>
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
            <div id="p${i}matchHistory"></div>
          </div>
        </div>
      </div>
    </div>
</div>
  `;
  return data;
}
function clearOneAutoComplete(player) {
  if (player == "all") {
    for (let i = 0; i <= 5; i++) {
      $(`#p${i}DropdownClass > li`).remove();
      $(`#p${i}DropdownClass`).attr("hidden", "");
    }
  }
  $(`#p${player}DropdownClass > li`).remove();
  $(`#p${player}DropdownClass`).attr("hidden", "");
}

// platform toggler function
function togglePlatform(player) {
  $("#x" + player).toggleClass("active");
  $("#p" + player).toggleClass("active");
}

module.exports = {
  Fetch: Fetch,
  LoadPlayerCards: loadPlayerCards,
  GetAutoComplete: getAutoComplete,
  SetPlatform: setPlatform,
  StripLetters: stripLetters,
  ClearAll: clearAll,
  RemoveWhitespace: removeWhitespace,
  TogglePlatform: togglePlatform,
  ClearOneAutoComplete: clearOneAutoComplete,
  LoadDom: loadDom,
  LoadRecentMatches: loadRecentMatches,
  LoadSeasonalData: loadSeasonalData,
};
