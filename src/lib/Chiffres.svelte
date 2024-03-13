<script>
    import gsap from 'gsap';
    import { onMount } from 'svelte';
    import DrawSVGPlugin from "$lib/gsap/DrawSVGPlugin";
    import { md } from './utils';
    /* BUREAUX DOMS CENTRES 
        INTERLETTRAGE DES LABELS DES CHIFRES: 0.05ch
    */
    
    /** @type {App.Anims} */
	export let anims;
    /** @type {HTMLElement} */
    export let sectionEl;

    export let imgPath = '';

    let screenWidth = 1920;

    const timeScale = .6;

    onMount(async() => {
        gsap.registerPlugin(DrawSVGPlugin);
        screenWidth = $md ? window.innerWidth : window.innerHeight;
        gsap.set('.deco-circle, .chiffre-circle', {scale:0.5});
        
        anims =gsap.timeline({ paused:true })
        .to(".deco-circle", {
            scale:0,
            duration: 0.4 * timeScale,
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
            duration: 1 * timeScale,
            backgroundColor: '#FFFFFF',
            stagger: { each: 1 / 4 },
        },'>')

        .from("#chiffre-line-masked", {
            duration: 3 * timeScale,
            drawSVG: '0',
            ease: "Power1.inOut",
        },'<')


        .to("#chiffres-el", {
            '--secteur-opacite': 1, 
            duration: 0.5 * timeScale,
        },'<')


        .to('.chiffres-wrapper',{ 
            opacity:1, 
            duration: 0.5 * timeScale,
            stagger: { each: 0.02 }, 
        },'<')

        .from('.chiffres-animes', {
            id: 'chiffres-animes',
            textContent: 1,
            duration: 1 * timeScale,
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

        !$md && anims.to('.chiffres-circle-wrapper', 
            { xPercent: 6.5, yPercent:(i)=> [ -60, -30, 0, 30 ][i], duration: 1 * timeScale},
        'chiffresAnim' );

        anims.vars = { immediate : true };
    })

</script>

<section 
    id="section-chiffres" 
    class="min-w-screen w-full h-screen bg-feuille relative z-[3] overflow-y-hidden" 
    bind:this={sectionEl}
    style="
        --url-cercle1: url('{imgPath}/chiffres-cles/collaborateurs.png');
        --url-cercle2: url('{imgPath}/chiffres-cles/bureaux.png');
        --url-cercle3: url('{imgPath}/chiffres-cles/missions.png');
        --url-cercle4: url('{imgPath}/chiffres-cles/expertises.png');
    "
>

    <svg class="absolute w-full scale-[2.2] -left-1/4 md:left-auto rotate-90 md:scale-100 md:rotate-0 h-[2px] -top-[0px] my-auto mx-0 bottom-0 overflow-visible" 
        version="1.2" baseProfile="tiny" 
        id="chiffres_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" 
        viewBox="0 0 {screenWidth} 2" x="0px" y="0px" overflow="visible" 
    >
        
        <mask id="mask-line" maskUnits="userSpaceOnUse">
            <line id="chiffre-line-masked" fill="none" stroke="white" stroke-width="20" 
                x1="0" y1="49.25%" x2="100%" y2="49.25%"
            />
        </mask>

        <line mask="url(#mask-line)" id="chiffre-line" fill="none" stroke="#D6FC8A" stroke-miterlimit="10" stroke-dasharray="9" 
            x1="0" y1="49.25%" x2="100%" y2="49.25%"
        />
        
    </svg>

    <div
        style="--secteur-opacite: 0;"
        id="chiffres-el"
        class="
            grid absolute top-0 left-0 w-full h-screen px-10
            grid-rows-6 grid-cols-3 md:grid-rows-[unset] md:grid-cols-6 md:px-0
        " 
    >

        {#each { length: 6 } as _}
        <div class="hidden md:block deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}

        <div class="deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>

        {#each { length: 2 } as _}
        <div class="block md:hidden deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}

        <div class="chiffres-circle-wrapper relative text-center leading-loose text-amande w-full self-center">
            <div class="deco-circle chiffre-circle circle-1 w-7/12 aspect-square rounded-full bg-amande mx-auto"/>
            <div class="chiffres-wrapper opacity-0 mt-2 md:mt-8 flex flex-col absolute text-[1.75ch] md:text-[1.5vw] font-semibold w-max">
                <span class="chiffres-animes leading-tight md:leading-auto">2200</span>
                <div class="text-[0.6ch] md:text-[0.9vw] font-light">collaborateurs</div>
            </div>
        </div>

        {#each { length: 2 } as _}
        <div class="block md:hidden deco-circle self-center w-7/12 aspect-square rounded-full bg-amande mx-auto mb-[1em]"/>
        {/each}

        <div class="chiffres-circle-wrapper relative text-center leading-loose text-amande w-full self-center">
            <div class="deco-circle chiffre-circle circle-2 w-7/12 aspect-square rounded-full bg-amande mx-auto"/>
            <div class="chiffres-wrapper opacity-0 mt-2 md:mt-8 text-left md:text-center top-[120%]  flex flex-col absolute text-[1.75ch] md:text-[1.5vw] font-semibold w-max">
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
            <div class="deco-circle chiffre-circle circle-3 w-7/12 aspect-square rounded-full bg-amande mx-auto"/>
            <div class="chiffres-wrapper opacity-0 mt-2 md:mt-8 flex flex-col absolute text-[1.75ch] md:text-[1.5vw] font-semibold w-max">
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
            <div class="deco-circle chiffre-circle circle-4 w-7/12 aspect-square rounded-full bg-amande mx-auto"/>
            <div class="chiffres-wrapper opacity-0 mt-2 md:mt-8 flex flex-col absolute text-[1.75ch] md:text-[1.5vw] font-semibold w-max">
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
    
</section>

<style lang="postcss">
        
    *  {
        font-family: "field-gothic-wide",sans-serif;
    }
    
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
        background-image: var(--url-cercle4);
    }
    .circle-3:after {
        background-image: var(--url-cercle3);
    }
    .circle-2:after {
        background-image: var(--url-cercle2);
    }
    .circle-1:after {
        background-image: var(--url-cercle1);
    }

</style>