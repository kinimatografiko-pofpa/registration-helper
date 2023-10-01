export default function (row) {
	const formItems = {
		Ονοματεπώνυμο: row.name,
		'Πανεπ. Ίδρυμα': row.university,
		Σχολή: row.faculty,
		Τμήμα: row.department,
		'Αρ. Μητρ. Σχολής': row.reg_number,
		'Έτος φοιτ./απόφοιτ.': row.year,
		Τηλέφωνο: row.phone,
		Email: row.email,
	};

	let formItemsHTML = ``;

	for (let item in formItems) {
		formItemsHTML += `
		<div class='d-flex'>
			<h4 style="width: 200px; padding-right: 5px" class="text-end mr-1">${item}: </h4>
			<h4 class='flex-fill border-3 border-bottom border-black'>${formItems[item]}</h4>
		</div>
		`;
	}

	return `
<div style='font-family: "Times New Roman"; margin: 80px 40px'>
	<div class='d-flex justify-content-between mb-5'>
		<h3>Ακαδ. Έτος 2023-24</h3>
		<h3>α/α Τομέα: ${row.sheets_id - 1}</h3>
	</div>
	<div class='text-center mx-auto mb-2'>
		<h1><strong>ΑΙΤΗΣΗ ΕΓΓΡΑΦΗΣ</strong></h1></br>
		<h3>Στον Κινηματογραφικό Τομέα</h3>
		<h3>του</h3>
		<h3>Πολιτιστικού Ομίλου Φοιτητών Πανεπιστημίου Αθηνών</h3>
	</div>
	<div class='mt-5'>
		${formItemsHTML}
	</div>
	<div class='my-4'>
		<p class='fs-5'>
		Ενημερώθηκα και αποδέχομαι το καταστατικό λειτουργίας του Κινηματογραφικού Τομέα και του Πολιτιστικού Ομίλου Φοιτητών Πανεπιστημίου Αθηνών (Π.Ο.Φ.Π.Α.).
		</p>
	</div>
	<div class='mt-4 d-flex justify-content-between'>
		<div style='width: 300px'>
			<p class='text-center fs-4'>
			Ο αιτών/ Η αιτούσα
			</p>
			<p class='border-bottom border-3 border-black mt-4 pt-5'></p>
		</div>
		<div class='fs-4'>
			<p>
			Ημερομηνία
			</p>
			<p>
			${new Date(row.timestamp).toLocaleDateString('el-gr')}
			</p>
		</div>
	</div>
</div>`;
}
