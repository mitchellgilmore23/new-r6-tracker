const bootstrap = require('bootstrap');
const template = `
<modal>
<div class="modal fade" id="welcomeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content bg-dark text-white">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="staticBackdropLabel">Welcome!</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<p>You're back! I have recently changed a few things around. There is a lot of data now! Feel free to shoot me an email with any suggestions!</p>
				<p>Heres a list of stuff I've added:</p>
				<ul>
					<li>You can use the ~ key (one above tab) to switch consoles on the fly! this will get you tracking quicker than ever.</li>
					<li>I've added every previous season ranking in the third accordion item.</li>
					<li>I've added the last 20 game sessions and how they ended.</li>
				</ul>
				<p>I hope this helps you all! This has been a fun project and am grateful for you all.</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary" welcomemodal="dontShowAgain"  data-bs-dismiss="modal">Don't Show Again</button>
			</div>
		</div>
	</div>
</div>
</modal>
`


$('[attr=welcomModalInject').replaceWith(template)

export const welcomeModal = new bootstrap.Modal($('#welcomeModal'))