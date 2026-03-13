var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-grunenthal.js
  function parse(element, { document }) {
    const cells = [];
    const bgPicture = element.querySelector(
      ".hero-home__image-wrapper picture, .tout-primary__image-wrapper picture, .tout-primary__image"
    );
    const bgImg = bgPicture ? bgPicture.querySelector("img") : element.querySelector(".hero-home__image-wrapper img, .tout-primary__image-wrapper img");
    if (bgImg) {
      cells.push([bgImg]);
    }
    const contentWrapper = document.createElement("div");
    const heading = element.querySelector(
      "h1.hero-home__title, h2.tout-primary__title, .hero-home__content h1, .tout-primary__content h2"
    );
    if (heading) {
      contentWrapper.append(heading);
    }
    const excerpt = element.querySelector(".tout-primary__excerpt");
    if (excerpt) {
      const paragraphs = excerpt.querySelectorAll("p");
      paragraphs.forEach((p) => contentWrapper.append(p));
    }
    const ctaButtons = element.querySelectorAll(
      ".hero-home__content > a.button, .tout-primary__content > a.button, .tout-primary__content > br + a.button"
    );
    ctaButtons.forEach((btn) => {
      const iconSpans = btn.querySelectorAll("span.icon-right, span.button__elipsis");
      iconSpans.forEach((s) => s.remove());
      contentWrapper.append(btn);
    });
    if (contentWrapper.children.length > 0) {
      cells.push([contentWrapper]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-grunenthal",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-grunenthal.js
  function parse2(element, { document }) {
    var _a, _b;
    const cells = [];
    const isGcImage = element.classList.contains("gcimage");
    const isToutSecondary = element.classList.contains("tout__secondary");
    const isVideo = element.classList.contains("gcvideovimeo");
    if (isToutSecondary) {
      const imgEl = element.querySelector(".tout__secondary__image img, .tout-secondary__picture img");
      const heading = element.querySelector("h2.tout__secondary__title");
      const excerpt = element.querySelector(".tout__secondary__excerpt");
      const ctaBtn = element.querySelector(".tout__secondary__content > a.button");
      const imgCell = document.createElement("div");
      if (imgEl) {
        imgCell.append(imgEl);
      }
      const textCell = document.createElement("div");
      if (heading) {
        textCell.append(heading);
      }
      if (excerpt) {
        const p = document.createElement("p");
        p.textContent = excerpt.textContent.trim();
        textCell.append(p);
      }
      if (ctaBtn) {
        const iconSpans = ctaBtn.querySelectorAll("span.icon-right, span.button__elipsis");
        iconSpans.forEach((s) => s.remove());
        textCell.append(ctaBtn);
      }
      cells.push([imgCell, textCell]);
    } else if (isGcImage) {
      const img = element.querySelector("img");
      const columnParent = element.closest(".column-splitter") || ((_a = element.closest(".medium-6")) == null ? void 0 : _a.parentElement);
      const imgCell = document.createElement("div");
      if (img) {
        imgCell.append(img);
      }
      const textCell = document.createElement("div");
      if (columnParent) {
        const siblingCols = columnParent.querySelectorAll(":scope > .medium-6");
        for (const col of siblingCols) {
          if (col.contains(element)) continue;
          const richtext = col.querySelector(".richtext");
          if (richtext) {
            const h2 = richtext.querySelector("h2");
            const p = richtext.querySelector("p");
            if (h2) textCell.append(h2);
            if (p) textCell.append(p);
            break;
          }
        }
      }
      cells.push([imgCell, textCell]);
    } else if (isVideo) {
      const extractVimeoLink = (videoEl) => {
        const iframe = videoEl.querySelector("iframe");
        const previewImg = videoEl.querySelector(".cmplazypreviewiframe > img");
        let vimeoId = null;
        if (iframe && iframe.title) {
          const match = iframe.title.match(/(\d{6,})/);
          if (match) vimeoId = match[1];
        }
        if (!vimeoId && previewImg && previewImg.src) {
          const match = previewImg.src.match(/vimeo\/(\d+)/);
          if (match) vimeoId = match[1];
        }
        if (vimeoId) {
          const a = document.createElement("a");
          a.href = `https://vimeo.com/${vimeoId}`;
          a.textContent = `https://vimeo.com/${vimeoId}`;
          return a;
        }
        return null;
      };
      const thisVideoLink = extractVimeoLink(element);
      const col1 = document.createElement("div");
      if (thisVideoLink) col1.append(thisVideoLink);
      const columnParent = element.closest(".column-splitter") || ((_b = element.closest(".medium-6")) == null ? void 0 : _b.parentElement);
      const col2 = document.createElement("div");
      if (columnParent) {
        const siblingVideos = columnParent.querySelectorAll(".gcvideovimeo");
        for (const sv of siblingVideos) {
          if (sv === element) continue;
          const siblingLink = extractVimeoLink(sv);
          if (siblingLink) {
            col2.append(siblingLink);
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
      name: "columns-grunenthal",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-grunenthal.js
  function parse3(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".storyCarouselItem");
    items.forEach((item) => {
      const img = item.querySelector("a.image img, .storyCarouselItem > a > img");
      const imgCell = document.createElement("div");
      if (img) {
        imgCell.append(img);
      }
      const textCell = document.createElement("div");
      const titleLink = item.querySelector("a.storyTitle");
      if (titleLink) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        const a = document.createElement("a");
        a.href = titleLink.href;
        a.textContent = titleLink.textContent.trim();
        strong.append(a);
        p.append(strong);
        textCell.append(p);
      }
      const desc = item.querySelector(".story-card-content .text > p");
      if (desc) {
        textCell.append(desc);
      }
      const dateEl = item.querySelector(".storyDate");
      if (dateEl) {
        const dateText = dateEl.textContent.trim();
        if (dateText) {
          const datePara = document.createElement("p");
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
      name: "cards-grunenthal",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/grunenthal-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#cmpbox",
        ".cmplazypreviewmsg",
        '[class*="cmplazy"]',
        '[class*="cmpbox"]',
        '[id*="cmpbox"]'
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".header-site-furniture",
        ".navigation-functional",
        ".navigation-main",
        ".header-brand"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.footer-site",
        "#page-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript",
        "source"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-cmp");
      });
    }
  }

  // tools/importer/transformers/grunenthal-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          try {
            sectionEl = element.querySelector(sel);
          } catch (e) {
          }
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-grunenthal": parse,
    "columns-grunenthal": parse2,
    "cards-grunenthal": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Gr\xFCnenthal corporate homepage with hero banner, content sections, and corporate information",
    urls: [
      "https://www.grunenthal.de"
    ],
    blocks: [
      {
        name: "hero-grunenthal",
        instances: [".hero-home", ".tout.tout-primary"]
      },
      {
        name: "columns-grunenthal",
        instances: [".component.gcimage", "article.tout__secondary", ".component.gcvideovimeo"]
      },
      {
        name: "cards-grunenthal",
        instances: [".component.gxstoriescarousel"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: ".hero-home",
        style: null,
        blocks: ["hero-grunenthal"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Intro Text",
        selector: ".row-splitter:has(.small-spacer-m)",
        style: null,
        blocks: [],
        defaultContent: [".richtext.richtext--standard h2", ".richtext.richtext--standard p"]
      },
      {
        id: "section-3",
        name: "Vision",
        selector: [".row-splitter:has(.gcimage)", ".component.gcimage"],
        style: null,
        blocks: ["columns-grunenthal"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "News",
        selector: ".row-splitter:has(.gxstoriescarousel)",
        style: null,
        blocks: ["cards-grunenthal"],
        defaultContent: [".gcsectionheader .section-header__title"]
      },
      {
        id: "section-5",
        name: "Service Touts",
        selector: [".row-splitter:has(.tout__secondary)", ".gctout:has(.tout__secondary)"],
        style: null,
        blocks: ["columns-grunenthal"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Videos",
        selector: ".row-splitter:has(.gcvideovimeo)",
        style: null,
        blocks: ["columns-grunenthal"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Career",
        selector: ".row-splitter:has(.tout-primary)",
        style: null,
        blocks: ["hero-grunenthal"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Disclaimer",
        selector: [".row-splitter:has(.richtext--standard):last-of-type", ".row-splitter:last-of-type"],
        style: null,
        blocks: [],
        defaultContent: [".richtext.richtext--standard p"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
              element
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
