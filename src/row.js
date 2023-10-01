export default function ({ sheets_id, timestamp, name, signed }) {
	let signedEmoji = signed ? '✅' : '❌';

	let signButton = `<button class='btn btn-success sign-button'><i class="bi bi-pen-fill"></i></button>`;
	if (signed) {
		signButton = `<button class='btn btn-danger remove-sign-button'><i class="bi bi-x-circle-fill"></i></button>`;
	}

	return `
	<tr data-sheets-id="${sheets_id}">
		<td>${sheets_id - 1}</td>
		<td>${new Date(timestamp).toLocaleString('el-gr')}</td>
		<td>${name}</td>
		<td>${signedEmoji}</td>
		<td>
			<button class='btn btn-outline-primary print-button'><i class="bi bi-printer"></i></button>
			${signButton}
		</td>
	</tr>
`;
}
