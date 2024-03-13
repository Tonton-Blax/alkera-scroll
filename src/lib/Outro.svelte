<script>
	import gsap from 'gsap';
	import TextPlugin from 'gsap/TextPlugin';
    import { onMount } from 'svelte';
    import { scrollyTeller } from './utils';
	import ScrollToPlugin from 'gsap/ScrollToPlugin';
    
    /** @type {App.Anims} */
	export let anims;

	export let imgPath = '';

	/** @type {HTMLElement} */
    export let sectionEl;

	let activeTopic = 0;


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
		gsap.registerPlugin(TextPlugin, ScrollToPlugin);
		
		gsap.set('#trait-gauche', { xPercent: -100 });

		textContentTl = gsap.timeline({ 
			paused: true,
			defaults: { ease: 'back.out(2)'} 
		})
		.to('#outro-text', { scale: 0.1, duration: 0.25 })
		.to('#outro-text', { scale: 1, duration: 0.25 })
		.to('#trait-gauche', { xPercent: -90, duration: 0.25 },0)
		.to('#trait-gauche', { xPercent: 5, duration: 0.25 },'>')
		
		outroTl = gsap.timeline({ 
			defaults: { ease: 'none' },
        })
		.to('.outro-bloc-text-contenu', 
			{ yPercent: -100, duration: 1, ease: 'Power4.out' }, 
		).to(textContentTl, { progress:1 },0)

		anims = gsap.timeline({ paused:true }).add(outroTl);
		anims.vars= { immediate : true, handleNext: handleNext };

	});

	/** @param {number} topicIndex @param {boolean} removeTl */
	function changeTopic(topicIndex, removeTl = true) {		
		activeTopic = topicIndex;
		textContentTl.restart().play()
		return;
	}

	/** @param {number} direction */
	function handleNext (direction) {
		if (textContentTl.isActive())
			return true;
		
		if (direction === 1) {

			if (activeTopic < textContent.length - 1) {
				changeTopic(activeTopic + 1)
				return true;
			} else {
				$scrollyTeller = false;
				return false;
			}

		}
		if (direction === -1 && activeTopic > 0) {
			changeTopic(activeTopic - 1);
			return true;
		}
		else return false;
	}

	
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<section 
    id="section-outro" class="flex min-w-screen w-full h-screen bg-white overflow-y-hidden"
    bind:this={sectionEl}
>
	<div class="w-full h-3/4 self-center flex">

		<div class="h-full w-[12%] flex justify-end">
			<div class="flex flex-col justify-center items-start w-full space-y-[1.1vw]">
				&nbsp;
			</div>
		</div>

		<div class="relative w-[26%] h-full pr-[2vw]">
			<div id="bloc-text" 
				class="absolute h-full text-[1.1vw] leading-[2.4vw] my-auto overflow-hidden font-light flex"
			>
				<span class="outro-bloc-text-contenu flex items-center h-full text-feuille translate-y-full">
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
		<div class="h-full w-[24%] flex p-[2vw]">
			<div 
				id="cercle-central" 
				class="w-full h-fit aspect-square bg-feuille self-center rounded-full bg-contain"
			>
				<img src="{imgPath}/outro/alkera-sengage.png" alt="alkera-sengage" class="w-full h-full object-cover">
			</div>
		</div>
		<div class="relative h-full w-[26%] flex p-[3.2vw] items-center">
			
			<div id="trait-gauche" class="alkera-line foret absolute -left-1/4 origin-center h-px w-[42.8%] z-[0]"></div>
			<div id="outro-text"
				class="flex items-center scale-0 px-12 text-center font-semibold text-[1vw] w-full aspect-square overflow-hidden self-center bg-amande rounded-full"
			>
				<span class="outro-text-content text-feuille w-full h-full flex items-center text-center">
					{textContent[activeTopic]}
				</span>
			</div>
		</div>
		<!-- section droite -->
		

		<div class="h-full w-[12%] flex justify-end">
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
	
    *  {
        font-family: "field-gothic-wide",sans-serif;
    }

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

    .outro-bloc-text-contenu::-webkit-scrollbar {
        display: none;
    }
    .outro-bloc-text-contenu {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }

</style>