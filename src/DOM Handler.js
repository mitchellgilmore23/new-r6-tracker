const $ = require("jquery")
import {default as rankImg } from "./Rank-Img"
export function togglePlaceholder(currentPlayerCol,show){
  var colFilter = `div[player=${currentPlayerCol || 1}]`
  show ? $(`${colFilter} [placeholder=placeholder]`).addClass('placeholder') : $(`${colFilter} [placeholder=placeholder]`).removeClass('placeholder')
}
window.initializeDOM = initializeDOM;
export function initializeDOM(player){
  if (!player){
    $(`inject[attr=buttonGroup]`).replaceWith(defaultElements.buttonGroup())
    $(`inject[attr=accordionCard1]`).each((i,v) => $(v).replaceWith(defaultElements.accordionCard1(i)))
    $(`inject[attr=accordionCard2]`).each((i,v) => $(v).replaceWith(defaultElements.accordionCard2(i))) 
    $(`inject[attr=accordionCard3]`).each((i,v) => $(v).replaceWith(defaultElements.accordionCard3(i))) 
    $(`inject[attr=accordionCard4]`).each((i,v) => $(v).replaceWith(defaultElements.accordionCard4(i)))
    $(`.placeholder`).attr('placeholder','placeholder')
    // accordionHelper()
  }
  else {
    $(`div[player=${player}] inject[attr=buttonGroup]`).replaceWith(defaultElements.buttonGroup())
    $(`div[player=${player}] inject[attr=accordionCard1]`).each((i,v) => $(v).replaceWith(defaultElements.accordionCard1(Math.random(),player)))
    $(`div[player=${player}] inject[attr=accordionCard2]`).each((i,v) => $(v).replaceWith(defaultElements.accordionCard2(Math.random(),player))) 
    $(`div[player=${player}] inject[attr=accordionCard3]`).each((i,v) => $(v).replaceWith(defaultElements.accordionCard3(Math.random(),player))) 
    $(`div[player=${player}] inject[attr=accordionCard4]`).each((i,v) => $(v).replaceWith(defaultElements.accordionCard4(Math.random(),player))) 
    $(`div[player=${player}] .placeholder`).attr('placeholder','placeholder')
    // accordionHelper();
  };
};

function accordionHelper () { // for each accordion collapse, assign the correct parent so when one opens, the rest collaspe
  $('div[data-bs-parent]').each((i,v) => {
    let parentAccordion=  $(v).parents('[id*=accordion]').attr('id')
    $(v).attr('data-bs-parent','#'+parentAccordion);
  });
};

