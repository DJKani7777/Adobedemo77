/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-grunenthal
 * Base block: hero
 * Source: https://www.grunenthal.de
 * Instances: .hero-home, .tout.tout-primary
 *
 * Block library structure (1 column, 2 content rows):
 *   Row 1: Background image (optional)
 *   Row 2: Title (heading) + Subheading (optional) + CTA (optional)
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Extract background image ---
  // .hero-home uses .hero-home__image-wrapper picture > img
  // .tout-primary uses .tout-primary__image-wrapper picture > img
  const bgPicture = element.querySelector(
    '.hero-home__image-wrapper picture, .tout-primary__image-wrapper picture, .tout-primary__image'
  );
  const bgImg = bgPicture
    ? bgPicture.querySelector('img')
    : element.querySelector('.hero-home__image-wrapper img, .tout-primary__image-wrapper img');

  if (bgImg) {
    cells.push([bgImg]);
  }

  // --- Extract content: heading, description, CTAs ---
  // All content goes into a single cell (wrapped in a div container)
  const contentWrapper = document.createElement('div');

  // Heading: h1 or h2 inside content area
  // .hero-home: h1.hero-home__title (wrapped in <a>)
  // .tout-primary: h2.tout-primary__title (wrapped in <a>)
  const heading = element.querySelector(
    'h1.hero-home__title, h2.tout-primary__title, .hero-home__content h1, .tout-primary__content h2'
  );
  if (heading) {
    contentWrapper.append(heading);
  }

  // Description/excerpt (tout-primary has .tout-primary__excerpt)
  const excerpt = element.querySelector('.tout-primary__excerpt');
  if (excerpt) {
    const paragraphs = excerpt.querySelectorAll('p');
    paragraphs.forEach((p) => contentWrapper.append(p));
  }

  // CTA buttons
  const ctaButtons = element.querySelectorAll(
    '.hero-home__content > a.button, .tout-primary__content > a.button, .tout-primary__content > br + a.button'
  );
  ctaButtons.forEach((btn) => {
    // Clean up button: remove icon spans and ellipsis spans
    const iconSpans = btn.querySelectorAll('span.icon-right, span.button__elipsis');
    iconSpans.forEach((s) => s.remove());
    contentWrapper.append(btn);
  });

  if (contentWrapper.children.length > 0) {
    cells.push([contentWrapper]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-grunenthal',
    cells,
  });
  element.replaceWith(block);
}
