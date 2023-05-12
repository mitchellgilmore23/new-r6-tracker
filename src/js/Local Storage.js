import * as Off_Canvas from './Off Canvas.js';

const persistentStorageTimeout = 3600; // timeout after 3600 seconds(1 hr)

export function staticStorage(type) {
	let localStorageArr = localStorage.getObj(type) ? localStorage.getObj(type) : [];
	function check(name){
		let bool = false;
		localStorageArr.forEach((_,i) => localStorageArr[i][0] == name ? bool = true : null);
		return { status : bool, [type] : localStorageArr };
	};
	////////////////////
	function set(name,platform) {
		if (name && platform) {
			let returnArr = [];
			if(name && platform) {
				localStorageArr.forEach((_,i) => {
					if (localStorageArr[i][0] == name) return;
					returnArr.push(localStorageArr[i]);
				});
				returnArr.push([name, platform]);
				localStorage.setObj(type,returnArr);
				Off_Canvas.refresh();
			};
			return { [type] : returnArr, currentLocalStorageLength: localStorageArr.length };
		}
		else if (name) {
		localStorage.setObj(type,name);
		return localStorage.getObj(type);
		}
	};
	/////////////////////
	function get(){
		if (type)	return localStorage.getObj(type) 
		else {
			let favorites = localStorage.getObj('favorites') ? localStorage.getObj('favorites') : [];
			let recents = localStorage.getObj('recents') ? localStorage.getObj('recents') : [];
			return {'favorites' : favorites,'recents': recents };
		};
	};
	/////////////////////
	function rm(nameToRm) {
		let found = false;
		localStorageArr.forEach((val,ind) => {
			let [ name,_ ] = val;
			if (name == nameToRm) {
				localStorageArr.splice(ind,1)
				found = true;
			};
		})
		localStorage.setObj(type,localStorageArr);
		if (found) return true
		else return console.error(`Player not found.. Unable to remove ${nameToRm} from local storage.`);
	};
	return {check,set,get,rm};
};
export function persistentStorage(type) {
	let loaded = localStorage.getObj(type) ? localStorage.getObj(type) : {} ;
	////////////////
	function set(name,platform,col) {
		Object.keys(loaded).forEach((arr,i) => loaded[arr].hasFocus = false);
		loaded[col] = { name: name,	platform: platform,
									expiryTime:(Date.now()/1000) + persistentStorageTimeout,
									hasFocus: true };
		localStorage.setObj('loaded',loaded);
		return;
	};
	////////////////
	function get(){
		let columnsOccupied = [];
		let timeNow = Date.now()/1000;
		Object.keys(loaded).forEach(key => {
			if (loaded[key].expiryTime < timeNow) delete loaded[key];
			else columnsOccupied.push(key);
		});
		localStorage.setObj('loaded',loaded);
		return { columnsOccupied : columnsOccupied, loaded : localStorage.getObj('loaded') };
	};
	let clear = () =>	localStorage.removeItem(type);
	return {set,get,clear}
};


const buttonGroup = `<div class="btn-group w-100 my-md-2 my-1">
<button class="btn rounded-2 btn-outline-success w-50" type="button" attr="input-group-button-submit" tabindex="-1">Submit</button>
<button class="btn w-50 rounded-2 btn-outline-info w-50" type="button" attr="input-group-button-refresh" tabindex="-1" style='display:none'>Refresh</button>
</div>
<div class="input-group mb-1 mb-md-2">
<input type="text" class="form-control" placeholder="Enter name.." attr="input-group-text" tabindex='-1' />
<button class="btn btn-outline-secondary active" type="button" attr="input-group-button-xbox" tabindex="-1">
	<img src='../media/Xbox_Icon.svg' height='35px' style='fill:white;'>
</button>
<button class="btn btn-outline-secondary" type="button" tabindex="-1" attr="input-group-button-ps">
	<img src='../media/PlayStation_Icon.svg' height='35px' style='fill:white;'>
</button>
</div>
<ul class="list-group dropdown-menu p-0"></ul>`;

(function loadingData () {
  let alreadyStored = localStorage.getItem('background-image');
	if (alreadyStored === null) {
		let bgImg = require('./bg-to-base64.js').data
		localStorage.setItem('background-image',bgImg)
		$('body').css('background-image', `url('data:image/png;base64,`+bgImg+`')`)
	} 
	else $('body').css('background-image', `url('data:image/png;base64,`+alreadyStored+`')`);
	alreadyStored = localStorage.getItem('button-group')
	if (alreadyStored === null) localStorage.setItem('button-group',buttonGroup);
})();

Storage.prototype.setObj = function(key, obj) { 
	return this.setItem(key, JSON.stringify(obj))
};
Storage.prototype.getObj = function(key) {
	return JSON.parse(this.getItem(key))
};