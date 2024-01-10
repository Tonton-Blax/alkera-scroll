<script>
    import Intro2 from "$lib/Intro2.svelte";
    import Chiffres from "$lib/Chiffres.svelte";
    import Orbites from '$lib/Orbites.svelte';
    // import Lenis from '@studio-freight/lenis'
    // import { onMount } from "svelte";
    // import ScrollTrigger from 'gsap/dist/ScrollTrigger.js';
    // import gsap from 'gsap';
    // import { browser } from "$app/environment";

    // if (browser)
    //     gsap.registerPlugin(ScrollTrigger);

    // onMount(async()=>{
    //     const lenis = new Lenis()

    //     lenis.on('scroll', ScrollTrigger.update)

    //     gsap.ticker.add((time)=>{
    //         lenis.raf(time * 1000)
    //     })

    //     gsap.ticker.lagSmoothing(0.1)
    // })
</script>


<Intro2/>
<div id="sections-wrapper">
    <Chiffres/>
    <Orbites/>
    <section class="w-full aspect-video relative bg-pervenche" />
</div>


