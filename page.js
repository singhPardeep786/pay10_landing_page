
function formSubmitHandler() {
  const forms = document.querySelectorAll("#connectform");
  if (!forms.length) return;

  forms.forEach((form) => {
    const getInput = (id) =>
      form.querySelectorAll(`#${id}`);
    const errors = form.querySelectorAll(".error");

    function hideAllErrors() {
      errors.forEach((err) => {
        err.style.display = "none";
        err.textContent = "";
      });
    }

    // Show error for a specific field (can be more than one error per form)
    let errorTimeout = null;
    function showError(message, inputEl) {
      if (errorTimeout) clearTimeout(errorTimeout);

      // Find the corresponding .error div inside the .form_group containing the input
      let errorDiv = null;
      if (inputEl && inputEl.length) {
        inputEl.forEach((el) => {
          const group = el.closest('.form_group');
          if (group) {
            errorDiv = group.querySelector('.error');
            if (errorDiv) {
              errorDiv.textContent = message;
              errorDiv.style.display = "block";
              errorDiv.style.color = "#ef4444";
              errorDiv.style.fontSize = "14px";
              errorDiv.style.marginTop = "8px";
            }
          }
        });
      }

      // Fallback: If no specific location, use the first error div in this form
      if (!errorDiv && errors.length > 0) {
        errors[0].textContent = message;
        errors[0].style.display = "block";
        errors[0].style.color = "#ef4444";
        errors[0].style.fontSize = "14px";
        errors[0].style.marginTop = "8px";
      }

      errorTimeout = setTimeout(hideAllErrors, 3000);
    }

    // Phone number input restriction
    getInput("phone").forEach((phoneInput) => {
      phoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
        if (this.value.length > 10) this.value = this.value.slice(0, 10);
        hideAllErrors();
      });
    });

    // Hide errors on relevant field inputs
    ["fullname", "email", "company"].forEach((id) => {
      getInput(id).forEach((input) => {
        input.addEventListener("input", hideAllErrors);
      });
    });
    getInput("volume").forEach((input) => {
      input.addEventListener("change", hideAllErrors);
    });

    // Handle form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      hideAllErrors();

      let isValid = true;
      let errorMessage = "";
      let errorTarget = [];

      // Get the relevant fields (in this form)
      const fullNames = getInput("fullname");
      const emails = getInput("email");
      const companies = getInput("company");
      const phones = getInput("phone");
      const volumes = getInput("volume");

      // For each form, validate the first of each input type
      // (If you need to support >1 per form, loop inside these too)
      const fullName = fullNames[0];
      const email = emails[0];
      const company = companies[0];
      const phone = phones[0];
      const volume = volumes[0];

      // Full Name validation
      if (fullName) {
        const nameValue = fullName.value.trim();
        if (nameValue.length < 2) {
          errorMessage = "Please enter a valid full name (at least 2 characters)";
          errorTarget = fullNames;
          isValid = false;
        } else if (!/^[a-zA-Z\s'-]+$/.test(nameValue)) {
          errorMessage = "Please enter a valid name (letters only)";
          errorTarget = fullNames;
          isValid = false;
        }
      }

      // Business Email validation
      if (isValid && email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
        const emailValue = email.value.trim();
        if (emailValue.length === 0) {
          errorMessage = "Please enter your business email";
          errorTarget = emails;
          isValid = false;
        } else if (!emailRegex.test(emailValue)) {
          errorMessage =
            "Please enter a valid email address (personal email domains not allowed)";
          errorTarget = emails;
          isValid = false;
        }
      }

      // Phone Number validation
      if (isValid && phone) {
        const phoneValue = phone.value.trim();
        if (phoneValue.length === 0) {
          errorMessage = "Please enter your phone number";
          errorTarget = phones;
          isValid = false;
        } else if (phoneValue.length !== 10) {
          errorMessage = "Please enter a valid 10 digit phone number";
          errorTarget = phones;
          isValid = false;
        } else if (!/^\d{10}$/.test(phoneValue)) {
          errorMessage = "Phone number must contain only digits";
          errorTarget = phones;
          isValid = false;
        }
      }

      // Company Name validation
      if (isValid && company) {
        const companyValue = company.value.trim();
        if (companyValue.length < 2) {
          errorMessage =
            "Please enter a valid company name (at least 2 characters)";
          errorTarget = companies;
          isValid = false;
        }
      }

      // Monthly Export Volume validation
      if (isValid && volume) {
        const volumeValue = volume.value;
        if (!volumeValue || volumeValue === "Select") {
          errorMessage = "Please select your monthly export volume";
          errorTarget = volumes;
          isValid = false;
        }
      }

      // Display error or submit form
      if (!isValid) {
        showError(errorMessage, errorTarget);
      } else {
        // Form is valid, proceed with submission
        console.log("Form is valid! Submitting...");

        // Place AJAX submission or desired logic here.

        alert("Form submitted successfully!");
        form.reset();
        hideAllErrors();
      }
    });
  });
}
formSubmitHandler();

// Initialize form validation when DOM is ready
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', formSubmitHandler);
// } else {
// }

