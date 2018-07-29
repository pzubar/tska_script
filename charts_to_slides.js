function  charts_to_slides() {

    // alert('kakaka');
    var cts_slide = document.getElementById('slide_2');
    var cts_container = document.getElementById('container');


    cts_slide.innerHTML += cts_container.childNodes[0].innerHTML;//appendChild(cts_container);
    alert(cts_slide.children[2].tagName);
    cts_slide.children[2].style.width = "90%";
    cts_slide.children[2].style.margin = "0 auto";
    cts_slide.children[2].style.display = "block";
}