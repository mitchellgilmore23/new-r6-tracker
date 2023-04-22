

const $ = require('jquery');
const axios = require('axios');
const cheerio = require('cheerio');
const proxy = 'https://tracker-proxy.herokuapp.com'
const moment = require('moment');
const MatchHistoryRankImgUrl = (cheerioData,arr) => cheerioData(arr).children().eq(3).children().attr('src') || "undefined"
const mainFetchRecordMMrAttr = (cheerioData) => cheerioData("#profile > div.trn-scont.trn-scont--swap > div.trn-scont__aside > div:nth-child(3) > div > div:nth-child(1) > div.r6-quickseason__image > img").attr()
const mainFetchRecordPointAttr = (cheerioData) => cheerioData("#profile > div.trn-scont.trn-scont--swap > div.trn-scont__aside > div:nth-child(2) > div > div:nth-child(1) > div.r6-quickseason__image > img").attr()


function MatchHistoryUTCTime(cheerioData,arr) {if (cheerioData(arr).children().children().eq(0).attr('v-human-time')) {
	return cheerioData(arr).children().children().eq(0).attr('v-human-time').replaceAll("'",'')
	} 
	else return "undefined"
}
export class autoComplete {
	constructor(lookupName, currentPlayerCol, lookupPlatform) {
    this.lookupName = lookupName;
		this.currentPlayerCol = currentPlayerCol;
		this.lookupPlatform = lookupPlatform;
		this.insertResults()
		}
	 
		axiosCall = () => axios.get(`${proxy}/https://r6.tracker.network/r6/autocomplete?name=${this.lookupName}&platform=${this.lookupPlatform}`)
	 
	 async insertResults () {
		this.clearResults();
		await this.axiosCall().then(response => {
			let ulDiv = $(`[player=${this.currentPlayerCol}] ul`)
			response.data.forEach((item, index, array) => {

				var buttonAttrs = 
				`class="list-group-item d-flex justify-content-between align-items-center rounded-2 w-100" 
				tabindex="${index + 1}" 
				attr='autocomplete-dropdown-items-to-delete'
				onclick="dropdownClicked($(this),${this.currentPlayerCol})"`
				
				var newHtml = 
				`<button ${buttonAttrs}>${item.name}<span class="badge rounded-pill"> 
					Level ${item.cl}</span>
				</button>`
			ulDiv.append(newHtml)
		})
	})
	}
	clearResults = () => $(`[attr='autocomplete-dropdown-items-to-delete']`).remove()
}

export class getRankedData {
  constructor(lookupName,currentPlayerCol,lookupPlatform) {
    this.lookupName = lookupName;
		this.currentPlayerCol = currentPlayerCol;
		this.lookupPlatform = lookupPlatform;
		this.fetchMain(lookupName,lookupPlatform)
  }
	axiosCallMain = () => axios.get(`${proxy}/https://r6.tracker.network/profile/${this.lookupPlatform}/${this.lookupName}`)
	axiosCallMatchHistory = () => axios.get(`${proxy}/https://r6.tracker.network/profile/${this.lookupPlatform}/${this.lookupName}/mmr-history`)
	axiosCallSeasonHistory = () => axios.get(`${proxy}/https://r6.tracker.network/profile/${this.lookupPlatform}/${this.lookupName}/seasons`)
	
  async fetchMain(lookupName,lookupPlatform) {
		
		var completeArray = {'axiosData': [],'cheerioData': {main:[],matchHistory:[],seasons:[]}}
		
		if (lookupName.length < 1 || lookupPlatform != 'xbox' && lookupPlatform != 'psn') return completeArray = 'Error in if statment';
		
		Promise.all([this.axiosCallMain(),this.axiosCallMatchHistory(),this.axiosCallSeasonHistory()]).then(response => {
			response.forEach(val => completeArray.axiosData.push(val.data)) //push axios into first array item 
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// Main Webpage
			var cheerio$ = cheerio.load(completeArray.axiosData[0])
			sortingHelper(completeArray.cheerioData.main,'#profile .trn-card',cheerio$)
			completeArray.cheerioData.main.forEach((arr,arrI) => arr.forEach((val,valI) =>  { //sorting and filtering	
					completeArray.cheerioData.main[arrI][valI] = val.replace(/^ | $/g,'')
					if (val.length < 1 || val == ' ' || val == '') completeArray.cheerioData.main[arrI].splice(valI,1)
			}))
			completeArray.cheerioData.main[7].unshift(mainFetchRecordMMrAttr(cheerio$))
			completeArray.cheerioData.main[6].unshift(mainFetchRecordPointAttr(cheerio$))
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			//Match History
			var cheerio$ = cheerio.load(completeArray.axiosData[1])
			sortingHelper(completeArray.cheerioData.matchHistory,'.trn-table__row',cheerio$)
			cheerio$('.trn-table__row').each((i,arr) => { // push match history
				completeArray.cheerioData.matchHistory[i] = ($(arr).text().replace(/(\n){1,}/gm,'\n').trim().split('\n'))
				completeArray.cheerioData.matchHistory[i].push(MatchHistoryRankImgUrl(cheerio$,arr)) //push match history rank img url
				completeArray.cheerioData.matchHistory[i].push(MatchHistoryUTCTime(cheerio$,arr))// push match history utc time
				completeArray.cheerioData.matchHistory[i].push(moment.utc(MatchHistoryUTCTime(cheerio$,arr)).fromNow()) //push match history readable time
			})
			completeArray.cheerioData.matchHistory.shift()
			completeArray.cheerioData.matchHistory.forEach((arr,arrI) => arr.forEach((val,valI) =>  { //sorting and filtering
				completeArray.cheerioData.matchHistory[arrI][valI] = val.replace(/^ | $/g,'')
        if (val.length < 1 || val == ' ' || val == '') completeArray.cheerioData.matchHistory[arrI].splice(valI,1)
      }))
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			//Season History
			var cheerio$ = cheerio.load(completeArray.axiosData[2])
			sortingHelper(completeArray.cheerioData.seasons,'.trn-card',cheerio$)
			completeArray.cheerioData.seasons.forEach((arr,arrI) => arr.forEach((val,valI) =>  { // sorting and filtering
				completeArray.cheerioData.seasons[arrI][valI] = val.replace(/^ | $/g,'')
				if (val.length < 1 || val == ' ' || val == '') completeArray.cheerioData.seasons[arrI].splice(valI,1)
			}))
			completeArray.cheerioData.seasons.shift()
			console.log(completeArray)
		})	

	}
}

function sortingHelper(arrToInsertData,lookupVal,cheerioDefinition){
	cheerioDefinition(`${lookupVal}`).each((_,arr) => {
		arrToInsertData.push($(arr).text().replace(/(\n){1,}/gm,'\n')
		.trim().split('\n'))
	})
}