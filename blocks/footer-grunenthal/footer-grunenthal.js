import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/content/grunenthal-footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Assign classes to footer sections
  const sections = [...footer.children];
  if (sections[0]) sections[0].classList.add('footer-brand');

  // Middle sections are link columns
  const columns = sections.slice(1, -1);
  if (columns.length) {
    const columnsWrap = document.createElement('div');
    columnsWrap.className = 'footer-columns';
    columns.forEach((col) => {
      col.classList.add('footer-column');
      columnsWrap.append(col);
    });
    footer.insertBefore(columnsWrap, sections[0].nextSibling);
  }

  // Last section is bottom bar
  const lastSection = footer.querySelector(':scope > div:last-child');
  if (lastSection) lastSection.classList.add('footer-bottom');

  block.append(footer);
}
