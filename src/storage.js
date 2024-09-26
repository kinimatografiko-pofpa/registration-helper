export async function encryptedStore(key, value, password) {
	const encryptedValue = await encryptString(value, password);
	localStorage.setItem(key, encryptedValue);
}

export async function getEncrypted(key, password) {
	const encryptedValue = localStorage.getItem(key);
	if (!encryptedValue) return null;
	return await decryptString(encryptedValue, password);
}

async function encryptString(plaintext, password) {
	// Generate a random salt for the PBKDF2 key derivation function
	const salt = crypto.getRandomValues(new Uint8Array(16));

	// Derive an AES-GCM key from the password and salt using PBKDF2
	const derivedKey = await crypto.subtle.importKey(
		'pbkdf2',
		{ hash: 'SHA-256', salt: salt, iterations: 100000 },
		password,
		'deriveBits',
		['encrypt', 'decrypt']
	);

	// Generate a random initialization vector (IV) for AES-GCM
	const iv = crypto.getRandomValues(new Uint8Array(12));

	// Encrypt the plaintext using AES-GCM
	const encryptedData = await crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv: iv },
		derivedKey,
		new TextEncoder().encode(plaintext)
	);

	// Combine the encrypted data, salt, and IV for storage or transmission
	const ciphertext = new Uint8Array(
		encryptedData.byteLength + salt.byteLength + iv.byteLength
	);
	ciphertext.set(encryptedData);
	ciphertext.set(salt, encryptedData.byteLength);
	ciphertext.set(iv, encryptedData.byteLength + salt.byteLength);

	// Convert the ciphertext to a base64-encoded string for storage or transmission
	return btoa(String.fromCharCode.apply(null, ciphertext));
}

async function decryptString(ciphertext, password) {
	// Decode the base64-encoded ciphertext
	const ciphertextBytes = new Uint8Array(
		atob(ciphertext)
			.split('')
			.map((char) => char.charCodeAt(0))
	);

	// Extract the encrypted data, salt, and IV from the ciphertext
	const encryptedData = ciphertextBytes.slice(
		0,
		ciphertextBytes.byteLength - 32
	);
	const salt = ciphertextBytes.slice(
		ciphertextBytes.byteLength - 32,
		ciphertextBytes.byteLength - 16
	);
	const iv = ciphertextBytes.slice(ciphertextBytes.byteLength - 16);

	// Derive an AES-GCM key from the password and salt using PBKDF2
	const derivedKey = await crypto.subtle.importKey(
		'pbkdf2',
		{ hash: 'SHA-256', salt: salt, iterations: 100000 },
		password,
		'deriveBits',
		['encrypt', 'decrypt']
	);

	// Decrypt the ciphertext using AES-GCM
	const decryptedData = await crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv: iv },
		derivedKey,
		encryptedData
	);

	// Convert the decrypted data to a string
	return new TextDecoder().decode(decryptedData);
}

//   // Example usage:
//   const ciphertext = 'YOUR_ENCRYPTED_CIPHERTEXT';
//   const password = 'your_strong_password';

//   decryptString(ciphertext, password)
// 	.then(plaintext => {
// 	  console.log('Decrypted plaintext:', plaintext);
// 	})
// 	.catch(error => {
// 	  console.error('Decryption error:', error);
// 	});

// Example usage:
//   const plaintext = 'This is a secret message.';
//   const password = 'your_strong_password';

//   encryptString(plaintext, password)
// 	.then(ciphertext => {
// 	  console.log('Encrypted ciphertext:', ciphertext);
// 	})
// 	.catch(error => {
// 	  console.error('Encryption error:', error);
// 	});
