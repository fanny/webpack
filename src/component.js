export default (text = 'This is my webpack setup') => {
  const element = document.createElement('div');

  element.innerHTML = text;
  return element;
}
