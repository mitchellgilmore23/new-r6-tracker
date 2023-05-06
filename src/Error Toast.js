const bootstrap = require('bootstrap');
const $ = require('jquery');
const errorToast = new bootstrap.Toast($('#error-toast'),{
	animation: true,
	autohide: true,
	delay: 1000 * 40
});
const toastBody = $('#error-toast-body');
const toastHeader = $('#error-toast-header');
export default function(message) {
	console.log(message);
	if(message){
	
		let match = message.config.url.match(/(?<platform>(xbox|psn))|(?<name>(?<=xbox\/|psn\/)[\w- ]+)/g)
		toastHeader.text(match[1] + ' on ' + match[0]+ ' returned an error. ');
		toastBody.html(`
		${message.message}. (${message.response.statusText})
		<a href='${message.config.url}' class='d-block text-center' id="error-toast-link" target="_blank">Click to See Error.</a>`
		)
		errorToast.show();

	}
}