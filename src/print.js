import form from './registration_form_layout';
// console.log(form());

const headIncludes = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
crossorigin="anonymous"></script>`;

function waitForLoad(win) {
	return new Promise((resolve) => {
		if (win.document.readyState === 'complete') {
			resolve();
		} else {
			win.addEventListener('load', resolve);
		}
	});
}

export default async (row) => {
	var winPrint = window.open(
		'',
		'',
		'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0'
	);
	winPrint.document.write(
		`<html><head>${headIncludes}<title>Εγγραφή #123</title></head><body></body></html>`
	);
	winPrint.document.close();
	await waitForLoad(winPrint);

	winPrint.document.body.innerHTML = form(row);
	winPrint.focus();
	winPrint.print();
	winPrint.close();
};
