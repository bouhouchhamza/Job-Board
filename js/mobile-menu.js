const menuButton = document.querySelector(".mobile-menu");
const navigation = document.querySelector(".desktop-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "✕" : "☰";
  });
}