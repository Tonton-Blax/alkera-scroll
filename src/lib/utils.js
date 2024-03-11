import { readable, writable } from 'svelte/store';

export const scrollyTeller = writable(true);

/** @param {string}  */
export function mq(query) {
    let tries = 0;
	if (typeof window === 'undefined') {
        if (tries < 5) {
            tries++;
            console.log('No window, trying again in 100ms');
            setTimeout(() => mq(query), 100);
        }
        return readable('');
	}
	const mediaQueryList = window.matchMedia(query);

	const mediaStore = readable(mediaQueryList.matches, (set) => {
		const handleChange = () => set(mediaQueryList.matches);

		try {
			mediaQueryList.addEventListener('change', handleChange);
		} catch (_) {
			mediaQueryList.addListener(handleChange);
		}

		return () => {
			try {
				mediaQueryList.removeEventListener('change', handleChange);
			} catch (_) {
				mediaQueryList.removeListener(handleChange);
			}
		};
	});
	return mediaStore;
}
export const md = mq('(min-width: 768px)');

/** @param {HTMLElement} node */
export function clickOutside(node) {
  
	const handleClick = (/** @type {{ target: Node | null; defaultPrevented: any; }} */ event) => {
	  if (node && !node.contains(event.target) && !event.defaultPrevented) {
		node.dispatchEvent(
		  new CustomEvent('click_outside', /** @type {any} */ (node))
		)
	  }
	}
  
	  // @ts-ignore
	  document.addEventListener('click', handleClick, true);
	
	return {
	  destroy() {
		// @ts-ignore
		document.removeEventListener('click', handleClick, true);
	  }
	}
}
/** @param {any} thing */
export function isFn (thing) { 
	return typeof thing === 'function';
}