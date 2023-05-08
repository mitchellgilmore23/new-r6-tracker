const bootstrap = require('bootstrap');
const $ = require('jquery');
const errorToast = new bootstrap.Toast($('#error-toast'),{
	animation: true,
	autohide: true,
	delay: 1000 * 40
});
const toastBody = $('#error-toast-body');
const toastHeader = $('#error-toast-header');



export default function(error,lookupName,lookupPlatform) {
	if(error){
		let newUrl = error.config.url.replace('https://tracker-proxy.herokuapp.com/','')
		toastHeader.text(lookupName + ' on ' + lookupPlatform + ' returned an error. ');
		toastBody.html(`${error.message}. (${error.response.statusText})
		<a href='${newUrl}' class='d-block text-center' id="error-toast-link" target="_blank">Click to See Error.</a>`
		)
		errorToast.show();

	}
}