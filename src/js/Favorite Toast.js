import * as Off_Canvas from './Off Canvas';
import * as Local_Storage from './Local Storage';
export function templates(add,lookupName,lookupPlatform,randomNum) {
	if (add){
		return `
		<div attr="${randomNum}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-animation="true">
		<div class="toast-header bg-success text-white">
			<strong class="me-auto ps-3" id="error-toast-header">Favorite added!</strong>
			<small>Just now</small>
			<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
		</div>
		<div class="toast-body bg-secondary text-white" id="error-toast-body">${lookupName} on ${lookupPlatform} has been added to your favorites!</div>
	</div>`
	} 
	else {
	return`
	<div attr="${randomNum}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-animation="true">
	<div class="toast-header bg-success text-white">
		<strong class="me-auto ps-3" id="error-toast-header">Favorite removed.</strong>
		<small>Just now</small>
		<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
	</div>
	<div class="toast-body bg-secondary text-white" id="error-toast-body">${lookupName} on ${lookupPlatform} has been removed from your favorites.</div>
	</div>
	`
	};
};

export function main(lookupName,lookupColumn,lookupPlatform) {
	let randomNum = Math.round(Math.random() * 1000)
  let add = true;
  let starIcon = lookupColumn.find('img[width=24px]');
  if(starIcon.attr('src').indexOf('Filled') !== -1){
    starIcon.attr('src','../media/Empty Star.svg');
    add = false;
    Local_Storage.removeStorage(lookupName,'favorites')
  }
  else { 
    starIcon.attr('src','../media/Filled Star.svg');
    add = true;
    Local_Storage.setStorage(lookupName,lookupPlatform,'favorites');
  }
  let toastTemplate = templates(add,lookupName,lookupPlatform,randomNum);
  $('[attr=favorite-toast]').append(toastTemplate);
  $('[attr=favorite-toast]').children().each((i,e) => i > 5 ? $('[attr=favorite-toast]').children().eq(0).remove() : null);
  new bootstrap.Toast($(`[attr=${randomNum}]`),{
		animation: true,delay: 3000
	}).show();
  Off_Canvas.refresh();
}

export function handleFavoriteStarOnLoad(currentPlayerCol,lookupName) {
	let starIcon = $(`div[player=${currentPlayerCol}]`).find('img[width=24px]');
	let playerisFavorite = localStorage.getItem(lookupName+':favorites') !== null
	playerisFavorite ? starIcon.attr('src','../media/Filled Star.svg') : starIcon.attr('src','../media/Empty Star.svg');
}