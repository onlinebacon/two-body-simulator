let textarea = document.createElement('textarea');
export const setTextarea = (dom) => {
	textarea = dom;
};
export const clear = () => textarea.value = '';
export const log = (message) => {
	textarea.value += message + '\n';
};
