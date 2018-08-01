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
                XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName],
					{range:3, blankrows: false, defval: '0'});
			else
                XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			XL_row_object.sheet_name = sheetName;
			reader_out[sheetName] = (XL_row_object);

		})

		pz_script();
		reader_to_chart();
		reader_to_politics_by_gts();
        // charts_to_slides();
        // chart_split();
        // setTimeout(charts_to_slides, 1000);
        // setTimeout(make_slides, 1000);
	};

	reader.onerror = function(ex) {
		console.log(ex);
	};

	reader.readAsBinaryString(inp.files[0]);
	
};