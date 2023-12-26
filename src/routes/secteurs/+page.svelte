<script>
    import { browser } from '$app/environment';
    import gsap from 'gsap';
    import MotionPathPlugin from 'gsap/dist/MotionPathPlugin.js';
    import { onMount, tick } from 'svelte';
    import DrawSVGPlugin from "$lib/gsap/DrawSVGPlugin";
    import ScrollTrigger from 'gsap/dist/ScrollTrigger.js';
    import { fly } from 'svelte/transition';

    let SVG;

    /** @type {string | undefined} */
    let hoveredGroup;

    if (browser)
        gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin,ScrollTrigger);

    const secteurs = [
        { id: 'group1', secteurs : [ 'Audit', 'Gestion des risques', 'Expertise' ], indexes : [ 0, 1, 2 ], xy: [ [331.03, 338.55], [537.08, 338.55], [743.06, 338.55]] },
        { id: 'group2', secteurs : [ 'Quatre', 'Cinq', 'Six' ], indexes : [ 3, 4, 5 ], xy: [ [331.09, 544.53], [537.08, 544.53], [743.06, 544.53]] },
        { id: 'group3', secteurs : [ 'Sept', 'Huit', 'Neuf' ], indexes : [ 6, 7, 8 ], xy: [ [331.09, 750.52], [537.08, 750.52], [743.06, 750.52]] },
    ]

    onMount(async() => {
        gsap.timeline({ scrollTrigger: {
            trigger: '#section-secteurs',
            scrub: 2,
            start: 'top top',
            end: '+=200%',
            pin: true
        }})
        .from('.mask-content-2', {drawSVG: '0%', duration: 30 } )
        .from('.mask-content-1', {drawSVG: '100% 100%', duration: 30 } )
        .from('.secteur-circle', {r:0, duration: 60, stagger: { each: 60/9, from: 0 }}, 6 )
        .to('.bloc-text-contenu', { yPercent: -90, duration: 500, startAt: { yPercent: 55 } }, 0 )
        await tick();
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


<section id="section-secteurs" class="w-screen bg-amande relative">

    <div id="bloc-text" class="absolute flex">
        <span class="bloc-text-contenu overflow-scroll h-fit max-h-fit min-h-fit">
        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures.
        </span>
    </div>

    <svg bind:this={SVG} 
        color-interpolation-filters="sRGB"
        shape-rendering="optimizeSpeed"
        text-rendering="optimizeSpeed"
        class="w-full h-auto mx-auto overflow-visible" 
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1920 1050"
    >

    <mask id="mask-part-1" class="mask-part" maskUnits="userSpaceOnUse">
        <path class="mask-content-2" fill="none" stroke="white" d="M335.7,343.15h452.29 c55.61,0,100.69,45.08,100.69,100.69v0c0,55.61-45.08,100.69-100.69,100.69H288.21"/>        
    </mask>
    <mask id="mask-part-2" class="mask-part" maskUnits="userSpaceOnUse">
        <path class="mask-content-1" fill="none" stroke="white" d="M732.25,745.91H288.21 c-55.61,0-100.69-45.08-100.69-100.69v0c0-55.61,45.08-100.69,100.69-100.69"/>
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
            <circle 
                data-secteur={secteur.id}
                class="secteur-circle" fill="#12473B"
                cx="{secteur.xy[j][0]}" cy="{secteur.xy[j][1]}"
                r="65.53"
            />
            {#if hoveredGroup && hoveredGroup === secteur.id}
            <text in:fly={{duration: 650, y: "10%", delay: j*120}}
                text-anchor="middle" class="fill-feuille"
                x="{secteur.xy[j][0]}" y="{secteur.xy[j][1]+100}"
            >
                {secteur.secteurs[j]}
            </text>
            {/if}
        {/each}
        {/each}
    
    </svg>

</section>

<style lang="postcss">
       
    .secteur-hover {
        opacity: 0;
        transform-origin: 50% 50%;
        transform-box: content-box;
        animation: rotating 7s linear infinite;
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

    #bloc-text {
        width:35%;
        height:55%;
        right:10%;
        font-size:1.7vw;
        overflow:hidden;
        top:22.5%;
        font-weight:300;
        line-height:2;
        /* mask-image: linear-gradient(to bottom, black 50%, transparent 100%); */
    }
    #bloc-text:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        background-image: linear-gradient( #DBFF94FF 0%, #DBFF9400 20% );
    }
    
    #bloc-text:after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-image: linear-gradient( #DBFF9400 80%, #DBFF94FF 100% );
    }
    

</style>