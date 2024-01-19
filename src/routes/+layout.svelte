<script>
  import "../app.css";
  import Lenis from '@studio-freight/lenis'
  import { onMount } from "svelte";
  import ScrollTrigger from 'gsap/dist/ScrollTrigger.js';
  import gsap from "gsap";
  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    // const lenis = new Lenis({lerp:0.06, gestureDirection: 'vertical' }) 
    // function raf(time) {
    //   lenis.raf(time)
    //   requestAnimationFrame(raf)
    // }
    // requestAnimationFrame(raf)

  })
</script>

<slot />