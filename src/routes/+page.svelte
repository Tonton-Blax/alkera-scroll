<script>
    import { browser } from '$app/environment';
    import gsap from 'gsap';
    import MotionPathPlugin from 'gsap/dist/MotionPathPlugin.js';
    import { onMount, tick } from 'svelte';
    import DrawSVGPlugin from "$lib/gsap/DrawSVGPlugin";
    import { getDirection } from '$lib/utils'

    $: if (browser && readyLine)
        gsap.to('#arrow-cursor', { ...(arrowPosition ? { y: arrowPosition, opacity: 1 } : { opacity : 0 }) });

    $: if (browser && toGroup)
        setGroupPosition(toGroup);

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

    /** @type {number | undefined} */
    let arrowPosition;

    let readyLine = false;

    const SCALE_FACTOR = 0.115;

    /** @type {undefined | App.Metier} */
    let toGroup;

    /** @type {App.Metier} */
    let fromGroup = 'initial'

    const duration = 80;
    
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

        internal: {
            el: internalOrbit,
            offsetGroup : {
                audit: 0.843, gestion: 0.853, assistance: 0.285, delegation: 0.01, initial:0.00001,
            },
            minMaxSizes: [ 32.35, 51.55 ],
            planets: entites.filter(e => e.orbit === 'internal'),
            direction: { direction: 1, progress: 0 },
        },

        middle: {
            el: middleOrbit,
            offsetGroup : { 
                audit: 0.843, gestion: 0.175, assistance: 0.55, delegation: 0.73, initial:0.00001,
            },
            minMaxSizes: [ 25.48, 60.94 ],
            planets: entites.filter(e => e.orbit === 'middle'),
            direction: { direction: 1, progress: 0 },
        },

        external: {
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

        Object.keys(orbits).forEach(orbitName => {
            const orbit = orbits[/** @type {keyof App.Orbits} */ (orbitName)];

            const fromPoints = orbit.planets
            .map(planet => Number(planet.tl?.labels.initialPosition) + orbit.offsetGroup[/** @type {keyof App.Metier} */ (fromGroup)]);

            const toPoints = orbit.planets
            .map(planet => (planet.tl?.labels.initialPosition || 0) + orbit.offsetGroup[metier]);
            
            orbit.direction = getDirection(fromPoints, toPoints);
        });

        entites.forEach(entite => {
            const { tl } = entite;
            if (!tl) return;
            const direction = orbits[entite.orbit].direction; 
            gsap.to(tl, {
                progress: ( tl.labels.lastPosition || tl.progress()) + direction.progress, 
                duration: 1, ease: "power2.Out",
                onComplete: () => tl.addLabel("lastPosition", tl.progress())
            })

        })
    }

    if (browser)
        gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin);

    onMount(async() => {
        
        readyLine = true;
        [internalOrbit, externalOrbit, middleOrbit].forEach(orbit => MotionPathPlugin.convertToPath(orbit))

        arrowPosition = 89
        gsap.timeline()
        .to('#orbit-mask', {
            duration: 1,
            autoAlpha: 0,
            // yPercent: 100,
            // xPercent: 21.2,
        })
        .to('text > tspan', { opacity: 1, duration: .12, ease: "power2.inOut"}, 0)
        
  
        let resizeObserver = new ResizeObserver(() => { 
            initialize();
        }); 

        function initialize () {
            entites.forEach(async (entite, i) => {
                const initialProgress = entite.order / orbits[entite.orbit].planets.length;
                entite.tl?.kill();
                await tick();
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
        fromGroup = toGroup || 'initial';
        toGroup = metier;
    }
</script>


<section id="section-orbits" class="w-screen h-screen bg-amande">

    <div class="planets" bind:this={planetsEl}>
        {#each entites as entite, index(entite.id)}

        <div
            class="absolute entite-{entite.id} entite-circle bg-feuille rounded-full bg-center bg-cover aspect-square transition-[background-color]" 
            style="
                width:{orbits[entite.orbit].minMaxSizes[1] * SCALE_FACTOR}%; 
                background-image:url({`/orbits/${entite.id}.png`});
            "
            class:activeGroup={toGroup && entite.groups.includes(toGroup)}
            data-orbit={entite.orbit}
        />

        {/each}
    </div>

<svg bind:this={galaxy} 
    color-interpolation-filters="sRGB"
    shape-rendering="optimizeSpeed"
    text-rendering="optimizeSpeed"
    class="w-4/5 h-auto mx-auto overflow-visible" 
    xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="Calque_1" x="0" y="0" version="1.1" viewBox="0 0 1360.5 988.92"
>

    <g id="arrow-cursor" x="0" y="0" transform="translate(-125 89)" opacity="0" >
        <line fill="none" stroke="#6563CA" stroke-width="3" stroke-miterlimit="10" x1="0" y1="4.49" x2="11.66" y2="4.49"/>
        <polygon fill="#6563CA" points="10.34,8.98 18.12,4.49 10.34,0"/>
    </g>

    <!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-mouse-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
    <text transform="translate(-100 100)" 

        on:mouseover={(e) => {
            if (!e.target?.dataset?.yArrow)
                return;
            arrowPosition = e.target?.dataset?.yArrow
        }} 
        on:mouseout={() => 
            arrowPosition = undefined 
        }
    >
        <tspan on:click={()=>changeGroup("audit")} opacity="0" x="0" y="0" data-y-arrow="89" fill="#12473B" class="hover:fill-pervenche hover:cursor-pointer transition-all" font-family="field-gothic-wide" font-size="21px">Audit, conseil et prévention</tspan>
        <tspan on:click={()=>changeGroup("gestion")} opacity="0" x="0" y="31.5" data-y-arrow="121" fill="#12473B" class="hover:fill-pervenche hover:cursor-pointer transition-all" font-family="field-gothic-wide" font-size="21px">Gestion des risques et expertise</tspan>
        <tspan on:click={()=>changeGroup("assistance")} opacity="0" x="0" y="63" data-y-arrow="152" fill="#12473B" class="hover:fill-pervenche hover:cursor-pointer transition-all" font-family="field-gothic-wide" font-size="21px">Assistance et réparation</tspan>
        <tspan on:click={()=>changeGroup("delegation")} opacity="0" x="0" y="94.5" data-y-arrow="183" fill="#12473B" class="hover:fill-pervenche hover:cursor-pointer transition-all" font-family="field-gothic-wide" font-size="21px">Délégation</tspan>

    </text>
    
    <ellipse bind:this={internalOrbit} id="internal" cx="659.02" cy="406.32" fill="none" stroke="#12473B" stroke-miterlimit="10" rx="310.39" ry="147.85" transform="rotate(-16.342 659.08 406.403)"/>
    <ellipse bind:this={middleOrbit} id="middle" cx="667.44" cy="435.04" fill="none" stroke="#12473B" stroke-miterlimit="10" rx="493.5" ry="237.51" transform="rotate(-16.342 667.5 435.124)"/>
    <ellipse bind:this={externalOrbit} id="external" cx="680.25" cy="478.73" fill="none" stroke="#12473B" stroke-miterlimit="10" rx="701.55" ry="332.01" transform="rotate(-16.342 680.308 478.821)"/>

    <!-- <g fill="#12473B">

       
    </g> -->

    <g id="orbit-mask" transform="skewX(16.35)">
        <rect x="-60.28%" y="0"  width="100%" height="100%" class="fill-amande"/>
    </g>

    <path id="orbit-dash-line" fill="none" stroke="#12473B" stroke-dasharray="8.1" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width=".675" d="m540.57.34 289.74 988.25"/>

    <filter id="logo-alkera" x="0%" y="0%" width="100%" height="100%">
        <feImage xlink:href="/orbits/alkera.svg"/>
        <feComposite in2="SourceGraphic" operator="over" />
    </filter>

    <circle filter="url(#logo-alkera)" cx="653.65" cy="393.04" r="90.81" fill="#12473B"/>


  </svg>      
</section>

<style lang="postcss">
.entite-circle, svg * {
    shape-rendering: optimizeSpeed;
    text-rendering: optimizeSpeed;
    image-rendering: optimizeSpeed;
}
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
    border-radius:100%;
    outline-color:transparent;
    opacity: 0;
    transition: scale 0.5s var(--spring-easing);
    scale:0.5;
}

.entite-circle:hover:before {
    outline-offset: 8px;
    outline: 1px dashed theme('colors.feuille');
    animation: rotation 20s linear infinite;
    scale:1;
    cursor: pointer;
    opacity: 1;
}

.activeGroup {
    background-color: theme('colors.pervenche');
    transition:background-color 2s ease;
}
.activeGroup.entite-circle:hover:before {
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