<script>    
    import gsap from 'gsap';
    import MotionPathPlugin from 'gsap/dist/MotionPathPlugin.js';
    import { onDestroy, onMount } from 'svelte';
    import DrawSVGPlugin from "$lib/gsap/DrawSVGPlugin";
    import { md } from './utils';

    /** @type {App.Anims} */
	export let anims;

    /** @type {gsap.core.Timeline} */
    let tlOrbits;

    /** @type {gsap.core.Timeline | null} */
    let maskAnim;

    /** @type {HTMLElement} */
    export let sectionEl;

    let mounted = false;

    $: if (mounted && readyLine) {
        gsap.to('#arrow-cursor', { y: arrowPosition, opacity: 1 } );
    }

    let ellipseRatio = 1;

    const orbitesTextIntro = `En tant qu'acteur multi-spécialiste de la gestion des risques, notre mission est d’apporter des solutions d’indemnisation sur l’ensemble de la chaîne de sinistres. Grâce à nos 17 entités de spécialité, nous construisons pour nos clients des solutions sur-mesure en fonction de leur stratégie et de leurs besoins.`;

    /** @type {SVGEllipseElement | undefined} */
    let internalOrbit;

    /** @type {SVGEllipseElement | undefined} */
    let externalOrbit;

    /** @type {SVGEllipseElement | undefined} */
    let middleOrbit;

    /** @type {HTMLElement | undefined} */
    let planetsEl;

    /** @type {ResizeObserver | undefined} */
    let resizeObserver;

    const tspanSpacing = 31.5;
    const initialArrowPosition = 138 + tspanSpacing;

    /** @type {number | undefined} */
    let arrowPosition = initialArrowPosition;

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
    const initialWidth = 1360.5;
        
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
        { url : '/', id: 'mcLaren',                orbit: 'external',  order: 6.65, groups: ['gestion'] },
        { url : '/', id: 'ciblexperts',            orbit: 'external',  order: 7.65, groups: ['gestion'] },
        { url : '/', id: 'quantimme',              orbit: 'external',  order: 8.65, groups: ['initial','audit'] }
    ]

    /** @type {App.Orbits} */
    const orbits = {

        'internal': {
            el: internalOrbit,
            offsetGroup : {
                audit: 0.843, gestion: 0.87, assistance: 0.285, delegation: 0.01, initial:0.00001,
            },
            minMaxSizes: [ 32.35, 51.55 ],
            planets: entites.filter(e => e.orbit === 'internal'),
            direction: { direction: 1, progress: 0 },
        },

        'middle': {
            el: middleOrbit,
            offsetGroup : { 
                audit: 0.843, gestion: 0.17, assistance: 0.55, delegation: 0.73, initial:0.00001,
            },
            minMaxSizes: [ 25.48, 60.94 ],
            planets: entites.filter(e => e.orbit === 'middle'),
            direction: { direction: 1, progress: 0 },
        },

        'external': {
            el: externalOrbit,
            offsetGroup : {
                audit: 0.843, gestion: 0.245, assistance: 0.5, delegation: 0.65, initial:0.00001,
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
            const nextProgress = tl?.labels.initialPosition + orbit.offsetGroup[metier];
            gsap.to(tl, {
                id: 'orbiting',
                progress: `+=${gsap.utils.wrap(0, 1, nextProgress - tl.progress())}`, 
                duration: 1, ease: "power2.Out",
                onComplete: () => tl.labels[metier] && tl.addLabel(metier, tl.progress())
            })

        })
    }

    onMount(async() => {
        gsap.registerPlugin(DrawSVGPlugin);
        mounted = true;
        resizeObserver = new ResizeObserver(() => { 
            initialize();
        });
        readyLine = true;
        [internalOrbit, externalOrbit, middleOrbit].forEach(orbit => MotionPathPlugin.convertToPath(orbit))


        tlOrbits = gsap.timeline()
            .from('.ellipse', {drawSVG:'25% 25%', duration:1, ease:"none", reversed: false, stagger : { each: 0.25, from: 'random'} },0)
            .from('.planets > div', {
                duration: 0.5,
                opacity: 0,
                stagger:{ each: 0.05, from: 'random' },
            },0.5)
            .to('text > tspan.orbit-menu-entries', { opacity: 1, duration: .12, ease: "power2.inOut"}, 0)
            .to({}, { duration: .45 }, .85)
            .play();

        maskAnim = gsap.timeline({ paused: true })
            .to('#big-mask-orbits', { autoAlpha: 0, duration: 0.5 }, 0.85)
        
        $md && maskAnim.fromTo('#big-mask-orbits', 
            { skewX: "16.34deg", x: "-50vw" }, 
            { x: "-120vw", duration: 1 }
        ,0.5);

        anims = gsap.timeline({ paused:true }).to({}, { duration:0.1 });
        anims.vars = { handleNext, immediate:true };
            
        function initialize () {
            entites.forEach(async (entite, i) => {
                const initialProgress = entite.order / orbits[entite.orbit].planets.length;
                entite.tl?.kill();
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

    onDestroy(()=>{
        resizeObserver?.unobserve(document.body);
    });

    /** @param {number} direction */
    function handleNext (direction) {

        if (maskAnim?.isActive())
            return true;
        
        if(maskAnim && maskAnim.progress() < 0.1) {
            !maskAnim?.isActive() && maskAnim.play();
            return true;
        }

        if (fromGroup !== 'initial')
            return false;

        const orbitingTl = gsap.getById("orbiting");
        if (orbitingTl?.isActive())
            return true;

        const groups = gsap.utils.toArray('[data-y-arrow]');        
        const currentGroup = groups.findIndex(g=>g.id===`groupe-${toGroup || 'initial'}`);

        if (typeof currentGroup !== 'number') return false;

        if (direction === 1 && currentGroup + 1 < groups.length) {
            changeGroup(groups[currentGroup+1].id.split('-')[1]);
            if (currentGroup + 1 === groups.length - 1) {
                anims.vars.handleNext = null;
                return false;
            }
            return true;
        }
        if (direction === -1 && currentGroup - 1 >= 0) {
            changeGroup(groups[currentGroup-1].id.split('-')[1]);
            return true;
        }
        else return false;
    }

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
        arrowPosition = document.querySelector(`#groupe-${metier}`).dataset.yArrow || initialArrowPosition;
        fromGroup = toGroup || 'initial';
        toGroup = metier;   
        setGroupPosition(toGroup);
    }

    /** @param {MouseEvent} clickEvent */
    function handleClickSection(clickEvent){
        
        if (!maskAnim)
            return;

		// @ts-ignore
		if(clickEvent.target?.id && clickEvent.target.id === 'big-mask-orbits')
            return 

        gsap.to(maskAnim, {progress:1});
        maskAnim?.invalidate().kill();
        maskAnim = null;
	}

</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<section 
    on:click={handleClickSection}
    bind:this={sectionEl} 
    id="section-orbits" 
    class="w-full bg-amande h-full overflow-hidden flex items-center relative" 
>

    <svg 
        class="absolute top-auto md:translate-y-0 max-h-screen w-full aspect-video mx-auto overflow-visible z-[3] pointer-events-none user-select-none"
        xmlns="http://www.w3.org/2000/svg" xml:space="preserve" x="0" y="0" version="1.1" viewBox="0 0 {initialWidth} {initialHeight+(resizeOrbit * 2)}"
    >
        <defs>
            <pattern id="image-pattern" patternContentUnits="objectBoundingBox" width="100%" height="100%">
              <image href="orbits/alkera-logo.jpg" preserveAspectRatio = "none" width = "1" height = "1" />
            </pattern>
        </defs>
        <circle id="noyau" fill="url(#image-pattern)" cx="653.65" cy="{393.04 + resizeOrbit}" r="90.81"/>
    </svg>

    <div id="big-mask-orbits" 
        class="hidden md:flex bg-white w-full h-full absolute z-[2]  items-center leading-loose"
    >
        <div class="w-[30%] text-feuille ml-auto mr-[11.5vw] font-light skew-x-[-16.34deg] text-[1.35vw]">
            {orbitesTextIntro}
        </div>
    </div>
    <!-- <div class="absolute w-[1px] h-screen -skew-x-[-16.34deg] border-feuille border-[0.1px] border-dashed left-1/2"/> -->
    <div class="alkera-line foret absolute w-[1px] h-screen -skew-x-[-16.34deg] border-feuille left-1/2"/>
    
    <svg
        color-interpolation-filters="sRGB"
        id="orbites"
        class="relative top-auto md:translate-y-0 max-h-screen w-full aspect-video mx-auto overflow-visible" 
        xmlns="http://www.w3.org/2000/svg" xml:space="preserve" x="0" y="0" version="1.1" viewBox="0 0 {initialWidth} {initialHeight+(resizeOrbit * 2)}"
    >

        <g id="arrow-cursor" x="0" y="0" transform="translate(-125 89)" opacity="0" >
            <line fill="none" stroke="#6563CA" stroke-width="3" stroke-miterlimit="10" x1="0" y1="4.49" x2="11.66" y2="4.49"/>
            <polygon fill="#6563CA" points="10.34,8.98 18.12,4.49 10.34,0"/>
        </g>

        <!-- svelte-ignore a11y-click-events-have-key-events svelte-ignore a11y-mouse-events-have-key-events svelte-ignore a11y-no-static-element-interactions -->
        <text
            id="orbits-menu"
            font-family="field-gothic-wide" font-size="21px"
            transform="{$md ? `translate(-100 ${initialArrowPosition - 18})` : `translate(${initialWidth/2} ${initialHeight*1.5})scale(2.5)`}"
            text-anchor="{$md ? 'start':'middle'}"
            on:mouseover={(e) => {
                if (!e.target?.dataset?.yArrow || !!toGroup)
                    return;
                arrowPosition = e.target?.dataset?.yArrow
            }} 
            
        >
            <tspan class="orbit-menu-entries fill-feuille font-bold" 
                opacity="0" x="0" y="-5" id="secteurs-titre"
            >
                Nos secteurs d’activité
            </tspan>
            <tspan on:click={()=>changeGroup("audit")} 
                opacity="0" x="0" y="{tspanSpacing * 1}" id="groupe-audit" data-y-arrow="{initialArrowPosition}" 
                class:fill-pervenche={toGroup === 'audit'} 
                class="hover:fill-pervenche hover:cursor-pointer transition-all orbit-menu-entries"
            >
                Audit, conseil et prévention
            </tspan>
            <tspan on:click={()=>changeGroup("gestion")} 
                opacity="0" x="0" y="{tspanSpacing * 2}" id="groupe-gestion" data-y-arrow="{initialArrowPosition + tspanSpacing}" 
                class:fill-pervenche={toGroup === 'gestion'} 
                class="hover:fill-pervenche hover:cursor-pointer transition-all orbit-menu-entries"
            >
                Expertise
            </tspan>
            <tspan on:click={()=>changeGroup("assistance")} 
                opacity="0" x="0" y="{tspanSpacing * 3}" id="groupe-assistance" data-y-arrow="{(initialArrowPosition + tspanSpacing * 2)}" 
                class:fill-pervenche={toGroup === 'assistance'} 
                class="hover:fill-pervenche hover:cursor-pointer transition-all orbit-menu-entries"
            >
                Assistance et réparation
            </tspan>
            <tspan on:click={()=>changeGroup("delegation")} 
                opacity="0" x="0" y="{tspanSpacing * 4}" id="groupe-delegation" data-y-arrow="{initialArrowPosition + (tspanSpacing * 3)}" 
                class:fill-pervenche={toGroup === 'delegation'} 
                class="hover:fill-pervenche hover:cursor-pointer transition-all orbit-menu-entries"
            >
                Délégation
            </tspan>

        </text>

        <ellipse bind:this={internalOrbit} id="internal" class="ellipse" cx="659.02" cy="{406.32 + resizeOrbit}" fill="none" stroke="#12473B" stroke-miterlimit="10" rx="310.39" ry="147.85" transform="rotate(-16.342 659.08 406.403)"/>
        <ellipse bind:this={middleOrbit} id="middle" class="ellipse" cx="667.44" cy="{435.04 + resizeOrbit}" fill="none" stroke="#12473B" stroke-miterlimit="10" rx="493.5" ry="237.51" transform="rotate(-16.342 667.5 435.124)"/>
        <ellipse bind:this={externalOrbit} id="external" class="ellipse" cx="680.25" cy="{478.73 + resizeOrbit}" fill="none" stroke="#12473B" stroke-miterlimit="10" rx="701.55" ry="332.01" transform="rotate(-16.342 680.308 478.821)"/>

    </svg>
    <div class="planets" bind:this={planetsEl}>
        {#each entites as entite, index(entite.id)}

        <div
            class="
                absolute entite-{entite.id} entite-circle bg-feuille rounded-full bg-center bg-cover aspect-square transition-[background-color]
                {toGroup && entite.groups.includes(toGroup) ? 'activeGroup':'inactiveGroup'}
                " 
            style="
                width:{orbits[entite.orbit].minMaxSizes[1] * SCALE_FACTOR}%; 
                background-image:url({`/orbits/${entite.id.toLowerCase()}.png`});
            "
            data-orbit={entite.orbit}
        />

        {/each}
    </div>
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
    outline: 1.5px dashed theme('colors.pervenche');
}
.entite-circle.inactiveGroup:hover:before {
    outline: 1.5px dashed theme('colors.feuille');
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
@media screen and (max-width: 768px) {
    #orbit-dash-line-reveal {
        display: none;
    }
    #section-orbits {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #orbites {
        display: inline-flex;
        align-items: center;
        width: 100%;
    }
}

</style>