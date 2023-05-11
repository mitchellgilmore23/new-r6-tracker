const $ = require('jquery');
const bootstrap = require('bootstrap');

export const offCanvas = new bootstrap.Offcanvas($('#offCanvas'),{scroll: true});
import * as Local_Storage from './Local Storage';

$('#offCanvas-close-button').on('click',() => offCanvas.hide());
$('#favorites').on('click',() => offCanvas.show());

export function refresh(){ //change or refresh
	const {recents,favorites} = Local_Storage.staticStorage().get();
	$('[attr=offCanvas-favorites],[attr=offCanvas-recents]').html('')
	recents.forEach(val => {
		let [player,platform] = val;
		$('[attr=offCanvas-recents]').append(defaultLayout(player,platform));
	});
	favorites.forEach(val => {
    let [player,platform] = val;
    $('[attr=offCanvas-favorites]').append(defaultLayout(player,platform));
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

