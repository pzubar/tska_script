var slides = [];
var slide_i = 0;
// var print_divs = [];

function update_title(slide, text) {
    var head = slide.querySelector(".gt_h3");
    if (head)
        var title_a = head.textContent;
    else if (text)
        title_a = text;
	else if (slide.querySelector('.politics_top_statements_div') !== null){
		title_a = 'КЛЮЧОВІ МЕСЕДЖІ ТОП-5* ПОЛІТИКІВ';
		slide.querySelector('.slide-subtitle').textContent = '';
		var p = slide.querySelector('.politics_top_statements_container').getAttribute('politician');
		p = p.toUpperCase();
		slide.querySelector('h3').textContent = p;
		slide.querySelector('.politics_top_statements_container').style.removeProperty('border');
	}else
        title_a = "Тематика заяв ключових політиків";
    var title = slide.querySelector(".slide-title");
    title.innerHTML = title_a.toUpperCase();
    title.style.color = "#5F9EBB";
}

function add_bigtopics_slide() {
    var slide = slides[slide_i];
    update_title(slide, "Динаміка уваги до ключових тем");
    var container = document.getElementById('bigtopics-container');

    slide.appendChild(container);
    add_textarea(slide);
    slide_i++;
}

function set_cover_subtitle() {
    var subt_container = document.querySelector('.cover-subtitle');

    subt_container.innerHTML = bigCategories[0] + ' — ' + bigCategories[bigCategories.length - 1];
}

function move_slide_up() {
    var prevSlide = this.parentNode.previousSibling;//querySelector(".gt_h3");
    var thisSlide = this.parentNode;

    this.parentNode.parentNode.insertBefore(thisSlide, prevSlide);
}

function move_slide_down() {
    var nextSlide = this.parentNode.nextSibling;//querySelector(".gt_h3");
    var thisSlide = this.parentNode;

    this.parentNode.parentNode.insertBefore(nextSlide, thisSlide);
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
    delete_button.className = "no-print deletebutton";
    slide.appendChild(delete_button);

    var  mvupbtn = document.createElement('button');
    mvupbtn.innerHTML = "ПЕРЕМІСТИТИ СЛАЙД ВГОРУ";
    mvupbtn.onclick = move_slide_up;
    mvupbtn.className = "no-print";
    slide.appendChild(mvupbtn);

    var  mvupbtn = document.createElement('button');
    mvupbtn.innerHTML = "ПЕРЕМІСТИТИ СЛАЙД ВНИЗ";
    mvupbtn.onclick = move_slide_down;
    mvupbtn.className = "no-print";
    slide.appendChild(mvupbtn);


    if (elem.classList.contains('chart_div') || elem.classList.contains('politics_top_statements_div')) {
        add_textarea(slide);
    }
    slide_i++;
}

function add_textarea(slide) {
    var input = document.createElement('div');
    // input.style.position = 'absolute';
    input.className += 'textarea';
    input.innerHTML += ' Кількість повідомлень, ініційованих політиками, у вибірці топ-10 інтернет-медіа, на центральному телебаченні та у центральній пресі';
    input.style.fontFamily = "Roboto Condensed";
    slide.appendChild(input);
}

function make_slides() {

    var slides_container = document.getElementById('slides');


    var slidesno = document.getElementsByClassName('gt_by_pol_chart_div').length;
    slidesno += document.getElementsByClassName('chart_div').length;
    slidesno += 1; // + second slide
	slidesno += document.getElementsByClassName('politics_top_statements_div').length;

    var slide = slides_container.children[1].children[0];
    //
    // if (print_divs.length > 0) {
    //     for (var i = 0; i < print_divs.length; i++) {
    //         var elem = document.getElementById(print_divs[i]);
    //         elem.parentNode.removeChild(elem);
    //     }
    //     print_divs.length = 0;
    // }

    for (var i = 0; i < slidesno; i++) {
        slides.push(slide.cloneNode(true));
        slides[i].setAttribute("id", i.toString());
        // print_divs.push(i.toString());
        slides_container.appendChild(slides[i]);
    }
    set_cover_subtitle();

    add_bigtopics_slide();
    var keypolitics = document.getElementsByClassName('gt_by_pol_chart_div');
    for (var i = 0; i < keypolitics.length; i++) {
        copy_plain_charts_outer(keypolitics[i]);
    }

    var chartdiv = document.getElementsByClassName('chart_div');
    for (var i = 0; i < chartdiv.length; i++) {
        copy_plain_charts_outer(chartdiv[i]);
    }
	
	var chart_top_statements = document.getElementsByClassName('politics_top_statements_div');
	for (var i = 0; i < chart_top_statements.length; i++) {
        copy_plain_charts_outer(chart_top_statements[i]);
    }
}