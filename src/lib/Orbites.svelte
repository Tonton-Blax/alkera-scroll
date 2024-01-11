<script>
    import { browser } from '$app/environment';
    import gsap from 'gsap';
    import MotionPathPlugin from 'gsap/dist/MotionPathPlugin.js';
    import { onMount, tick } from 'svelte';
    import ScrollTrigger from 'gsap/dist/ScrollTrigger.js';
    import DrawSVGPlugin from "$lib/gsap/DrawSVGPlugin";
    export let order = 1;

    $: if (browser && readyLine)
        gsap.to('#arrow-cursor', { ...(arrowPosition ? { y: arrowPosition, opacity: 1 } : { opacity : 0 }) });

    /** @type {SVGEllipseElement | undefined} */
    let internalOrbit;

    /** @type {SVGEllipseElement | undefined} */
    let externalOrbit;

    /** @type {SVGEllipseElement | undefined} */
    let middleOrbit;

    /** @type {SVGElement | undefined} */
    let galaxy;

    /** @type {HTMLElement | undefined} */
    let planetsEl;

    /** @type {HTMLElement} */
    let orbitsEl;

    /** @type {number | undefined} */
    let arrowPosition;

    let readyLine = false;

    const SCALE_FACTOR = 0.105;

    /** @type {undefined | App.Metier} */
    let toGroup;

    /** @type {App.Metier} */
    let fromGroup = 'initial';

    /** @type {number} */
    let intervalIdle;

    const duration = 80;

    const resizeOrbit = 50;
    const initialHeight = 988.92;
        
    /** @type {App.Planet[]} */
    const entites = [
        { url : '/', id: 'pyrim',                  orbit: 'internal',  order: 1,    groups: ['audit', 'gestion'] },
        { url : '/', id: 'dynaren',                orbit: 'internal',  order: 2,    groups: ['assistance'] },
        { url : '/', id: 'am',                     orbit: 'internal',  order: 3,    groups: ['initial','audit','gestion', 'delegation'] },
        { url : '/', id: 'immolab',                orbit: 'middle',    order: 1,    groups: ['initial','audit'] },
        { url : '/', id: 'geco',                   orbit: 'middle',    order: 2,    groups: ['delegation'] },
        { url : '/', id: 'electroren',             orbit: 'middle',    order: 3,    groups: ['assistance'] },
        { url : '/', id: 'manderley',              orbit: 'middle',    order: 4,    groups: ['gestion'] },
        { url : '/', id: 'polyexpert_construction',orbit: 'middle',    order: 5,    groups: ['initial','gestion'] },
        { url : '/', id: 'polyexpert_entreprises', orbit: 'middle',    order: 6,    groups: ['initial','gestion'] },
        { url : '/', id: 'ekkoia',                 orbit: 'external',  order: 1.65, groups: ['audit'] },
        { url : '/', id: 'claims_ai',              orbit: 'external',  order: 2.65, groups: ['delegation'] },
        { url : '/', id: 'batifive',               orbit: 'external',  order: 3.65, groups: ['assistance']  },
        { url : '/', id: 'polytel',                orbit: 'external',  order: 4.65, groups: ['gestion']  },
        { url : '/', id: 'polyexpert',             orbit: 'external',  order: 5.65, groups: ['gestion'] },    
        { url : '/', id: 'ciblexperts',            orbit: 'external',  order: 6.65, groups: ['gestion'] },
        { url : '/', id: 'quantimme',              orbit: 'external',  order: 7.65, groups: ['initial','audit'] },
    ]

    /** @type {App.Orbits} */
    const orbits = {

        'internal': {
            el: internalOrbit,
            offsetGroup : {
                audit: 0.843, gestion: 0.853, assistance: 0.285, delegation: 0.01, initial:0.00001,
            },
            minMaxSizes: [ 32.35, 51.55 ],
            planets: entites.filter(e => e.orbit === 'internal'),
            direction: { direction: 1, progress: 0 },
        },

        'middle': {
            el: middleOrbit,
            offsetGroup : { 
                audit: 0.843, gestion: 0.175, assistance: 0.55, delegation: 0.73, initial:0.00001,
            },
            minMaxSizes: [ 25.48, 60.94 ],
            planets: entites.filter(e => e.orbit === 'middle'),
            direction: { direction: 1, progress: 0 },
        },

        'external': {
            el: externalOrbit,
            offsetGroup : {
                audit: 0.843, gestion: 0.205, assistance: 0.452, delegation: 0.632, initial:0.00001,
            },
            minMaxSizes: [ 21.49, 73.75 ],
            planets:entites.filter(e => e.orbit === 'external'),
            direction: { direction: 1, progress: 0 },
        }
    }
    

    /** @param {App.Metier} metier*/
    const setGroupPosition = (metier) => {
        if (!metier || !fromGroup) return;        
        
        planetsEl?.removeEventListener("mouseenter", slowTimeScale);
        planetsEl?.removeEventListener("mouseleave", fastTimeScale);
        slowTimeScale();

        entites.forEach(entite => {
            const { tl } = entite;
            if (!tl) return;
            const orbit = orbits[entite.orbit];
            const direction = orbit.direction.direction;
            const nextProgress = tl?.labels.initialPosition + orbit.offsetGroup[metier];
            gsap.to(tl, {
                progress: `+=${gsap.utils.wrap(0, 1, nextProgress - tl.progress())}`, 
                duration: 1, ease: "power2.Out",
                onComplete: () => tl.labels[metier] && tl.addLabel(metier, tl.progress())
            })

        })
    }

    if (browser)
        gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin, ScrollTrigger);

    onMount(async() => {

        const tl = gsap.timeline({
            scrollTrigger:  {
                // @ts-ignore
                refreshPriority: order,
                anticipatePin: 1,
                onScrubComplete: () => {
                    if (!intervalIdle)
                    intervalIdle = setInterval(() => changeGroup('audit'), 3000)
                },
                trigger: '#section-orbits',
                scrub: 1,
                start: (/** @type {{ previous: () => any; }} */ self) => {
                    return self.previous().end + (orbitsEl?.offsetHeight);
                },
                end: '+=300%',
                pin: '#sections-wrapper',
            }
        })
        .fromTo('#big-mask-orbits', { skewX: "16.34deg", x: "-50vw" }, { x: "-100vw", delay: 0.2 })
        .to('#big-mask-orbits', { autoAlpha: 0, duration:0.2 }, '>')
       
        
        
        readyLine = true;
        [internalOrbit, externalOrbit, middleOrbit].forEach(orbit => MotionPathPlugin.convertToPath(orbit))


        arrowPosition = 89
        gsap.timeline()
        .from('.ellipse', {drawSVG:'25% 25%', duration:1, ease:"none", reversed: false, stagger : { each: 0.25, from: 'random'} },0)
        .to("#orbit-dash-line", {
            duration: 1,
            drawSVG: '100% 100%',
            reversed: true,
            ease: "Power1.inOut",
        },0)
        .from('.planets > div', {
            duration: 0.5,
            opacity: 0,
            stagger:{ each: 0.05, from: 'random' },
            // yPercent: 100,
            // xPercent: 21.2,
        },0.5)
        .to('text > tspan', { opacity: 1, duration: .12, ease: "power2.inOut"}, 0)
        
  
        let resizeObserver = new ResizeObserver(() => { 
            initialize();
        }); 

        function initialize () {
            entites.forEach(async (entite, i) => {
                const initialProgress = entite.order / orbits[entite.orbit].planets.length;
                entite.tl?.kill();
                //await tick();
                entite.tl = gsap.timeline({ defaults: { ease: "none" }, repeat: -1, paused:false });
                entite.tl.data = { initialProgress }
                entite.tl.to(`.entite-${entite.id}`, {
                    duration,
                    motionPath: {
                        path: `#${entite.orbit}`, align: `#${entite.orbit}`,
                        alignOrigin: [0.5, 0.5],
                        start: 0.24, end: 1.24,
                        fromCurrent: false
                    }
                })
                .fromTo(`.entite-${entite.id}`, {scale:1}, {
                        scale: () => 1 / ( orbits[entite.orbit].minMaxSizes[1] / orbits[entite.orbit].minMaxSizes[0] ),
                        duration: duration / 2,
                        repeat: 1, yoyo: true,
                        ease: 'sine.inOut',
                    }, 0 )
                .addLabel('initialPosition', initialProgress)
                .progress(initialProgress)
            });

        }
  
        initialize();

        resizeObserver.observe(document.body); 

        planetsEl?.addEventListener("mouseenter", slowTimeScale);
        planetsEl?.addEventListener("mouseleave", fastTimeScale);
    });

    function slowTimeScale () {
        entites.forEach(({tl}) => tl && gsap.fromTo(tl, {timeScale : 1 }, {timeScale: 0.20 , ease: "Power3.circInOut", duration: 1 }));
    }
    function fastTimeScale () {
        entites.forEach(({tl}) => tl && gsap.fromTo(tl, {timeScale : .20 }, {timeScale: 1 , ease: "Power3.circInOut", duration: 1 }));
    }

    /** @param {App.Metier} metier*/
    function changeGroup (metier) {
        clearInterval(intervalIdle);
        // @ts-ignore
        arrowPosition = document.querySelector(`#groupe-${metier}`).dataset.yArrow || 89;
        fromGroup = toGroup || 'initial';
        toGroup = metier;
        setGroupPosition(toGroup);
    }
