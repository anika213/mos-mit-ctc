export function shuffleArray(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function isColliding(elm1, elm2) {
  return !(
    elm1.getClientRect().x >
      elm2.getClientRect().x + elm2.getClientRect().width ||
    elm1.getClientRect().x + elm1.getClientRect().width <
      elm2.getClientRect().x ||
    elm1.getClientRect().y >
      elm2.getClientRect().y + elm2.getClientRect().height ||
    elm1.getClientRect().y + elm1.getClientRect().height <
      elm2.getClientRect().y
  );
}

export function toAlphabetBase26(i) {
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  while (i >= 0) {
    result = alphabet[i % 26] + result;
    i = Math.floor(i / 26) - 1;
  }
  return result;
}
