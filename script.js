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
function calculateQuote(size, type, hasHazard = false, hasLawn = false) {
  // Updated pricing logic: $2.50 per square foot plus optional fees
  const baseRate = 2.5; // dollars per square foot
  // Multipliers allow for complexity differences by property type
  const multipliers = {
    residential: 1.0,
    commercial: 1.2,
    abandoned: 1.5,
    construction: 0.8,
  };
  const multiplier = multipliers[type] || 1.0;
  let estimate = size * baseRate * multiplier;
  if (hasHazard) {
    estimate += 50; // flat fee for hazardous materials
  }
  if (hasLawn) {
    estimate += 99; // promotional lawn cut for first-time customers
  }
  return estimate;
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
  const hasHazard = form.hazardous && form.hazardous.checked;
  const hasLawn = form.lawn && form.lawn.checked;
  if (!name || !type || !size || Number.isNaN(size)) {
    resultEl.textContent = 'Please provide all required fields.';
    resultEl.hidden = false;
    return false;
  }
  const estimate = calculateQuote(size, type, hasHazard, hasLawn);
  const formatted = estimate.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  let detail = `${name}, your estimated cleanout cost is ${formatted}.`;
  if (hasHazard) {
    detail += ' This includes a $50 hazardous waste handling fee.';
  }
  if (hasLawn) {
    detail += ' This includes our limited‑time $99 lawn cut special.';
  }
  detail += ' Final pricing may vary based on on‑site assessment.';
  resultEl.textContent = detail;
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
  // Check whether selected date and time fall within availability
  if (!isWithinAvailability(date, time)) {
    resultEl.textContent =
      'Selected date/time is outside our booking window (Mon–Fri 8:00 AM–5:00 PM). Please choose another time.';
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

/**
 * Determine if a date and time fall within the company's availability.
 * We are available Monday through Friday from 08:00 to 17:00 local time.
 *
 * @param {string} dateStr The date in YYYY-MM-DD format
 * @param {string} timeStr The time in HH:MM format
 * @returns {boolean} True if within availability, false otherwise
 */
function isWithinAvailability(dateStr, timeStr) {
  try {
    const dateParts = dateStr.split('-').map(Number);
    const timeParts = timeStr.split(':').map(Number);
    const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    const day = dateObj.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const hour = timeParts[0];
    const minute = timeParts[1];
    // Only Monday–Friday (1–5)
    if (day < 1 || day > 5) {
      return false;
    }
    // Our schedule is from 08:00 to 17:00 (5pm). Accept exactly 08:00 – 17:00, inclusive
    const startHour = 8;
    const endHour = 17;
    // If before start or after end, not available. Accept end times at 17:00.
    if (hour < startHour || hour > endHour) {
      return false;
    }
    // If hour equals endHour (17), only accept 17:00 exactly (minute 0)
    if (hour === endHour && minute > 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}