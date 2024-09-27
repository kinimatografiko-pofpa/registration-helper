export async function encryptedStore(key, value, password) {
	const encryptedValue = await encryptString(value, password);
	localStorage.setItem(key, encryptedValue);
}

export async function getEncrypted(key, password) {
	const encryptedValue = localStorage.getItem(key);
	if (!encryptedValue) return null;
	return await decryptString(encryptedValue, password);
}

// Function to encrypt a string using a password
async function encryptString(plaintext, password) {
	const enc = new TextEncoder();

	// Convert the password to a key
	const keyMaterial = await window.crypto.subtle.importKey(
		'raw',
		enc.encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveBits', 'deriveKey']
	);

	// Generate a salt
	const salt = window.crypto.getRandomValues(new Uint8Array(16));

	// Derive an AES-GCM key using PBKDF2
	const key = await window.crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: 100000,
			hash: 'SHA-256',
		},
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt']
	);

	// Generate an IV
	const iv = window.crypto.getRandomValues(new Uint8Array(12));

	// Encrypt the plaintext
	const ciphertext = await window.crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv: iv },
		key,
		enc.encode(plaintext)
	);

	// Combine the salt, IV, and ciphertext
	const result = new Uint8Array(
		salt.length + iv.length + ciphertext.byteLength
	);
	result.set(salt, 0);
	result.set(iv, salt.length);
	result.set(new Uint8Array(ciphertext), salt.length + iv.length);

	// Return the result as a base64-encoded string
	return btoa(String.fromCharCode.apply(null, result));
}

// Function to decrypt an encrypted string using a password
async function decryptString(encryptedData, password) {
	const dec = new TextDecoder();
	const data = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));

	// Extract salt, IV, and ciphertext
	const salt = data.slice(0, 16);
	const iv = data.slice(16, 28);
	const ciphertext = data.slice(28);

	const keyMaterial = await window.crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveBits', 'deriveKey']
	);

	const key = await window.crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: 100000,
			hash: 'SHA-256',
		},
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		false,
		['decrypt']
	);

	const plaintext = await window.crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv: iv },
		key,
		ciphertext
	);

	return dec.decode(plaintext);
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
