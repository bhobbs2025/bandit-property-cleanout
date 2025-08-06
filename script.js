/*
  JavaScript for Business Website

  Contains simple client-side functionality such as updating the year in the
  footer and providing basic handling for the contact form submission. The
  contact form displays a success message and resets the form. Modify
  handleSubmit() to integrate with a backend or external service as needed.
*/

// Update footer year dynamically
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
  }
});

/**
 * Handle contact form submission.
 * Prevents default browser submit action, displays a thank you message,
 * and resets the form. Customize this function to integrate with backend
 * services such as email sending or CRM integration.
 *
 * @param {Event} event The form submission event
 */
function handleSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('contactForm');
  const responseEl = document.getElementById('formResponse');
  if (form && responseEl) {
    // Example: Simulate sending to server
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (name && email && message) {
      // Display success message
      responseEl.textContent = `Thank you, ${name}! Your message has been sent.`;
      responseEl.hidden = false;
      // Reset form fields
      form.reset();
    } else {
      responseEl.textContent = 'Please complete all fields.';
      responseEl.hidden = false;
    }
  }
  return false;
}

/**
 * Calculate an estimated quote based on square footage and property type.
 * Base rate is defined per square foot and multipliers adjust for
 * complexity of different property types.
 *
 * @param {number} size Square footage of the property
 * @param {string} type Property type key (residential, commercial, abandoned, construction)
 * @returns {number} Estimated cost
 */
function calculateQuote(size, type) {
  const baseRate = 0.50; // dollars per square foot
  const multipliers = {
    residential: 1.0,
    commercial: 1.2,
    abandoned: 1.5,
    construction: 0.8,
  };
  const multiplier = multipliers[type] || 1.0;
  return size * baseRate * multiplier;
}

/**
 * Handle quote form submission. Reads input values, calculates an estimate,
 * and displays the result to the user.
 *
 * @param {Event} event Form submit event
 */
function handleQuote(event) {
  event.preventDefault();
  const form = document.getElementById('quoteForm');
  const resultEl = document.getElementById('quoteResult');
  const name = form.name.value.trim();
  const type = form.type.value;
  const size = parseFloat(form.size.value);
  if (!name || !type || !size || Number.isNaN(size)) {
    resultEl.textContent = 'Please provide all required fields.';
    resultEl.hidden = false;
    return false;
  }
  const estimate = calculateQuote(size, type);
  const formatted = estimate.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  resultEl.textContent = `${name}, your estimated cleanout cost is ${formatted}. This price may vary based on on‑site assessment.`;
  resultEl.hidden = false;
  // Optionally reset certain fields but keep user input; we leave form intact
  return false;
}

/**
 * Handle schedule form submission. Displays a confirmation message.
 *
 * @param {Event} event Form submit event
 */
function handleSchedule(event) {
  event.preventDefault();
  const form = document.getElementById('scheduleForm');
  const resultEl = document.getElementById('scheduleResult');
  const name = form.name.value.trim();
  const date = form.date.value;
  const time = form.time.value;
  if (!name || !date || !time) {
    resultEl.textContent = 'Please fill out your name, date and time.';
    resultEl.hidden = false;
    return false;
  }
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(date).toLocaleDateString(undefined, options);
  // Format time to human readable
  const formattedTime = time;
  resultEl.textContent = `Thank you, ${name}! Your appointment request for ${formattedDate} at ${formattedTime} has been received. We will contact you to confirm.`;
  resultEl.hidden = false;
  // Optionally reset the form
  form.reset();
  return false;
}