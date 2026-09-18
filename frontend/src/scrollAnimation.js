export function animateOnScroll(selector) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Slide up and fade in
                    entry.target.classList.add("opacity-100", "translate-y-0");
                    entry.target.classList.remove("opacity-0", "translate-y-8");
                } else {
                    // Optional: Remove this else block if you ONLY want them to animate once.
                    // Leaving it in makes them animate every time you scroll up and down.
                    entry.target.classList.remove("opacity-100", "translate-y-0");
                    entry.target.classList.add("opacity-0", "translate-y-8");
                }
            });
        },
        { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    // Apply base starting classes to all matched elements
    document.querySelectorAll(selector).forEach((el) => {
        el.classList.add(
            "opacity-0",
            "translate-y-8",
            "transition-all",
            "duration-700",
            "ease-out"
        );
        observer.observe(el);
    });
}