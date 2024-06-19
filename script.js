gsap.registerPlugin(ScrollTrigger);

// GSAP Defaults
gsap.config({
  nullTargetWarn: false,
  trialWarn: false
});

// Lenis setup
class Scroll extends Lenis {
  constructor() {
    super({
      duration: 1.5,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // https://easings.net
      direction: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 1.5
    });

    this.time = 0;
    this.isActive = true;
    this.init();
  }

  init() {
    this.config();
    this.render();
  }

  config() {
    // allow scrolling on overflow elements
    const overscroll = [
      ...document.querySelectorAll('[data-scroll="overscroll"]')
    ];

    if (overscroll.length > 0) {
      overscroll.forEach((item) =>
        item.setAttribute("onwheel", "event.stopPropagation()")
      );
    }

    // stop and start scroll btns
    const stop = [...document.querySelectorAll('[data-scroll="stop"]')];
    if (stop.length > 0) {
      stop.forEach((item) => {
        item.onclick = () => {
          this.stop();
          this.isActive = false;
        };
      });
    }

    const start = [...document.querySelectorAll('[data-scroll="start"]')];
    if (start.length > 0) {
      start.forEach((item) => {
        item.onclick = () => {
          this.start();
          this.isActive = true;
        };
      });
    }

    // toggle page scrolling
    const toggle = [...document.querySelectorAll('[data-scroll="toggle"]')];
    if (toggle.length > 0) {
      toggle.forEach((item) => {
        item.onclick = () => {
          if (this.isActive) {
            this.stop();
            this.isActive = false;
          } else {
            this.start();
            this.isActive = true;
          }
        };
      });
    }

    // anchor links
    const anchor = [...document.querySelectorAll("[data-scrolllink]")];
    if (anchor.length > 0) {
      anchor.forEach((item) => {
        const id = parseFloat(item.dataset.scrolllink);
        const target = document.querySelector(`[data-scrolltarget="${id}"]`);
        if (target) {
          console.log(id, target);
          item.onclick = () => this.scrollTo(target);
        }
      });
    }
  }

  render() {
    this.raf((this.time += 10));
    window.requestAnimationFrame(this.render.bind(this));
  }
}

window.Scroll = new Scroll();
observeEditor(); // don't trigger if it's webflow editor view

/*
 * Make Editor View Scrollable
 */
function observeEditor() {
  const html = document.documentElement;
  const config = { attributes: true, childList: false, subtree: false };

  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes") {
        const btn = document.querySelector(".w-editor-bem-EditSiteButton");
        const bar = document.querySelector(".w-editor-bem-EditorMainMenu");
        const addTrig = (target) =>
          target.addEventListener("click", () => window.Scroll.destroy());

        if (btn) addTrig(btn);
        if (bar) addTrig(bar);
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(html, config);
}

// Page Load
function pageLoad() {
  let tl = gsap.timeline({ delay: 0.1 });
  tl.to(".page-wrap", { opacity: 1, ease: "power2.out", duration: 1.2 });
  tl.to(".nav", { opacity: 1, ease: "power2.out", duration: 1.2 }, 0);
}
pageLoad();

// Add empty item
// $(".c-blog-empty")
//   .insertAfter(".c-blog-item-wrap:nth-child(3n)")
//   .addClass("is-active");

// All categories item
$(".c-cat-link.is-all").prependTo(".c-cat-wrap");

function catHover() {
  // Current link
  $(".c-cat-hover").appendTo(".c-cat-link.w--current");

  // Category bar hover
  $(".c-cat-link").on("mouseenter", function () {
    let state = Flip.getState(".c-cat-hover");
    $(".c-cat-hover").appendTo($(this));
    Flip.from(state, {
      duration: 0.8,
      ease: "power2.out"
    });
  });

  $(".c-cat-wrap").on("mouseleave", function () {
    let state = Flip.getState(".c-cat-hover");
    $(".c-cat-hover").appendTo(".c-cat-link.w--current");
    Flip.from(state, {
      duration: 0.6,
      ease: "power3.out"
    });
  });
}

// Category bar pin
function catBar() {
  let barPin = gsap.timeline({
    scrollTrigger: {
      trigger: ".c-cat-wrap",
      pin: ".c-cat-wrap",
      pinSpacing: false,
      start: "top top",
      // endTrigger: ".o-row.blog-wrap",
      endTrigger: ".section.pre-footer-section",
      end: "bottom 70%"
    }
  });
}

function cardHover() {
  // Card hover
  $(".c-blog-item-wrap").each(function (index) {
    let tl = gsap.timeline({ paused: true });

    tl.to($(this).find(".c-blog-item"), {
      rotationY: 180,
      duration: 1,
      ease: "power2.inOut"
    });

    $(this).on("mouseenter", function () {
      tl.restart();
    });

    $(this).on("mouseleave", function () {
      tl.reverse();
    });
  });
}

// Category dropdown
function catDropdown() {
  let tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.inOut", duration: 0.6 }
  });

  tl.set(".c-cat-bar-wrap", { height: "auto" });

  tl.fromTo(
    ".c-cat-bar-wrap",
    { clipPath: "inset(0% 0% 100% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)" }
  );

  tl.to(".c-select-icon", { rotation: 180 }, 0);

  $(".c-select-cat").on("click", function () {
    $(".c-cat-bar-wrap").toggleClass("is-open");
    if ($(".c-cat-bar-wrap").hasClass("is-open")) {
      tl.restart();
    } else {
      tl.reverse();
    }
  });
}

// Who am I Page
function aboutCardHover() {
  $(".partner-item").each(function () {
    let tl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.6, ease: "power3.inOut" }
    });

    let partnerText = $(this).find(".text-size-xsmall");
    let partnerImage = $(this).find(".partner-image");

    tl.to($(this), { backgroundColor: "#181a1b" });
    tl.to(partnerText, { yPercent: -100, opacity: 1 }, 0);
    tl.to(partnerImage, { y: -12, scale: 1.05 }, 0);

    $(this).on("mouseenter", function () {
      tl.restart();
    });

    $(this).on("mouseleave", function () {
      tl.reverse();
    });
  });
}

// Project CMS page
function relatedProjectsHover() {
  $(".related-projects-collection-item").each(function () {
    let tl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.8, ease: "power3.inOut" }
    });

    let topLine = $(this).find(".related-projects-top-line");
    let bottomLine = $(this).find(".related-projects-bottom-line");

    tl.to(topLine, { width: "100%" });
    tl.to(bottomLine, { width: "100%" }, 0);

    $(this).on("mouseenter", function () {
      tl.restart();
    });

    $(this).on("mouseleave", function () {
      tl.reverse();
    });
  });
}

// Projects custom hover
function buildHover() {
  const items = document.querySelectorAll(".work-2-project-item");

  items.forEach((el) => {
    const image = el.querySelector(".work-2-project-thumb");

    el.addEventListener("mouseenter", (e) => {
      gsap.to(image, { autoAlpha: 1 });
    });

    el.addEventListener("mouseleave", (e) => {
      gsap.to(image, { autoAlpha: 0 });
    });

    el.addEventListener("mousemove", (e) => {
      gsap.set(image, { x: e.offsetX });
    });
  });
}

// Matchmedia Desktop
let mm = gsap.matchMedia();

mm.add("(min-width: 992px)", () => {
  catBar();
  cardHover();
  catHover();
  aboutCardHover();
  relatedProjectsHover();
  buildHover();
  return () => {
    //
  };
});

// Matchmedia landscape/mobile
mm.add("(max-width: 766px)", () => {
  catDropdown();
  return () => {
    //
  };
});
