// toggle the navbar on scroll
function toggleNavbar(e) {
    var offset = window.pageYOffset

    if (offset > 1) {
    // prevent iOS scroll bug
    //if (offset != 0) {    
        $(".navbar-toggleable").removeClass("navbar-dark").addClass("navbar-light")
    } else {
        $(".navbar-toggleable").removeClass("navbar-light").addClass("navbar-dark")
    }
}

$(window).scroll(toggleNavbar)
$(document).ready(toggleNavbar)


// page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this)
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).position().top - $('.navbar').height()
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


// enable countUp with data attributes
$(document).ready(function() {
    
    function triggerCountUpAOS() {
        $(".aos-animate[data-aos-id='countup:in']:not(.counted)").each(function() {
            
            var elem = $(this)
            var from = elem.data('from') || null
            var to = elem.data('to') || null
            var decimals = elem.data('decimals') || null
            var duration = elem.data('duration') || null
            var options = elem.data('options') || null
            var countup = new CountUp(this, from, to, decimals, duration, options)
            var err = countup.error 
            
            if (err) {
                console.error(err)
            } else {
                countup.start()
                elem.addClass('counted')
            }
            
        })
    }

    AOS.init()

    triggerCountUpAOS()

    document.addEventListener('aos:in:countup:in', function(detail) {
        triggerCountUpAOS()
    })

})
