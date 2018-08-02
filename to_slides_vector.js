var slides = [];
var slide_i = 0;
var print_divs = [];

function update_title(slide, text) {
    var head = slide.querySelector(".gt_h3");
    if (head)
        var title_a = head.textContent;
    else
        title_a = "Тематика заяв ключових політиків";
    var title = slide.querySelector(".slide-title");
    title.innerHTML = title_a.toUpperCase();
    title.style.color = "#5F9EBB";
}

function create_slide_title(text, slide) {
    var title = document.createElement('div');
    title.innerHTML = text.toUpperCase();

    title.style.color = "#5F9EBB";
    slide.appendChild(title);
}

function add_bigtopics_slide() {
    var slide = slides[slide_i];
    create_slide_title("Динаміка уваги до ключових тем", slide);
    var container = document.getElementById('bigtopics-container');
    slide.appendChild(container);

    slide_i++;
}

function copy_plain_charts_outer(elem) {
    var slide = slides[slide_i];

    var buf = elem.innerHTML;
    var div = document.createElement('div');
    div.className = 'chart_container_slide';
    div.innerHTML = buf;
    //
    slide.appendChild(elem);
    update_title(slide);

    var  delete_button = document.createElement('button');
    delete_button.innerHTML = "ВИДАЛИТИ ЦЕЙ СЛАЙД";
    delete_button.onclick = function() {
        slide.parentNode.removeChild(slide);
    };
    delete_button.className = "no-print";
    slide.appendChild(delete_button);

    // if gt_by_pol_chart_div
    if (elem.classList.contains('chart_div'))
    {
        var input = document.createElement('div');
        input.style.position = 'absolute'
        input.className += 'textarea draggable';
        input.innerHTML += ' Кількість повідомлень, ініційованих політиками, у вибірці топ-10 інтернет-медіа, на центральному телебаченні та у центральній пресі';
        input.style.fontFamily = "Roboto Condensed";
        slide.appendChild(input);

    }
    slide_i++;
}

function make_slides() {

    var slides_container = document.getElementById('slides');


    var slidesno = document.getElementsByClassName('gt_by_pol_chart_div').length;
    slidesno += document.getElementsByClassName('chart_div').length;
    slidesno += 1; // + second slide


    var slide = slides_container.children[1].children[0];

    if (print_divs.length > 0) {
        for (var i = 0; i < print_divs.length; i++) {
            var elem = document.getElementById(print_divs[i]);
            elem.parentNode.removeChild(elem);
        }
        print_divs.length = 0;
    }

    for (var i = 0; i < slidesno; i++) {
        slides.push(slide.cloneNode(true));
        slides[i].setAttribute("id", i.toString());
        print_divs.push(i.toString());
        slides_container.appendChild(slides[i]);
    }

    add_bigtopics_slide();

    var keypolitics = document.getElementsByClassName('gt_by_pol_chart_div');
    for (var i = 0; i < keypolitics.length; i++) {
        copy_plain_charts_outer(keypolitics[i]);
    }

    var chartdiv = document.getElementsByClassName('chart_div');
    for (var i = 0; i < chartdiv.length; i++) {
        copy_plain_charts_outer(chartdiv[i]);
    }
}