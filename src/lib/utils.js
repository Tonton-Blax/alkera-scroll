import { readable } from 'svelte/store';

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