export function hideCard(lookupColumn) {$(`div[player=${lookupColumn}] .card`).attr('hidden',true)};
export function showCard(lookupColumn) {$(`div[player=${lookupColumn}] .card`).removeAttr('hidden')};
export const defaultElements = {
  buttonGroup: () => 
  `<div class="btn-group w-100">
    <button class="btn rounded-2 btn-outline-success my-2 w-50" type="button" attr="input-group-button-submit" tabindex="-1">Submit</button>
    <button class="btn w-50 rounded-2 btn-outline-info my-2 w-50" type="button" attr="input-group-button-refresh" tabindex="-1" hidden>Refresh</button>
  </div>
  <div class="input-group mb-1 mt-1">
    <input type="text" class="form-control" placeholder="Enter name.." attr="input-group-text" tabindex='-1' />
    <button class="btn btn-outline-secondary active" type="button" attr="input-group-button-xbox" tabindex="-1" data-bs-title="Use the backquote key (~) to change platforms on the fly!">
      <img src='./media/Xbox_Icon.svg' height='35px' style='fill:white;'>
    </button>
    <button class="btn btn-outline-secondary" type="button" tabindex="-1" attr="input-group-button-ps">
      <img src='./media/PlayStation_Icon.svg' height='35px' style='fill:white;'>
    </button>
  </div>
	<ul class="list-group dropdown-menu p-0"></ul>`,
  accordionCard1: (i,player) => `
	<inject attr='accordionCard1'>
    <div class="accordion-item">
      <div class="accordion-header">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}:${player}" aria-expanded="true" aria-controls="accordion${player}" tabindex="-1">
            <div class='d-flex flex-row align-items-center w-100'>
              <img card1="current_rank_img" class='placeholder' style="height: 50px; width:50px" />
              <div class='mx-3 vr align-self-center' style='height:38px'></div>
              <p card1="current_season" class='placeholder mb-0 p-1 col-7'></p>
            </div>
        </button>
      </div>

      <div id="collapse${i}:${player}" class="accordion-collapse collapse show" data-bs-parent='#accordion${player}'>
        <div class="accordion-body p-0">
          <div class="card m-0 rounded-0">
            <p class="fs-4 my-2 text-decoration-underline">Current</p>
            <div class="row mx-3 align-items-center border-1 border-bottom">
              <div class="col-8 col-md-7 vstack fs-5">
                <p card1="body_kd" class="fw-bold mt-2 mb-1 col-7 col-md-12 placeholder"></p>
                <p card1="body_rank" class="col-7 col-md-12 mb-1 placeholder"></p>
                <p card1="body_mmr" class="mb-2 col-7 col-md-12 mb-2 placeholder"></p>
              </div>
              <div class="col-4 col-md-5" style='display:flex;justify-content:space-evenly'>
                <img card1="current_rank_img" class="placeholder my-3" style="width: 70px;height:70px"/>
							</div>
            </div>
            <p class="fs-4 my-2 text-decoration-underline">Seasonal Record</p>
            <div class="row mx-3 align-items-center border-1 border-bottom pb-2">
              <div class="col-8 col-md-7 vstack fs-5 my-2">
                <p card1="body_max_rank" class="mb-2 text-primary fs-5 placeholder col-7 col-md-12"></p>
                <p card1="body_max_mmr" class="mb-2 fs-5 placeholder col-7 col-md-12"></p>
              </div>
              <div class="col-4 col-md-5" style='display:flex;justify-content:space-evenly'>
                <img card1="record_img" class="placeholder mb-2" style="width: 70px;height:70px"/>
							</div>
            </div>
            <div class="hstack m-2 my-4 text-truncate">
              <div class="vstack">
                <p class="card-text mb-0">Matches:</p>
                <p card1="footer_matches" class="card-text placeholder col-6"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Wins:</p>
                <p card1="footer_wins" class="card-text placeholder col-6"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Losses:</p>
                <p card1="footer_losses" class="card-text placeholder col-6"></p>
              </div>
              <div class="vr"></div>
              <div class="vstack">
                <p class="card-text mb-0">Win %</p>
                <p card1="footer_win_" class="card-text placeholder col-6"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
	<inject>`
  , 
  accordionCard2: (i,player) => {return `
  <inject attr='accordionCard2'>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}:${player}" aria-expanded="false" aria-controls="accordion${player}" tabindex="-1">
        <div class='d-flex flex-row align-items-center w-100'>
        <img card2="max_rank_img" class='placeholder' style="height: 50px; width:50px" />
        <div class='mx-3 vr align-self-center' style='height:38px'></div>
        <p class='mb-0 p-1 col-7'>Overall Ranked</p>
      </div>
        </button>
      </h2>
      <div id="collapse${i}:${player}" class="accordion-collapse collapse" data-bs-parent='#accordion${player}'>
        <div class="accordion-body p-0">
          <div class="card m-0 rounded-0" >
            <p class="fs-4 my-2 text-decoration-underline">Overall Ranked</p>
            <div class="row p-2 m-2 align-items-center border-bottom">
              <div class="col-6 vstack">
                <p class="mb-0 text-decoration-underline">Kills/Match:</p>
                <p card2="body_kills_per_match" class="mt-2 mb-3 fs-5 placeholder col-4"></p>
                <p class="mb-0 text-decoration-underline">Kills/Min:</p>
                <p card2="body_kills_per_min" class="mt-2 mb-3 fs-5 placeholder col-4"></p>
                <p class="mb-0 text-decoration-underline" >Time Played:</p>
                <p card2="body_time_played" class="mt-2 mb-3 fs-5 placeholder col-6" style='inline-size: fit-content;'></p>
              </div>
              <div class="col-6 vstack">
                <p class="mb-0 text-decoration-underline">Average K/D:</p>
                <p card2="body_avg_kd" class="mt-2 mb-3 fs-5 placeholder col-4"></p>
                <p class="mb-0 text-decoration-underline">Total Kills:</p>
                <p card2="body_total_kills" class="mt-2 mb-3 fs-5 placeholder col-4"></p>
                <p class="mb-0 text-decoration-underline">Total Deaths:</p>
                <p card2="body_total_deaths" class="mt-2 mb-3 fs-5 placeholder col-4"></p>
              </div>
            </div>
            <p class="fs-4 my-2 text-decoration-underline">Personal Record</p>
            <div class="row mx-3 align-items-center border-bottom pb-2">
            <div class="col-8 col-md-7 vstack fs-5 my-2">
              <p card2="body_max_mmr_season" class="mb-2 text-primary fs-5 placeholder col-7 col-md-12"></p>
              <p card2="body_max_mmr" class="mb-2 fs-5 placeholder col-7 col-md-12"></p>
            </div>
            <div class="col-4 col-md-5" style='display:flex;justify-content:space-evenly'>
              <img card2="max_rank_img" class="placeholder" style="width: 70px;height:70px"/>
            </div>
          </div>
          <div class="hstack m-2 my-4 text-truncate">
          <div class="vstack">
            <p class="card-text mb-0">Matches:</p>
            <p card2="footer_matches" class="card-text placeholder col-6"></p>
          </div>
          <div class="vr"></div>
          <div class="vstack">
            <p class="card-text mb-0">Wins:</p>
            <p card2="footer_wins" class="card-text placeholder col-6"></p>
          </div>
          <div class="vr"></div>
          <div class="vstack">
            <p class="card-text mb-0">Losses:</p>
            <p card2="footer_losses" class="card-text placeholder col-6"></p>
          </div>
          <div class="vr"></div>
          <div class="vstack">
            <p class="card-text mb-0">Win %</p>
            <p card2="footer_win_" class="card-text placeholder col-6"></p>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
    </inject>`
  }, 
  accordionCard3: (i,player) => {return `
  <inject attr='accordionCard3'>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}:${player}" aria-expanded="false" aria-controls="accordion${player}" tabindex="-1">
          <div class="hstack gap-3">
            <i class="fa-solid fa-trophy" style="height: 35px"></i>
            <p class="m-0">Previous Seasons</p>
          </div>
        </button>
      </h2>
      <div id="collapse${i}:${player}" class="accordion-collapse collapse" data-bs-parent='#accordion${player}'>
        <div class="accordion-body p-0">
          <div class="card m-0 rounded-0"><div attr="accordion-card-3">
          </div>
        </div>
      </div>
    </div>
  </inject>`
  }, 
  accordionCard4: (i,player) => {return `
  <inject attr='accordionCard4'>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}:${player}" aria-expanded="false" aria-controls="accordion${player}" tabindex="-1">
          <div class="hstack gap-3">
            <i class="fa-solid fa-clock-rotate-left" style="height: 35px"></i>
            <p class="m-0">Recent Matches</p>
          </div>
        </button>
      </h2>
      <div id="collapse${i}:${player}" class="accordion-collapse collapse" data-bs-parent='#accordion${player}'>
        <div class="accordion-body p-0">
          <div class="card m-0 rounded-0" style="max-width: 740px; min-width: 100px">
            <div class="row mx-0 py-1 border-bottom text-info">
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
  </inject>`
  }
};
export function main (currentPlayerCol,array,lookupName,lookupPlatform) {
	let colFilter = `div[player=${currentPlayerCol}]`;
  let arr = array.main;
  $(`${colFilter} [attr=card-header]`).attr('href', array.main[0][0] ||'http://www.google.com').text(array.main[0][1]);
  /////////////card 1
  $(`${colFilter} [card1=current_season]`).text(array.main[3][0])
  $(`${colFilter} [card1=current_rank_img]`).attr('src', rankImg(addOffset(arr[3],'Rank',1)))
  //body
  $(`${colFilter} [card1=body_kd]`).text('K/D: '+addOffset(arr[3],'K/D',1))
  $(`${colFilter} [card1=body_rank]`).text(addOffset(arr[3],'Rank',1))
  $(`${colFilter} [card1=body_mmr]`).text(addOffset(arr[3],'Rank Points',1)+' MMR')
  //
  $(`${colFilter} [card1=body_max_rank]`).text(addOffset(arr[3],'Max Rank',1))
  $(`${colFilter} [card1=body_max_mmr]`).text(addOffset(arr[3],'Max Rank Points',1)+' MMR')
  $(`${colFilter} [card1=record_img]`).attr('src',rankImg(addOffset(arr[3],'Max Rank',1)))
  //footer
  $(`${colFilter} [card1=footer_matches]`).text(arr[3][1].replace(/[A-Za-z ]/g, ''))
  $(`${colFilter} [card1=footer_wins]`).text(addOffset(arr[3],'Wins',1))
  $(`${colFilter} [card1=footer_losses]`).text(addOffset(arr[3],'Losses',1))
  $(`${colFilter} [card1=footer_win_]`).text(addOffset(arr[3],'Win %',1)+' %')
  ///////////////card 2
  let mmrVsRp = mmrOrRp(arr)
  if (mmrVsRp == 'rp') $(`${colFilter} [card2=max_rank_img]`).attr('src', arr[5][0].src)
  else if (mmrVsRp =='mmr') $(`${colFilter} [card2=max_rank_img]`).attr('src', arr[6][0].src)
  //body
  $(`${colFilter} [card2=body_kills_per_match]`).text(addOffset(arr[1],'Kills/match',1))
  $(`${colFilter} [card2=body_kills_per_min]`).text(addOffset(arr[1],'Kills/min',1))
  $(`${colFilter} [card2=body_time_played]`).text(String(addOffset(arr[1],'Time Played',1)).indexOf('#') >= 0 ? "--" : addOffset(arr[1],'Time Played',1))
  $(`${colFilter} [card2=body_avg_kd]`).text(addOffset(arr[1],'KD',1))
  $(`${colFilter} [card2=body_total_kills]`).text(addOffset(arr[1],'Kills',1))
  $(`${colFilter} [card2=body_total_deaths]`).text(addOffset(arr[1],'Deaths',1))
  //
  if (mmrVsRp == 'rp') { 
    $(`${colFilter} [card2=body_max_mmr_season]`).text(addOffset(arr[5],'Personal Record',2))
    $(`${colFilter} [card2=body_max_mmr]`).text(addOffset(arr[5],'Personal Record',1))
  }
  else if (mmrVsRp =='mmr'){
    $(`${colFilter} [card2=body_max_mmr_season]`).text(addOffset(arr[6],'Personal Record',2))
    $(`${colFilter} [card2=body_max_mmr]`).text(addOffset(arr[6],'Personal Record',1))
  }
  //footer
  $(`${colFilter} [card2=footer_matches]`).text(addOffset(arr[1],'Matches',1).replace(/[A-Za-z ]/g, ''))
  $(`${colFilter} [card2=footer_wins]`).text(addOffset(arr[1],'Wins',1))
  $(`${colFilter} [card2=footer_losses]`).text(addOffset(arr[1],'Losses',1))
  $(`${colFilter} [card2=footer_win_]`).text(addOffset(arr[1],'Win %',1))
  ////////////////////////////////
  console.log(lookupName,currentPlayerCol,array)
  togglePlaceholder(currentPlayerCol,false)
};
export function seasons(currentPlayerCol,completeArray) {
  $(`div[player=${currentPlayerCol}] [attr=seasonsInject]`).remove()
  const addOffsettoSeasonal = (array, value, offset = 1) => completeArray.seasons[array].indexOf(`${value}`) == -1  ? "N/A" : completeArray.seasons[array][completeArray.seasons[array].indexOf(`${value}`) + offset];
  const seasonsTemplate = (seasonName, KD, Rank, Matches, imgSource) => `
    <div class="container border-1 border-bottom mt-2" attr="seasonsInject">
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
  </div>`  
  completeArray.seasons.forEach((v,i)=> {
    let seasonName = v[0]; let KD = addOffsettoSeasonal(i, "K/D");
    let rank = addOffsettoSeasonal(i, "Max Rank"); let Matches = v[1].replace(/[A-Za-z ]/g, '');
    let imgSource = rankImg(addOffsettoSeasonal(i, "Max Rank"));
    $(`div[player=${currentPlayerCol}] [attr=accordion-card-3]`).append(seasonsTemplate(seasonName, KD, rank, Matches, imgSource));
  });
};
export function matches(currentPlayerCol,completeArray) {
  $(`div[player=${currentPlayerCol}] [attr=matchesInject]`).remove()
  const matchesTemplate = (date, mmr, mmrChange, result, imgSource, KD, humanTime) => {
    let color = mmrChange.includes("+") ? "chartreuse" : "red"; 
    return `
    <div class="row align-items-center mx-0 border-bottom mb-2 g-0" attr="matchesInject">
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
    </div>`
  };
  completeArray.matchHistory.forEach((v, i) => {
    let date = v[0]; let mmr = v[3]; let mmrChange = v[4];
    let KD = v[5]; let humanTime = v[8]; 
    let result = () => v[2].includes("!") ? v[2] : v[2].replace(/[A-Za-z ]/g, '').slice(0, 1) + ` W's | ` + ` L's`;
    let imgSource = v[6] =='undefined' || undefined ? "https://imgur.com/PvLQN8r.png" : v[6]
    $(`div[player=${currentPlayerCol}] [attr=accordion-card-4]`).append(matchesTemplate(date, mmr, mmrChange, result(), imgSource, KD, humanTime));
  });
};
export function initializeDOMForNewPlayer(currentPlayerCol,inMobileView) {
  inMobileView ? $(`[player=${currentPlayerCol}] [attr=input-group-text]`).eq(1).val('') : $(`[player=${currentPlayerCol}] [attr=input-group-text]`).eq(0).val(''); //clear input
  $(`[attr='autocomplete-dropdown-items-to-delete']`).remove(); //clear autocomplete
  $(`div[player=${currentPlayerCol}] [attr=card-header]`).text('') //clear header
  AutoComplete.controller.abort();
  showCard(currentPlayerCol); //show card
  $(`div[player=${currentPlayerCol}] [attr='input-group-button-refresh']`).removeAttr('hidden') // show refresh button
  initializeDOM(currentPlayerCol,inMobileView); //refresh DOM for only one column
  $('.accordion-body .card').css('max-height',$(window).outerHeight() - 474);
}
function addOffset(array, value, offset = 1) {
  if (!array.find((element) => element === value)) return 'N/A' 
  else return array[array.indexOf(`${value}`) + offset]
}
function mmrOrRp(arr){ 
  let result;
  if (arr[5].find((element) => element === 'Personal Record') && arr[6].find((element) => element === 'Personal Record')){ //Personal Record on BOTH rp and mmr
    let bestRP = arr[5][arr[5].indexOf('Personal Record') +1].replace(/[A-Za-z ,]/g, '') *1
    let bestMMR = arr[6][arr[6].indexOf('Personal Record') +1].replace(/[A-Za-z ,]/g, '') *1
    bestRP <= bestMMR ? result = 'mmr' : result = 'rp';
    return result;
  }
  else if(arr[5].find((element) => element === 'Personal Record')) return 'rp'
  else if (arr[6].find((element) => element === 'Personal Record')) return 'mmr'
  else return false;
}
