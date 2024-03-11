<svelte:window 
    on:hashchange={handleHashChange} 
    on:beforeunload={replaceState}
/>
<script>
    import "./app.css";  
    import { onDestroy, onMount, tick } from 'svelte';
    import { Observer } from 'gsap/all';
    import gsap from 'gsap';
    import { scrollyTeller } from '$lib/utils';
    import ScrollToPlugin from 'gsap/ScrollToPlugin';
	import Outro from '$lib/Outro.svelte';
    import Intro2 from "$lib/Intro2.svelte";
    import Chiffres from "$lib/Chiffres.svelte";
    import Orbites from '$lib/Orbites.svelte';
    
    export let text;
    $:console.log(text);

    /** @type {App.Anims} */
    let introAnims;

    /** @type {App.Anims} */
    let currentTransition

    /** @type {HTMLElement} */
    let introEl;

    /** @type {App.Anims} */
    let chiffresAnims;
    /** @type {HTMLElement} */
    let ChiffresEl;

    /** @type {App.Anims} */
    let orbitesAnims;
    /** @type {HTMLElement} */
    let orbitesEl;
    
    /** @type {App.Anims} */
    let outroAnims;
    /** @type {HTMLElement} */
    let outroEl;

    /** @type {HTMLElement[]} */
    let wrappers;
    
    /** @type {HTMLElement[]} */
    let sections = [];
    let currentIndex = -1;
    let transitioning = false;
    let shouldAnimate = false;

    const tolerance = 20;

    let whichColor = '#D6FC8A';

    /** @type {Observer} */
    let observer;

    /** @type {HTMLElement | null} */
    let header;

    /** @type {number} */
    let urlHash;

    /** @type {Map} */
    let animsMap;

    onMount(async()=> {
        gsap.registerPlugin(Observer, ScrollToPlugin);
        header = document.querySelector('header');
        window.scroll(0,1);

        wrappers = gsap.utils.toArray('.section-wrappers');
        sections.push(introEl, ChiffresEl, orbitesEl, outroEl);

        animsMap = new Map([
            [introEl, introAnims],
            [ChiffresEl, chiffresAnims],
            [orbitesEl, orbitesAnims],
            [outroEl, outroAnims]
        ]);

        const storedHash = localStorage.getItem('alkera-scrollyteller');
        if (storedHash)
            urlHash = sections.findIndex(s => s.parentElement?.id === storedHash) + 1;
        handleHashChange();
        
        gsap.set(wrappers, { yPercent: 100 });
        gsap.set(sections, { yPercent: -100 });

        observer= Observer.create({
            type: "wheel,touch,pointer",
            wheelSpeed: -0.1,
            onDown:(o) => {

                if (!$scrollyTeller) {
                    if (window.scrollY < sections[currentIndex]?.offsetHeight) {
                        gsap.to(window, { 
                            scrollTo: sections[currentIndex]?.offsetTop || 0,
                            ease: "power1.inOut"
                        });
                    } else {
                        gsap.to(window, { scrollTo: window.scrollY - (o.velocityY) });
                        return;
                    }

                    observer.vars.preventDefault = true;
                    $scrollyTeller = true;
                    return;
                }

                if (transitioning) return;
                if (currentIndex <= 0) {
                    header?.classList.remove('et-fixed-header');
                    whichColor = '#D6FC8A';
                }           
                triggerAnimation(animsMap, -1, o.deltaY);
            },
            onUp:(o) => {
                if (!$scrollyTeller) {

                    observer.vars.preventDefault = false;

                    const bottom = sections[currentIndex]?.offsetTop + sections[currentIndex]?.offsetHeight

                    if (window.scrollY < sections[currentIndex]?.offsetTop + 2)
                        gsap.to(window, {  scrollTo: bottom });

                    else gsap.to(window, { scrollTo: window.scrollY - (o.velocityY) });

                    return;
                }
                if (transitioning) return;

                if (currentIndex <= 0)
                    whichColor = '#12473B'

                header?.classList.add('et-fixed-header');

                gsap.to('#scroll-down', { opacity: 0 })
                triggerAnimation(animsMap, 1, o.deltaY);
            },
            tolerance,
            onStopDelay: 2,
            onStop: () => {
                gsap.to('#scroll-down', { 
                opacity: 1, 
                '--arrow-scroller-color': sections[currentIndex]?.parentElement?.dataset.colorArrow
                })
            },
            preventDefault: true
        });
        gotoSection(urlHash ? urlHash - 1 : 0, 1, animsMap, tolerance);
    });

    /** @param {number} index @param {number} direction @param {Map<HTMLElement, App.Anims> | null} animsMap @param {number | null} velocity */
    function gotoSection(index, direction, animsMap = null, velocity = null) {
    
        if (!$scrollyTeller)
            return;

        let fromTop = direction === -1;
        let dFactor = fromTop ? -1 : 1;
    
        if (currentIndex <= 0 && direction === -1)
            return;

        const absVelocity = Math.abs(velocity ?? tolerance);

        if (currentTransition?.isActive())
            return;
        
        currentTransition?.kill();
        currentTransition = gsap.timeline({
            defaults: { duration: tolerance / absVelocity, ease: "power1.inOut" },
            onStart: () => transitioning = true,
            onComplete: () => {
                transitioning = false;
                currentIndex = index;
                shouldAnimate = true;
                const hasImmediateFollowUp = animsMap?.get(sections[currentIndex])?.vars.immediate;
                hasImmediateFollowUp && triggerAnimation(animsMap, direction, velocity);
            }
        });

        if (currentIndex >= 0) {
            // The first time this function runs, current is -1
            gsap.set(wrappers[currentIndex], { zIndex: 0 });
            currentTransition.to(sections[currentIndex], { yPercent: -15 * dFactor })
            .set(wrappers[currentIndex], { autoAlpha: 0 });
        }

        gsap.set(wrappers[index], { autoAlpha: 1, zIndex: 1 });
        
        currentTransition.fromTo(wrappers[index], 
            { yPercent: i => i ? -100 * dFactor : 100 * dFactor }, 
            { yPercent: 0 }, 
        0)

        .fromTo(sections[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
    }

    /** @param {Map<HTMLElement, App.Anims>} animsMap @param {number} direction @param {number | null} velocity */
    function triggerAnimation(animsMap, direction, velocity = tolerance) {

        if (!$scrollyTeller)
            return;

        const anims = animsMap.get(sections[currentIndex]);
        if (!anims) {
            return;
        }

        if (anims.isActive()) {
            //velocity && anims.timeScale(Math.abs(velocity * 1.5) / tolerance);
            return;
        }
        
        if (shouldAnimate && anims && !anims.vars.done) {
            anims.play();
            anims.eventCallback('onComplete', () => {
                anims.vars.done=true;
                anims.vars.immediate = false;
                shouldAnimate = false;
            });

        } else if (!anims.isActive()) {
            
            const handleNextMove = anims.vars?.handleNext;
            const nextMove = typeof(handleNextMove) === 'function' ? handleNextMove(direction) : null;
            
            if(!nextMove) {
                gotoSection(currentIndex + direction, direction, animsMap, velocity);
            }
        }
    }

    /** @param {HashChangeEvent | null} e */
    function handleHashChange(e=null) {

        const url = new URL(e?.newURL || location?.href);

        if (!url?.hash)
            return;

        const hash = url.hash.substring(1);
        urlHash = sections.findIndex(s => s.parentElement?.id === hash) + 1;
        urlHash = urlHash > 0 && urlHash <= sections.length ? urlHash : null;

        if (urlHash !== null && e !== null)
            gotoSection(urlHash ? urlHash - 1 : 0, 1, animsMap, tolerance);
    }
    
    function replaceState () {
        if (!$scrollyTeller)
            localStorage.removeItem('alkera-scrollyteller');    
        
        localStorage.setItem('alkera-scrollyteller', sections[currentIndex].parentElement?.id);
    }

    

    
</script>
<header class="hidden fixed md:flex items-center justify-center w-full h-[83.5px] bg-gray-50 border-b-[1px] border-foret z-[99]">
    FAKE BAR
  </header>
  
<main class="w-screen h-screen max-h-screen overflow-hidden fixed top-0" id="alkera-scrollyteller">
    <div class="section-wrappers bg-amande" data-color-arrow="{whichColor}" id="st-bienvenue">
        <Intro2 bind:anims={introAnims} bind:sectionEl={introEl} />
    </div>

    <div class="section-wrappers bg-foret" data-color-arrow="#D6FC8A" id="st-chiffres">
        <Chiffres bind:anims={chiffresAnims} bind:sectionEl={ChiffresEl} />
    </div>

    <div class="section-wrappers bg-amande" data-color-arrow="#12473B" id="st-secteurs">
        <Orbites bind:anims={orbitesAnims} bind:sectionEl={orbitesEl}/>
    </div>

    <div class="section-wrappers bg-white" data-color-arrow="#12473B" id="st-engagements">
        <Outro bind:anims={outroAnims} bind:sectionEl={outroEl} />
    </div>

    <svg
        class="fixed bottom-[15vw] md:bottom-[2.2vw] w-[5vw] md:w-[2vw] h-auto left-0 right-0 mx-auto my-0" 
        xmlns="http://www.w3.org/2000/svg" xml:space="preserve" 
        id="scroll-down" x="0" y="0" version="1.1" viewBox="0 0 54 79.4"
    >
        <path class="fleche" stroke-miterlimit=10 fill="none" d="M27 78.9C12.4 78.9.5 67 .5 52.4V27C.5 12.4 12.4.5 27 .5S53.5 12.3 53.5 27v25.4C53.5 67 41.6 78.9 27 78.9zM27 20v27.2"/>
        <path class="cadre" d="M18.6 44.7 27 59.2l8.4-14.5z"/>
    </svg>
</main>

<style lang="postcss">
    .section-wrappers {
        @apply fixed top-0 invisible w-full h-screen;
    }
</style>