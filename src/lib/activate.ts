/**
 * Wraps an action so it only runs on Enter/Space — the activation keys for
 * `role="button"` elements. Prevents OS/browser shortcuts (e.g. Cmd+Tab)
 * from unintentionally triggering the action on a focused element.
 */
export const activateOnEnterOrSpace = (action: () => void) => (event: KeyboardEvent) => {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		action();
	}
};
