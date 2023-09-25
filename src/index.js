import './style.css';
import genRow from './row.js';

let values = [];

async function getValues() {
	let response;
	try {
		// Fetch first 10 files
		response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: import.meta.env.VITE_SHEET_ID,
			range: 'Form Responses 1',
		});
		return response.result.values;
	} catch (err) {
		document.getElementById('content').innerText = err.message;
		return;
	}
	// return response.body
}

async function sign(e) {
	let parent = e.target.parentElement.parentElement; //target is the button element

	if (e.target.nodeName == 'TD')
		//target is the td element
		parent = e.target.parentElement;
	else if (e.target.nodeName == 'I')
		//target is the i element
		parent = e.target.parentElement.parentElement.parentElement;
	const row_id = parent.dataset.sheetsId;
	const range = `Form Responses 1!G${row_id}:G${row_id}`;
	try {
		let resp = await gapi.client.sheets.spreadsheets.values.update({
			spreadsheetId: import.meta.env.VITE_SHEET_ID,
			range: range,
			valueInputOption: 'USER_ENTERED',
			resource: {
				majorDimension: 'ROWS',
				range: range,
				values: [['NEW']],
			},
		});
		console.log(resp);
	} catch (err) {
		console.log(err);
	}
}

async function handleUpdateVals(v) {
	document
		.querySelectorAll('.sign-button')
		.forEach((btn) => btn.setAttribute('disabled', 'disabled'));
	values = v.map((v, idx) => ({
		name: v[1],
		timestamp: v[0],
		signed: v[2],
		sheets_id: idx + 1,
	}));

	document.getElementById('registrations').innerHTML = values
		.map((v) => genRow(v))
		.join('\n');

	document.querySelectorAll('.sign-button').forEach((btn) => {
		btn.onclick = sign;
		btn.removeAttribute('disabled');
	});
}

async function updateVals() {
	if (document.signedIn) {
		let v = await getValues();
		if (v.length != values.length) {
			console.log('New Response!');
			handleUpdateVals(v);
		}
	}
}

async function forceUpdateVals() {
	let v = await getValues();
	handleUpdateVals(v);
}

setInterval(updateVals, 5000);
