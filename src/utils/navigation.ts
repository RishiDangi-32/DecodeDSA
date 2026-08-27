/**
 * Lightweight client-side router navigation helper.
 * Pushes path to history and dispatches a popstate event to trigger rerendering in listener hooks.
 */
export const navigate = (to: string) => {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
};
