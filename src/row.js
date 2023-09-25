export default ({ sheets_id, timestamp, name, signed }) => `
	<tr data-sheets-id="${sheets_id}">
		<td>${sheets_id - 1}</td>
		<td>${timestamp}</td>
		<td>${name}</td>
		<td>${signed}</td>
		<td><button class='btn btn-primary sign-button'><i class="bi bi-pen-fill"></i></button></td>
	</tr>
`;
