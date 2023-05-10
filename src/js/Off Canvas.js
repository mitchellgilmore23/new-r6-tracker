const $ = require('jquery');
const bootstrap = require('bootstrap');

export const offCanvas = new bootstrap.Offcanvas($('#offCanvas'),{scroll: true});
import * as Local_Storage from './Local Storage';

$('#offCanvas-close-button').on('click',() => offCanvas.hide());
$('#favorites').on('click',() => offCanvas.show());

export function refresh(){ //change or refresh
	const arr = Local_Storage.fetchStorage();
	$('[attr=offCanvas-favorites],[attr=offCanvas-recents]').html('')
	arr.forEach((v,i) => {
		if (v[1] == 'favorites') $('[attr=offCanvas-favorites]').append(defaultLayout(v[0],v[2]));
		if (v[1] == 'recents')   $('[attr=offCanvas-recents]').append(defaultLayout(v[0],v[2]));
	});
};

function defaultLayout(player,platform) {
	return `
		<div class="row g-1 mb-1">
			<div class="col-10">
				<button class="btn text-white btn-outline-primary w-100" attr='offCanvas-player-button' platform='${platform}'>${player}</button>
			</div>
			<div class="col-2">
				<button class="btn btn-outline-danger w-100" attr='offCanvas-trash-button'><img src="../media/Trash.svg" /></button>
			</div>
		</div>`
}