function GradientAccordion() {
  class GradientAccordion {
    constructor(containerId, options = {}) {
      this.container = document.getElementById(containerId);
      this.items = options.items || [];
      this.initialActiveIndex = options.initialActiveIndex || 0;
      this.activeIndex = Math.min(
        Math.max(this.initialActiveIndex, 0),
        this.items.length - 1
      );

      this.itemRefs = [];
      this.gradientEl = null;
      this.observer = null;

      this.init();
    }

    init() {
      this.render();
      this.attachEventListeners();
      this.updateGradient();
    }

    render() {
      const accordionHTML = `
            <div class="accordion">
              <div class="line">
                <div class="gradient" style="height: 0px; top: 0px;"></div>
              </div>
              <div class="items">
                ${this.items
                  .map(
                    (item, index) => `
                  <div 
                    class="item ${index === this.activeIndex ? "active" : ""}" 
                    data-index="${index}"
                    role="button"
                    tabindex="0"
                    aria-expanded="${index === this.activeIndex}"
                  >
                    <div class="indicator" aria-hidden="true">
                      <span class="dash">-</span>
                      <span class="plus">+</span>
                    </div>
                    <div class="content">
                      ${
                        item.title
                          ? `<div class="title">${item.title}</div>`
                          : ""
                      }
                      <div class="description">${item.content}</div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `;

      this.container.innerHTML = accordionHTML;
      this.gradientEl = this.container.querySelector(".gradient");
      this.itemRefs = Array.from(this.container.querySelectorAll(".item"));
    }

    attachEventListeners() {
      this.itemRefs.forEach((item, index) => {
        item.addEventListener("click", () => this.setActiveIndex(index));
        item.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.setActiveIndex(index);
          }
        });
      });

      window.addEventListener("resize", () => {
        requestAnimationFrame(() => {
          setTimeout(() => this.updateGradient(), 100);
        });
      });
    }

    setActiveIndex(index) {
      if (this.activeIndex === index) return;

      // Remove active class from previous item
      if (this.itemRefs[this.activeIndex]) {
        this.itemRefs[this.activeIndex].classList.remove("active");
        this.itemRefs[this.activeIndex].setAttribute("aria-expanded", "false");
      }

      // Add active class to new item
      this.activeIndex = index;
      this.itemRefs[index].classList.add("active");
      this.itemRefs[index].setAttribute("aria-expanded", "true");

      // Disconnect previous observer
      if (this.observer) {
        this.observer.disconnect();
      }

      // Update gradient with delay to allow CSS transitions
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.updateGradient();
            setTimeout(() => this.updateGradient(), 100);
            setTimeout(() => this.updateGradient(), 500);
          });
        });
      }, 0);

      // Setup observer for active item
      this.setupObserver(index);
    }

    setupObserver(index) {
      const activeItem = this.itemRefs[index];
      const descriptionEl = activeItem.querySelector(".description");

      if (descriptionEl) {
        this.observer = new MutationObserver(() => {
          requestAnimationFrame(() => this.updateGradient());
        });

        this.observer.observe(descriptionEl, {
          attributes: true,
          attributeFilter: ["style", "class"],
          childList: true,
          subtree: true,
        });
      }
    }

    updateGradient() {
      if (this.activeIndex < 0) return;

      const activeItem = this.itemRefs[this.activeIndex];
      if (!activeItem) return;

      const itemsContainer = activeItem.parentElement;
      if (!itemsContainer) return;

      // Calculate top position
      let topPosition = 0;
      const itemsComputedStyle = window.getComputedStyle(itemsContainer);
      const paddingTop = parseFloat(itemsComputedStyle.paddingTop) || 0;
      topPosition += paddingTop;

      for (let i = 0; i < this.activeIndex; i++) {
        const item = this.itemRefs[i];
        if (item) topPosition += item.offsetHeight;
      }

      const gapValue =
        itemsComputedStyle.gap || itemsComputedStyle.rowGap || "16px";
      const gap = parseFloat(gapValue) || 16;
      if (this.activeIndex > 0) topPosition += this.activeIndex * gap;

      // Measure full height
      const descriptionEl = activeItem.querySelector(".description");
      let height = 0;

      if (descriptionEl) {
        const originalMaxHeight = descriptionEl.style.maxHeight;
        const originalOverflow = descriptionEl.style.overflow;
        const originalDisplay = descriptionEl.style.display;

        descriptionEl.style.maxHeight = "none";
        descriptionEl.style.overflow = "visible";
        descriptionEl.style.display = "block";

        void descriptionEl.offsetHeight;
        void activeItem.offsetHeight;

        height = activeItem.scrollHeight;

        descriptionEl.style.maxHeight = originalMaxHeight;
        descriptionEl.style.overflow = originalOverflow;
        descriptionEl.style.display = originalDisplay || "";
      } else {
        height = activeItem.scrollHeight;
      }

      this.gradientEl.style.height = `${height}px`;
      this.gradientEl.style.top = `${topPosition}px`;
    }
  }

  // Initialize accordion with sample data
  const accordionData = {
    items: [
      {
        id: 1,
        title: "Multi-Currency Support",
        content:
          "Accept payments in 100+ currencies and provide your customers with seamless checkout experience worldwide.",
      },
      {
        id: 2,
        title: "Global Payment Methods",
        content:
          "Accept payments in 100+ currencies and provide your customers with seamless checkout experience worldwide.",
      },
      {
        id: 3,
        title: "RBI Authorised",
        content:
          "Accept payments in 100+ currencies and provide your customers with seamless checkout experience worldwide.",
      },
      {
        id: 4,
        title: "Transparent FX",
        content:
          "Accept payments in 100+ currencies and provide your customers with seamless checkout experience worldwide.",
      },
      {
        id: 5,
        title: "Dedicated Integration Support",
        content:
          "Accept payments in 100+ currencies and provide your customers with seamless checkout experience worldwide.",
      },
      {
        id: 6,
        title: "Receiving INR Settlement",
        content:
          "Accept payments in 100+ currencies and provide your customers with seamless checkout experience worldwide.",
      },
    ],
    initialActiveIndex: 0,
  };

  // Create the accordion
  new GradientAccordion("accordion-container", accordionData);
}
GradientAccordion();


function faqAccordion(){
  document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Close all accordion items with smooth transition
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });

    // Add keyboard accessibility
    accordionHeaders.forEach(header => {
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});
}

faqAccordion();