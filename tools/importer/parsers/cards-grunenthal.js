/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-grunenthal
 * Base block: cards
 * Source: https://www.grunenthal.de
 * Instance: .component.gxstoriescarousel
 *
 * Block library structure (2 columns per row):
 *   Each row: col1 = image | col2 = title + description + optional CTA
 *   One row per card item
 *
 * Source DOM structure:
 *   .gxstoriescarousel > .row > .columns-12 > .slider > div > .storyCarouselItem
 *   Each .storyCarouselItem has:
 *     - a.image > img (thumbnail)
 *     - .story-card-content > .text > a.storyTitle (linked title)
 *     - .story-card-content > .text > p (excerpt)
 *     - .story-card-content > .text > .storyDate (date text)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all carousel items
  const items = element.querySelectorAll('.storyCarouselItem');

  items.forEach((item) => {
    // --- Image cell ---
    const img = item.querySelector('a.image img, .storyCarouselItem > a > img');
    const imgCell = document.createElement('div');
    if (img) {
      imgCell.append(img);
    }

    // --- Text content cell ---
    const textCell = document.createElement('div');

    // Title as a linked heading
    const titleLink = item.querySelector('a.storyTitle');
    if (titleLink) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleLink.textContent.trim();
      strong.append(a);
      p.append(strong);
      textCell.append(p);
    }

    // Description paragraph
    const desc = item.querySelector('.story-card-content .text > p');
    if (desc) {
      textCell.append(desc);
    }

    // Date
    const dateEl = item.querySelector('.storyDate');
    if (dateEl) {
      const dateText = dateEl.textContent.trim();
      if (dateText) {
        const datePara = document.createElement('p');
        datePara.textContent = dateText;
        textCell.append(datePara);
      }
    }

    if (imgCell.children.length > 0 || textCell.children.length > 0) {
      cells.push([imgCell, textCell]);
    }
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-grunenthal',
    cells,
  });
  element.replaceWith(block);
}
