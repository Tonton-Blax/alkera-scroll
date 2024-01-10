<script>
	import { fly } from 'svelte/transition';
    import { browser } from '$app/environment';
    import gsap from 'gsap';
    import MotionPathPlugin from 'gsap/dist/MotionPathPlugin.js';
    import { onMount, tick } from 'svelte';
    import DrawSVGPlugin from "$lib/gsap/DrawSVGPlugin";
    import ScrollTrigger from 'gsap/dist/ScrollTrigger.js';
    import { RoughEase } from "gsap/EasePack";

    export let order = 3;

    let SVG;
    let baseDuration = 0.1;
    /** @type {string | undefined} */
    let hoveredGroup;

    const secteurs = [
        {   id: 'group1', 
            secteurs : [ 'Audit', 'Conseil', 'Prévention' ], 
            indexes : [ 0, 1, 2 ], 
            xy: [ [331.03, 338.55], [537.08, 338.55], [743.06, 338.55]], 
            imagePrefix: 'audit-conseil-gestion-' 
        },
        {   id: 'group2', 
            secteurs : [ 'Gestion des risaues', 'Expertise' ], 
            indexes : [ 3, 4 ], 
            xy: [ [331.09, 544.53], [537.08, 544.53]], 
            imagePrefix: 'gestion-risque-expertise-' 
        },
        {   id: 'group3', 
            secteurs : [ 'Assistance', 'Reparation' ], 
            indexes : [ 5,6 ], 
            xy: [ [743.06, 544.53], [331.09, 750.52] ], 
            imagePrefix: 'assistance-reparation-' 
        },
        {   id: 'group4', 
            secteurs : [ 'Délégation' ], 
            indexes : [ 7 ], 
            xy: [ [537.08, 750.52] ], 
            imagePrefix: 'delegation-'  
        },
        {   id: 'group5', 
            secteurs : [ 'Implantation' ], 
            indexes : [ 8 ], 
            xy: [ [743.06, 750.52] ], 
            imagePrefix: 'international-'  
        },
    ]

    if (browser)
        gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin,ScrollTrigger, RoughEase);

    onMount(async() => {
        const el = document.querySelector('#section-intro');
        gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
                // @ts-ignore
                refreshPriority: order,
                trigger: '#section-intro',
                scrub: 5,
                pin: '#section-intro',
                start: 'center center',
                end: '+=300%'
            }
        })
        .to('#scroll-down', { opacity: 0, duration: baseDuration * 0.5 },0)
        .to('#transition-intro', {scale:60, duration:baseDuration * 1.5, ease:'circ.in'},0)
        .from('#le-cercle-1, #le-cercle-2, #la-ligne-1, #la-ligne-2', { scale:0, duration: baseDuration, ease:'none', stagger: {each: 0.01 }},0)
        .to('#le-point', { scale:2, duration: baseDuration * 2 },0)
        .to('#la-ligne-1', { rotate: -360, duration: baseDuration * 1.5, ease:'steps(25)'},0)
        .to('#la-ligne-2', { rotate: 720, duration: baseDuration * 1.5, ease:'none'},0)
        .to('#le-cercle-1', { rotate:-360, duration: baseDuration, ease:'none'},0)
        .to('#le-cercle-2', { rotate:360, duration: baseDuration, ease:'none'},0)
        .to('#intro-part-2', { autoAlpha: 1 , duration: baseDuration * 0.2, ease:'none'},0.128)
        .fromTo('.bloc-text-contenu', { yPercent: 100 }, { yPercent: 5, duration: baseDuration * 0.5 }, 0.128 )
        .from('.mask-outline-secteur-2', {drawSVG: '0%', duration: baseDuration * 0.25 }, 0.128 )
        .from('.mask-outline-secteur-1', {drawSVG: '100% 100%', duration: baseDuration * 0.25 }, '>' )
        .from('.secteur-circle', { attr: {transform: "scale(0)"}, duration: baseDuration * 0.50, stagger: { each: (baseDuration * 0.50 )/9, from: 0 }}, 0.12 )
        .from('.secteur-circle', {opacity: 1, duration: baseDuration * 1.5 }, '>' )
        //await tick();
        document.querySelectorAll('.secteur-circle')?.forEach(el => {
            el.addEventListener('mouseenter', (evt) => {
                hoveredGroup = el.dataset.secteur;
                gsap.to(`.secteur-hover[data-secteur='${el.dataset.secteur}']`,{
                    opacity: 1,
                    r:75,
                    ease: "Bounce.easeOut",
                })
            })
            el.addEventListener('mouseleave', (evt) => {
                hoveredGroup = undefined;
                // @ts-ignore
                gsap.to(`.secteur-hover[data-secteur='${el.dataset.secteur}']`,{
                    opacity: 0,
                    r:60,
                    stagger: { each: 0.1 },
                })
            })
        })
    })
</script>


