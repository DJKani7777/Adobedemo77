/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Grünenthal cleanup.
 * Removes non-authorable content from grunenthal.de pages.
 * Selectors from captured DOM of https://www.grunenthal.de
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent manager (from captured DOM: #cmpbox, .cmplazypreviewmsg)
    WebImporter.DOMUtils.remove(element, [
      '#cmpbox',
      '.cmplazypreviewmsg',
      '[class*="cmplazy"]',
      '[class*="cmpbox"]',
      '[id*="cmpbox"]',
    ]);
  }
  if (hookName === H.after) {
    // Remove header/navigation (from captured DOM: .header-site-furniture, .navigation-functional, .navigation-main)
    WebImporter.DOMUtils.remove(element, [
      '.header-site-furniture',
      '.navigation-functional',
      '.navigation-main',
      '.header-brand',
    ]);
    // Remove footer (from captured DOM: footer.footer-site#page-footer)
    WebImporter.DOMUtils.remove(element, [
      'footer.footer-site',
      '#page-footer',
    ]);
    // Remove iframes, links, noscript, source elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);
    // Clean data attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-cmp');
    });
  }
}
