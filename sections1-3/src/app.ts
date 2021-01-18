const button = document.querySelector('button');

function clickHandler(message: string) {
  console.log('click ' + message);
}

button?.addEventListener('click', clickHandler.bind(null, 'me'));
