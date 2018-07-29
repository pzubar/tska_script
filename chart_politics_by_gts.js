var glob_d;

function reader_to_politics_by_gts(){
	
	//have to form data series again with this, sheet 'Розподіл за політиками' doesnt read well
    var get_data;
    get_data = function () {
        var gt_by_pol = {}, pol_sum = {};
        var arr_pol_sum = [], gt_alphaorder = [], colors_gt_alphaorder = [];
        var data_pol_by_gt_stacked = [], cats_pol_topsum = [];
        var sht, col_a, col_b, subtopics, pol;
        var exclude = ['Общий итог', 'Більша тема', 'Названия строк'];

        for (gt in lbls) {
            sht = reader_out[gt];
            gt = lookup_grosstopic(gt, colors);
            gt = gt.charAt(0).toUpperCase() + gt.slice(1);
            gt_by_pol[gt] = {};

            col_a = Object.keys(sht[0])[0];
            col_b = Object.keys(sht[0])[1];

            subtopics = [];
            for (var r = 1, l = sht.length; r < l; r++) {
                if (sht[r][col_a] != 'Общий итог')
                    subtopics.push(sht[r][col_a]);
                else
                    break;
            }

            r++;
            for (l = sht.length; r < l; r++) {
                if (!subtopics.includes(sht[r][col_a]) && !exclude.includes(sht[r][col_a])) {
                    pol = sht[r][col_a];
                    if (!(pol in gt_by_pol[gt]))
                        gt_by_pol[gt][pol] = +sht[r][col_b];
                    else
                        gt_by_pol[gt][pol] += +sht[r][col_b];
                }
            }
        }

        for (k in gt_by_pol) {
            for (p in gt_by_pol[k]) {
                if (!(p in pol_sum))
                    pol_sum[p] = +gt_by_pol[k][p];
                else
                    pol_sum[p] += +gt_by_pol[k][p];
            }
        }

        for (k in pol_sum) {
            arr_pol_sum.push([k, pol_sum[k]]);
        }
        pol_sum = null;
        arr_pol_sum.sort(compareSecondColumnDesc);

        document.getElementById("politicians_count").textContent += arr_pol_sum.length;
        document.getElementById("pol_by_gts_split_by_input").value = "2 " + Math.ceil((arr_pol_sum.length - 2) / 2) + " " + (arr_pol_sum.length - 2 - Math.ceil((arr_pol_sum.length - 2) / 2));

        gt_alphaorder = Object.keys(gt_by_pol);
        gt_alphaorder.sort(sortUkrAlphabet);

        for (k in arr_pol_sum) {
            cats_pol_topsum.push(arr_pol_sum[k][0]);
        }
        arr_pol_sum = null;

        //get data_pol_by_gt_stacked aka series data for stacked bar chart
        var d, v;
        for (t in gt_alphaorder) {
            d = [];
            for (p in cats_pol_topsum) {
                v = gt_by_pol[gt_alphaorder[t]][cats_pol_topsum[p]];
                (v === undefined) && (v = 0);
                //d.push(v);
                d.push({
                    y: v,
                    //color: lookup_color(gt_alphaorder[t], colors)
                });
            }
            data_pol_by_gt_stacked.push({
                name: gt_alphaorder[t],
                data: d,
            });
            colors_gt_alphaorder.push(lookup_color(gt_alphaorder[t], colors));
        }

        function compareSecondColumnDesc(a, b) {
            if (a[1] === b[1])
                return 0;
            else
                return (a[1] < b[1]) ? 1 : -1;
        }

        function sortUkrAlphabet(a, b) {
            var ukr = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";
            for (var c = 0, l = Math.min(a.length, b.length); c < l; c++) {
                if (a[c].toLowerCase() === b[c].toLowerCase())
                    continue;
                else
                    return (ukr.indexOf(a[c].toLowerCase()) < ukr.indexOf(b[c].toLowerCase())) ? 1 : -1;
            }
        }

        return [cats_pol_topsum, data_pol_by_gt_stacked, colors_gt_alphaorder];
    };
	var d = get_data();
	get_data = null;
	glob_d = d;
	
	var build_chart = function(cats = undefined, container_div = undefined, data_series = undefined, crt_name = 'gt_by_pol'){
		if(!cats)
			cats = d[0];
		if(!container_div)
			container_div = document.getElementById("gt_by_pol_chart_container_asses");
		if(!data_series)
			data_series = d[1];
		charts[crt_name] = Highcharts.chart(container_div, {
			credits: {
				enabled: false
			},
			navigation: {
				buttonOptions: {
					enabled: false
				}
			},
			colors: d[2],
			chart: {
				type: 'bar',
			},
			title: {
				text: ''
			},
			xAxis: {
				categories: cats //d[0]					//politicians names
			},
			yAxis: {
				min: 0,
				title: {
					text: 'К-ть повідомлень по тематиці'
				},
				allowDecimals: false,
				endOnTick: false
			},
			legend: {
				reversed: true
			},
			plotOptions: {
				bar: {
					animation: false
				},
				series: {
					dataLabels: {
						enabled: true,
						color: 'white',
						crop: false,
						overflow: 'none',
						style: {
							textOutline: 'none',
						},
						filter: {
							property: 'y',
							operator: '>',
							value: 0
						}
					},
				  stacking: 'normal'
				}
			},
			series: data_series
			//series: [{
			//	name: 'John',						//topic a-z	
			//	data: [5, 3, 4, 7, 2]				//values of this topic among all listed politicians max-min, 0 included
			//}, ]
		});
	}
	build_chart();
	//build_chart = null;
	
	var chart_split = function(){
		var a = this.parentNode.querySelector("#pol_by_gts_split_by_input").value;
		a = a.split(" ");
			
		for(var i = 1, l = a.length, cln; i < l; i++){
			cln = document.getElementsByClassName("gt_by_pol_chart_div")[0].cloneNode(true);
			document.body.insertBefore(cln, document.getElementsByClassName("chart_div")[0]);
		}
		
		var last_index = 0;
		var cs = [], cds = [];
		for(var i = 0, l = a.length, c, cd; i < l; i++){
			c = d[0].slice(last_index, last_index + Number(a[i]));
			cs.push(c);
			
			cd = [];
			for(var j = 0, lj = d[1].length; j < lj; j++){
				cd.push({
					name: d[1][j].name,
					data: d[1][j].data.slice(last_index, last_index + Number(a[i]))
				});
			}
			cds.push(cd);
			last_index += Number(a[i]);
			
			if(i)
				document.getElementsByClassName("gt_by_pol_chart_container")[i].style.height = (130 + c.length * 40) + "px";
			else
				document.getElementsByClassName("gt_by_pol_chart_container")[i].style.height = "312px";
			build_chart(c, document.getElementsByClassName("gt_by_pol_chart_container")[i], cd, 'gt_by_pol_' + i);
			document.getElementsByClassName("gt_by_pol_chart_container")[i].id = "gt_by_pol_" + i;
		}
		
		var set_chart_width = function(){
			var container = this.parentNode.parentNode.querySelector(".gt_by_pol_chart_container");			
			var chart = charts[container.id];
			var cid = +container.id.slice(-1);
			chart.destroy();

			var w = Number(container.style.width.slice(0, container.style.width.length - 2));
			w = w * (Number(this.parentNode.querySelector(".set_stacked_bar_width_input").value) / 100);
			if(this.className == "set_stacked_bar_width_orig_btn")
				w = 1200;
			container.style.width = w +"px";
			build_chart(cs[cid], container, cds[cid], container.id);
			
			if(this.className != "set_stacked_bar_width_orig_btn"){
				chart = charts[container.id];
				chart.update({
					legend: {
						enabled: false
					},
					chart: {
						animation: false
					},
					plotOptions: {
						bar: {
							animation: false
						}
					}
				});
			}
		}
		a = document.getElementsByClassName("set_stacked_bar_width_btn");
		var b = document.getElementsByClassName("set_stacked_bar_width_orig_btn");
		for(var i = 0, l = a.length; i < l; i++){
			a[i].onclick = set_chart_width;
			b[i].onclick = set_chart_width;
		}
		set_chart_width = null;
		
		var init_export = function(){
			var a = document.getElementsByClassName("export_stacked_bar_btn");
			for(i in a){
				a[i].onclick = function(){
					var chart = charts[this.parentNode.parentNode.querySelector(".gt_by_pol_chart_container").id];
					chart.exportChart();
				}
			}
		}
		init_export();
		init_export = null;
		
	}
	document.getElementById("pol_by_gts_split").onclick = chart_split;
	chart_split = null;
	
	
	
}