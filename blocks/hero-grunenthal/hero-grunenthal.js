export default function decorate(block) {
  const firstDiv = block.querySelector(':scope > div:first-child');
  if (firstDiv && !firstDiv.querySelector('picture') && !firstDiv.querySelector('img')) {
    block.classList.add('no-image');
  }
}
