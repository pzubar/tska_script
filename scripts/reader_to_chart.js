//declared here, called from reader_xl_to_json.js
var charts = {}, data_series = {}, lbls = {};

var colors = [
	[['Протидія Росії', 'протидія росії'], 'rgb(255, 216, 93)'],
	[['розвиток економіки',
		'розвиток економіки, реформи'
	],  'rgb(31, 170, 171)'],
	[['боротьба з корупцією',
		'протидія корупції', 'антикорупція'
	],  'rgb(11, 112, 167)'],
	[['Інтеграція в ЄС та НАТО', 'інтеграція до єс та нато',
		'інтеграція в єс та нато', 'євроінтеграція', 'інтеграція в єс і нато'],  'rgb(255, 192, 0)'],
	[['інше'],  'rgb(149, 159, 160)'],
	[['медреформа',
		'медична реформа'],  'rgb(56, 189, 186)'],
	[['підготовка до виборів', 'підготовка до виборів2',
		'підготовка до чесних виборів', 'вибори'
	],  'rgb(0, 38, 122)'],
	[['розвиток оборонної галузі', 'розвиток оборонної сфери', 'Розвиток оборонної галузі',
		'оборонна галузь'
	],  'rgb(25, 95, 65)'],
	[['безпека'],  'rgb(146, 208, 80)'],
	[['соціальний захист населення',
		'соцзахист населення', 'соцзахист'
	],  'rgb(38, 142, 98)'],
	[['критика влади'],  'rgb(68, 84, 106)'],
	[['конституційна реформа',
		'конст реформа', 'констреформа'
	], 'rgb(237, 125, 49)'],
	[['реакція на поточні події', 
		'реакція на події', 'реакція'
	], 'rgb(124, 181, 236)']
]

function lookup_color(a, colors){
	for(var i = 0, l = colors.length; i < l; i++){
		if(~colors[i][0].indexOf(a.toLowerCase()))
			return colors[i][1];
	}
	// alert(a);
	return false;
}

function lookup_grosstopic(a, colors){
	for(var i = 0, l = colors.length; i < l; i++){
		if(~colors[i][0].indexOf(a.toLowerCase()))
			return colors[i][0][0];
		}
	return false;
}

// kostyl
function fix_topics_colors(){
	var sht = reader_out['Список тем'];
	// while there is column 'B' (blue), e.g. iterate through data from columns J-M, sheet 'Список тем'
	var l = sht.length, i = 0;
	while(i < l && 'Велика тема' in sht[i]){
		// if this topic is not in colors global variable then add it + colors R G B
		if(!lookup_color(sht[i]['Велика тема'].toLowerCase(), colors)){
			if (sht[i]['R'] == undefined)
                colors.push([[sht[i]['Велика тема']],
                    getRandomColor()]);
			else {
                colors.push([[sht[i]['Велика тема'].toLowerCase()],
                    'rgb(' + [sht[i]['R'], sht[i]['G'], sht[i]['B']].join() + ')']);
			}

		}
		i++;
	}
}


