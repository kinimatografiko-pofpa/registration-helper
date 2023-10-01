export default ({ sheets_id, timestamp, name, signed }) => `
	<tr data-sheets-id="${sheets_id}">
		<td>${sheets_id - 1}</td>
		<td>${new Date(timestamp).toLocaleString('el-gr')}</td>
		<td>${name}</td>
		<td>${signed}</td>
		<td>
			<button class='btn btn-outline-primary print-button'><i class="bi bi-printer"></i></button>
			<button class='btn btn-success sign-button'><i class="bi bi-pen-fill"></i></button>
		</td>
	</tr>
`;
