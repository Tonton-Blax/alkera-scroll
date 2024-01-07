<script>
	import gsap from 'gsap';
    import { onMount } from 'svelte';
	
	let activeTopic = 1;

	/** @type {gsap.core.Timeline} */
	let tl;

	onMount(() => {
		tl = gsap.timeline({ paused: true, defaults: { ease: 'back.out(2)'} })
		.to('#outro-central-text', { scaleY: 0.1, duration: 0.25 })
		.to('#outro-central-text', { scaleY: 1, duration: 0.25 })
		.to('#trait-haut', { scaleY: 0.15, duration: 0.25 },0)
		.to('#trait-haut', { scaleY: 1, duration: 0.25 }, '>')
		.to('#trait-bas', { scaleY: 0.15, duration: 0.25 },0)
		.to('#trait-bas', { scaleY: 1, duration: 0.25 }, '>')
		.from('.chiffres-haut p', {
			text: "This is the new text",
        },0.25)
	})

	/** @param {number} topicIndex */
	function changeTopic(topicIndex) {
		activeTopic = topicIndex;
		tl.restart().play()
	}
</script>
<div class="flex min-w-screen aspect-video">
	<div class="w-full h-3/4 self-center flex px-[4vw]">
		<!-- left section -->
		<div class="h-full w-[39%] text-[1vw] text-feuille px-[4vw] pt-[6vh] leading-loose overflow-hidden">
			Témoins au quotidien d'une sinistralité climatique qui est, chaque année, toujours plus intense et fréquente, nous avons la responsabilité d'agir aujourd'hui pour transformer durablement notre entreprise. C’est pourquoi, nous nous engageons à réduire et maîtriser notre impact environnemental, maximiser notre impact positif sur la société et répondre aux attentes de nos collaborateurs.


			Textes accompagnant les chiffres clé (il me manque les chiffres eux-même, je cherche)
			
			- Prendre part à la transition écologique et mettre en place une stratégie bas carbone
			- Mener nos activités de façon éthique, innovante et agir en entreprise responsable et citoyenne
			- Contribuer au développement des compétences, encourager la diversité et la mixité, et améliorer le bien-être de nos collaborateurs
		</div>
		<!-- cercle central -->
		<div class="h-full w-[22%] flex">
			<div class="w-full h-fit aspect-square self-center bg-feuille rounded-full bg-[url('/orbits/alkera.png')] bg-cover"></div>
		</div>
		<!-- section droite -->
		<div class="h-full w-[39%] flex flex-col justify-center relative">

			<div id="trait-haut" class="absolute left-1/2 origin-bottom -translate-y-1/2 -translate-x-1/2 w-px h-1/4 border-dashed border-[0.75px] border-black"></div>
			<div id="trait-bas" class="absolute left-1/2 origin-top translate-y-1/2 -translate-x-1/2 w-px h-1/4 border-dashed border-[0.75px] border-black"></div>
			<div id="trait-gauche" class="absolute left-1/2 origin-right -translate-x-[200%] h-px w-1/4 border-dashed border-[0.75px] border-black z-[3]"></div>

			<div class="w-1/2 h-1/3 text-[1vw] self-center text-center text-black flex items-center justify-center p-4">
				<div id="chiffres-haut" class="chiffres leading-[1.5vh]">
					<p class="text-[2.5vw] font-bold mb-[2vh]">40</p>
					<span class="text-[0.6vw]">de dossiers résolus en moins de temps qu'il n'en faut pour dire catastrophe naturelle</span>
				</div>
			</div>

			<div id="outro-central-text" class="w-1/2 h-1/3 self-center flex z-[2]">
				<div class="self-center text-center text-[0.75vw] text-black bg-amande rounded-[3rem] flex items-center justify-center p-4">
					Témoins au quotidien d'une sinistralité climatique qui est
				</div>
			</div>

			<div class="flex flex-col w-3 space-y-3 absolute right-0">
				{#each [1,2,3] as topic}
					<button 
						class="rounded-full w-3 aspect-square {activeTopic === topic ? 'bg-feuille' : 'border-feuille border'}"
						on:click={()=>changeTopic(topic)}
					/>
				{/each}
			</div>


			<div class="w-1/2 h-1/3 text-[1vw] self-center text-center text-black flex items-center justify-center p-4">
				<div id="chiffres-bas" class="chiffres leading-[1.5vh]">
					<p class="text-[2.5vw] font-bold mb-[2vh]">75M</p>
					<span class="text-[0.6vw]">d'impôts évités grâce à l'exil fiscal</span>
				</div>
			</div>

		</div>
	</div>
</div>