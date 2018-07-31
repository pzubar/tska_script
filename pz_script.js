function pz_script() {

    var bigTopics = reader_out['Розподіл за темами великими'];
    var bigname = "Розподіл за темами великими";
    var bigCategories = [];

    bigTopics.forEach(function (item, i, bigTopics) {
        delete item['(пусто)'];
        var result = item['Названия строк'].split(/\//);
        var day = result[0];
        var month = result[1];
        var year = result[2];
        var dateString = month + '/' + day + '/' + year;
        var timestamp = Date.parse(dateString);
        if (isNaN(timestamp) == false) {
            // bigCategories.push(new Date(timestamp));
            bigCategories.push(day + '.' + month + '.' + year);
        }
        delete item['Названия строк'];
    });
    var bigSeries = [];
    //
    // bigTopics.sort(function(a, b) {
    //     if (a['Общий итог'] > b['Общий итог'])
    //         return 1;
    //     if (a['Общий итог'] < b['Общий итог'])
    //         return -1;
    //     return 0;
    // });

    var bigSeriesNames = Object.keys(bigTopics[0]);

    delete bigSeriesNames[12]; // костыль - убираем 'общий итог'


    bigSeriesNames.forEach(function (item, i) {
        bigSeries[i] = new Object();
        bigSeries[i].name = item;
        bigSeries[i].color = lookup_color(item, colors);
        bigSeries[i].data = [];

        for (var a = 0; a < bigTopics.length; a++) {
            if (a == 7) // костыль - (пусто) и суммарно, подумать, как реализовать по-человечески
                break;
            var elem = bigTopics[a];
            bigSeries[i].data.push(Number(elem[item]));
        }
    });
    Highcharts.chart('container', {
        chart: {
            type: 'area'
        },
        title: {
            text: ''//bigname
        },
        exporting: { enabled: false },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            layout: 'vertical',
            x: 0,
            y: 100,
            itemStyle: {
                color: '#000000',
                fontWeight: 'bold',
                fontSize: '14px'
            }
        },
        xAxis: {
            categories: bigCategories,
            gridLineWidth: 1
        },
        yAxis: {
            title: {
                text: ''
            },
            gridLineWidth: 0
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                // lineColor: '#ffffff',
                // lineWidth: 1,
                marker: {
                    enabled: false,
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            },
            plotLines: [{
                color: 'red', // Color value
                dashStyle: 'solid', // Style of the plot line. Default to solid
                width: 2 // Width of the line
            }],
            series: {
                fillOpacity: 1
            }
        },
        series: bigSeries
    });
}