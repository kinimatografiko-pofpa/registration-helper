import './style.css';
// import 'https://apis.google.com/js/api.js';
import genRow from './row.js';
import printRow from './print.js';

import { loadAuth, resetLocalStorage as resetAuth } from './auth.js';

const SIGN_COLUMN = 'S';
let stop = false;
// const isSignedIn = false;

let values = [];

async function getValues() {
	let response;
	try {
		response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: import.meta.env.VITE_SHEET_ID,
			range: 'Form Responses 1',
		});
		return response.result.values;
	} catch (err) {
		document.getElementById('content').innerText = err.message;
		if (err.status == 403) {
			stop = true;
			console.log('403 happened in gv');
			resetAuth();
			await loadAuth();
			await forceUpdateVals();
		}
	}
	// return response.body
}

function getIdFromEvent(e) {
	let parent = e.target.parentElement.parentElement; //target is the button element

	if (e.target.nodeName == 'TD')
		//target is the td element
		parent = e.target.parentElement;
	else if (e.target.nodeName == 'I')
		//target is the i element
		parent = e.target.parentElement.parentElement.parentElement;

	return parent.dataset.sheetsId;
}

async function print(e) {
	const row_id = getIdFromEvent(e);
	console.log(values[row_id - 2]);
	printRow(values[row_id - 2]);
}

async function sign(e) {
	const row_id = getIdFromEvent(e);
	const range = `Form Responses 1!${SIGN_COLUMN}${row_id}:${SIGN_COLUMN}${row_id}`;
	try {
		let resp = await gapi.client.sheets.spreadsheets.values.update({
			spreadsheetId: import.meta.env.VITE_SHEET_ID,
			range: range,
			valueInputOption: 'USER_ENTERED',
			resource: {
				majorDimension: 'ROWS',
				range: range,
				values: [['true']],
			},
		});
		await forceUpdateVals();
	} catch (err) {
		if (err.status == 403) {
			stop = true;
			resetAuth();
			await loadAuth();
			await forceUpdateVals();
		}
		throw err;
	}
}

async function removeSign(e) {
	const row_id = getIdFromEvent(e);
	const range = `Form Responses 1!${SIGN_COLUMN}${row_id}:${SIGN_COLUMN}${row_id}`;
	try {
		let resp = await gapi.client.sheets.spreadsheets.values.update({
			spreadsheetId: import.meta.env.VITE_SHEET_ID,
			range: range,
			valueInputOption: 'USER_ENTERED',
			resource: {
				majorDimension: 'ROWS',
				range: range,
				values: [['']],
			},
		});
		await forceUpdateVals();
	} catch (err) {
		console.log(err);
		if (err.status == 403) {
			stop = true;
			resetAuth();
			await loadAuth();
			await forceUpdateVals();
		}
	}
}

async function handleUpdateVals(v) {
	const filterSigned = document.getElementById('hide-signed-switch').checked;
	v.splice(0, 1); // Remove the header row
	document
		.querySelectorAll('td button')
		.forEach((btn) => btn.setAttribute('disabled', 'disabled'));
	values = v.map((v, idx) => ({
		name: v[1],
		timestamp: v[0],
		university: v[2] || '',
		faculty: v[3] || '',
		phone: v[4] || '',
		email: v[5] || '',
		year: v[7] || v[8] || '',
		reg_number: v[9] || '',
		department: v[11] || '',
		signed: v[18] || false,
		sheets_id: idx + 2,
	}));

	if (filterSigned) {
		values = values.filter((v) => !v.signed);
	}

	document.getElementById('registrations').innerHTML = values
		.slice()
		.reverse()
		.map((v) => genRow(v))
		.join('\n');

	document.querySelectorAll('.sign-button').forEach((btn) => {
		btn.onclick = sign;
	});
	document.querySelectorAll('.remove-sign-button').forEach((btn) => {
		btn.onclick = removeSign;
	});
	document.querySelectorAll('.print-button').forEach((btn) => {
		btn.onclick = print;
	});

	document.querySelectorAll('td button').forEach((btn) => {
		btn.removeAttribute('disabled');
	});
}

function setLoadingStatus(status) {
	document.getElementById('loading-btn').disabled = status;
	document.getElementById('loading-spinner').style.display = status
		? 'inline-block'
		: 'none';
}

async function updateVals() {
	if (document.signedIn && !stop) {
		setLoadingStatus(true);
		let v = await getValues();
		// if (v.length != values.length + 1 ) {
		// console.log('New Response!');
		await handleUpdateVals(v);
		setLoadingStatus(false);
		// }
		setTimeout(updateVals, 3000);
	}
}

async function forceUpdateVals() {
	if (!stop) {
		setLoadingStatus(true);
		let v = await getValues();
		await handleUpdateVals(v);
		setLoadingStatus(false);
	}
}

document.getElementById('loading-btn').onclick = forceUpdateVals;
document.getElementById('sign-out-btn').onclick = async () => {
	await resetAuth();
	await loadAuth();
};

setTimeout(updateVals, 3000);
console.log(import.meta.env.VITE_COMMIT_HASH);

(async () => {
	await loadAuth();
	await forceUpdateVals();
})();
