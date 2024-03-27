<svelte:window 
    on:hashchange={handleHashChange}
/>
<script>
    import "./app.css";  
    import { onMount } from 'svelte';
    import { Observer } from 'gsap/all';
    import gsap from 'gsap';
    import ScrollToPlugin from 'gsap/ScrollToPlugin';
    import { ScrollTrigger } from 'gsap/all';
	import Outro from '$lib/Outro.svelte';
    import Intro2 from "$lib/Intro2.svelte";
    import Chiffres from "$lib/Chiffres.svelte";
    import Orbites from '$lib/Orbites.svelte';
    
    export let text = '';

    let scrollyTeller = true;

    export let imgPath = '';

    /** @type {App.Anims} */
    let introAnims;

    /** @type {App.Anims} */
    let currentTransition

    /** @type {HTMLElement} */
    let mainEl;

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

    const tolerance = 10;

    let whichColor = '#D6FC8A';

    /** @type {Observer} */
    let observer;

    /** @type {HTMLElement | null} */
    let header;

    /** @type {number} */
    let urlHash;

    /** @type {Map} */
    let animsMap;

    const sleep = time => new Promise(res => setTimeout(res, time, "done sleeping"));

    onMount(async()=> {
        gsap.registerPlugin(Observer, ScrollToPlugin, ScrollTrigger)
        header = document.querySelector('header');

        wrappers = gsap.utils.toArray('.section-wrappers');
        sections = [introEl, ChiffresEl, orbitesEl, outroEl];

        animsMap = new Map([
            [introEl, introAnims],
            [ChiffresEl, chiffresAnims],
            [orbitesEl, orbitesAnims],
            [outroEl, outroAnims]
        ]);

        ScrollTrigger.create({
            trigger: "#alkera-scrollyteller",
            pin: true,
            // @ts-ignore
            anticipatePin: true,
            start:()=> "top top",
            end:()=> "top bottom",
            onEnter: (self) => {
                scrollyTeller = true;
                observer.enable();
            },
            onEnterBack: (self) => {
                scrollyTeller = true;
                window.scroll(0,0);
                observer.enable();
            },
        });

        //const storedHash = localStorage.getItem('alkera-scrollyteller');
        // if (storedHash)
        //     urlHash = sections.findIndex(s => s.parentElement?.id === storedHash) + 1;
        handleHashChange();
        
        gsap.set(wrappers, { yPercent: 100 });
        gsap.set(sections, { yPercent: -100 });

        observer= Observer.create({
            type: "wheel,touch,pointer",
            preventDefault: true,
            wheelSpeed: -0.1,
            onDown: onDown,
            onUp: onUp,
            tolerance,
            onStopDelay: 2,
            onStop: () => {
                gsap.to('#scroll-down', { 
                    autoAlpha: 1, 
                    '--arrow-scroller-color': sections[currentIndex]?.parentElement?.dataset.colorArrow
                })
            },
        });
        await sleep(200);
        gotoSection(urlHash ? urlHash - 1 : 0, 1, animsMap, tolerance);
        if(ScrollTrigger.isInViewport('#alkera-scrollyteller', 0.7)) {
            window.scroll(0,0)
        } else leaveScrollyteller(false)
    });

    /** @param {globalThis.Observer | null} o */
    function onUp(o=null) {
        if (transitioning) return;

        if (currentIndex <= 0)
            whichColor = '#12473B'

        header?.classList.add('et-fixed-header');
        gsap.to('#scroll-down', { autoAlpha: 0 })
        triggerAnimation(animsMap, 1, Math.abs(o?.deltaY || 20));
    }

    /** @param {globalThis.Observer | null} o */
    function onDown(o=null) {
        if (transitioning) return;
        if (currentIndex <= 0) {
            header?.classList.remove('et-fixed-header');
            whichColor = '#D6FC8A';
        }           
        triggerAnimation(animsMap, -1, Math.abs(o?.deltaY || 20));
    }

    /** @param {boolean | any} scroll */
    function leaveScrollyteller(scroll = false) {
        observer?.disable();
        scrollyTeller = false;
        //scroll && window.scroll({top: mainEl.offsetHeight, behavior: 'smooth'});
    }

    /** @param {number} index @param {number} direction @param {Map<HTMLElement, App.Anims> | null} animsMap @param {number | null} velocity */
    function gotoSection(index, direction, animsMap = null, velocity = null) {
    
        if (!scrollyTeller)
            return;

        let fromTop = direction === -1;
        let dFactor = fromTop ? -1 : 1;
    
        if (currentIndex <= 0 && direction === -1)
            return;

        const absVelocity = velocity ?? tolerance;

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
            { yPercent: 0, duration: tolerance / absVelocity },
        0)

        .fromTo(sections[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
    }
    
    /** @param {Map<HTMLElement, App.Anims>} animsMap @param {number} direction @param {number | null} velocity */
    function triggerAnimation(animsMap, direction, velocity = tolerance) {

        const anims = animsMap.get(sections[currentIndex]);

        if (!scrollyTeller || !anims || anims.isActive())
            return;

        if (shouldAnimate && anims && !anims.vars.done) {
            anims.timeScale(1 / (tolerance / velocity)).play();
            anims.eventCallback('onComplete', () => {
                anims.vars.done=true;
                anims.vars.immediate = false;
                shouldAnimate = false;
            });

        } else if (!anims.isActive()) {
            
            
            const hasNextMove = typeof(anims.vars?.handleNext) === 'function' 
                ? anims.vars.handleNext(direction, 1 / (tolerance / velocity)) 
                : false;
            
            if(!hasNextMove) {
                gotoSection(currentIndex + direction, direction, animsMap, velocity);
            }
        }
    }

    /** @param {HashChangeEvent | null} e */
    async function handleHashChange(e=null) {
        const url = new URL(e?.newURL || location?.href);

        if (!url?.hash)
            return;

        const hash = url.hash.substring(1);
        urlHash = sections.findIndex(s => s.parentElement?.id === hash) + 1;
        urlHash = urlHash > 0 && urlHash <= sections.length ? urlHash : null;
        if (urlHash !== null && e !== null) {
            gotoSection(urlHash ? urlHash - 1 : 0, -1, animsMap, tolerance);
        }

    }
    
    function replaceState () {
        if (!scrollyTeller)
            localStorage.removeItem('alkera-scrollyteller');    
        
        localStorage.setItem('alkera-scrollyteller', sections[currentIndex]?.parentElement?.id);
    }
    
</script>

<main bind:this={mainEl}
    class="w-screen h-screen min-h-screen max-h-screen overflow-hidden" id="alkera-scrollyteller"
>
    <div class="section-wrappers bg-transparent" data-color-arrow="{whichColor}" id="st-bienvenue">
        
        <Intro2 
            bind:anims={introAnims} bind:sectionEl={introEl} {imgPath} 
        />

    </div>

    <div class="section-wrappers bg-feuille" data-color-arrow="#D6FC8A" id="st-chiffres">
        
        <Chiffres 
            bind:anims={chiffresAnims} bind:sectionEl={ChiffresEl} {imgPath} 
        />

    </div>

    <div class="section-wrappers bg-amande" data-color-arrow="#12473B" id="st-secteurs">
        
        <Orbites 
            bind:anims={orbitesAnims} bind:sectionEl={orbitesEl} {imgPath} isActive={currentIndex===2} 
        />

    </div>

    <div class="section-wrappers bg-white" data-color-arrow="#12473B" id="st-engagements">
        
        <Outro 
            bind:anims={outroAnims} bind:sectionEl={outroEl} {imgPath}
            on:end={leaveScrollyteller}
        />

    </div>
    <button class="contents" on:click={()=>onUp()}>
    <svg
        class="absolute bottom-[5vw] md:bottom-[3.2vw] w-[4vw] md:w-[1.4vw] h-auto left-0 right-0 mx-auto my-0" 
        xmlns="http://www.w3.org/2000/svg" xml:space="preserve" 
        id="scroll-down" x="0" y="0" version="1.1" viewBox="0 0 54 79.4"
    >
        <path class="fleche" stroke-miterlimit=10 fill="none" d="M27 78.9C12.4 78.9.5 67 .5 52.4V27C.5 12.4 12.4.5 27 .5S53.5 12.3 53.5 27v25.4C53.5 67 41.6 78.9 27 78.9zM27 20v27.2"/>
        <path class="cadre" d="M18.6 44.7 27 59.2l8.4-14.5z"/>
    </svg>
    </button>
</main>

<!-- <div id="scroll-siblings" class="w-screen h-screen bg-[blue] bg-[url('/intro/assistance-reparation-02.png')]"/>
<div id="scroll-siblings-2" class="w-screen aspect-video bg-[red] bg-[url('/intro/assistance-reparation-02.png')]"/> -->

<style lang="postcss">
    
    .section-wrappers {
        @apply absolute top-0 invisible w-full h-screen max-h-screen;
    }
    
</style>