document.signedIn = false;

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const API_KEY = import.meta.env.VITE_API_KEY;
const REDIRECT_URI = window.location.origin + '/';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
	'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let access_token = null;

function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function resetLocalStorage() {
	localStorage.removeItem('refresh_token');
	localStorage.removeItem('oauth2-test-params');
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
function initializeGapiClient() {
	return new Promise((resolve, reject) => {
		gapi.load('client', async () => {
			try {
				await gapi.client.init({
					apiKey: API_KEY,
					discoveryDocs: [DISCOVERY_DOC],
				});
				gapi.client.setToken({ access_token });

				document.signedIn = true;
				resolve();
			} catch (e) {
				reject(e);
			}
		});
	});
}

async function refreshToken() {
	await getAccessToken();
	gapi.client.setToken({ access_token });
}

/**
 * from https://stackoverflow.com/a/13419367
 */
function parseQuery() {
	var queryString = window.location.search;
	var query = {};
	var pairs = (
		queryString[0] === '?' ? queryString.substring(1) : queryString
	).split('&');
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split('=');
		query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
	}
	return query;
}

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
async function oauth2SignIn() {
	// Google's OAuth 2.0 endpoint for requesting an access token
	const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

	// Parameters to pass to OAuth 2.0 endpoint.
	const params = {
		client_id: CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		scope: SCOPES,
		state: 'try_sample_request',
		response_type: 'code',
		access_type: 'offline',
	};

	// Construct the URL with query parameters.
	const url = new URL(oauth2Endpoint);
	for (const p in params) {
		url.searchParams.set(p, params[p]);
	}

	// Open the URL in a new window.
	window.location = url;
	await wait(1000); // wait for redirect
}

async function getRefreshToken(code) {
	try {
		let resp = await fetch('https://www.googleapis.com/oauth2/v4/token', {
			method: 'POST',
			body: new URLSearchParams({
				client_id: CLIENT_ID,
				client_secret: SECRET,
				redirect_uri: REDIRECT_URI,
				grant_type: 'authorization_code',
				access_type: 'offline',
				prompt: 'consent',
				code,
			}),
		});
		let { access_token: at, refresh_token, expires_in } = await resp.json();
		if (refresh_token == null) {
			resetLocalStorage();
			loadAuth();
			throw 'no refresh token sent :('
		}
		access_token = at;
		localStorage.setItem('refresh_token', refresh_token);
		setTimeout(refreshToken, (expires_in - 1) * 1000);
	} catch (e) {
		console.error(e);
		if (e.status == 403) {
			resetLocalStorage();
			loadAuth();
		}
	}
}

async function getAccessToken() {
	const refresh_token = localStorage.getItem('refresh_token');
	if (refresh_token == null || refresh_token == '') {
		resetLocalStorage();
		loadAuth();
		return;
	}
	try {
		let resp = await fetch('https://accounts.google.com/o/oauth2/token?', {
			method: 'POST',
			body: new URLSearchParams({
				client_id: CLIENT_ID,
				client_secret: SECRET,
				refresh_token: localStorage.getItem('refresh_token'),
				grant_type: 'refresh_token',
			}),
		});
		let { access_token: at, expires_in } = await resp.json();
		access_token = at;
		setTimeout(refreshToken, (expires_in - 1) * 1000);
	} catch (e) {
		console.error(e);
		if (e.status == 403) {
			resetLocalStorage();
			loadAuth();
		}
	}
}

/**
 * load the Google Identity Services token. If there is no token in
 * local storage, we initiate an oauth2 flow to get one.
 */
export async function loadAuth() {
	// Parse query string to see if page request is coming from OAuth 2.0 server.
	let URIparams = parseQuery();
	window.history.replaceState({}, '', REDIRECT_URI);
	let localToken = localStorage.getItem('refresh_token');

	if (Object.keys(URIparams).length > 1) {
		if (URIparams['state'] && URIparams['state'] == 'try_sample_request') {
			localStorage.setItem(
				'oauth2-test-params',
				JSON.stringify(URIparams)
			);
		}
		let code = URIparams['code'];
		await getRefreshToken(code);
		await initializeGapiClient();
	} else if (localToken != null) {
		try {
			await getAccessToken();
		} catch (e) {
			console.error(e);
			localStorage.removeItem('refresh_token');
			await oauth2SignIn();
		}
		await initializeGapiClient();
	} else {
		oauth2SignIn();
	}
}
