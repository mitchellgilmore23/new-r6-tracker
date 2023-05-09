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
				<p>You're back!</p>
				<p>Heres a list of stuff I've added:</p>
				<ul>
					<li>You can use the ~ key (one above tab) to switch consoles on the fly! this will get you tracking quicker than ever.</li>
					<li>Added favorites and recent players tab.</li>
					<li>Optimized site for mobile, since most people use it.</li>
				</ul>
				<p>Please reach out in the "Contribute" Section with any suggestions!</p>
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
$('[attr=welcomeModalInject').replaceWith(template)

export default () => new bootstrap.Modal($('#welcomeModal'))
	 