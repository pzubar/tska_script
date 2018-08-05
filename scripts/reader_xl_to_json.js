var g_infolog = document.getElementById('infolog_area');
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

		});
        try {
            add_bigtopics_chart();
        } catch (err) {
            // g_infolog.innerHTML += "Неможливо побудувати діаграму розподілу за великими політиками. Перевірте наявність відповідного аркуша";
        }
        reader_to_chart();
        reader_to_politics_by_gts();
        

        try {
            make_slides();
        } catch (err) {
            // g_infolog.innerHTML += "Сталася помилка при створенні слайдів";
        }
        // g_infolog.innerHTML += "Слайди створено\n";
        // alert('Слайди побудовано');
	};

	reader.onerror = function(ex) {
		console.log(ex);
	};

	reader.readAsBinaryString(inp.files[0]);
	
};