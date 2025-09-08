document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const themeToggle = document.querySelector(".theme-toggle");
  const footerThemeToggle = document.getElementById("footer-checkbox");
  const body = document.body;
  const loaderContainer = document.querySelector(".loader-container");
  const themeTransitionObserver = document.getElementById(
    "theme-transition-observer"
  );

  // Set up MutationObserver to detect theme changes
  if (themeTransitionObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const isDarkTheme = body.classList.contains("dark-theme");
          // console.log(`Theme transition detected: ${isDarkTheme ? 'dark' : 'light'}`);

          // Force a repaint to ensure all CSS transitions are applied
          document.documentElement.style.setProperty(
            "--theme-transition-trigger",
            isDarkTheme ? "1" : "0"
          );

          // Update footer elements to ensure they reflect the current theme
          updateFooterTheme(isDarkTheme);
        }
      });
    });

    // Start observing the body for class changes
    observer.observe(body, { attributes: true });
  }

  // Function to update footer theme-specific elements
  function updateFooterTheme(isDarkTheme) {
    const footer = document.querySelector(".footer");
    const socialIcons = document.querySelectorAll(".social-icon");
    const footerLinks = document.querySelectorAll(".footer-links a");

    // Apply specific styles if needed beyond CSS variables
    if (isDarkTheme) {
      footer.setAttribute("data-theme", "dark");
      socialIcons.forEach((icon) => {
        icon.setAttribute("data-theme", "dark");
      });
      footerLinks.forEach((link) => {
        link.setAttribute("data-theme", "dark");
      });
    } else {
      footer.setAttribute("data-theme", "light");
      socialIcons.forEach((icon) => {
        icon.setAttribute("data-theme", "light");
      });
      footerLinks.forEach((link) => {
        link.setAttribute("data-theme", "light");
      });
    }

    // Log the update for testing
    // console.log(`Footer theme updated to: ${isDarkTheme ? 'dark' : 'light'}`);
  }

  // Hide loader after page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      loaderContainer.classList.add("hidden");
      // Remove loader from DOM after animation completes
      setTimeout(() => {
        loaderContainer.style.display = "none";
      }, 500);
    }, 1000); // Show loader for at least 1 second
  });

  // Toggle menu when hamburger is clicked
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Prevent scrolling when menu is open
    body.classList.toggle("menu-open");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);
    const isClickOnThemeToggle = themeToggle.contains(event.target);

    if (
      !isClickInsideMenu &&
      !isClickOnToggle &&
      !isClickOnThemeToggle &&
      navMenu.classList.contains("active")
    ) {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      body.classList.remove("menu-open");
    }
  });

  // Function to toggle theme
  function toggleTheme(event) {
    // If the event is from a checkbox, we need to prevent toggling twice
    if (event && event.type === "change") {
      // If the change came from the footer toggle, we don't need to toggle the class
      // as the navbar toggle handler will do it
      if (event.target === footerThemeToggle) {
        if (
          footerThemeToggle.checked &&
          !body.classList.contains("dark-theme")
        ) {
          body.classList.add("dark-theme");
        } else if (
          !footerThemeToggle.checked &&
          body.classList.contains("dark-theme")
        ) {
          body.classList.remove("dark-theme");
        }

        // Save theme preference to localStorage
        localStorage.setItem(
          "theme1",
          footerThemeToggle.checked ? "dark" : "light"
        );

        // Update aria-label for accessibility
        updateThemeToggleAccessibility();

        // Log theme change for testing
        // console.log(`Theme changed to: ${body.classList.contains('dark-theme') ? 'dark' : 'light'}`);

        return;
      }
    }

    // Toggle the theme class
    body.classList.toggle("dark-theme");

    // Save theme preference to localStorage
    const isDarkTheme = body.classList.contains("dark-theme");
    localStorage.setItem("theme1", isDarkTheme ? "dark" : "light");

    // Sync the footer toggle with the current theme
    if (footerThemeToggle) {
      footerThemeToggle.checked = isDarkTheme;
    }

    // Update aria-label for accessibility
    updateThemeToggleAccessibility();

    // Log theme change for testing
    // console.log(`Theme changed to: ${isDarkTheme ? 'dark' : 'light'}`);

    // Test footer theme adaptation
    testFooterThemeAdaptation();
  }

  // Toggle theme with navbar button
  themeToggle.addEventListener("click", toggleTheme);

  // Toggle theme with footer switch
  if (footerThemeToggle) {
    footerThemeToggle.addEventListener("change", toggleTheme);
  }

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme1");
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    if (footerThemeToggle) {
      footerThemeToggle.checked = true;
    }
    // Update footer theme on initial load
    setTimeout(() => updateFooterTheme(true), 100);
  } else {
    // Update footer theme on initial load
    setTimeout(() => updateFooterTheme(false), 100);
  }

  // Update theme toggle accessibility label
  function updateThemeToggleAccessibility() {
    if (body.classList.contains("dark-theme")) {
      themeToggle.setAttribute("aria-label", "Switch to light theme");
    } else {
      themeToggle.setAttribute("aria-label", "Switch to dark theme");
    }
  }

  // Test footer theme adaptation
  function testFooterThemeAdaptation() {
    const footer = document.querySelector(".footer");
    const footerBg = getComputedStyle(footer).backgroundColor;
    const footerText = getComputedStyle(footer).color;
    const footerHeading = getComputedStyle(
      document.querySelector(".footer-column h3")
    ).color;
    const footerLink = getComputedStyle(
      document.querySelector(".footer-links a")
    ).color;
    const footerBorder = getComputedStyle(
      document.querySelector(".footer-bottom")
    ).borderTopColor;

    // console.log('Footer Theme Test:');
    // console.log(`- Background: ${footerBg}`);
    // console.log(`- Text: ${footerText}`);
    // console.log(`- Heading: ${footerHeading}`);
    // console.log(`- Link: ${footerLink}`);
    // console.log(`- Border: ${footerBorder}`);
  }

  // Initialize accessibility label
  updateThemeToggleAccessibility();

  // Run initial footer theme test
  setTimeout(testFooterThemeAdaptation, 500);

  // Close menu when window is resized to desktop size
  window.addEventListener("resize", () => {
    if (window.innerWidth > 991 && navMenu.classList.contains("active")) {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      body.classList.remove("menu-open");
    }
  });

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Close menu when a link is clicked
      if (navMenu.classList.contains("active")) {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("menu-open");
      }

      // Scroll to the target section
      const targetId = this.getAttribute("href");
      if (targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Add parallax effect to hero background
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    const heroBackground = document.querySelector(".hero-background");

    if (heroBackground) {
      // Parallax effect - move background slightly as user scrolls
      heroBackground.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    }
  });

  // Add a keyboard shortcut for theme toggle (Alt+T)
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.key === "t") {
      toggleTheme();
    }
  });
});
