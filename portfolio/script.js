let isAnimating = false;

// Function to hide all sections except the one with the given ID
function hideSectionsExcept(sectionId) {
    if (isAnimating) return; // Exit if an animation is already in progress
    isAnimating = true;

    const sections = document.querySelectorAll(".content-section");

    // Wait for all fade-out animations to complete before showing the target section
    Promise.all(
        Array.from(sections).map((section) => {
            if (section.id === sectionId) {
                return fadeIn(section);
            } else if (section.style.display !== "none") {
                return fadeOut(section);
            }
        })
    ).then(() => {
        sections.forEach((section) => {
            if (section.id !== sectionId) {
                section.style.display = "none";
            }
        });
        const targetSection = document.getElementById(sectionId);
        targetSection.style.display = "block";
        isAnimating = false;
    });
}

// Function to show the selected section with fade-in and fade-out animations
function showSection(sectionId) {
    hideSectionsExcept(sectionId);
}

function showCurrentSectionFromHash() {
    const currentHash = window.location.hash;
    const sectionId = currentHash ? currentHash.substring(1) : "home";

    // Remove the 'active' class from all menu links
    document.querySelectorAll("nav a").forEach((link) => {
        link.classList.remove("active");
    });

    // Add the 'active' class to the menu link corresponding to the current section
    const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add("active");
    }

    showSection(sectionId);
}

// Function to handle menu link clicks
function handleMenuLinkClick(event) {
    event.preventDefault();
    const sectionId = this.getAttribute("href").substring(1);
    const targetSection = document.getElementById(sectionId);
    targetSection.scrollIntoView({ behavior: "smooth" });

    // Update the URL without reloading the page
    window.history.pushState(null, null, "#" + sectionId);

    // Show the corresponding section with animation
    showSection(sectionId);

    // Add the 'active' class to the clicked menu link
    document.querySelectorAll("nav a").forEach((link) => {
        link.classList.remove("active");
    });
    this.classList.add("active");
}

// Add click event listeners to menu links
document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", handleMenuLinkClick);
});

// Show the current section from the URL hash on initial load
showCurrentSectionFromHash();

// Update the content when the URL hash changes (e.g., when switching to another tab)
window.addEventListener("hashchange", showCurrentSectionFromHash);

// Toggle the menu button
document.getElementById("menuBtn").addEventListener("click", () => {
    const nav = document.querySelector("nav");
    nav.classList.toggle("show");
});

// Helper function for fade-in animation
function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = "block";
    let opacity = 0;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        opacity = Math.min(1, elapsedTime / 500); // 500ms animation duration
        element.style.opacity = opacity;

        if (opacity < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// Helper function for fade-out animation
function fadeOut(element) {
    element.style.opacity = 1;
    let opacity = 1;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        opacity = Math.max(0, 1 - elapsedTime / 500); // 500ms animation duration
        element.style.opacity = opacity;

        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = "none";
        }
    }

    requestAnimationFrame(animate);
}