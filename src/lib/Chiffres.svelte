<script>
    import { browser } from '$app/environment';
    import gsap from 'gsap';
    import { onMount } from 'svelte';
    import DrawSVGPlugin from "$lib/gsap/DrawSVGPlugin";
    import ScrollTrigger from 'gsap/dist/ScrollTrigger.js';

    export let order = 2;

    let SVG;
    /** @type {HTMLElement} */
    let chiffresEl;

    if (browser)
        gsap.registerPlugin(DrawSVGPlugin,ScrollTrigger);

    onMount(async() => {
        const tl =gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
            // @ts-ignore
            refreshPriority: order,
            trigger: '#section-chiffres',
            scrub: 1,
            start:()=> `top-=${(window.innerHeight - chiffresEl?.offsetHeight) / 2}px top`,
            end: '+=300%',
            pin: '#sections-wrapper',
        }})
        tl.to(".deco-circle", {
            scale:0.1,
            duration: 0.4,
            stagger: { 
                amount: 0.12, 
                grid: [3,6], 
                axis: 'x', 
                from: 'center'
             },
        },0)

        tl.to(".chiffre-circle", {
            scale:1,
            duration: 1,
            backgroundColor: '#FFFFFF',
            stagger: { each: 1 / 4 },
        },'>')


        .from("#chiffre-line-masked", {
            duration: 2,
            drawSVG: '0',
            ease: "Power1.inOut",
        },'<')


        .to("#chiffres-el", {
            '--secteur-opacite': 1, 
            duration: 0.5,
        },'<')


        .from('.chiffres-wrapper',{ 
            opacity:0, 
            duration: 1, 
            stagger: { each: 0.05 }, 
            reversed: true 
        },'<')

        .from('.chiffres-animes:not(.milliards)', {
            textContent: 1,
            duration: 0.25,
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
            
        },'<')

    })

</script>

<section id="section-chiffres" class="w-screen aspect-video bg-feuille relative">


    <div 
        style="--secteur-opacite: 0;"
        id="chiffres-el"
        class="grid grid-cols-6 absolute top-0 left-0 w-full aspect-video" 
        bind:this={chiffresEl}
    >

        {#each {length:6} as _}
        <div class="deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}

        <div class="deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>

        <div class="relative text-center leading-loose text-amande w-full self-center">
            <div class="deco-circle chiffre-circle circle-1 w-7/12 aspect-square rounded-full bg-amande mx-auto mb-5"/>
            <div class="chiffres-wrapper absolute text-[1.5vw] w-max">
                <span class="chiffres-animes">2000</span>
                <div class="text-[0.9vw]">collaborateurs</div>
            </div>
        </div>

        <div class="relative text-center leading-loose text-amande w-full self-center">
            <div class="deco-circle chiffre-circle circle-2 w-7/12 aspect-square rounded-full bg-amande mx-auto mb-5"/>
            <div class="chiffres-wrapper absolute text-[1.5vw] w-max">
                <span class="chiffres-animes milliards">4</span><span>&nbsp;Milliards €</span>
                <div class="text-[0.9vw]">de dommages</div>
            </div>
        </div>

        <div class="relative text-center leading-loose text-amande w-full self-center">
            <div class="deco-circle chiffre-circle circle-3 w-7/12 aspect-square rounded-full bg-amande mx-auto mb-5"/>
            <div class="chiffres-wrapper absolute text-[1.5vw] w-max">
                <span class="chiffres-animes">520000</span>
                <div class="text-[0.9vw]">missions d’expertise</div>
            </div>
        </div>

        <div class="relative text-center leading-loose text-amande w-full self-center">
            <div class="deco-circle chiffre-circle circle-4 w-7/12 aspect-square rounded-full bg-amande mx-auto mb-5"/>
            <div class="chiffres-wrapper absolute text-[1.5vw] w-max">
                <span class="chiffres-animes">210</span><span>&nbsp;Millions</span>
                <div class="text-[0.9vw]">de chiffre d’affaire</div>
            </div>
        </div>

        <div class="deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>

        {#each {length:6} as _}
            <div class="deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}

       
    </div>

    <svg class="w-full h-full overflow-visible" bind:this={SVG} version="1.2" baseProfile="tiny" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" overflow="visible" xml:space="preserve">
        
        
        <mask id="mask-line" maskUnits="userSpaceOnUse">
            <line id="chiffre-line-masked" fill="none" stroke="white" stroke-miterlimit="10" stroke-dasharray="9" x1="0" y1="49.25%" x2="100%" y2="49.25%"/>
        </mask>

        <line mask="url(#mask-line)" id="chiffre-line" fill="none" stroke="#D6FC8A" stroke-miterlimit="10" stroke-dasharray="9" x1="0" y1="49.25%" x2="100%" y2="49.25%"/>
        
    </svg>
    
</section>

<style lang="postcss">
    
    .chiffres-wrapper {
        @apply top-[120%] left-1/2 -translate-y-1/2 -translate-x-1/2;
    }
    
    circle {
        cursor: pointer;
    }

    .circle-1:after, .circle-2:after, .circle-3:after, .circle-4:after {
        opacity: var(--secteur-opacite);
        content: '';
        position: absolute;
        left:0%;
        width: 100%;
        height: 100%;
        background-radius: 100%;
        background-repeat: no-repeat;
        background-size: contain;
    }

    .circle-4:after {
        background-image: url('/chiffres-cles/expertises.png');
    }
    .circle-3:after {
        background-image: url('/chiffres-cles/missions.png');
    }
    .circle-2:after {
        background-image: url('/chiffres-cles/bureaux.png');
    }
    .circle-1:after {
        background-image: url('/chiffres-cles/collaborateurs.png');
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