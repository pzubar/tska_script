function reader_to_politics_top_statements(){
	// needed for chart data: [{id: statement, y: n}]
	// plus extra info {sum, order}
	/*
	d == {
		politician: [
			[{
				id: statement,
				y:  n
			}, {...}],
			{
				sum: n_sum,
				order: 0-4 descending by n_sum,
				statements: [statement, ...]
			}
		]
	}
	*/
	var get_data = function(){
		var sht = reader_out['коментарі'];
		var politician, statement, n;
		var d = {};
		for(var i = 0, l = sht.length; i < l; i++){
			if('Політик' in sht[i]){
				politician = sht[i]['Політик'];
				d[politician] = [[]];
			}
			if('Заяви' in sht[i]){
				d[politician][0].push({
					id: sht[i]['Заяви'],
					y: +sht[i]['N'],
				});
			}
		}
		for(p in d){
			var n_sum = 0, statements = [];
			for(var i = 0, l = d[p][0].length; i < l; i++){
				n_sum += +d[p][0][i]['y'];
				statements.push(d[p][0][i]['id']);
			}
			d[p].push({
				sum: n_sum,
				order: 0,
				statements: statements
			});
		}
		var arr2d = [];
		for(p in d)
			arr2d.push([p, d[p][1]['sum']]);
		arr2d.sort(function(a, b){
			if(a[1] == b[1]) return 0;
			else
				return (a[1] > b[1]) ? -1 : 1;
		});
		for(var i = 0, l = arr2d.length; i < l; i++){
			d[arr2d[i][0]][1]['order'] = i;
		}
		
		return d;
	};
	
	// get data and free memory
	var d = get_data(); get_data = null;
	
	// prepare containers
	var prep_containers = function(){
		var slides_end = document.getElementById("slides_end");
		var div = document.getElementsByClassName("politics_top_statements_div")[0];
		for(var i = 1, l = Object.keys(d).length; i < l; i++){
			var cln = div.cloneNode(1);
			document.body.insertBefore(cln, slides_end);
		}
	}(); prep_containers = null;
	
	function calc_width(){
		if(200 * statements.length > 1380)
			return 1380;
		else
			return 200 * statements.length;
	}
	
	// build charts
	var build_chart = function(chart_name, container_div, chart_data, statements){
		// add to global charts variable : needed for upd_vis
		charts[chart_name] = Highcharts.chart(container_div, {
			// highcharts constructor literal object configs, options
				credits: {
					enabled: false
				},
				
				chart: {
					type: 'column',
					animation: false,
					width: calc_width(),
					style: {
						'fontFamily': '\"Roboto Condensed\"',
					}
				},
				
				navigation: {
					buttonOptions: {
						enabled: false
					}
				},
				
				title: {
                	useHTML:true,
					text: '',
                	widthAdjust: -2000
				},
				
				xAxis: {
					categories: statements,
					crosshair: true
				},
				yAxis: {
					visible: false
				},
				tooltip: {
					enabled: false
				},
				plotOptions: {
					column: {
						pointPadding: 0.2,
						borderWidth: 0,
						dataLabels: {
							enabled: true,
							y: 24,
							crop: false,
							overflow: 'none',
							color: 'white',
							style: {
								textOutline: 'none',
							}
						},		
					},
					
				},
				series: [{
					showInLegend: false,
					data: chart_data,
				}],
		});
	}
	
	for(p in d){
		var i = d[p][1]['order'];
		var container_div = document.getElementsByClassName('politics_top_statements_container')[i];
		
		container_div.setAttribute('politician', p);
		
		var chart_name = 'statements_' + p;
		var chart_data = d[p][0];
		var statements = d[p][1]['statements'];
		
		build_chart(chart_name, container_div, chart_data, statements);
	}
	build_chart = null;
	var top_statements_charts = document.querySelectorAll('.politics_top_statements_container .highcharts-container ');
	for(var i = 0, l = top_statements_charts.length; i < l; i++){
		top_statements_charts[i].style.margin = '0 auto';
	} top_statements_charts = null;
}