<section id="section-intro" class="w-screen h-screen bg-feuille relative overflow-clip flex">

    <div class="w-1/3 h-full"/>
    <div class="w-1/3 h-full flex flex-col justify-center">
        <svg bind:this={SVG} 
            id="logo-alkera-et-texte"
            class="w-full h-auto overflow-visible" 
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="300px" y="300px" viewBox="0 10 300 300"
        >
        
        <g id="logo-alkera" class="fill-amande">
            <path d="M58.6 122.9c-1.7 0-3.4.6-5 2.4L1.2 187.9c-2 2.4-1.7 6 .7 8.1 1 .9 2.3 1.4 3.7 1.4 1.5 0 3.4-.9 4.5-2.1l42.5-50.8v25.3H38.4c-3.1 0-5.7 2.5-5.7 5.6 0 3.1 2.4 5.6 5.5 5.7h14.2v10.1c0 3.4 2.7 6.1 6.1 6.1h6.1V129c0-1.2-.4-2.4-1-3.4-1.1-1.6-3-2.7-5-2.7m213.6 19.7h-5.7v6.4c-4.7-4.2-10.8-6.6-17.2-6.5-14.9 0-26.2 12.1-26.2 27.5s11.3 27.5 26.2 27.5c6.3 0 12.4-2.2 17.2-6.4v.6c0 1.6.7 3.2 1.9 4.2.1.1.1.1.2.1 1 .8 2.3 1.3 3.6 1.3h5.7v-49.1c0-3.1-2.5-5.6-5.7-5.6m-5.7 27.4c0 9.6-7 16.9-16 16.9s-16-7.3-16-16.9c0-9.6 7-16.9 16-16.9 8.7 0 15.6 6.9 16 16.1v.8zM85.1 183.7v-55c0-3.1-2.5-5.7-5.7-5.7h-5.7v66.7c0 4.2 3.4 7.7 7.7 7.7s7.7-3.4 7.7-7.7l-2.3-2.2c-1.1-1-1.7-2.4-1.7-3.8m14.8-60.8h-5.7v68.7c0 3.1 2.5 5.7 5.7 5.7h5.7v-68.7c0-3.1-2.6-5.7-5.7-5.7m43.1 19.7h-11.2c-1.7 0-3.3.7-4.3 2l-21.2 25.1 21.6 25.5c1.1 1.3 2.7 2 4.3 2h12.3L120.7 169l22.3-26.4z" class="st1"/>
            <path d="M166.2 186.9c-8.8 0-16-7.6-16-16.9 0-9.3 7.1-16.9 16-16.9 2.4 0 4.8.6 6.9 1.7l-14.2 16.8c-1.8 2.2-1.6 5.5.6 7.3 2.2 1.8 5.5 1.6 7.3-.6l21.1-24.9c-5-6.4-13.1-10.9-21.8-10.9-15.1 0-27.5 12.3-27.4 27.5 0 15.1 12.3 27.5 27.5 27.4 11.4 0 21.7-7.1 25.7-17.8h-12.6c-2.9 4.4-7.7 7.3-13.1 7.3m58.6-39.1c0-2.9-2.4-5.3-5.3-5.3-12.4 0-23.3 9.1-23.3 21.5v27.8c0 3.1 2.5 5.5 5.5 5.5h5.5v-32.8c0-6.3 5.9-11.5 12.2-11.5 3 .1 5.4-2.3 5.4-5.2" class="st1"/>
        </g>

        </svg>

        <div id="transition-intro" class="absolute translate-x-[32.5vw] -translate-y-[5.9vw] border-[1px] flex justify-center items-center w-fit h-fit">
                <div id="le-point" class="rounded-full absolute w-[1.7vw] h-[1.7vw] bg-amande z-[2]" />
                <div id="le-cercle-1" class="cercle-intro rounded-full absolute w-[10vw] h-[10vw] border-white border-dashed border-[0.65px]" />
                <div id="le-cercle-2" class="cercle-intro rounded-full absolute w-[17vw] h-[17vw] border-amande border-dashed border-[0.65px]" />
                <div id="la-ligne-1" class="rounded-full absolute h-[16.9vw] w-[1px] border-amande border-dotted border-l-[0.25px]" />
                <div id="la-ligne-2" class="rounded-full absolute h-[20vw] w-[1px] border-white border-dashed border-l-[0.25px]" />
        </div>
            

        <div class="text-amande z-[0] text-center overflow-visible relative -top-[10vw] w-[150%] self-center">
            <p class="text-[4vw] font-thin whitespace-nowrap">
                L'imprévu s'arrête là
            </p>
            <p class="text-[1.3vw] font-light px-[20%] mt-[2vw]">
                Le Groupe Alkera accompagne assureurs, courtiers et entreprises dans la gestion globale des risques et des sinistres.
            </p>
        </div>
        <svg
            class="w-[2vw] h-auto mx-auto mt-[2vw]" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" 
            id="scroll-down" x="0" y="0" version="1.1" viewBox="0 0 54 79.4"
        >
            <path stroke-width=1 stroke-miterlimit=10 fill="none" stroke="#D6FC8A" d="M27 78.9C12.4 78.9.5 67 .5 52.4V27C.5 12.4 12.4.5 27 .5S53.5 12.3 53.5 27v25.4C53.5 67 41.6 78.9 27 78.9zM27 20v27.2"/>
            <path d="M18.6 44.7 27 59.2l8.4-14.5z" fill="#D6FC8A"/>
        </svg>
    </div>
    <div class="w-1/3 h-full"/>



    <div id="intro-part-2" class="z-[12] absolute w-full h-full opacity-0 flex">

        <div id="bloc-text" class="absolute max-h-fit h-fit self-center my-auto overflow-hidden font-light right-[10%] text-[1.5vw] flex w-[35%] leading-[3vw]">
            <span class="bloc-text-contenu self-center">
                <br>&nbsp;
                <br>
                Depuis plus de 25 ans, le Groupe Alkera développe une expertise complète et reconnue sur l’ensemble de la chaîne du sinistre en France et l’international. Du diagnostic technique jusqu’à la réparation en passant par l’expertise de sinistres, nous proposons une offre complète avant, pendant et après sinistre.
                <br>&nbsp;
                <br>&nbsp;
            </span>
        </div>
    
        <svg bind:this={SVG} 
            color-interpolation-filters="sRGB"
            class="w-full h-auto mx-auto overflow-visible" 
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1920 1050"
        >
    
        <mask id="mask-part-1" class="mask-part" maskUnits="userSpaceOnUse">
            <path class="mask-outline-secteur-2" fill="none" stroke="white" d="M335.7,343.15h452.29 c55.61,0,100.69,45.08,100.69,100.69v0c0,55.61-45.08,100.69-100.69,100.69H288.21"/>        
        </mask>
        <mask id="mask-part-2" class="mask-part" maskUnits="userSpaceOnUse">
            <path class="mask-outline-secteur-1" fill="none" stroke="white" d="M732.25,745.91H288.21 c-55.61,0-100.69-45.08-100.69-100.69v0c0-55.61,45.08-100.69,100.69-100.69"/>
        </mask>
            <path class="path-part part-1" mask="url(#mask-part-1)" fill="none" stroke="#12473B" stroke-linecap="round" stroke-miterlimit="10" stroke-dasharray="9" d="M335.7,343.15h452.29 c55.61,0,100.69,45.08,100.69,100.69v0c0,55.61-45.08,100.69-100.69,100.69H288.21"/>
            <path class="path-part part-2" mask="url(#mask-part-2)" fill="none" stroke="#12473B" stroke-linecap="round" stroke-miterlimit="10" stroke-dasharray="9" d="M732.25,745.91H288.21 c-55.61,0-100.69-45.08-100.69-100.69v0c0-55.61,45.08-100.69,100.69-100.69"/>
    
            
            {#each secteurs as secteur, i}
            {#each secteur.indexes as index, j}
                <circle 
                    id="secteur-hover-{index}" 
                    class="secteur-hover" 
                    data-secteur={secteur.id}
                    stroke="#12473B" fill="none" stroke-dasharray="4" 
                    cx="{secteur.xy[j][0]}" 
                    cy="{secteur.xy[j][1]}" 
                    r="60"
                />
                
                <filter id="secteur-image-{index}{j}" x="0%" y="0%" width="100%" height="100%">
                    <feImage xlink:href="intro/{secteur.imagePrefix}0{j+1}.png"/>
                    <feComposite in2="SourceGraphic" operator="over" />
                </filter>
                assistance-reparation-01.png

                <circle 
                    data-secteur={secteur.id}
                    class="secteur-circle"
                    cx="{secteur.xy[j][0]}" cy="{secteur.xy[j][1]}"
                    r="65.53"
                    fill="#12473B"
                    filter="url(#secteur-image-{index}{j})"
                    transform="scale(1)"
                    transform-origin="{secteur.xy[j][0]} {secteur.xy[j][1]}"
                />
                {#if hoveredGroup && hoveredGroup === secteur.id}
                <text in:fly={{duration: 650, y: "1vw", delay: j*120}}
                    text-anchor="middle" class="fill-feuille"
                    x="{secteur.xy[j][0]}" y="{secteur.xy[j][1]+100}"
                >
                    {secteur.secteurs[j]}
                </text>
                {/if}
            {/each}
            {/each}
        
        </svg>
    
    </div>

</section>


<style lang="postcss">
/*    
    #la-ligne-1, #la-ligne-2, #le-cercle-1, #le-cercle-2  {
        will-change:transform;
    }
*/
    #scroll-down {
        animation: bounce 2s infinite;
    }
     @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-30px);
        }
        60% {
            transform: translateY(-15px);
        }
    }
       
    .secteur-hover {
        opacity: 0;
        transform-origin: 50% 50%;
        transform-box: content-box;
        animation: rotating 16s linear infinite;
    }
    @keyframes rotating {
        from {
            rotate: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    circle {
        cursor: pointer;
    }

  
    /* #bloc-text:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        background-image: linear-gradient( #D6FC8AFF 0%, #D6FC8A00 20% );
    } */
    
    #bloc-text:after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        background-image: linear-gradient( #D6FC8A00 80%, #D6FC8AFF 100% );
    }

    .bloc-text-contenu::-webkit-scrollbar {
        display: none;
    }
    .bloc-text-contenu {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    

  
</style>