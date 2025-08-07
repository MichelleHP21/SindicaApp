document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggleMenu");
      const menu = document.getElementById("menuLateral");

      if (toggleBtn && menu) {
        // Estado inicial: contraído
        menu.classList.add("collapsed");

        toggleBtn.addEventListener("click", function () {
          menu.classList.toggle("collapsed");
        });
    }
});