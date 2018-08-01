var slides = [];
var slide_i = 0;
var print_divs = [];

var  delete_button = document.createElement('button');

function create_slide_title(text, slide) {
    var title = document.createElement('div');
    title.innerHTML = text.toUpperCase();

    title.style.color = "#5F9EBB";
    // slide.innerHTML += "<p>" + title.innerHTML + "</p>";
    slide.appendChild(title);
}

function add_bigtopics_slide() {
    var slide = slides[slide_i];
    create_slide_title("Динаміка уваги до ключових тем", slide);
    var container = document.getElementById('bigtopics-container');
    // var svg_element = container.getElementsByTagName("svg")[0];
    slide.appendChild(container);

    slide_i++;
}

function add_cover() {
    var slide = slides[slide_i];
    var title = document.createElement('div');
    title.innerHTML = "Порядок денний ключових політичних спікерів";
    title.style.color = "#5F9EBB";
    slide.appendChild(title);

    // create_slide_title("First page", slide);
    slide_i++;
}

function copy_plain_charts_inner(elem) {
    var slide = slides[slide_i];
    create_slide_title("Тематика заяв ключових політиків", slide);
    var buf = elem.innerHTML;
    slide.innerHTML += buf;
    slide_i++;
}


function copy_plain_charts_outer(elem) {
    var slide = slides[slide_i];
    var title = elem.parentNode.querySelector(".gt_h3").textContent;

    create_slide_title(title, slide);
    var buf = elem.innerHTML;
    var div = document.createElement('div');
    div.className = 'chart_container_slide';
    div.innerHTML = buf;
    slide.appendChild(elem);
    slide_i++;
}


function make_slides() {

    var slides_container = document.getElementById('slides');


    // var slides_container = document.getElementById('slides');
    //
    var slidesno = document.getElementsByClassName('gt_by_pol_chart_div').length;
    slidesno += document.getElementsByClassName('chart_div').length;
    slidesno += 2; //title + second stile


    var slide = slides_container.children[1].children[0];

    if (print_divs.length > 0) {
        for (var i = 0; i < print_divs.length; i++) {
            var elem = document.getElementById(print_divs[i]);
            elem.parentNode.removeChild(elem);
            // slides[i].parentNode.removeChild(slides[i]);
            // slides.slice(slides[i], 1);
            // alert(slides[i].id);
            // slides[i].remove();
        }
        // alert("a");
        // slides = null;
        print_divs.length = 0;
        // return ;
    }

    for (var i = 0; i < slidesno; i++) {
        slides.push(slide.cloneNode(true));
        slides[i].setAttribute("id", i.toString());
        // slides[i].style.width = "1295px";
        // slides[i].style.height = "730px";//("id", i.toString());
        // slides[i].style.display = "block";
        print_divs.push(i.toString());
        slides_container.appendChild(slides[i]);
    }
    // add_cover();

    add_bigtopics_slide();

    // var keypolitics = document.getElementsByClassName('gt_by_pol_chart_container');
    // for (var i = 0; i < keypolitics.length; i++) {
    //     copy_plain_charts_inner(keypolitics[i]);
    // }


    var keypolitics = document.getElementsByClassName('gt_by_pol_chart_div_asses');
    for (var i = 0; i < keypolitics.length; i++) {
        copy_plain_charts_outer(keypolitics[i]);
    }

    var keypolitics = document.getElementsByClassName('gt_by_pol_chart_div');
    for (var i = 0; i < keypolitics.length; i++) {
        copy_plain_charts_outer(keypolitics[i]);
    }


    var chartdiv = document.getElementsByClassName('chart_div');
    for (var i = 0; i < chartdiv.length; i++) {
        copy_plain_charts_outer(chartdiv[i]);
    }
}