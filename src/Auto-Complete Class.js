

const $ = require('jquery');
const axios = require('axios');
const cheerio = require('cheerio');
const proxy = 'https://tracker-proxy.herokuapp.com/'
export class autoComplete {
	constructor(lookupName, currentPlayerCol, lookupPlatform) {
    this.lookupName = lookupName;
		this.currentPlayerCol = currentPlayerCol;
		this.lookupPlatform = lookupPlatform;
		this.fetch()
	}
	async fetch(){
		let url = `https://tracker-proxy.herokuapp.com/https://r6.tracker.network/r6/autocomplete?name=${this.lookupName}&platform=${this.lookupPlatform}`;
		const array = fetch(url).then(r => r.json());
		this.insertResults(await array);
	}
	async insertResults(array){
		this.clearResults();
		let ulDiv = $(`[player=${this.currentPlayerCol}] ul`)
		if (this.lookupName.length < 1) array = [];
		array.forEach((item, index, array) => {
			let newHtml = `
			<button 
				class="list-group-item d-flex justify-content-between align-items-center rounded-2 w-100" 
				tabindex="${index + 1}" 
				attr='autocomplete-dropdown-items-to-delete'
				onclick="dropdownClicked($(this),${this.currentPlayerCol})"
				>${item.name}<span class="badge rounded-pill"> 
					Level ${item.cl}
				</span>
			</button>
			`;
			ulDiv.append(newHtml)
		});
	}
	clearResults(){
		$(`[attr='autocomplete-dropdown-items-to-delete']`).remove()
	}
}

export class getRankedData {
  constructor(lookupName,currentPlayerCol,lookupPlatform) {
    this.lookupName = lookupName;
		this.currentPlayerCol = currentPlayerCol;
		this.lookupPlatform = lookupPlatform;
		this.fetchMain(this.lookupName,this.lookupPlatform)
		this.fetchMatchHistory(this.lookupName,this.lookupPlatform)
		this.fetchSeasonHistory(this.lookupName,this.lookupPlatform)

  }
  async fetchMain(lookupName,lookupPlatform) {
		var newArr = [];
		if (lookupName.length < 1 || lookupPlatform != 'xbox' && lookupPlatform != 'psn') return;
		await axios({
			timeout: 8000,
			method: 'get',
      headers: {
        'accept-language': 'en-US,en;q=0.8,et;q=0.6',
				"cache-control": "max-age=0"
    	},
			url: `${proxy}https://r6.tracker.network/profile/${lookupPlatform}/${lookupName}`,
		})
		.then(response => {
			var axiosData = cheerio.load(response.data)
			axiosData('#profile .trn-card').each((i,arr) => newArr.push($(arr).text().replace(/(\n){1,}/gm,'\n').trim().split('\n')))
			newArr.forEach((arr,arrI) => arr.forEach((val,valI) =>  {
				newArr[arrI][valI] = val.replace(/^ | $/g,'')
				if (val.length < 1 || val == ' ' || val == '') newArr[arrI].splice(valI,1)
			}))
			this.mainArray = newArr;
		})
		.catch(error => console.log(error))
	}
	async fetchMatchHistory(lookupName,lookupPlatform) {
		var newArr = [];
		if (lookupName.length < 1 || lookupPlatform != 'xbox' && lookupPlatform != 'psn') return;
		await axios({
			timeout: 8000,
			method: 'get',
      headers: {
        'accept-language': 'en-US,en;q=0.8,et;q=0.6',
				"cache-control": "max-age=0"
    	},
			url: `${proxy}https://r6.tracker.network/profile/${lookupPlatform}/${lookupName}/mmr-history`,
		})
		.then(response => {
			var axiosData = cheerio.load(response.data)
			axiosData('.trn-table__row').each((i,arr) => newArr.push($(arr).text().replace(/(\n){1,}/gm,'\n').trim().split('\n')))
				// if (i < 21) {
				// 	if (i > 0 && $(this)[0].children[7].children[1] !== undefined) {
				// 		a["matchHistory"][i].push($(this)[0].children[7].children[1].attribs["src"]);
				// 		a["matchHistory"][i].push($(this)[0].children[1].children[1].attribs["v-human-time"]);
				// 		a["matchHistory"][i][7] = a["matchHistory"][i][7].replaceAll(`'`, ``);
				// 		a["matchHistory"][i].push(humanTime(a["matchHistory"][i][7]));
				// 	}
				// }

			
			newArr.forEach((arr,arrI) => arr.forEach((val,valI) =>  {
				newArr[arrI][valI] = val.replace(/^ | $/g,'')
				if (val.length < 1 || val == ' ' || val == '') newArr[arrI].splice(valI,1)
			}))
			this.MatchHistory = newArr;
			console.log(newArr)
		})
		.catch(error => console.log(error))
	}
	async fetchSeasonHistory(lookupName,lookupPlatform) {
		var newArr = [];
		if (lookupName.length < 1 || lookupPlatform != 'xbox' && lookupPlatform != 'psn') return;
		await axios({
			timeout: 8000,
			method: 'get',
      headers: {
        'accept-language': 'en-US,en;q=0.8,et;q=0.6',
				"cache-control": "max-age=0"
    	},
			url: `${proxy}https://r6.tracker.network/profile/${lookupPlatform}/${lookupName}/seasons`,
		})
		.then(response => {
			var seasons = cheerio.load(response.data)
			seasons('.trn-card').each((i,arr) => newArr.push($(arr).text().replace(/(\n){1,}/gm,'\n').trim().split('\n')))

			newArr.forEach((arr,arrI) => arr.forEach((val,valI) =>  {
				newArr[arrI][valI] = val.replace(/^ | $/g,'')
				if (val.length < 1 || val == ' ' || val == '') newArr[arrI].splice(valI,1)
			}))
			this.SeasonHistory = newArr;
			console.log(newArr)
		})
		.catch(error => console.log(error))
	}
}