</script>


<section id="section-orbits" class="w-screen bg-amande aspect-video overflow-hidden" bind:this={orbitsEl}>
    
    <div id="big-mask-orbits" class="bg-amande w-full aspect-video absolute z-[2] flex items-center leading-loose text-[1vw]">
        <div class="w-2/6 ml-auto mr-[10.7vw] font-light skew-x-[-16.34deg]">
            En tant acteur multi-spécialiste de la gestion des risques, notre mission est d’apporter des solutions d’indemnisation sur l’ensemble de la chaîne de sinistres. Grâce à nos 17 entités de spécialité, nous construisons pour nos clients des solutions sur-mesure en fonction de leur stratégie et de leurs besoins.
        </div>
    </div>

    <div id="noyau" class="absolute z-[3] translate-x-[43.3vw] rounded-full translate-y-[17.9vw] h-[10vw] w-[10vw] bg-feuille bg-[url('/orbits/alkera.png')] bg-contain"></div>
    
    <div class="planets" bind:this={planetsEl}>
        {#each entites as entite, index(entite.id)}

        <div
            class="
                absolute entite-{entite.id} entite-circle bg-feuille rounded-full bg-center bg-cover aspect-square transition-[background-color]
                {toGroup && entite.groups.includes(toGroup) ? 'activeGroup':'inactiveGroup'}
                " 
            style="
                width:{orbits[entite.orbit].minMaxSizes[1] * SCALE_FACTOR}%; 
                background-image:url({`/orbits/${entite.id}.png`});
            "
            data-orbit={entite.orbit}
        />

        {/each}
    </div>

    <div class="big-mask" ></div>

<svg bind:this={galaxy} 
    color-interpolation-filters="sRGB"
    class="h-full w-auto mx-auto overflow-visible" 
    xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="Calque_1" x="0" y="0" version="1.1" viewBox="0 0 1360.5 {initialHeight+(resizeOrbit * 2)}"
>

    <g id="arrow-cursor" x="0" y="0" transform="translate(-125 89)" opacity="0" >
        <line fill="none" stroke="#6563CA" stroke-width="3" stroke-miterlimit="10" x1="0" y1="4.49" x2="11.66" y2="4.49"/>
        <polygon fill="#6563CA" points="10.34,8.98 18.12,4.49 10.34,0"/>
    </g>

    <!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-mouse-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
    <text transform="translate(-100 100)" 

        on:mouseover={(e) => {
            if (!e.target?.dataset?.yArrow || !!toGroup)
                return;
            arrowPosition = e.target?.dataset?.yArrow
        }} 
        
    >
        <tspan on:click={()=>changeGroup("audit")} opacity="0" x="0" y="0" id="groupe-audit" data-y-arrow="89" fill="#12473B" class:fill-pervenche={toGroup === 'audit'} class="hover:fill-pervenche hover:cursor-pointer transition-all" font-family="field-gothic-wide" font-size="21px">Audit, conseil et prévention</tspan>
        <tspan on:click={()=>changeGroup("gestion")} opacity="0" x="0" y="31.5" id="groupe-gestion" data-y-arrow="121" fill="#12473B" class:fill-pervenche={toGroup === 'gestion'} class="hover:fill-pervenche hover:cursor-pointer transition-all" font-family="field-gothic-wide" font-size="21px">Gestion des risques et expertise</tspan>
        <tspan on:click={()=>changeGroup("assistance")} opacity="0" x="0" y="63" id="groupe-assistance" data-y-arrow="152" fill="#12473B" class:fill-pervenche={toGroup === 'assistance'} class="hover:fill-pervenche hover:cursor-pointer transition-all" font-family="field-gothic-wide" font-size="21px">Assistance et réparation</tspan>
        <tspan on:click={()=>changeGroup("delegation")} opacity="0" x="0" y="94.5" id="groupe-delegation" data-y-arrow="183" fill="#12473B" class:fill-pervenche={toGroup === 'delegation'} class="hover:fill-pervenche hover:cursor-pointer transition-all" font-family="field-gothic-wide" font-size="21px">Délégation</tspan>

    </text>
    
    <ellipse bind:this={internalOrbit} id="internal" class="ellipse" cx="659.02" cy="{406.32 + resizeOrbit}" fill="none" stroke="#12473B" stroke-miterlimit="10" rx="310.39" ry="147.85" transform="rotate(-16.342 659.08 406.403)"/>
    <ellipse bind:this={middleOrbit} id="middle" class="ellipse" cx="667.44" cy="{435.04 + resizeOrbit}" fill="none" stroke="#12473B" stroke-miterlimit="10" rx="493.5" ry="237.51" transform="rotate(-16.342 667.5 435.124)"/>
    <ellipse bind:this={externalOrbit} id="external" class="ellipse" cx="680.25" cy="{478.73 + resizeOrbit}" fill="none" stroke="#12473B" stroke-miterlimit="10" rx="701.55" ry="332.01" transform="rotate(-16.342 680.308 478.821)"/>

    <path id="orbit-dash-line-reveal" fill="none" stroke="#12473B" stroke-dasharray="8.1" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width=".675" 
        d="m521.57.34 318.71 1086.08"
    />

  </svg>      
</section>


<style lang="postcss">
    
.box {
    overflow: visible;
}

.entite {
    transition: all 2s;
    transition: all 1300ms ease;
    outline-offset: 0px;
    outline: 2px dashed transparent;
}

.entite-circle:before {
    transform:scale(0.5);
    position: absolute;
    width: 100%;
    height: 100%;
    top:0%;
    left:0%;
    content:"";    
    opacity: 0;
    border-radius:100%;
    transition: scale 0.5s var(--spring-easing);
    scale:0.5;
}
.entite-circle:hover:before {
    outline-offset: 0.4vw;
    animation: rotation 20s linear infinite;
    scale:1;
    cursor: pointer;
    opacity: 1;
}

.entite-circle.activeGroup:hover:before {
    outline: 1px dashed theme('colors.pervenche');
}
.entite-circle.inactiveGroup:hover:before {
    outline: 1px dashed theme('colors.feuille');
}

.activeGroup {
    background-color: theme('colors.pervenche');
    transition:background-color 2s ease;
}
.entite-circle.activeGroup:hover:before {
    outline-color: theme('colors.pervenche');
}

@keyframes rotation {
    from { transform: rotate(0deg); }
    to { transform: rotate(359.9deg); }
}

/* #section-orbits {
    background: url(orbits/maquette-full.svg) no-repeat;
    background-size: 114%;
    background-position: 43% -63%;
}
svg {
    filter:grayscale(100%);
    mix-blend-mode: difference;
} */
</style>