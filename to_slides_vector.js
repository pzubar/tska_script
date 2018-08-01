
var logo64;
var slides = [];
var slide_i = 0;
var print_divs = [];

function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data
        callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

        // ... or get as Data URI
        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
}

getDataUri('img/top-logo.png', function(dataUri) {
    logo64 = dataUri;
});



function create_slide_title(text, slide) {
    var title = document.createElement('div');
    title.innerHTML = text.toUpperCase();

    title.style.color = "#5F9EBB";
    // slide.innerHTML += "<p>" + title.innerHTML + "</p>";
    slide.appendChild(title);
}

function add_keypolitics_slides(div) {
    // alert(slide_i);
    var slide = slides[slide_i];
    var title = "Тематика заяв ключових політиків";//getElementsByTagName("h3").innerHTML;

    // var diva = document.createElement('div');
    create_slide_title(title, slide);
    // var ctx = slide.getContext('2d');
    // var title = "Тематика заяв ключових політиків";

    // put_title(title, ctx);
    var svg_element = div;//getElementsByTagName("svg")[0].parentElement.parentElement.cloneNode(true);//.parentElement.innerHTML;



    // slide.appendChild(svg_element);

    // diva.appendChild(svg_element);
    // alert(div.offsetWidth);
    // diva.style.width = "1295px";
    // diva.style.height = "700px";
    slide.appendChild(svg_element);

    slide_i++;
}

function add_bigtopics_slide() {


    var slide = slides[slide_i];
    create_slide_title("Динаміка уваги до ключових тем", slide);

    // var div = document.createElement('div');

    var container = document.getElementById('container');
    var svg_element = container.getElementsByTagName("svg")[0];//.parentElement;//.cloneNode(true);


    // var logo = new Image();
    //
    // logo.onload = function () {
    //     logo.width = "16";
    //     logo.height = "16";
    //     slide.appendChild(logo);
    // }
    //
    // logo.src = logo64;

    // slide.setAttribute("id", "printme");
    // div.appendChild(svg_element);
    // // alert(div.offsetWidth);
    // div.width = "1295px";
    // div.height = "700px";
    slide.appendChild(svg_element);

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