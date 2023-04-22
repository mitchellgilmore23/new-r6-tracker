

const $ = require('jquery');
const axios = require('axios');
const cheerio = require('cheerio');
const proxy = 'https://tracker-proxy.herokuapp.com'

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
		
			// Main Webpage
			var axiosData = cheerio.load(completeArray.axiosData[0])
			axiosData('#profile .trn-card').each((_,arr) => { //initial push
				completeArray.cheerioData.main.push($(arr).text()
				.replace(/(\n){1,}/gm,'\n')
				.trim()
				.split('\n'))
			})
			completeArray.cheerioData.main.forEach((arr,arrI) => arr.forEach((val,valI) =>  { //sorting and filtering
				completeArray.cheerioData.main[arrI][valI] = val.replace(/^ | $/g,'')
				if (val.length < 1 || val == ' ' || val == '') completeArray.cheerioData.main[arrI].splice(valI,1)
			}))


			//Match History
			var axiosData = cheerio.load(completeArray.axiosData[1])

			axiosData('.trn-table__row').each((_,arr) => { //main content 
				completeArray.cheerioData.matchHistory.push($(arr).text()
				.replace(/(\n){1,}/gm,'\n')
				.trim()
				.split('\n')		
				)
			})
			completeArray.cheerioData.matchHistory.shift()
			axiosData('table > tbody > tr > td:nth-child(4) > img').each((i,arr) => {/// rank-img url
				completeArray.cheerioData.matchHistory[i].unshift(arr.attribs.src)
				// console.log(arr.attribs.src)
			})
			completeArray.cheerioData.matchHistory.forEach((arr,arrI) => arr.forEach((val,valI) =>  { //sorting and filtering
				completeArray.cheerioData.matchHistory[arrI][valI] = val.replace(/^ | $/g,'')
        if (val.length < 1 || val == ' ' || val == '') completeArray.cheerioData.matchHistory[arrI].splice(valI,1)
      }))

			//Season History
			var axiosData = cheerio.load(completeArray.axiosData[2])
			axiosData('.trn-card').each((_,arr) => {
				completeArray.cheerioData.seasons.push($(arr).text()
				.replace(/(\n){1,}/gm,'\n')
				.trim()
				.split('\n'))
			})
			completeArray.cheerioData.seasons.forEach((arr,arrI) => arr.forEach((val,valI) =>  { // sorting and filtering
				completeArray.cheerioData.seasons[arrI][valI] = val.replace(/^ | $/g,'')
				if (val.length < 1 || val == ' ' || val == '') completeArray.cheerioData.seasons[arrI].splice(valI,1)
			}))
			console.log(completeArray)
		})	
	}
				// if (i < 21) {
				// 	if (i > 0 && $(this)[0].children[7].children[1] !== undefined) {
				// 		a["matchHistory"][i].push($(this)[0].children[7].children[1].attribs["src"]);
				// 		a["matchHistory"][i].push($(this)[0].children[1].children[1].attribs["v-human-time"]);
				// 		a["matchHistory"][i][7] = a["matchHistory"][i][7].replaceAll(`'`, ``);
				// 		a["matchHistory"][i].push(humanTime(a["matchHistory"][i][7]));
				// 	}
				// }

}