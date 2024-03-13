<script>
    import gsap from 'gsap';
    import MotionPathPlugin from 'gsap/dist/MotionPathPlugin.js';
    import { onMount } from 'svelte';
    import DrawSVGPlugin from "$lib/gsap/DrawSVGPlugin";
    import { RoughEase } from "gsap/EasePack";
    import { md } from './utils';

    let baseDuration = 0.3;
    
    /** @type {string | undefined} */
    let hoveredGroup;

    /** @type {App.Anims} */
	export let anims;
    /** @type {HTMLElement} */
    export let sectionEl;

    export let imgPath = '';

    const HREF_PREFIX = '/nos-activites/'

    const secteurs = [
        {   id: 'group1', 
            secteurs : [ 'Audit', 'Conseil', 'Prévention' ], 
            indexes : [ 0, 1, 2 ], 
            xy: [ [331.03, 338.55], [537.08, 338.55], [743.06, 338.55]], 
            imagePrefix: 'audit-conseil-gestion-' 
        },
        {   id: 'group2', 
            secteurs : [ 'Gestion des risques', 'Expertise' ], 
            indexes : [ 3, 4 ], 
            xy: [ [331.09, 544.53], [537.08, 544.53]], 
            imagePrefix: 'gestion-risque-expertise-',
            url:'expertise'
        },
        {   id: 'group3', 
            secteurs : [ 'Assistance', 'Réparation' ], 
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
            secteurs : [ 'Implantations' ], 
            indexes : [ 8 ], 
            xy: [ [743.06, 750.52] ], 
            imagePrefix: 'international-'  
        },
    ]


    onMount(async() => {
        gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin, RoughEase);
        
        gsap.set('#le-point, #le-cercle-1, .secteur-hover', { transformOrigin:'50% 50%' })
        gsap.to('.secteur-hover', { rotateZ: 360, repeat: -1, duration: 7, ease:'none' })
        
        /** @type {gsap.core.Animation} */
        let secteurHover;

        /** @type {gsap.core.Timeline} */
        let secteurHoverInitial = gsap.timeline({paused:true, defaults:{duration:0.1}})
            .to(`.secteur-hover[data-secteur='group1']`,{ 
                opacity: 1, r:75, ease: "back.out(2)",
                stagger: {
                    each: 0.04,
                    from: "start",
                    grid: [3,3],
                } 
            })
            .to(`.secteur-hover[data-secteur='group1']`, { 
                opacity: 0, r:0, ease: "back.in(2)", delay: 0.01,
                stagger: {
                    each: 0.04,
                    from: "end",
                    grid: [3,3]
                }, 
            },'>');


        anims = gsap.timeline({
            paused: true,
            defaults: { ease: 'Power1.inOut' },
        })
        .fromTo('#le-point', { scale: 1 }, {scale:160, duration:baseDuration * 2.5, ease:'circ.in'},'<')
        .fromTo('#le-cercle-1',{ scale:0 }, {scale:60, rotate: 720, duration:baseDuration * 2.5, ease:'circ.in'},'<')
        .to('#intro-part-2', { autoAlpha: 1 , duration: baseDuration * 0.2, ease:'none'},">-=0.03")
        .to('#intro-part-1', { autoAlpha: 0 , duration: baseDuration * 0.1, ease:'none'},'<')
        .addLabel('apparition-secteur', '<')
        .to('#st-bienvenue', { attr: { 'data-data-color-arrow': '#D6FC8A' } }, 'apparition-secteur')
        .fromTo('.bloc-text-contenu', { yPercent: 100 }, { yPercent: 0, duration: baseDuration * 5, ease: 'power2.inOut'  }, 'apparition-secteur' )
        .from('.mask-outline-secteur-2', {drawSVG: '0%', duration: baseDuration * 3 }, 'apparition-secteur' )
        .from('.mask-outline-secteur-1', {drawSVG: '100% 100%', duration: baseDuration * 2 }, '>' )
        .from('#tites-secteurs', { yPercent: 40, opacity: 0, duration: baseDuration * 2, stagger: { each: 1.5 / 9  } }, 'apparition-secteur' )
        .from('.secteur-circle', { scale: 0, transformOrigin: '50% 50%', duration: baseDuration * 2, stagger: { each: 1.5 / 9  }}, 'apparition-secteur' )
        .call(gsap.to, [secteurHoverInitial, { progress: 1, duration: 3}], '-=1')

        anims.vars = { handleNext }

        //await tick();
        document.querySelectorAll('.secteur-circle')?.forEach(el => {
            secteurHoverInitial?.kill();
            el.addEventListener('click', (evt) => {
                const clickedGroup = el.dataset.secteur;
                const secteur = secteurs.find(secteur => secteur.id === clickedGroup);
                if (secteur && secteur.url)
                    window.location.href = HREF_PREFIX + secteur.url;
            })
            el.addEventListener('mouseenter', (evt) => {
                hoveredGroup = el.dataset.secteur;
                secteurHover?.progress?.(1)?.kill();
                secteurHover =  gsap.to(`.secteur-hover[data-secteur='${el.dataset.secteur}']`,{
                    opacity: 1,
                    r:75,
                    ease: "Bounce.easeOut",
                    rotate: 360,
                })
            })
            el.addEventListener('mouseleave', (evt) => {
                hoveredGroup = undefined;
                // @ts-ignore
                secteurHover?.progress?.(1)?.kill();
                secteurHover = gsap.to(`.secteur-hover[data-secteur='${el.dataset.secteur}']`,{
                    opacity: 0,
                    r:60,
                    stagger: { each: 0.1 },
                })
            })
        })
    })

    /** @param {number} direction */
    function handleNext (direction) {
        if (anims.isActive())
            return false;

        if (direction === 1 && anims.progress() <= 0.1) {
            //anims.reversed() && anims.reverse();
            anims.restart().play();
            return true;
        }
        if (direction === -1 && anims.progress() >= 0.5) {
            anims.timeScale(2).reverse();
            return true;
        }
        return false;            
	}

