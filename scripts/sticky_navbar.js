// When the user scrolls the page, execute myFunction
    window.onscroll = function() {myFunction()};

    // Get the navbar
    var navbar = document.getElementById("navbar");

    // Get the offset position of the navbar
    var sticky = navbar.offsetTop;

    // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
    function myFunction() {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("sticky")
        } else {
            navbar.classList.remove("sticky");
        }
    }



    document.onmousedown = function(e) {

        var dragElement = e.target;

        if (!dragElement.classList.contains('draggable')) return;

        var coords, shiftX, shiftY;

        startDrag(e.clientX, e.clientY);

        document.onmousemove = function(e) {
            moveAt(e.clientX, e.clientY);
        };

        dragElement.onmouseup = function() {
            finishDrag();
        };


        // -------------------------

        function startDrag(clientX, clientY) {

            shiftX = clientX - dragElement.getBoundingClientRect().left;
            shiftY = clientY - dragElement.getBoundingClientRect().top;

            dragElement.style.position = 'fixed';

            document.body.appendChild(dragElement);
            // dragElement.
            moveAt(clientX, clientY);
        };

        function finishDrag() {
            // конец переноса, перейти от fixed к absolute-координатам
            dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
            dragElement.style.position = 'absolute';

            document.onmousemove = null;
            dragElement.onmouseup = null;
        }

        function moveAt(clientX, clientY) {
            // новые координаты
            var newX = clientX - shiftX;
            var newY = clientY - shiftY;

            var newBottom = newY + dragElement.offsetHeight;

            if (newBottom > document.documentElement.clientHeight) {
                var docBottom = document.documentElement.getBoundingClientRect().bottom;

                var scrollY = Math.min(docBottom - newBottom, 10);

                if (scrollY < 0) scrollY = 0;

                window.scrollBy(0, scrollY);

                newY = Math.min(newY, document.documentElement.clientHeight - dragElement.offsetHeight);
            }


            if (newY < 0) {
                var scrollY = Math.min(-newY, 10);
                if (scrollY < 0) scrollY = 0; // поправим ошибку округления

                window.scrollBy(0, -scrollY);
                newY = Math.max(newY, 0);
            }


            if (newX < 0) newX = 0;
            if (newX > document.documentElement.clientWidth - dragElement.offsetHeight) {
                newX = document.documentElement.clientWidth - dragElement.offsetHeight;
            }

            dragElement.style.left = newX + 'px';
            dragElement.style.top = newY + 'px';
        }

        // отменим действие по умолчанию на mousedown (выделение текста, оно лишнее)
        // return false;
    }