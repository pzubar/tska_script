
var g_svg;
var g_canvas;

function put_logo(ctx, canvas) {
    var image = new Image();
    image.src = "img/top-logo.png";

    image.onload = function() {
        ctx.drawImage(image, canvas.width - image.width - 5, 5, image.width / 2, image.height / 2);
    };
alert(canvas.width);
}

function put_title(title, ctx) {
    ctx.font = "30px Roboto Condensed";
    ctx.fillStyle = '#5F9EBB';

    var res = title.toUpperCase();

    ctx.fillText(res,0,30);

}

function copy_canvas() {
    var cts_slide = document.getElementById('slide_2').children[0];

    var destinationCanvas = cts_slide.children[0];//document.createElement('canvas');
    var image, destinationCtx;
    destinationCanvas.style.width = '1200px';
//create the image
    image = new Image();

//get the base64 data
    image.src = g_canvas.toDataURL('image/png');

//get the destination context
    destinationCtx = destinationCanvas.getContext('2d');

//copy the data

    put_title("Динаміка уваги до ключових тем", destinationCtx);
    put_logo(destinationCtx, destinationCanvas);
    image.onload = function() { destinationCtx.drawImage(image, 15, 150);};

}

function  charts_to_slides() {
    var sliders_container = document.getElementsByClassName('main-container')[0];


    var cts_container = document.getElementById('container');

    g_svg = cts_container.childNodes[0].innerHTML;

    g_canvas = document.createElement('canvas');
    canvg(g_canvas, g_svg);
    copy_canvas();


}


// var doc = new jsPDF();
// var specialElementHandlers = {
//     '#editor': function (element, renderer) {
//         return true;
//     }
// };

$('#cmda').click(function () {

    // var svg = document.getElementById('svg-container').innerHTML;
    var svg = g_svg;
    if (svg)
        svg = svg.replace(/\r?\n|\r/g, '').trim();
    //
    //
    var doc = new jsPDF('l', 'px', [1295,730]);
    // var canvas = document.getElementById('canvas');
    //
    // var canvas = document.createElement('div');
    // canvg(canvas, svg);
    //
    // var imgData = canvas.toDataURL('image/png', 1.0);
    // Generate PDF
    // var doc = new jsPDF('l', 'px', 'a4');


    // doc.addImage(imgData, 'PNG', 40, 40, canvas.width, canvas.height);
    doc.save('test.pdf');
    // doc.output("dataurlnewwindow");
});