</script>
<section id="section-intro" class="min-w-screen w-full h-screen overflow-y-hidden" bind:this={sectionEl}>

    <div id="intro-part-2" class="z-[12] absolute w-full h-full opacity-0 flex flex-row bg-amande">

        <div id="bloc-text" 
            class="absolute 
                w-[65vw] text-[4vw] leading-[6vw] right-[17vw] h-1/2 bottom-[5%]
                md:w-[30%] md:text-[1.35vw] md:leading-[2.6vw] md:right-[14%] md:h-fit md:bottom-auto md:top-auto
                max-h-fit self-center my-auto overflow-hidden font-light flex">
            <span class="bloc-text-contenu self-start md:self-center text-feuille">
                <br>&nbsp;
                <br>
                Depuis plus de 25 ans, le Groupe Alkera développe une expertise complète et reconnue sur l’ensemble de la chaîne du sinistre en France et l’international.
                <br>
                De l’audit jusqu’à la réparation en passant par l’expertise de sinistres, nous proposons une offre complète avant, pendant et après sinistre.
                <br>&nbsp;
                <br>&nbsp;
            </span>
        </div>
    
        <svg 
            color-interpolation-filters="sRGB"
            shape-rendering="{$md ? 'geometricPrecision' : 'optimizeSpeed'}"
            class="w-full h-fit md:h-auto mx-auto overflow-visible
            absolute scale-[2.2] origin-[10%_30vh] top-1/3
            md:-mt-[4%]  md:relative md:bottom-auto md:scale-100  md:origin-center md:top-[unset]" 
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
                    stroke="#12473B" fill="none" stroke-dasharray="4" stroke-width="2"
                    cx="{secteur.xy[j][0]}" 
                    cy="{secteur.xy[j][1]}" 
                    r="60"
                />
                
                <filter id="secteur-image-{index}{j}" x="0%" y="0%" width="100%" height="100%">
                    <feImage xlink:href="{imgPath}/intro/{secteur.imagePrefix}0{j+1}.png"/>
                    <feComposite in2="SourceGraphic" operator="over" />
                </filter>

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
                <text id="tites-secteurs"
                    text-anchor="middle" class="fill-feuille text-[25px] md:text-[18px]"
                    x="{secteur.xy[j][0]}" y="{secteur.xy[j][1]+100}"
                >
                    {secteur.secteurs[j]}
                </text>
            {/each}
            {/each}
        
        </svg>
    
    </div>

    
    <div id="intro-part-1" class="w-screen h-screen bg-feuille overflow-clip flex z-[0]">
        <div class="w-2/12 md:w-1/3 h-full"/>
        <div class="w-10/12 md:w-1/3 h-full flex flex-col justify-center">
            <svg 
                id="logo-alkera-et-texte"
                class="w-full h-auto overflow-visible"
                color-interpolation-filters="sRGB"
                shape-rendering=" geometricPrecision"
                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="300px" y="300px" viewBox="0 10 300 300"
            >
            
            <g id="logo-alkera" class="fill-amande">
                <path d="M58.6 122.9c-1.7 0-3.4.6-5 2.4L1.2 187.9c-2 2.4-1.7 6 .7 8.1 1 .9 2.3 1.4 3.7 1.4 1.5 0 3.4-.9 4.5-2.1l42.5-50.8v25.3H38.4c-3.1 0-5.7 2.5-5.7 5.6 0 3.1 2.4 5.6 5.5 5.7h14.2v10.1c0 3.4 2.7 6.1 6.1 6.1h6.1V129c0-1.2-.4-2.4-1-3.4-1.1-1.6-3-2.7-5-2.7m213.6 19.7h-5.7v6.4c-4.7-4.2-10.8-6.6-17.2-6.5-14.9 0-26.2 12.1-26.2 27.5s11.3 27.5 26.2 27.5c6.3 0 12.4-2.2 17.2-6.4v.6c0 1.6.7 3.2 1.9 4.2.1.1.1.1.2.1 1 .8 2.3 1.3 3.6 1.3h5.7v-49.1c0-3.1-2.5-5.6-5.7-5.6m-5.7 27.4c0 9.6-7 16.9-16 16.9s-16-7.3-16-16.9c0-9.6 7-16.9 16-16.9 8.7 0 15.6 6.9 16 16.1v.8zM85.1 183.7v-55c0-3.1-2.5-5.7-5.7-5.7h-5.7v66.7c0 4.2 3.4 7.7 7.7 7.7s7.7-3.4 7.7-7.7l-2.3-2.2c-1.1-1-1.7-2.4-1.7-3.8m14.8-60.8h-5.7v68.7c0 3.1 2.5 5.7 5.7 5.7h5.7v-68.7c0-3.1-2.6-5.7-5.7-5.7m43.1 19.7h-11.2c-1.7 0-3.3.7-4.3 2l-21.2 25.1 21.6 25.5c1.1 1.3 2.7 2 4.3 2h12.3L120.7 169l22.3-26.4z" class="st1"/>
                <path d="M166.2 186.9c-8.8 0-16-7.6-16-16.9 0-9.3 7.1-16.9 16-16.9 2.4 0 4.8.6 6.9 1.7l-14.2 16.8c-1.8 2.2-1.6 5.5.6 7.3 2.2 1.8 5.5 1.6 7.3-.6l21.1-24.9c-5-6.4-13.1-10.9-21.8-10.9-15.1 0-27.5 12.3-27.4 27.5 0 15.1 12.3 27.5 27.5 27.4 11.4 0 21.7-7.1 25.7-17.8h-12.6c-2.9 4.4-7.7 7.3-13.1 7.3m58.6-39.1c0-2.9-2.4-5.3-5.3-5.3-12.4 0-23.3 9.1-23.3 21.5v27.8c0 3.1 2.5 5.5 5.5 5.5h5.5v-32.8c0-6.3 5.9-11.5 12.2-11.5 3 .1 5.4-2.3 5.4-5.2" class="st1"/>
            </g>
                
                <circle id="le-cercle-1"
                    cx="292px"
                    cy="190px"
                    r="45"
                    stroke-dasharray="2"
                    fill="none" stroke="white" 
                    stroke-width="0.1" 
                    stroke-miterlimit="10"
                />

                <circle 
                    id="le-point"
                    cx="292" cy="190" r="7.5" fill="#D6FC8A"
                />

            </svg>

            <div class="text-amande z-[0] text-center overflow-visible relative -top-[24vw] md:-top-[10vw] w-[150%] self-center">
                <p class="text-[7vw] md:text-[3.24vw] font-thin whitespace-nowrap">
                    L'imprévu s'arrête là.
                </p>
                <p class="text-[3vw] md:text-[1.3vw] font-light px-[20%] mt-[2vw] leading-[5vw] md:leading-[2.2vw]">
                    Le Groupe Alkera accompagne assureurs, courtiers et entreprises dans la gestion globale des risques et des sinistres.
                </p>
            </div>            
        </div>
        <div class="w-2/12 md:w-1/3 h-full"/>
    </div>



</section>


<style lang="postcss">


    *  {
        font-family: "field-gothic-wide",sans-serif;
    }
 
    #le-cercle-1, #le-point  {
        shape-rendering: optimizeSpeed;
        color-rendering: optimizeSpeed;
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

    .secteur-hover {
        opacity: 0;
    }

    @media screen and (min-width: 768px) {
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
    }

    .bloc-text-contenu::-webkit-scrollbar {
        display: none;
    }
    .bloc-text-contenu {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    

  
</style>