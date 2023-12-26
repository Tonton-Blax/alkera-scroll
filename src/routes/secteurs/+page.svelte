<script>
    import { browser } from '$app/environment';
    import gsap from 'gsap';
    import MotionPathPlugin from 'gsap/dist/MotionPathPlugin.js';
    import { onMount, tick } from 'svelte';
    import DrawSVGPlugin from "$lib/gsap/DrawSVGPlugin";
    import { getDirection } from '$lib/utils'

    let SVG;

    if (browser)
        gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin);

    onMount(async() => {
        gsap.timeline()
        .to('.mask-content', {drawSVG: '0%', ease: "none", duration: 1, reversed:true }, 0 )
        .from('circle', {r:0, duration: 1.35, ease: "Power3.Out", stagger: { each: 0.08 }}, 0 )
    })
</script>


<section id="section-orbits" class="w-screen bg-amande max-h-screen relative">
    <div id="bloc-text" class="absolute">
        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
    </div>
    <svg bind:this={SVG} 
        color-interpolation-filters="sRGB"
        shape-rendering="optimizeSpeed"
        text-rendering="optimizeSpeed"
        class="w-full h-auto mx-auto overflow-visible" 
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1920 1050"
    >

    <mask id="mask-part-1" class="mask-part" maskUnits="userSpaceOnUse">
        <path class="mask-content" fill="none" stroke="white" d="M335.7,343.15h452.29 c55.61,0,100.69,45.08,100.69,100.69v0c0,55.61-45.08,100.69-100.69,100.69H288.21"/>        
    </mask>
    <mask id="mask-part-2" class="mask-part" maskUnits="userSpaceOnUse">
        <path class="mask-content" fill="none" stroke="white" d="M732.25,745.91H288.21 c-55.61,0-100.69-45.08-100.69-100.69v0c0-55.61,45.08-100.69,100.69-100.69"/>
    </mask>
        <path class="path-part part-1" mask="url(#mask-part-1)" fill="none" stroke="#12473B" stroke-linecap="round" stroke-miterlimit="10" stroke-dasharray="9" d="M335.7,343.15h452.29 c55.61,0,100.69,45.08,100.69,100.69v0c0,55.61-45.08,100.69-100.69,100.69H288.21"/>
        <path class="path-part part-2" mask="url(#mask-part-2)" fill="none" stroke="#12473B" stroke-linecap="round" stroke-miterlimit="10" stroke-dasharray="9" d="M732.25,745.91H288.21 c-55.61,0-100.69-45.08-100.69-100.69v0c0-55.61,45.08-100.69,100.69-100.69"/>
        
        <circle fill="#12473B" cx="331.03" cy="338.55" r="65.53"/>
        <circle fill="#12473B" cx="537.08" cy="338.55" r="65.53"/>
        <circle fill="#12473B" cx="743.06" cy="338.55" r="65.53"/>
        <circle fill="#12473B" cx="331.09" cy="544.53" r="65.53"/>
        <circle fill="#12473B" cx="537.08" cy="544.53" r="65.53"/>
        <circle fill="#12473B" cx="743.06" cy="544.53" r="65.53"/>
        <circle fill="#12473B" cx="331.09" cy="750.52" r="65.53"/>
        <circle fill="#12473B" cx="537.08" cy="750.52" r="65.53"/>
        <circle fill="#12473B" cx="743.06" cy="750.52" r="65.53"/>
    </svg>

</section>

<style lang="postcss">
    
    path {
        stroke-width: 1px;
        /* opacity: 1; */
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
        background-image: linear-gradient( #DBFF94FF 10%, #DBFF9400 100% );
    }
    /* #bloc-text:after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-image: linear-gradient( #DBFF94FF 10%, #DBFF9400 100% );
    } */

</style>