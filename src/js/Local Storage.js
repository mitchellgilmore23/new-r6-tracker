import * as Off_Canvas from './Off Canvas.js';

export function setStorage(name,platform,type) {
	localStorage.setItem(`${name}:${type}`,platform);
	Off_Canvas.refresh();
};
export function removeStorage(name,type) {
localStorage.removeItem(`${name}:${type}`);
Off_Canvas.refresh();
}
export function fetchStorage() {
	let regex = /(?<name>(^[\w _-]+))|(?<platform>(xbox|psn))|\w+/g
	let sortedLocalStorage = []
	Object.entries(localStorage).forEach((object,index) => {
		object.forEach((v,i) => {
			if (v.includes(':')) {
				let newArr = v.match(regex); // match player and type into object
				newArr.push(object[1]);
				sortedLocalStorage.push(newArr);
			};
		});
	});
	return sortedLocalStorage;
};


//////////////////////////////////////////// TESTING
