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
			<h6 style="width: 200px; padding-right: 5px" class="text-end mr-1">${item}: </h6>
			<h6 class='flex-fill border-3 border-bottom border-black'>${formItems[item]}</h6>
		</div>
		`;
	}

	return `
<div style='font-family: "Times New Roman"; margin: 80px 40px'>
	<div class='d-flex justify-content-between mb-5'>
		<h4>Ακαδ. Έτος 2024-25</h4>
		<h4>α/α Τομέα: ${row.sheets_id - 1}</h4>
	</div>
	<div class='text-center mx-auto mb-2'>
		<h2><strong>ΑΙΤΗΣΗ ΕΓΓΡΑΦΗΣ</strong></h2></br>
		<h4>Στον Κινηματογραφικό Τομέα</h4>
		<h4>του</h4>
		<h4>Πολιτιστικού Ομίλου Φοιτητών Πανεπιστημίου Αθηνών</h4>
	</div>
	<div class='mt-5'>
		${formItemsHTML}
	</div>
	<div class='my-4'>
		<p>
		Ενημερώθηκα και αποδέχομαι το καταστατικό λειτουργίας του Κινηματογραφικού Τομέα και του Πολιτιστικού Ομίλου Φοιτητών Πανεπιστημίου Αθηνών (Π.Ο.Φ.Π.Α.).
		</p>
	</div>
	<div class='mt-5 pt-5 d-flex justify-content-between'>
		<div style='width: 300px'>
			<p class='text-center fs-5'>
			Ο αιτών/ Η αιτούσα
			</p>
			<p class='border-bottom border-3 border-black mt-4 pt-5'></p>
		</div>
		<div class='fs-5'>
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
