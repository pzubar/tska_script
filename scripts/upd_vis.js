function upd_vis() {
    function add_to_ch() {

        var curtitle = this.parentNode.querySelector(".gt_h3");
        var cur = this.parentNode.querySelector(".highcharts-container");//.textContent;
        var addto = this.parentNode.querySelector(".add-to-chart").value;
        // var scalebutton =  this.parentNode.querySelector(".apply_scalebygt");
        // scalebutton.click();
        scale_by_gt(this);
        var titles = document.getElementsByClassName('gt_h3');
        var addto_container;

        for (var i = 0; i < titles.length; i++) {
            if (titles[i].textContent.toUpperCase().includes(addto.toUpperCase())) {
                titles[i].textContent += "; " + curtitle.textContent;
                addto_container = titles[i].parentNode;
                break;
            }
        }
        update_title(addto_container.parentNode);
        addto_container = addto_container.getElementsByClassName('chart_container');
        addto_container = addto_container[0];
        // alert(addto_container.children[0].id);
        addto_container.appendChild(cur);

        addto_container.parentElement.parentElement.scrollIntoView();
        this.parentElement.parentElement.querySelector('.deletebutton').click();

    }

    var a = function () {
        var chart;
        for (let k in charts) {
            try {
                if (data_series[k].length) {
                    chart = charts[k];
                    var mt = chart.margin[0];
                    if (mt === undefined)
                        mt = 0;
                    var crt = document.getElementById("chart_container_" + k);
                    var hc_points = crt.querySelectorAll(".highcharts-point");

                    var bar_height, annot_height;
                    var annot_padding = chart.annotations[0].labels[0].padding;
                    var callout_offset = 16; //callout default offset from point -16
                    var x;

                    for (var i = 0, l = chart.annotations[0].labels.length; i < l; i++) {
                        bar_height = hc_points[i].height.baseVal.value;
                        annot_height = chart.annotations[0].labels[i].height;
						
						// found formula
                        x = bar_height + annot_height + annot_padding + callout_offset - chart.plotHeight;
						console.log(k + ' x: ' + x);
						
                        if (x > 0) {
                            mt = chart.margin[0] === undefined ? 0: chart.margin[0];	// @valeks 2018-12-21: fixes the marginTop - against labels overlapping title on top 
							if(x > mt){
								console.log(k + ' resetting mt: ' + (mt + x).toString());
								chart.update({
									chart: {
										marginTop: mt + x
									}
								});

								//now again get the svg element transform property, evaluate, re-update
								var hc_annot_lbls = crt.querySelectorAll(".highcharts-annotation-label");
								for (var ii = 0, ll = hc_annot_lbls.length, t_prop; ii < ll; ii++) {
									t_prop = hc_annot_lbls[ii].getAttribute("transform");
									t_prop = t_prop.slice(t_prop.indexOf(","));
									t_prop = t_prop.slice(1, t_prop.length - 1);
									t_prop = Number(t_prop);
									if (t_prop <= 0) {
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
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    a();
    a = null;

    //function manage_label_collisions(){
    //iterate all neighboring pairs, detect y and x collisions, calculate options to separate
    //}

    function move_annotations() {
        var a = this.parentNode.querySelector(".bar_n").value - 1;
        var x_fix = this.parentNode.querySelector(".x_fix").value;
        var y_fix = this.parentNode.querySelector(".y_fix").value;

        var gt = this.parentNode.querySelector(".gt_h3").textContent;	//gt sheet name
        var chart = charts[gt];
        if (a >= 0) {
            if (x_fix) {
                chart.annotations[0].labels[a].xSetter(chart.annotations[0].labels[a].x + +x_fix);
                if (!('x' in lbls[gt][a]))
                    lbls[gt][a].x = +x_fix;
                else
                    lbls[gt][a].x += +x_fix;
            }
            if (y_fix) {
                chart.annotations[0].labels[a].ySetter(chart.annotations[0].labels[a].y + +y_fix);
                if (!('y' in lbls[gt][a]))
                    lbls[gt][a].y = +y_fix - 16;
                else
                    lbls[gt][a].y += +y_fix;
            }
            this.parentNode.querySelector(".x_fix").value = '';
            this.parentNode.querySelector(".y_fix").value = '';
        }
    }

    a = document.getElementsByClassName("move_annotations_btn");
    for (var i = 0, l = a.length; i < l; i++) {
        a[i].onclick = move_annotations;
    }

    function fixup_labels_above_xaxis(gt) {

        var chart = charts[gt];
        // debugger;
        if (!chart.series[0].data[0] || !chart.series[0].data[0].dataLabel)
            return;
        var a = chart.series[0].data[0].dataLabel.height;
        var b = chart.series[0].data[0].dataLabel.padding + 1;
        var c = chart.plotHeight - a + b;
        var data_label_height = chart.series[0].data[0].dataLabel.height - chart.series[0].data[0].dataLabel.padding * 2;
        for (var i = 0, l = chart.series[0].data.length; i < l; i++) {
            try {
                if (chart.series[0].data[i].dataLabel.y > c) {
                    //chart.series[0].data[i].dataLabel.ySetter(c);
                    data_series[gt][i].dataLabels = {
                        y: chart.series[0].data[i].shapeArgs.height + chart.series[0].data[0].dataLabel.padding - 1
                    }
                }
                if (chart.series[0].data[i].shapeArgs.height < data_label_height) {
                    data_series[gt][i].dataLabels.color = '#666666';
                    data_series[gt][i].dataLabels.y = 5;
                }
            }
            catch (e) {
                console.log(e);
                console.log(data_series[gt][i]);
            }
        }
        chart.update({
            series: [{data: data_series[gt]}]
        });
    }

    setTimeout(function () {
        for (k in data_series) {
            if (data_series[k].length)
                fixup_labels_above_xaxis(k);
        }
    }, 100);

    function scale_by_gt(elem) {
        var gt = elem.parentNode.querySelector(".gt_h3").textContent;
        var scalebygt = elem.parentNode.querySelector(".add-to-chart").value;
        var chart = charts[gt];
        var scalebychart = charts[scalebygt];

        var yMaxOriginal = (data_series[gt][0]).y;
        var yMaxTarget = (data_series[scalebygt][0]).y;

        if (yMaxOriginal > yMaxTarget) {
            var buf = chart;
            chart = scalebychart;
            scalebychart = buf;
            buf = gt;
            gt = scalebygt;
            scalebygt = buf;
        }

        chart.update({
            yAxis: {max: scalebychart.yAxis[0].max},
            chart: {
                marginTop: scalebychart.margin[0],
                marginBottom: scalebychart.marginBottom
            },
            plotOptions: {
                series: {
                    pointWidth: Math.ceil(scalebychart.series[0].columnMetrics.width)
                }
            }
        });
        fixup_labels_above_xaxis(gt);
        // g_infolog.innerHTML += gt + " додано до " + scalebygt + "\n";
    }

    a = document.getElementsByClassName("apply_scalebygt");
    for (i in a) {
        a[i].onclick = scale_by_gt;
    }


    // var mvupbtn = document.getElementsByClassName("move_up");
    // for(i in pz){
    //     // a[i].onclick = scale_by_gt;
    //     mvupbtn[i].onclick = add_to_ch;
    // }

    a = document.getElementsByClassName("apply_scalebygt");
    for (i in a) {
        a[i].onclick = scale_by_gt;
    }

    var pz = document.getElementsByClassName("apply-add-to-chart");
    for (i in pz) {
        // a[i].onclick = scale_by_gt;
        pz[i].onclick = add_to_ch;
    }

    a = function () {
        var b = document.getElementsByClassName("scroll_to_top");
        for (i in b) {
            b[i].onclick = function () {
                window.scrollTo(0, 0);
            }
        }
    }
    a();

    a = function () {

        var b = document.getElementsByClassName("toggle_title");
        for (i in b) {
            b[i].onclick = function () {
                var gt = this.parentNode.querySelector(".gt_h3").textContent;
                var topicsonslide = gt.split("; ");
                for (var i = 0; i < topicsonslide.length; i++) {
                    gt = topicsonslide[i];
                    var grosstopic = lookup_grosstopic(gt, colors);
                    grosstopic = grosstopic.charAt(0).toUpperCase() + grosstopic.slice(1);
                    var mt_delta = 40;

                    var chart = charts[gt];
                    if (chart.title.element.textContent) {
                        grosstopic = '';
                        mt_delta = -40;
                    }
                    var mt = chart.margin[0] || 10;
                    // mt = mt === undefined ? mt = 10 : m mt;
                    // alert(mt);
                    // alert(chart.annotations[0].labels[0].alignAttr.y);

                    //!!!!Changing small charts titles positioning
                    // debugger;
                    var lowerPos = 5;
                    // if (chart.annotations[0].labels[0].alignAttr.y - 15 > 0)
                    //     lowerPos = chart.annotations[0].labels[0].alignAttr.y - 15;
                    // alert(lowerPos);

                    // var lowerPos = y:chart.annotations[0].labels[0].alignAttr.y - 7
                    chart.update({
                        title: {text: grosstopic, y: lowerPos},
                        chart: {marginTop: mt + mt_delta}
                    });
                    // alert(this.parentNode.querySelector('.highcharts-title').innerHTML)
                }
                // var titles = this.parentNode.getElementsByClassName('highcharts-title');
                // for (var i = 0; i < titles.length; i++) {
                //     titles[i].className += " draggable";
                // }
            }
        }
    };
    a();
    a = null;
}