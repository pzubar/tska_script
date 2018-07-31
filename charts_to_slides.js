//
// var g_svg = [];
// var g_canvas = [];
// var slide_i = 0;
// var svg_i = 0;
// var slides = [];
//
// var res_cnv = [];
//
// function put_logo(ctx, canvas) {
//     var image = new Image();
//     image.src = "img/top-logo.png";
//
//     image.onload = function() {
//         ctx.drawImage(image, canvas.width - image.width - 5, 5, image.width / 2, image.height / 2);
//     };
// // alert(canvas.width);
// }
//
// function put_title(title, ctx) {
//     ctx.font = "30px Roboto Condensed";
//     ctx.fillStyle = '#5F9EBB';
//
//     var res = title.toUpperCase();
//
//     ctx.fillText(res,15,30);
// }
//
// function put_chart(destinationCtx) {
//     var image;
//
//     image = new Image();
//
//     image.src = g_canvas[svg_i].toDataURL('image/png');
//
//     // destinationCtx = destinationCanvas.getContext('2d');
//
//     // put_title("Динаміка уваги до ключових тем", c);
//
//     // alert(g_canvas[svg_i].height);
//
//     image.onload = function() {
//             destinationCtx.drawImage(image, 15, 150);
//     };
//     svg_i++;
// }
//
// function add_keypolitics_slides(div) {
//     // alert(slide_i);
//     var slide = slides[slide_i];
//     var ctx = slide.getContext('2d');
//     var title = "Тематика заяв ключових політиків";
//
//     put_title(title, ctx);
//     g_svg[svg_i] = div.getElementsByTagName("svg")[0].parentElement.innerHTML;
//     g_canvas[svg_i] = document.createElement('canvas');
//     canvg(g_canvas[svg_i], g_svg[svg_i]);
//     put_chart(ctx);
//     put_logo(ctx, slide);
//     slide_i++;
// }
//
// function  add_simple_charts(div) {
//     var slide = slides[slide_i];
//     var ctx = slide.getContext('2d');
//     var title = div.children[0].innerHTML;//getElementsByTagName("h3").innerHTML;
//     // alert(title);
//     put_title(title, ctx);
//     g_svg[svg_i] = div.getElementsByTagName("svg")[0].parentElement.innerHTML;
//     g_canvas[svg_i] = document.createElement('canvas');
//     canvg(g_canvas[svg_i], g_svg[svg_i]);
//     put_chart(ctx);
//     put_logo(ctx, slide);
//
//
//     slide_i++;
// }
//
// function add_bigtopics_slide(canvas) {
//
//     var destinationCanvas = slides[1];
//     var image, destinationCtx;
//
//     image = new Image();
//
//     image.src = canvas.toDataURL('image/png');
//
//     destinationCtx = destinationCanvas.getContext('2d');
//
//     put_title("Динаміка уваги до ключових тем", destinationCtx);
//     put_logo(destinationCtx, destinationCanvas);
//
//     image.onload = function() {
//         destinationCtx.drawImage(image, 15, 150);
//     };
//
//     slide_i++;
// }
//
// function add_cover() {
//     var slide = slides[0];
//     var ctx = slide.getContext('2d');
//     var title = "Порядок денний ключових політичних спікерів";
//
//     ctx.font = "48px Roboto Condensed";
//     ctx.fillStyle = '#5F9EBB';
//     ctx.fillText(title,50,50);
//     slide_i++;
// }
//
// function  charts_to_slides() {
//     // var slides_container = document.getElementById('slides');
//     //
//     // var slidesno = document.getElementsByClassName('gt_by_pol_chart_div').length;
//     // slidesno += document.getElementsByClassName('chart_div').length;
//     // slidesno += 2; //title + second stile
//     //
//     // var slide = slides_container.children[0].children[0];
//     //
//     // for (var i = 0; i < slidesno; i++) {
//     //     //
//     //
//     //     slides.push(slide.cloneNode(true));
//     //     slides_container.appendChild(slides[i]);
//     //     // slides[i].crossOrigin = 'anonymous';
//     //     slides[i].setAttribute("crossorigin", 'anonymous');
//     // }
//     //
//     // add_cover(slides_container);
//     //
//     //
//     // var cts_container = document.getElementById('container');
//     //
//     // g_svg[svg_i] = cts_container.childNodes[0].innerHTML;
//     //
//     // g_canvas[svg_i] = document.createElement('canvas');
//     // canvg(g_canvas[svg_i], g_svg[svg_i]);
//     // add_bigtopics_slide(g_canvas[svg_i]);
//     // svg_i++;
//     //
//     // var keypolitics = document.getElementsByClassName('gt_by_pol_chart_container');
//     // for (var i = 0; i < keypolitics.length; i++) {
//     //     add_keypolitics_slides(keypolitics[i]);
//     // }
//     //
//     // var simple_charts = document.getElementsByClassName('chart_div');
//     // for (var i = 0; i < simple_charts.length; i++) {
//     //     add_simple_charts(simple_charts[i]);
//     // }
//
//     // var printme =
//     //
//     // var slidestoid = document.getElementsByClassName('chart_div');
//     // for (var i = 0; i < slidestoid.length; i++) {
//     //     slidestoid[i].setAttribute("id", "" + i + "");
//     // }
// }
//
//
// // var doc = new jsPDF();
// // var specialElementHandlers = {
// //     '#editor': function (element, renderer) {
// //         return true;
// //     }
// // };
//
// $('#cmda').click(function () {
//
//     // var svg = document.getElementById('svg-container').innerHTML;
//     // var svg = g_svg;
//     // if (svg)
//         // svg = svg.replace(/\r?\n|\r/g, '').trim();
//     //
//     //
//     var doc = new jsPDF('l', 'px', [1295,730]);
//     // var canvas = document.getElementById('canvas');
//     //
//     // var canvas = document.createElement('div');
//     // canvg(canvas, svg);
//     //
//     // var imgData = canvas.toDataURL('image/png', 1.0);
//     // Generate PDF
//     // var doc = new jsPDF('l', 'px', 'a4');
//     for (var i = 0; i < slides.length; i++)
//     {
//         // var img = new Image();
//
//         var imgData = slides[i].toDataURL('image/png', 1.0);
//         doc.addImage(imgData, 'PNG', 0, 0, slides[i].width, slides[i].height);
//         doc.addPage();
//     }
//
//     // doc.addImage(imgData, 'PNG', 40, 40, canvas.width, canvas.height);
//
//     doc.save('test.pdf');
//     // doc.output("dataurlnewwindow");
// });
//
//
var func = function () {
    // alert("kea");

    xepOnline.Formatter.Format(print_divs,{pageWidth:'1295px', pageHeight:'730px'});
}