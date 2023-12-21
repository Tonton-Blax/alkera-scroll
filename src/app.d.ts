// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {

		type Metier = undefined | 'audit' | 'gestion' | 'assistance' | 'delegation';
		type Planet = {
			url: string;
			id: string;
			orbit: 'internal' | 'middle' | 'external';
			start: number;
			tl?: gsap.core.Timeline;
			groups: Metier[];
		};

		type OffsetGroup = {
			audit: number;
			gestion: number;
			assistance: number;
			delegation: number;
		};

		type Orbit = {
			el: SVGEllipseElement | undefined;
			offsetGroup: OffsetGroup;
			minMaxSizes: [number, number];
			planets: Planet[];
		};

		type Orbits = {
			internal: Orbit;
			middle: Orbit;
			external: Orbit;
		};
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
