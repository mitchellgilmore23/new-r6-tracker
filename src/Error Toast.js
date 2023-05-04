const bootstrap = require('bootstrap');
const $ = require('jquery');
const errorToast = new bootstrap.Toast($('#error-toast'),{
animation: true,
autohide: true,
delay: 5000
});
const toastBody = $('#error-toast-body');
export default function(message) {
	let platform = message.config.url.match(/(xbox|psn)/)
	console.log(platform[0]);
	console.log(message);
	toastBody.text(message + message.config.url);
	errorToast.show();
}