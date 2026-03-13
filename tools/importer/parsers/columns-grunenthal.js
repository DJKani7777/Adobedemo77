/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-grunenthal
 * Base block: columns
 * Source: https://www.grunenthal.de
 * Instances:
 *   - .component.gcimage (Vision section: image + richtext side by side)
 *   - article.tout__secondary (Service touts: image + heading/excerpt/CTA)
 *   - .component.gcvideovimeo (Videos: Vimeo embeds side by side)
 *
 * Block library structure (N columns per row):
 *   Each row: col1 | col2 (content in each cell: text, images, links)
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Detect which instance type ---
  const isGcImage = element.classList.contains('gcimage');
  const isToutSecondary = element.classList.contains('tout__secondary');
  const isVideo = element.classList.contains('gcvideovimeo');

  if (isToutSecondary) {
    // --- article.tout__secondary ---
    // Structure: image link + content div (heading, excerpt, CTA)
    const imgEl = element.querySelector('.tout__secondary__image img, .tout-secondary__picture img');
    const heading = element.querySelector('h2.tout__secondary__title');
    const excerpt = element.querySelector('.tout__secondary__excerpt');
    const ctaBtn = element.querySelector('.tout__secondary__content > a.button');

    // Build image cell
    const imgCell = document.createElement('div');
    if (imgEl) {
      imgCell.append(imgEl);
    }

    // Build text cell
    const textCell = document.createElement('div');
    if (heading) {
      // Unwrap heading from its link wrapper if needed - keep h2 with link inside
      textCell.append(heading);
    }
    if (excerpt) {
      const p = document.createElement('p');
      p.textContent = excerpt.textContent.trim();
      textCell.append(p);
    }
    if (ctaBtn) {
      // Clean up button spans
      const iconSpans = ctaBtn.querySelectorAll('span.icon-right, span.button__elipsis');
      iconSpans.forEach((s) => s.remove());
      textCell.append(ctaBtn);
    }

    cells.push([imgCell, textCell]);
  } else if (isGcImage) {
    // --- .component.gcimage (Vision section) ---
    // Image is in this element; text is in a sibling .medium-6 column
    const img = element.querySelector('img');

    // Navigate up to the column-splitter to find sibling text column
    const columnParent = element.closest('.column-splitter')
      || element.closest('.medium-6')?.parentElement;

    const imgCell = document.createElement('div');
    if (img) {
      imgCell.append(img);
    }

    const textCell = document.createElement('div');
    if (columnParent) {
      // Find the sibling medium-6 column that contains richtext
      const siblingCols = columnParent.querySelectorAll(':scope > .medium-6');
      for (const col of siblingCols) {
        if (col.contains(element)) continue; // skip the image column
        const richtext = col.querySelector('.richtext');
        if (richtext) {
          const h2 = richtext.querySelector('h2');
          const p = richtext.querySelector('p');
          if (h2) textCell.append(h2);
          if (p) textCell.append(p);
          break;
        }
      }
    }

    cells.push([imgCell, textCell]);
  } else if (isVideo) {
    // --- .component.gcvideovimeo ---
    // Extract Vimeo embed URL from iframe title or consent manager preview
    const extractVimeoLink = (videoEl) => {
      const iframe = videoEl.querySelector('iframe');
      const previewImg = videoEl.querySelector('.cmplazypreviewiframe > img');
      let vimeoId = null;

      if (iframe && iframe.title) {
        // Title format: "Vimeo Video 361010643"
        const match = iframe.title.match(/(\d{6,})/);
        if (match) vimeoId = match[1];
      }
      if (!vimeoId && previewImg && previewImg.src) {
        // Preview img src: https://cdn.consentmanager.net/delivery/cache/vimeo/361010643
        const match = previewImg.src.match(/vimeo\/(\d+)/);
        if (match) vimeoId = match[1];
      }

      if (vimeoId) {
        const a = document.createElement('a');
        a.href = `https://vimeo.com/${vimeoId}`;
        a.textContent = `https://vimeo.com/${vimeoId}`;
        return a;
      }
      return null;
    };

    // Get this video's link
    const thisVideoLink = extractVimeoLink(element);
    const col1 = document.createElement('div');
    if (thisVideoLink) col1.append(thisVideoLink);

    // Check for sibling video in same column-splitter
    const columnParent = element.closest('.column-splitter')
      || element.closest('.medium-6')?.parentElement;

    const col2 = document.createElement('div');
    if (columnParent) {
      const siblingVideos = columnParent.querySelectorAll('.gcvideovimeo');
      for (const sv of siblingVideos) {
        if (sv === element) continue;
        const siblingLink = extractVimeoLink(sv);
        if (siblingLink) {
          col2.append(siblingLink);
          // Remove sibling from DOM so it won't be processed again
          sv.remove();
          break;
        }
      }
    }

    if (col2.children.length > 0) {
      cells.push([col1, col2]);
    } else {
      cells.push([col1]);
    }
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-grunenthal',
    cells,
  });
  element.replaceWith(block);
}
