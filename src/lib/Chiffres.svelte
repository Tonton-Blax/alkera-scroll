<script>
    import { browser } from '$app/environment';
    import gsap from 'gsap';
    import { onMount } from 'svelte';
    import DrawSVGPlugin from "$lib/gsap/DrawSVGPlugin";
    import ScrollTrigger from 'gsap/dist/ScrollTrigger.js';
    import { md } from './utils';
    
    export let order = 3;
    
    let SVG;
    /** @type {HTMLElement} */
    let chiffresEl;

    if (browser) {
        gsap.registerPlugin(DrawSVGPlugin,ScrollTrigger);
        ScrollTrigger.normalizeScroll(true);
    }

    onMount(async() => {

        gsap.set('.deco-circle, .chiffre-circle', {scale:0.5});
        const tl =gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
            // @ts-ignore
            refreshPriority: order,
            trigger: '#section-chiffres',
            scrub: 1,
            start:()=> `top-=${(window.innerHeight - chiffresEl?.offsetHeight) / 2}px top`,
            end: '+=200%',
            pin: '#sections-wrapper',
            preventOverlaps: true,
            anticipatePin: 1,
        }})

        tl
        .to(".deco-circle", {
            scale:0,
            duration: 0.4,
            stagger: { 
                amount: 0.12, 
                grid: [3,6], 
                axis: 'x', 
                from: 'center'
             },
        },0)
        .addLabel('chiffresAnim')
        .to(".chiffre-circle", {
            scale: $md ? 1 : 1.25,
            duration: 1,
            backgroundColor: '#FFFFFF',
            stagger: { each: 1 / 4 },
        },'>')
        // .to('.circle-1, .circle-2', { yPercent:()=> $md ? 0 : -25 }, 'chiffresAnim')
        // .to('.circle-3, .circle-4', { yPercent:()=> $md ? 0 : 25 }, 'chiffresAnim')

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
            duration: 0.5, 
            stagger: { each: 0.02 }, 
            reversed: true 
        },'<')

        .from('.chiffres-animes', {
            textContent: 1,
            duration: 0.5,
            ease: "none",
            snap: { textContent: 1 },
            stagger: {
                onUpdate: function() {
                    // @ts-ignore
                    const number = Math.ceil(this.targets()[0].textContent);
                    // @ts-ignore
                    this.targets()[0].innerHTML = new Intl.NumberFormat("fr-FR").format(number);
                },
            }
            
        },'<')
        !$md && tl.to('.chiffres-circle-wrapper', { xPercent: 6.5, yPercent:(i)=> [ -60, -30, 0, 30 ][i]}, 'chiffresAnim' )
        .to({},{duration:2},'>')

    })

</script>

<section id="section-chiffres" class="w-screen h-screen md:h-[unset] md:aspect-video bg-feuille relative z-[3]">


    <div 
        style="--secteur-opacite: 0;"
        id="chiffres-el"
        class="
            grid absolute top-0 left-0 w-full h-screen md:h-[unset] md:aspect-video px-10
            grid-rows-6 grid-cols-3 md:grid-rows-[unset] md:grid-cols-6 md:px-0
        " 
        bind:this={chiffresEl}
    >

        {#each { length: 6 } as _}
        <div class="hidden md:block deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}

        <div class="deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>

        {#each { length: 2 } as _}
        <div class="block md:hidden deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}

        <div class="chiffres-circle-wrapper relative text-center leading-loose text-amande w-full self-center">
            <div class="deco-circle chiffre-circle circle-1 w-7/12 aspect-square rounded-full bg-amande mx-auto mb-2 md:mb-5"/>
            <div class="chiffres-wrapper flex flex-col absolute text-[1.75ch] md:text-[1.5vw] font-semibold w-max">
                <span class="chiffres-animes leading-tight md:leading-auto">2200</span>
                <div class="text-[0.6ch] md:text-[0.9vw] font-light">collaborateurs</div>
            </div>
        </div>

        {#each { length: 2 } as _}
        <div class="block md:hidden deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}

        <div class="chiffres-circle-wrapper relative text-center leading-loose text-amande w-full self-center">
            <div class="deco-circle chiffre-circle circle-2 w-7/12 aspect-square rounded-full bg-amande mx-auto mb-2 md:mb-5"/>
            <div class="chiffres-wrapper text-left md:text-center top-[120%]  flex flex-col absolute text-[1.75ch] md:text-[1.5vw] font-semibold w-max">
                <span class="chiffres-animes leading-tight md:leading-auto milliards">93
                    <span>&nbsp;Milliards €</span>
                </span>
                <div class="text-[0.6ch] md:text-[0.9vw] font-light">Bureaux en France<br>
                    <span class="relative -top-[0.5vw]">(Métro. et DROM-COM)</span>
                </div>
            </div>
        </div>

        {#each { length: 2 } as _}
        <div class="block md:hidden deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}


        <div class="chiffres-circle-wrapper relative text-center leading-loose text-amande w-full self-center">
            <div class="deco-circle chiffre-circle circle-3 w-7/12 aspect-square rounded-full bg-amande mx-auto mb-2 md:mb-5"/>
            <div class="chiffres-wrapper flex flex-col absolute text-[1.75ch] md:text-[1.5vw] font-semibold w-max">
                <span class="chiffres-animes leading-tight md:leading-auto">
                    450000
                </span>
                <div class="text-[0.6ch] md:text-[0.9vw] font-light">missions d’expertise</div>
            </div>
        </div>

        {#each { length: 2 } as _}
        <div class="block md:hidden deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}


        <div class="chiffres-circle-wrapper relative text-center leading-loose text-amande w-full self-center">
            <div class="deco-circle chiffre-circle circle-4 w-7/12 aspect-square rounded-full bg-amande mx-auto mb-2 md:mb-5"/>
            <div class="chiffres-wrapper flex flex-col absolute text-[1.75ch] md:text-[1.5vw] font-semibold w-max">
                <span class="leading-tight md:leading-auto">+
                    <span class="chiffres-animes">4</span>
                    <span>&nbsp;Millards €</span>
                </span>
                <div class="text-[0.6ch] md:text-[0.9vw] font-light">de dommages expertisés</div>
            </div>
        </div>

        {#each { length: 2 } as _}
        <div class="block md:hidden deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}


        <div class="deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>

        {#each { length: 2 } as _}
        <div class="block md:hidden deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}

        {#each { length: 6 } as _}
            <div class="hidden md:block deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}

       
    </div>

    <svg class="absolute w-full scale-[2.2] -left-1/4 md:left-auto rotate-90 md:scale-100 md:rotate-0 h-[2px] -top-[15px] my-auto mx-0 bottom-0 overflow-visible" bind:this={SVG} version="1.2" baseProfile="tiny" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" overflow="visible" xml:space="preserve" viewBox="0 0 1920 2">
        
        <mask id="mask-line" maskUnits="userSpaceOnUse">
            <line id="chiffre-line-masked" fill="none" stroke="white" stroke-width="20" 
                x1="0" y1="49.25%" x2="1920" y2="49.25%"
            />
        </mask>

        <line mask="url(#mask-line)" id="chiffre-line" fill="none" stroke="#D6FC8A" stroke-miterlimit="10" stroke-dasharray="9" 
            x1="0" y1="49.25%" x2="100%" y2="49.25%"
        />
        
    </svg>
    
</section>

<style lang="postcss">
    
    .chiffres-wrapper {
        @apply items-start md:items-center top-[10%] md:top-[120%] left-[105%] md:left-1/2 md:-translate-y-1/2 md:-translate-x-1/2 h-[5vw];
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