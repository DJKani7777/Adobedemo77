/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroGrunenthalParser from './parsers/hero-grunenthal.js';
import columnsGrunenthalParser from './parsers/columns-grunenthal.js';
import cardsGrunenthalParser from './parsers/cards-grunenthal.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/grunenthal-cleanup.js';
import sectionsTransformer from './transformers/grunenthal-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-grunenthal': heroGrunenthalParser,
  'columns-grunenthal': columnsGrunenthalParser,
  'cards-grunenthal': cardsGrunenthalParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Grünenthal corporate homepage with hero banner, content sections, and corporate information',
  urls: [
    'https://www.grunenthal.de',
  ],
  blocks: [
    {
      name: 'hero-grunenthal',
      instances: ['.hero-home', '.tout.tout-primary'],
    },
    {
      name: 'columns-grunenthal',
      instances: ['.component.gcimage', 'article.tout__secondary', '.component.gcvideovimeo'],
    },
    {
      name: 'cards-grunenthal',
      instances: ['.component.gxstoriescarousel'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.hero-home',
      style: null,
      blocks: ['hero-grunenthal'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Intro Text',
      selector: '.row-splitter:has(.small-spacer-m)',
      style: null,
      blocks: [],
      defaultContent: ['.richtext.richtext--standard h2', '.richtext.richtext--standard p'],
    },
    {
      id: 'section-3',
      name: 'Vision',
      selector: ['.row-splitter:has(.gcimage)', '.component.gcimage'],
      style: null,
      blocks: ['columns-grunenthal'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'News',
      selector: '.row-splitter:has(.gxstoriescarousel)',
      style: null,
      blocks: ['cards-grunenthal'],
      defaultContent: ['.gcsectionheader .section-header__title'],
    },
    {
      id: 'section-5',
      name: 'Service Touts',
      selector: ['.row-splitter:has(.tout__secondary)', '.gctout:has(.tout__secondary)'],
      style: null,
      blocks: ['columns-grunenthal'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Videos',
      selector: '.row-splitter:has(.gcvideovimeo)',
      style: null,
      blocks: ['columns-grunenthal'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Career',
      selector: '.row-splitter:has(.tout-primary)',
      style: null,
      blocks: ['hero-grunenthal'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Disclaimer',
      selector: ['.row-splitter:has(.richtext--standard):last-of-type', '.row-splitter:last-of-type'],
      style: null,
      blocks: [],
      defaultContent: ['.richtext.richtext--standard p'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
          });
        });
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
