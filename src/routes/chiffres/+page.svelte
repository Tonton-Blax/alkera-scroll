<script>
    import { browser } from '$app/environment';
    import gsap from 'gsap';
    import { onMount } from 'svelte';
    import DrawSVGPlugin from "$lib/gsap/DrawSVGPlugin";
    import ScrollTrigger from 'gsap/dist/ScrollTrigger.js';

    let SVG;


    if (browser)
        gsap.registerPlugin(DrawSVGPlugin,ScrollTrigger);

    onMount(async() => {
        gsap.timeline({ scrollTrigger: {
            trigger: '#section-chiffres',
            scrub: 1,
            start: 'top top',
            end: '+=300%',
            pin: true
        }})

        .from("#chiffre-line-masked", {
            duration: 0.5,
            drawSVG: '0',
            ease: "Power1.inOut",
        },0.01)

        .from(".chiffre-circle", {
            scale:0,
            duration: 0.25,
            reversed:true,
            stagger: { each: 0.05 },
            ease: "Power1.inOut",
        },0.25)

        .from('.chiffres-wrapper',{ 
            opacity:0, 
            duration:0.2, 
            stagger: { each: 0.05 }, 
            reversed: true 
        },0.25)

        .from('.chiffres-animes:not(.milliards)', {
            textContent: 1,
            duration: 0.2,
            ease: "none",
            snap: { textContent: 1 },
            stagger: {
                each:-0.05,
                onUpdate: function() {
                    // @ts-ignore
                    const number = Math.ceil(this.targets()[0].textContent);
                    // @ts-ignore
                    this.targets()[0].innerHTML = new Intl.NumberFormat("fr-FR").format(number);
                },
            }
            
        },0.25)

        .to(".chiffre-circle", {
            background:'#DBFF94',
            stagger: { each: 0.05 },
        },1)

        .from(".deco-circle", {
            scale:0,
            duration: 0.2,
            stagger: { each: 0.025 },
        },1)

        .to(".deco-circle, .chiffre-circle", {
            scale: (_, el) => window.innerWidth / window.innerHeight < 1.77  ? (window.innerHeight / el.clientHeight) / 2.15 : (window.innerWidth / el.clientWidth) / 2.15,
            duration: 0.2,
        })
    })

</script>


<section id="section-chiffres" class="w-screen aspect-video bg-feuille relative overflow-hidden">


    <div class="grid grid-cols-6 absolute top-0 left-0 w-full h-full">

        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>



        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>

        <div class="relative text-center leading-loose text-amande w-full self-center">
            <div class="chiffre-circle w-2/3 aspect-square rounded-full bg-white mx-auto mb-5"/>
            <div class="chiffres-wrapper absolute text-[1.2vw]">
                <span class="chiffres-animes">2000</span>
                <div class="text-[0.7vw]">collaborateurs</div>
            </div>
        </div>

        <div class="relative text-center leading-loose text-amande w-full self-center">
            <div class="chiffre-circle w-2/3 aspect-square rounded-full bg-white mx-auto mb-5"/>
            <div class="chiffres-wrapper absolute text-[1.2vw]">
                <span class="chiffres-animes milliards">4</span><span>&nbsp;Milliards €</span>
                <div class="text-[0.7vw]">de dommages</div>
            </div>
        </div>

        <div class="relative text-center leading-loose text-amande w-full self-center">
            <div class="chiffre-circle w-2/3 aspect-square rounded-full bg-white mx-auto mb-5"/>
            <div class="chiffres-wrapper absolute text-[1.2vw]">
                <span class="chiffres-animes">520000</span>
                <div class="text-[0.7vw]">missions d’expertise</div>
            </div>
        </div>

        <div class="relative text-center leading-loose text-amande w-full self-center">
            <div class="chiffre-circle w-2/3 aspect-square rounded-full bg-white mx-auto mb-5"/>
            <div class="chiffres-wrapper absolute text-[1.2vw]">
                <span class="chiffres-animes">210</span><span>&nbsp;Millions</span>
                <div class="text-[0.7vw]">de chiffre d’affaire</div>
            </div>
        </div>

        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>

        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        <div class="deco-circle self-center w-2/3 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>

       
    </div>

    <svg class="w-full h-full overflow-visible" bind:this={SVG} version="1.2" baseProfile="tiny" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" overflow="visible" xml:space="preserve">
        
        
        <mask id="mask-line" maskUnits="userSpaceOnUse">
            <line id="chiffre-line-masked" fill="none" stroke="white" stroke-miterlimit="10" stroke-dasharray="9" x1="0" y1="49.25%" x2="100%" y2="49.25%"/>
        </mask>

        <line mask="url(#mask-line)" id="chiffre-line" fill="none" stroke="#DBFF94" stroke-miterlimit="10" stroke-dasharray="9" x1="0" y1="49.25%" x2="100%" y2="49.25%"/>
        
        <!-- <circle fill="red" cx="481.68" cy="489.67" r="100.9"/>
        <circle fill="red" cx="800.56" cy="489.67" r="100.9"/>
        <circle fill="red" cx="1119.44" cy="489.67" r="100.9"/>
        <circle fill="red" cx="1438.32" cy="489.67" r="100.9"/> -->
    </svg>
</section>

<style lang="postcss">
    
    .chiffres-wrapper {
        @apply top-[120%] left-1/2 -translate-y-1/2 -translate-x-1/2;
    }
    
    circle {
        cursor: pointer;
    }

    /* .chiffres-cles {
        height:55%;
        top:39.3%;
        font-size:1.7vw;
        overflow:hidden;
        font-weight:300;
        line-height:2;
    }
     */
    

</style>