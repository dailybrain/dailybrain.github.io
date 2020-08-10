// toggle the navbar on scroll
function toggleNavbar(e) {
    var offset = window.pageYOffset

    if (offset > 1) {
    // prevent iOS scroll bug
    //if (offset != 0) {    
        $(".navbar-toggleable").removeClass("navbar-dark").addClass("navbar-light bg-white border-bottom")
    } else {
        $(".navbar-toggleable").removeClass("navbar-light bg-white border-bottom").addClass("navbar-dark")
    }
}

$(window).scroll(toggleNavbar)
$(document).ready(toggleNavbar)


// page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this)
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo')
        event.preventDefault()
    })
})


// enable typed js with data attributes
$(document).ready(function() {
    
    $(".typed").each(function() {
        new Typed(this, { typeSpeed: 40, backSpeed: 40, backDelay: 1000, loop: true, stringsElement: this.previousElementSibling })
    })
   
})