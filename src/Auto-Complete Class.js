const $ = require('jquery');
const axios = require('axios');
const proxy = 'https://tracker-proxy.herokuapp.com'
export class autoComplete {
	constructor(lookupName, currentPlayerCol, lookupPlatform) {
    this.lookupName = lookupName;
		this.currentPlayerCol = currentPlayerCol;
		this.lookupPlatform = lookupPlatform;
		this.controller = new AbortController()
		this.insertResults()
	} 
	axiosCall = () => axios.get(`${proxy}/https://r6.tracker.network/r6/autocomplete?name=${this.lookupName}&platform=${this.lookupPlatform}`, {
		signal : this.controller.signal }
		)
	
	async insertResults () {
		await this.axiosCall().then(response => {
			this.clearResults();
			let ulDiv = $(`[player=${this.currentPlayerCol}] ul`)
			response.data.forEach((item, index) => {
				var buttonAttrs =	`class="list-group-item d-flex justify-content-between align-items-center rounded-2 w-100" tabindex="${index +1}" 
				attr='autocomplete-dropdown-items-to-delete' onclick="dropdownClicked($(this),${this.currentPlayerCol})"`
				var newHtml = `<button ${buttonAttrs}>${item.name}<span class="badge rounded-pill">Level ${item.cl}</span></button>`
				ulDiv.append(newHtml)
			})
		}).catch(error => cancelledAutoComplete(error))
	}
	clearResults = () => $(`[attr='autocomplete-dropdown-items-to-delete']`).remove()
}
function cancelledAutoComplete(e) {
	$(`[attr='autocomplete-dropdown-items-to-delete']`).remove()
}