import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/fragments/grunenthal-footer';
  const resp = await fetch(`${footerPath}.html`);
  if (!resp.ok) return;
  const html = await resp.text();
  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  // Wrap each section's content in default-content-wrapper (mimics EDS decoration)
  [...fragment.children].forEach((section) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'default-content-wrapper';
    while (section.firstChild) wrapper.append(section.firstChild);
    section.append(wrapper);
  });

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