function reader_to_chart(){
	// fix_topics_colors();
	
	var grosstopics = [];
	var topic_sheets = [];
	
	var a = function(){
		var sht = reader_out['Список тем'];
		var col_a = 'Названия строк';
		var col_b = 'Количество по полю id';
		
		for(var r = 0, l = sht.length; r < l; r++){
			if(!sht[r][col_b] && sht[r][col_a] != '(пусто)')
				grosstopics.push(sht[r][col_a]);
		}
		
		var ul = document.getElementById("gt_ul");
		for(var i = 0, l = Object.keys(reader_out).length, s = false, li, check_topic, cln, a; i < l; i++){
			li = document.createElement("li");
			check_topic = Object.keys(reader_out)[i];
			if(lookup_color(check_topic, colors)){
				li.style.listStyleType = "disc";
				//li.style.fontWeight = "bold";
				topic_sheets.push(check_topic);
				a = document.createElement("a");
				
				if(s){
					cln = document.getElementsByClassName("chart_div")[0].cloneNode(true);
					document.body.appendChild(cln);
					cln.querySelector('.gt_h3').textContent = check_topic;
					cln.querySelector('.gt_h3').id = "gt_h3_" + i;
					a.href = "#" + cln.querySelector('.gt_h3').id;
				}
				if(!s){
					document.getElementsByClassName("gt_h3")[0].textContent = check_topic;
					document.getElementsByClassName("gt_h3")[0].id = "gt_h3_0";
					a.href = "#gt_h3_0";
					s = true;
				}
				a.textContent = check_topic;
				li.appendChild(a);
			}else{
				li.style.listStyleType = "circle";
				li.textContent = check_topic;
			}
			ul.appendChild(li);
		}
		
		var a = document.getElementsByClassName("export_btn");
		for(var i = 0, l = a.length; i < l; i++){
			a[i].addEventListener("click", function(){
				var gt = this.parentNode.parentNode.querySelector(".gt_h3").textContent;
				var chart = charts[gt];
				chart.exportChart(
					null, {
						annotations: [{
							labelOptions: chart.annotations[0].userOptions.labelOptions,
							labels: lbls[gt]
						}]
					}
				);
			});
		}
		
		// a = document.getElementsByClassName("select_scalebygt");
        var a = document.getElementsByClassName("add-to-chart");
		for(var i = 0, l = a.length; i < l; i++){
			for(k in topic_sheets){
				var b = document.createElement("option");
				b.setAttribute("value", topic_sheets[k]);
				b.textContent = topic_sheets[k];
				a[i].appendChild(b);
				// adtch[i].appendChild(b.cloneNode(true));
			}
		}
	}
	a(); a = null;
	
	function build_charts_gt_t_by_politics(){
		
		var sht, col_a, col_b;
		var gt, st, grosstopic;
		var exclude = ['Общий итог', 'Більша тема', 'Названия строк'];
		
		for(var oi = 0, ol = topic_sheets.length; oi < ol; oi++){
			gt = topic_sheets[oi];
			
			sht = reader_out[gt];
			col_a = Object.keys(sht[0])[0];
			col_b = Object.keys(sht[0])[1];
			
			data_series[gt] = [];
			for(var r = 1, l = sht.length; r < l; r++){
				if(sht[r][col_a] != 'Общий итог')
					data_series[gt].push({
						id: sht[r][col_a],
						y: Number(sht[r][col_b])
					});
				else
					break;
			}
			var subtopics = [];
			for(var i = 0, l = data_series[gt].length; i < l; i++){
				subtopics.push(data_series[gt][i]['id']);
			}
			
			var subtopics_by_pol = [];
			r++;
			for(l = sht.length; r < l; r++){
				if(subtopics.includes(sht[r][col_a])){
					st = sht[r][col_a];
					subtopics_by_pol[st] = '';
				}
				if(!subtopics.includes(sht[r][col_a]) && !exclude.includes(sht[r][col_a])){
					subtopics_by_pol[st] += sht[r][col_a] + ' (' + sht[r][col_b] + ')<br/>';
				}
			}
			
			lbls[gt] = [];
			for(var i = 0, l = subtopics.length; i < l; i++){
				lbls[gt].push({
					point: subtopics[i],
					text: subtopics_by_pol[subtopics[i]]
				});
			}

			function calc_width(){
				if(150 * subtopics.length > 1100)
					return 1100;
				else
					return 150 * subtopics.length;
			}
			
			if(data_series[gt].length){
			document.getElementsByClassName("chart_container")[oi].id = "chart_container_" + gt;
			charts[gt] = Highcharts.chart(document.getElementsByClassName("chart_container")[oi], {
				credits: {
					enabled: false
				},
				
				chart: {
					type: 'column',
					animation: false,
					width: calc_width(),
					style: {
						'fontFamily': '\"Roboto Condensed\"',
						// 'borderRight': '1px dashed lightblue',
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
					categories: subtopics,
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
					color: lookup_color(gt, colors),
					data: data_series[gt],
				}],
				
				annotations: [{
					labelOptions: {
						allowOverlap: true,
						backgroundColor: '#F0F0F0',
						borderColor: '#cccccc',
						overflow: 'none'
					},
					labels: lbls[gt]
				}]
			});
			}
		}
		
		upd_vis();

	}
	build_charts_gt_t_by_politics();
	
	var fix_empty_containers = function(){
		var c = document.getElementsByClassName("chart_div");
		var i = 0, l = c.length;
		while(i < l){
			if(c[i].querySelector('svg') === null){
				c[i].remove();
				i--; l--;
			}
			i++;
		}
	}();
	fix_empty_containers = null;
}