// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {

		type Metier = undefined | 'audit' | 'gestion' | 'assistance' | 'delegation' | 'initial';
		type OrbitName = 'internal' | 'middle' | 'external';

		type Anims = gsap.core.Timeline;
		type Planet = {
			url: string;
			id: string;
			orbit: OrbitName;
			order: integer;
			tl?: gsap.core.Timeline;
			groups: Metier[];
		};

		type OffsetGroup = {
			[key in Metier]: number;
		};

		type Orbit = {
			el: SVGEllipseElement | undefined;
			offsetGroup: OffsetGroup;
			minMaxSizes: [number, number];
			planets: Planet[];
			forward?: boolean;
			progress?: number;
			direction: { direction: 1 | -1, progress: number }
		};

		type Orbits = Record<OrbitName, Orbit>;
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
