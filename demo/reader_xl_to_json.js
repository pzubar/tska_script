var reader_out = [];

var ExcelToJSON = function(e) {
	var inp = e.target;
	
	var reader = new FileReader();

	reader.onload = function() {
		var data = reader.result;
		var workbook = XLSX.read(data, {
			type: 'binary'
		});

		workbook.SheetNames.forEach(function(sheetName) {
            var XL_row_object;
			if (sheetName == 'Розподіл за темами великими')
                XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], {range:3});
			else
                XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			var json_object = JSON.stringify(XL_row_object);
			XL_row_object.sheet_name = sheetName;
			reader_out[sheetName] = (XL_row_object);

		})


		reader_to_chart();
		reader_to_politics_by_gts();

	};

	reader.onerror = function(ex) {
		console.log(ex);
	};

	reader.readAsBinaryString(inp.files[0]);
	
};