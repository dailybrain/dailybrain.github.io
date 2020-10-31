import Typed from 'typed.js'
import { Collapse } from '../../node_modules/bootstrap/dist/js/bootstrap.esm.min'
import { default as countup } from '../../node_modules/countup.js/dist/countUp.umd'
import { default as AOS } from '../../node_modules/aos/dist/aos' 
import smoothscroll from 'smoothscroll-polyfill'
import * as _ from './rAF'

// load smooth scroll polyfill
smoothscroll.polyfill()

// smooth scroll elements
Array
    .from(document.querySelectorAll('.smooth-scroll'))
    .forEach(node => {
        node.addEventListener('click', (e) => {
            e.preventDefault()
            const anchor = node.getAttribute("href")
            document.querySelector(anchor).scrollIntoView({ behavior: 'smooth' });
        })
    })

// typed.js elements
Array
    .from(document.querySelectorAll('.typed'))
    .forEach(node => new Typed(node, 
        { 
            typeSpeed: 40, 
            backSpeed: 40, 
            backDelay: 1000, 
            loop: true, 
            stringsElement: node.previousElementSibling 
        }
    ))

// toggle scroll top button on scroll
const scrollTopBtn = document.querySelector('.btn-scroll-top')
const clientHeight = window.innerHeight || document.documentElement.clientHeight
const minClientHeight = clientHeight * 0.4

// toggle navbar on scroll
const navbarToggleable = document.querySelector('.navbar-toggleable')

window.addEventListener('scroll', (e) => {
    
    const offset = e.currentTarget.pageYOffset

    if (scrollTopBtn != null) {
        if(offset > minClientHeight) {
            scrollTopBtn.classList.add("show")
        } else {
            scrollTopBtn.classList.remove("show")
        }
    }

    if (navbarToggleable != null) {
        if (offset > 1) {
            navbarToggleable.classList.remove('navbar-dark')
            navbarToggleable.classList.add('navbar-light')
        } else {
            navbarToggleable.classList.remove('navbar-light')
            navbarToggleable.classList.add('navbar-dark')
        }
    }

})   


// enable countUp with data attributes
const countUpAOS = () => {

    //console.log('trigger')

    Array
    .from(document.querySelectorAll(".aos-animate[data-aos-id='countup:in']:not(.counted)"))
    .forEach(node => {

        //console.log(node)
        
        const from = node.dataset.from || null
        const to = node.dataset.to || null
        const decimals = node.dataset.decimals || null
        const duration = node.dataset.duration || null

        const options = {
            startVal: from,
            duration: duration,
            decimalPlaces: decimals
        }

        const c = new countup.CountUp(node, to, options)
        const err = c.error 
            
        if (!err) {
            c.start()
            node.classList.add('counted')
        } else {
            console.error(err)            
        }

    })

}

AOS.init({
    once: true
})

countUpAOS()

document.addEventListener('aos:in:countup:in', (detail) => {
    countUpAOS()
})