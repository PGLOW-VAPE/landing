import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

type ShowcaseSlide = {
  type: "image" | "video";
  src: string;
  title: string;
  caption: string;
  alt?: string;
  poster?: string;
};

// Place final showcase assets in public/media/product/.
// Files in public are served from the site root:
// public/media/product/usage-flow.mp4 -> /media/product/usage-flow.mp4

// https://i.ibb.co/ksxGLRwC/IMG-8067.jpg

const slides: ShowcaseSlide[] = [
  // {
  //   type: "video",
  //   src: "/media/product/usage-flow.mp4",
  //   poster: "/media/product/usage-flow-poster.jpg",
  //   title: "Usage flow",
  //   caption: "Load, set, and enjoy.",
  // },
  {
    type: "image",
    src: "https://vapeguy.com/wp-content/uploads/2024/02/POTV-Lobo-dry-herb-vaporizer-11-1024x683.jpg",
    title: "Tanque de cerámica",
    caption: "Mejor sabor y fácil de limpiar.",
    alt: "Imagen de uso del vaporizador PGLOW mostrando la carga de hierba, selección de temperatura y vapeo.",
  },

  {
    type: "image",
    src: "https://ca.planetofthevapes.com/cdn/shop/files/CopyofPOTVLoboextras-8copy_840x.jpg?v=1751878750",
    title: "Pantalla OLED",
    caption: "Vaporiza con precisión y estilo.",
    alt: "OLED display placeholder on the PGLOW vaporizer.",
  },
  {
    type: "image",
    src: "https://vapeguy.com/wp-content/uploads/2024/02/POTV-Lobo-dry-herb-vaporizer-11-1024x683.jpg",
    title: "Carga con USB-C",
    caption: "Ready for daily use.",
    alt: "USB-C charging placeholder for the PGLOW vaporizer.",
  },
  {
    type: "image",
    src: "https://www.planetofthevapes.com/cdn/shop/files/battery_1_cabca34a-408f-45be-add5-1c797ab901f1_840x.jpg?v=1748449934",
    title: "Replaceable battery",
    caption: "Power that keeps moving.",
    alt: "Replaceable battery placeholder for the PGLOW vaporizer.",
  },
  {
    type: "image",
    src: "https://ca.planetofthevapes.com/cdn/shop/files/CopyofPOTVLoboextras-8copy_840x.jpg?v=1751878750",
    title: "Diseño compacto",
    caption: "Perfecto para sesiones discretas.",
    alt: "Close-up placeholder of the PGLOW vaporizer.",
  },
];

type DragState = {
  pointerId: number;
  startScrollLeft: number;
  startX: number;
};

const clampSlideIndex = (index: number) =>
  Math.min(Math.max(index, 0), slides.length - 1);

const wrapSlideIndex = (index: number) =>
  (index + slides.length) % slides.length;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  Boolean(target.closest("button, video, a, input, textarea, select"));

export default function ProductShowcaseReact() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const scrollFrameRef = useRef<number | null>(null);

  const goToSlide = (index: number) => {
    const scroller = scrollerRef.current;
    const nextIndex = wrapSlideIndex(index);

    setActiveIndex(nextIndex);

    if (!scroller) {
      return;
    }

    scroller.scrollTo({
      left: scroller.clientWidth * nextIndex,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const handleScroll = () => {
    if (scrollFrameRef.current !== null) {
      return;
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const scroller = scrollerRef.current;
      scrollFrameRef.current = null;

      if (!scroller) {
        return;
      }

      const nextIndex = clampSlideIndex(
        Math.round(scroller.scrollLeft / scroller.clientWidth),
      );

      setActiveIndex((currentIndex) =>
        currentIndex === nextIndex ? currentIndex : nextIndex,
      );
    });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;

    if (
      !scroller ||
      event.pointerType !== "mouse" ||
      isInteractiveTarget(event.target)
    ) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startScrollLeft: scroller.scrollLeft,
      startX: event.clientX,
    };

    scroller.dataset.dragging = "true";
    scroller.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    const dragState = dragStateRef.current;

    if (!scroller || !dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    scroller.scrollLeft =
      dragState.startScrollLeft - (event.clientX - dragState.startX);
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    const dragState = dragStateRef.current;

    if (!scroller || !dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    dragStateRef.current = null;
    delete scroller.dataset.dragging;

    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLVideoElement) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(activeIndex + 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      goToSlide(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      goToSlide(slides.length - 1);
    }
  };

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    scroller.querySelectorAll("video").forEach((video) => {
      const slide = video.closest<HTMLElement>("[data-slide-index]");
      const slideIndex = Number(slide?.dataset.slideIndex ?? -1);

      if (slideIndex !== activeIndex) {
        video.pause();
      }
    });
  }, [activeIndex]);

  const activeSlide = slides[activeIndex] ?? slides[0];

  return (
    // <section
    //   id="product"
    //   aria-labelledby="product-showcase-heading"
    //   className="relative isolate overflow-hidden bg-secondary px-6 py-8 text-white sm:py-28 lg:px-10"
    // >
    //   <div className="mx-auto w-full max-w-6xl">
    //     <div className="max-w-3xl">
    //       <h2
    //         id="product-showcase-heading"
    //         className="mt-0 text-4xl font-bold tracking-normal text-primary text-balance sm:text-5xl"
    //       >
    //         Meet the Vaporizer
    //       </h2>
    //       <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
    //         Designed for smooth sessions, pure flavor, and precise control.
    //       </p>
    //     </div>

    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Product media carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="mt-10 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-secondary sm:mt-12"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] shadow-[0_26px_90px_rgba(0,0,0,0.46),0_0_48px_rgba(111,209,215,0.12)]">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          className="flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] data-[dragging=true]:cursor-grabbing data-[dragging=true]:snap-none [&::-webkit-scrollbar]:hidden cursor-grab motion-reduce:scroll-auto sm:aspect-[16/10] lg:aspect-[16/9]"
        >
          {slides.map((slide, index) => {
            const isActive = activeIndex === index;

            return (
              <figure
                key={slide.src}
                data-slide-index={index}
                className="grid min-w-full snap-center grid-rows-[1fr_auto]"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
                aria-hidden={!isActive}
                inert={isActive ? undefined : true}
              >
                <div className="relative min-h-0 overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.025))]">
                  {slide.type === "video" ? (
                    <video
                      src={slide.src}
                      poster={slide.poster}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      controls
                      preload="metadata"
                      aria-label="Video placeholder showing loading herb, selecting temperature, and vaping with the PGLOW vaporizer"
                    >
                      Your browser does not support the video element.
                    </video>
                  ) : (
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      loading={index === 1 ? "eager" : "lazy"}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.48)_100%)]"
                  />
                </div>

                <figcaption className="flex min-h-20 flex-col justify-center gap-1 border-t border-white/10 bg-black/45 px-5 py-4 backdrop-blur sm:min-h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
                  <h3 className="text-base font-semibold tracking-normal text-white">
                    {slide.title}
                  </h3>
                  <p className="text-sm leading-6 text-white/68">
                    {slide.caption}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <div
        className="mt-5 flex items-center justify-center gap-2"
        aria-label="Choose product media slide"
      >
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={slide.src}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full border transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none ${
                isActive
                  ? "w-8 border-primary bg-primary"
                  : "w-2.5 border-white/30 bg-white/35 hover:bg-primary"
              }`}
              aria-label={`Show slide ${index + 1}: ${slide.title}`}
              aria-current={isActive ? "true" : undefined}
            />
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {slides.length}: {activeSlide.title}
      </p>
    </div>
    //   </div>
    // </section>
  );
}
