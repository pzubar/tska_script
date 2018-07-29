function upd_vis(){
	var a = function(){
		var j = 0, chart;
		for(k in charts){
			chart = charts[k];
			var mt = chart.margin[0];
			if(mt === undefined)
				mt = 0;
			var crt = document.getElementsByClassName("chart_container")[j++];
			var hc_points = crt.querySelectorAll(".highcharts-point");
			
			var bar_height, annot_height;
			var annot_padding = chart.annotations[0].labels[0].padding;
			var callout_offset = 16; //callout default offset from point -16
			var x;
			
			for(var i = 0, l = chart.annotations[0].labels.length; i < l; i++){
				bar_height = hc_points[i].height.baseVal.value;
				annot_height = chart.annotations[0].labels[i].height;
				
				x = bar_height + annot_height + annot_padding + callout_offset - chart.plotHeight;
				
				if(x > 0){
					chart.update({
						chart: {
							marginTop: mt + x
						}
					});
					
					//now again get the svg element transform property, evaluate, re-update
					var hc_annot_lbls = crt.querySelectorAll(".highcharts-annotation-label");
					for(var ii = 0, ll = hc_annot_lbls.length, t_prop; ii < ll; ii++){
						t_prop = hc_annot_lbls[ii].getAttribute("transform");
						t_prop = t_prop.slice(t_prop.indexOf(","));
						t_prop = t_prop.slice(1, t_prop.length - 1);
						t_prop = Number(t_prop);
						if(t_prop <= 0){
							x += 0 + t_prop + annot_padding * 2;
							chart.update({
								chart: {
									marginTop: mt + x
								}
							});
						}
					}					
				}
			}
		}
	}
	a();
	a = null;
	
	//function manage_label_collisions(){
		//iterate all neighboring pairs, detect y and x collisions, calculate options to separate
	//}
	
	function move_annotations(){
		var a = this.parentNode.querySelector(".bar_n").value - 1;
		var x_fix = this.parentNode.querySelector(".x_fix").value;
		var y_fix = this.parentNode.querySelector(".y_fix").value;
		
		var gt = this.parentNode.querySelector(".gt_h3").textContent;	//gt sheet name
		var chart = charts[gt];
		if(a >= 0){
			if(x_fix){
				chart.annotations[0].labels[a].xSetter(chart.annotations[0].labels[a].x + +x_fix);
				if(!('x' in lbls[gt][a]))
					lbls[gt][a].x = +x_fix;
				else
					lbls[gt][a].x += +x_fix;
			}
			if(y_fix){
				chart.annotations[0].labels[a].ySetter(chart.annotations[0].labels[a].y + +y_fix);
				if(!('y' in lbls[gt][a]))
					lbls[gt][a].y = +y_fix - 16;
				else
					lbls[gt][a].y += +y_fix;
			}
			this.parentNode.querySelector(".x_fix").value = '';
			this.parentNode.querySelector(".y_fix").value = '';
		}
	}
	a = document.getElementsByClassName("move_annotations_btn");
	for(var i = 0, l = a.length; i < l; i++){
		a[i].onclick = move_annotations;
	}
	
	function fixup_labels_above_xaxis(gt){
		var chart = charts[gt];
		
		var a = chart.series[0].data[0].dataLabel.height;
		var b = chart.series[0].data[0].dataLabel.padding + 1;
		var c = chart.plotHeight - a + b;
		for(var i = 0, l = chart.series[0].data.length; i < l; i++){
			if(chart.series[0].data[i].dataLabel.y > c){
				//chart.series[0].data[i].dataLabel.ySetter(c);			
				data_series[gt][i].dataLabels = {
					y: chart.series[0].data[i].shapeArgs.height + chart.series[0].data[0].dataLabel.padding - 1
				}
			}
		}
		chart.update({
			series: [{data: data_series[gt]}]
		});
	}
	setTimeout(function(){
		for(k in data_series){
			fixup_labels_above_xaxis(k);
		}
	}, 100);
	
	function scale_by_gt(){
		var gt = this.parentNode.querySelector(".gt_h3").textContent;
		var scalebygt = this.parentNode.querySelector(".select_scalebygt").value;
		var chart = charts[gt];
		var scalebychart = charts[scalebygt];

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
		fixup_labels_above_xaxis(gt);
	}
	a = document.getElementsByClassName("apply_scalebygt");
	for(i in a){
		a[i].onclick = scale_by_gt;
	}
	
	a = function(){
		var b = document.getElementsByClassName("scroll_to_top");
		for(i in b){
			b[i].onclick = function(){window.scrollTo(0, 0);}
		}
	}
	a();
	
	a = function(){
		
		var b = document.getElementsByClassName("toggle_title");
		for(i in b){
			b[i].onclick = function(){
				var gt = this.parentNode.querySelector(".gt_h3").textContent;
				var grosstopic = lookup_grosstopic(gt, colors);
				grosstopic = grosstopic.charAt(0).toUpperCase() + grosstopic.slice(1);
				var mt_delta = 36;
				/*if(grosstopic == 'Протидія росії')
					grosstopic = 'Протидія Росії';
				if(grosstopic == 'євроінтеграція')
					grosstopic = 'Інтеграція в ЄС та НАТО';
				if(grosstopic == 'Інтеграція в єс та нато')
					grosstopic = 'Інтеграція в ЄС та НАТО';
				if(grosstopic == 'Оборонна галузь')
					grosstopic = 'Розвиток оборонної галузі';
				if(grosstopic == 'Соцзахист населення')
					grosstopic = 'Соціальний захист населення';
				if(grosstopic == 'Медреформа')
					grosstopic = 'Медична реформа';*/
				
				
				
				
				var chart = charts[gt];
				if(chart.title.element.textContent){
					grosstopic = '';
					mt_delta = -36;
				}
				var mt = chart.margin[0];
				mt == undefined ? mt = 10 : mt = mt;
				chart.update({
					title: {text: grosstopic},
					chart: {marginTop: mt + mt_delta}
				});
			}
		}
	}
	a();
	a = null;
}
