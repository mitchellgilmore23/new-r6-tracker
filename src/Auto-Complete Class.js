export default class {
	constructor(lookupName, currentPlayerCol, lookupPlatform) {
    this.lookupName = lookupName;
    this.currentPlayerCol = currentPlayerCol;
    this.lookupPlatform = lookupPlatform;
  }
	async fetch(){
		console.log(this.lookupName, this.currentPlayerCol, this.lookupPlatform)
		let url = `https://tracker-proxy.herokuapp.com/https://r6.tracker.network/r6/autocomplete?name=${this.lookupName}&platform=${this.lookupPlatform}`;
		// var length = $(`#p${player}Input`).width();
		// $(`#p${player}DropdownClass`).css("width", length * 1.08 + "px");
		// if (name.length < 1) {
		//   $(`#p${player}DropdownClass`).removeClass("show");
		//   return;
		const a = fetch(url).then(r => r.json());
		this.insertResults(await a);
	}
	async insertResults(a){
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
			$(`[dropdown='${player}]'`).before(newHtml);
		});
		$(`#p${player}DropdownClass`).removeAttr("hidden");
    console.log(a)
	}
	clear(){

	}
}