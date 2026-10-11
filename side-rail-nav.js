(() => {
  const nav = document.querySelector(".nav-links");
  if (!nav) return;

  const links = [...nav.querySelectorAll('a[href^="#"]')]
    .map(link => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter(item => item.section);
  if (!links.length) return;

  nav.classList.add("side-rail-nav");
  document.body.appendChild(nav);
  let ticking = false;

  const updateActiveSection = () => {
    ticking = false;
    const marker = window.innerHeight * .42;
    let active = links[0];

    links.forEach(item => {
      const rect = item.section.getBoundingClientRect();
      if (rect.top <= marker) active = item;
    });

    links.forEach(item => {
      const selected = item === active;
      item.link.classList.toggle("is-active", selected);
      if (selected) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    });
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateActiveSection);
  };

  links.forEach(item => {
    item.link.addEventListener("click", () => {
      links.forEach(entry => entry.link.classList.toggle("is-active", entry === item));
    });
  });

  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate, { passive: true });
  addEventListener("load", requestUpdate, { once: true });
  addEventListener("hashchange", requestUpdate);
  updateActiveSection();
})();
