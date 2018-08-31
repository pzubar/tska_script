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
		if(168 * statements.length > 1380)		//200
			return 1380;
		else
			return 168 * statements.length;
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
					crosshair: true,
					labels: {
						style: {
							fontSize: '13.5px',
						}
					}
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
								fontSize: '13.5px',
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
		data_series[chart_name] = chart_data;
	}
	build_chart = null;
	
	// kind of upd vis
	var top_statements_charts = document.querySelectorAll('.politics_top_statements_container .highcharts-container ');
	for(var i = 0, l = top_statements_charts.length; i < l; i++){
		top_statements_charts[i].style.margin = '0 auto';
	} top_statements_charts = null;
	
	//modified add_to_ch
	function add_to_ch_statements(){
		//own scale_by_gt
		function scale_by_gt_statements(p_this, p_addto){
			var gt = 'statements_' + p_this;
			var scalebygt = 'statements_' + p_addto;
			var chart = charts[gt];
			var scalebychart = charts[scalebygt];
			
			var yMaxOriginal = (data_series[gt][0]).y;
			var yMaxTarget = (data_series[scalebygt][0]).y;

			if (yMaxOriginal > yMaxTarget) {
				var buf = chart;
				chart = scalebychart;
				scalebychart = buf;
				buf = gt; gt = scalebygt; scalebygt = buf;
			}
			
			chart.update({
				yAxis: {max: scalebychart.yAxis[0].max},
				chart: {
					marginTop: scalebychart.margin[0],
					marginBottom: scalebychart.marginBottom
				},
				plotOptions: {series: {
					pointWidth: Math.ceil(scalebychart.series[0].columnMetrics.width)
				}}
			});
		}
		
		var p_this = this.parentElement.querySelector('.politics_top_statements_container').getAttribute('politician');
		var cur = this.parentNode.querySelector('.highcharts-container');
		
		var p_addto = this.parentNode.querySelector(".add-to-chart").value;
		var p_addto = p_addto.slice(11);

		var targs = document.getElementsByClassName('politics_top_statements_container');
		var addto_container;

		for (var i = 0; i < targs.length; i++) {
			if (targs[i].getAttribute('politician') == p_addto)
			{
				addto_container = targs[i];
				break ;
			}
		}
		
		addto_container.style.textAlign = 'center';
		addto_container.appendChild(cur);
		cur.style.display = 'inline-block';
		var addto_hc_c = addto_container.querySelector('.highcharts-container');
		addto_hc_c.style.display = 'inline-block';
		
		var h = addto_container.parentElement.querySelector('h3');
		addto_hc_c.insertBefore(h, addto_hc_c.firstChild);
		
		h = this.parentElement.querySelector('h3');
		cur.insertBefore(h, cur.firstChild);
		
		addto_container.parentElement.parentElement.scrollIntoView();
		this.parentElement.parentElement.querySelector('.deletebutton').click();
		
		scale_by_gt_statements(p_this, p_addto);
	}
	
	var pol_s = document.getElementsByClassName('politics_top_statements_container');
	for(var i = 0, l = pol_s.length; i < l; i++){
		var a = pol_s[i].parentElement.querySelector('select');
		for(var j  = 0; j < l; j++){
			var b = document.createElement("option");
			b.setAttribute("value", 'statements_' + pol_s[j].getAttribute('politician'));
			b.textContent = 'statements_' + pol_s[j].getAttribute('politician');
			a.appendChild(b);
		}
		var btn = pol_s[i].parentElement.querySelector('.apply-add-to-chart');
		btn.onclick = add_to_ch_statements;
	}
}