var bigCategories = [];

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function add_bigtopics_chart() {
    fix_topics_colors();
    var bigTopics = reader_out['Розподіл за темами великими'];
    // var bigname = "Розподіл за темами великими";

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

    for(var f in bigSeriesNames) {
        if(bigSeriesNames[f] == 'Общий итог') {
            delete bigSeriesNames[f];
        }
    }

    bigSeriesNames.forEach(function (item, i) {
        bigSeries[i] = new Object();
        bigSeries[i].name = item;
        bigSeries[i].color = lookup_color(item, colors);
        //setting random color if false
        // if (bigSeries[i].color == false)
            // bigSeries[i].color = getRandomColor();
        bigSeries[i].data = [];

        for (var a = 0; a < bigTopics.length; a++) {
            if (a == 7) // костыль - (пусто) и суммарно, подумать, как реализовать по-человечески
                break;
            var elem = bigTopics[a];
            bigSeries[i].data.push(Number(elem[item]));
        }
    });
    Highcharts.chart('bigtopics-container', {
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
            y: 0,
            itemStyle: {
                color: '#333333',
                fontWeight: 'bold',
                fontSize: '13px'
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
                lineColor: '#ffffff',
                lineWidth: 1,
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