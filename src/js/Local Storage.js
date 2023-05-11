import * as Off_Canvas from './Off Canvas.js';

const persistentStorageTimeout = 3600 // timeout after 3600 seconds(1 hr)
export function staticStorage() {
	function check(type,name){
		let localStorageArr = localStorage.getObj(type) ? localStorage.getObj(type) : [];
		let bool = false;
		localStorageArr.forEach((_,i) => localStorageArr[i][0] == name ? bool = true : null);
		return {status : bool,
						[type] : localStorageArr
					};
	};
	function set(type,name,platform) {
		let localStorageArr = localStorage.getObj(type) ? localStorage.getObj(type) : [];
		let returnArr = [];
		if(name && platform) {
			localStorageArr.forEach((_,i) => {
				if (localStorageArr[i][0] == name) return;
				returnArr.push(localStorageArr[i]);
			});
			returnArr.push([name,
											platform
										]);
			localStorage.setObj(type,returnArr);
			Off_Canvas.refresh();
		};
		return {[type] : returnArr,
						currentLocalStorageLength: localStorageArr.length
					};
	};
	function get(type){
		if (type)	{
			return {[type] : localStorage.getObj(type)}
		}
		else {
			let favorites = localStorage.getObj('favorites') ? localStorage.getObj('favorites') : [];
			let recents = localStorage.getObj('recents') ? localStorage.getObj('recents') : [];
			return {'favorites' : favorites,
							'recents': recents,
							};
		};
	};
	function rm(type,nameToRm) {
		let arr = localStorage.getObj(type) ? localStorage.getObj(type) : [];
		let found = false;
		arr.forEach((val,ind) => {
			let [name,_] = val;
			if (name == nameToRm) {
				arr.splice(ind,1)
				found = true;
			};
		})
		localStorage.setObj(type,arr);
		if (found) return true
		else return console.error('Player not found..');
	};
	return {check,set,get,rm};
};

export function persistentStorage() {
	let loaded = localStorage.getObj('loaded') ? localStorage.getObj('loaded') : {} ;
	function set(name,platform,col) {
		Object.keys(loaded).forEach((arr,i) => loaded[arr].hasFocus = false);
		loaded[col] = {name: name,
									platform: platform,
									expiryTime:(Date.now()/1000) + persistentStorageTimeout,
									hasFocus: true,
								}

		localStorage.setObj('loaded',loaded);
		return;
	}
	function get(){
		let columnsOccupied = []
		let timeNow = Date.now()/1000
		Object.keys(loaded).forEach(key => {
			if (loaded[key].expiryTime < timeNow) delete loaded[key]
			else columnsOccupied.push(key)
		});
		localStorage.setObj('loaded',loaded);
		return {columnsOccupied : columnsOccupied,
						loaded : localStorage.getObj('loaded')
						}
	}
	let clear = () =>	localStorage.removeItem('loaded')
	return {set,get,clear}
}

Storage.prototype.setObj = function(key, obj) { 
	return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
	return JSON.parse(this.getItem(key))
}
