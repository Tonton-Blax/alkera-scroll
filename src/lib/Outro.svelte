<script>
	import gsap from 'gsap';
	import TextPlugin from 'gsap/TextPlugin';
	import ScrollTrigger from 'gsap/dist/ScrollTrigger.js';
    import { onMount, tick } from 'svelte';
    export let order=1;

	let activeTopic = 0;


    /** @type {HTMLElement} */
    let outroEl
	/** @type {gsap.core.Timeline} */
	let textContentTl;
	/** @type {gsap.core.Timeline} */
	let outroTl;

	const textContent = [
		'Prendre part à la transition écologique et mettre en place une stratégie bas carbone',
		'Mener nos activités de façon éthique, innovante et agir en entreprise responsable et citoyenne',
		'Contribuer au développement des compétences, encourager la diversité et la mixité, et améliorer le bien-être de nos collaborateurs'
	]

	onMount(async() => {
		gsap.registerPlugin(TextPlugin, ScrollTrigger);

		gsap.set('#trait-gauche', { xPercent: -100 });

		textContentTl = gsap.timeline({ 
			paused: true,
			onStart: () => gsap.to('.outro-text-content', { 
				text: { value: textContent[activeTopic] }, 
				delay: 0.1
			}),
			defaults: { ease: 'back.out(2)'} 
		})
		.to('#outro-text', { scale: 0.1, duration: 0.25 })
		.to('#outro-text', { scale: 1, duration: 0.25 })
		.to('#trait-gauche', { xPercent: -75, duration: 0.25 },0)
		.to('#trait-gauche', { xPercent: 0, duration: 0.25 },'>');


		outroTl = gsap.timeline({ 
			defaults: { ease: 'none' },
			scrollTrigger:  {
                refreshPriority: order,
                trigger: '#section-outro',
				anticipatePin: true,
                scrub: 1,
                start: (/** @type {{ previous: () => any; }} */ self) => {
                    return self.previous() ? self.previous().end + (outroEl?.offsetHeight) : 'top bottom';
                },                
                end: '+=300%',
                pin: '#sections-wrapper',
            }
        })
		.to('.bloc-text-contenu', 
			{ y: 0, duration: 2, ease: 'Power4.out' }, 
		)
		.call(changeTopic, [0, false], 0)
		.call(changeTopic, [1, false], 0.9)
		.call(changeTopic, [2, false], 1.8)
	});

	/** @param {number} topicIndex @param {boolean} removeTl */
	function changeTopic(topicIndex, removeTl = true) {

		if (removeTl && outroTl.progress() < 1) {
			outroTl.progress(1);
			//outroTl.kill();
		}

		activeTopic = topicIndex;
		textContentTl.restart().play()
	}

</script>
<section 
    id="section-outro" class="flex min-w-screen aspect-[9/16] md:aspect-video bg-white"
    bind:this={outroEl}
>
	<div class="w-full h-3/4 self-center flex">

		<div class="relative w-[33.3%] h-full px-[4vw]">
			<div id="bloc-text" 
				class="absolute h-full text-[1.1vw] leading-[2.4vw] my-auto overflow-hidden font-light flex"
			>
				<span class="bloc-text-contenu flex items-center h-full text-feuille translate-y-full">
					Témoins au quotidien d’une
					sinistralité climatique qui devient,
					chaque année, toujours plus
					intense et fréquente, nous avons
					la responsabilité d’agir.
					Aujourd’hui pour transformer
					durablement notre entreprise
					nous minimisons notre impact
					négatif sur l’environnement et
					maximisons notre impact positif
					sur la société comme dans nos
					pratiques d’entreprise.
				</span>
			</div>
		</div>

		<!-- cercle central -->
		<div class="h-full w-[33.3%] flex p-[6vw]">
			<div class="w-full h-fit aspect-square self-center bg-feuille rounded-full bg-[url('/outro/alkera-sengage.png')] bg-contain"></div>
		</div>
		<div class="relative h-full w-[33.3%] flex p-[6vw] items-center">
			
			<div id="trait-gauche" class="absolute -left-1/4 origin-center h-px w-[42.8%] border-dashed border-[0.75px] border-feuille z-[0]"></div>
			<div id="outro-text"
				class="flex items-center scale-0 px-12 text-center font-semibold text-[1vw] w-full aspect-square overflow-hidden self-center bg-amande rounded-full"
			>
				<span class="outro-text-content w-full h-full flex items-center text-center">
					{textContent[0]}
				</span>
			</div>
		</div>
		<!-- section droite -->
		

		<div class="h-full w-[5%] flex justify-end">
			<div class="flex flex-col justify-center items-start w-full space-y-[1.1vw]">
				{#each textContent as topic,i}
					<button 
						class="rounded-full w-[1.1vw] aspect-square {activeTopic === i ? 'bg-feuille cursor-default' : 'border-feuille border hover:scale-[120%]'} transition-all"
						on:click={()=>changeTopic(i)}
					/>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	  #bloc-text:after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        background-image: linear-gradient( #D6FC8A00 80%, white 100% );
    }

    .bloc-text-contenu::-webkit-scrollbar {
        display: none;
    }
    .bloc-text-contenu {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
</style>