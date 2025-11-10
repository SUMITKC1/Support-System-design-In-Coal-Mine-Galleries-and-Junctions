// Set current year in footer and initialize theme
document.addEventListener('DOMContentLoaded', function() {
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        if (el) el.textContent = currentYear;
    });
    
    // Initialize theme
    initializeTheme();
});

// Dark Mode Toggle Functionality
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        // Update toggle state based on current theme
        updateToggleState(savedTheme === 'dark');
        
        // Add click event listener
        themeToggle.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateToggleState(newTheme === 'dark');
        });
    }
}

function updateToggleState(isDark) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        if (isDark) {
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = event.target.closest('.nav-container');
        if (!isClickInsideNav && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Calculator functionality (only on index.html)
const form = document.getElementById('calculator-form');
if (form) {
    const resultsCard = document.getElementById('results-card');
    const checkButton = document.getElementById('check-button');
    const errorMessages = {};

    // Initialize error message elements
    const inputIds = ['rmr', 'roof-thickness', 'bolt-capacity', 'fos', 'bolt-efficiency', 'plate-efficiency', 'location'];
    inputIds.forEach(id => {
        const errorElement = document.getElementById(id + '-error');
        if (errorElement) {
            errorMessages[id] = errorElement;
        }
    });

    // Validation functions
    function validateRMR(value) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return 'RMR must be a number';
        }
        if (num < 0 || num > 100) {
            return 'RMR must be between 0 and 100';
        }
        return '';
    }

    function validatePositive(value, fieldName) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return `${fieldName} must be a number`;
        }
        if (num <= 0) {
            return `${fieldName} must be greater than 0`;
        }
        return '';
    }

    function validateEfficiency(value, fieldName) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return `${fieldName} must be a number`;
        }
        if (num <= 0 || num > 1) {
            return `${fieldName} must be between 0 and 1`;
        }
        return '';
    }

    function validateFoS(value) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return 'Factor of Safety must be a number';
        }
        if (num <= 1.0) {
            return 'Factor of Safety must be greater than 1.0';
        }
        return '';
    }

    function validateJf(value) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return 'Location factor must be a number';
        }
        if (num < 1) {
            return 'Location factor (Jf) must be greater than or equal to 1';
        }
        return '';
    }

    // Display error message
    function showError(inputId, message) {
        if (errorMessages[inputId]) {
            errorMessages[inputId].textContent = message;
            const input = document.getElementById(inputId);
            if (input) {
                input.style.borderColor = '#d32f2f';
            }
        }
    }

    // Clear error message
    function clearError(inputId) {
        if (errorMessages[inputId]) {
            errorMessages[inputId].textContent = '';
            const input = document.getElementById(inputId);
            if (input) {
                input.style.borderColor = '#d0d0d0';
            }
        }
    }

    // Validate all inputs
    function validateInputs() {
        let isValid = true;
        const rmr = document.getElementById('rmr')?.value;
        const roofThickness = document.getElementById('roof-thickness')?.value;
        const boltCapacity = document.getElementById('bolt-capacity')?.value;
        const fos = document.getElementById('fos')?.value;
        const boltEfficiency = document.getElementById('bolt-efficiency')?.value;
        const plateEfficiency = document.getElementById('plate-efficiency')?.value;
        const location = document.getElementById('location')?.value;

        // Validate RMR
        if (rmr !== undefined) {
            const rmrError = validateRMR(rmr);
            if (rmrError) {
                showError('rmr', rmrError);
                isValid = false;
            } else {
                clearError('rmr');
            }
        }

        // Validate Roof Thickness
        if (roofThickness !== undefined) {
            const roofThicknessError = validatePositive(roofThickness, 'Roof Thickness');
            if (roofThicknessError) {
                showError('roof-thickness', roofThicknessError);
                isValid = false;
            } else {
                clearError('roof-thickness');
            }
        }

        // Validate Bolt Capacity
        if (boltCapacity !== undefined) {
            const boltCapacityError = validatePositive(boltCapacity, 'Bolt Capacity');
            if (boltCapacityError) {
                showError('bolt-capacity', boltCapacityError);
                isValid = false;
            } else {
                clearError('bolt-capacity');
            }
        }

        // Validate FoS
        if (fos !== undefined) {
            const fosError = validateFoS(fos);
            if (fosError) {
                showError('fos', fosError);
                isValid = false;
            } else {
                clearError('fos');
            }
        }

        // Validate Bolt Efficiency
        if (boltEfficiency !== undefined) {
            const boltEfficiencyError = validateEfficiency(boltEfficiency, 'Bolt efficiency');
            if (boltEfficiencyError) {
                showError('bolt-efficiency', boltEfficiencyError);
                isValid = false;
            } else {
                clearError('bolt-efficiency');
            }
        }

        // Validate Plate Efficiency
        if (plateEfficiency !== undefined) {
            const plateEfficiencyError = validateEfficiency(plateEfficiency, 'Plate efficiency');
            if (plateEfficiencyError) {
                showError('plate-efficiency', plateEfficiencyError);
                isValid = false;
            } else {
                clearError('plate-efficiency');
            }
        }

        // Validate Location (Jf)
        if (location !== undefined) {
            const locationError = validateJf(location);
            if (locationError) {
                showError('location', locationError);
                isValid = false;
            } else {
                clearError('location');
            }
        }

        return isValid;
    }

    // Round to sensible decimal places
    function roundValue(value, decimals = 3) {
        if (isNaN(value) || !isFinite(value)) {
            return '-';
        }
        return parseFloat(value.toFixed(decimals));
    }

    // Calculation functions
    function calculateRockLoad(rmr, roofThickness) {
        // RL = 0.1 × (100 − RMR) × t
        return 0.1 * (100 - rmr) * roofThickness;
    }

    function calculateEffectiveCapacityKN(boltCapacity, boltEfficiency, plateEfficiency) {
        // Effective capacity (kN): Ceff_kN = Cb × ηb × ηp
        return boltCapacity * boltEfficiency * plateEfficiency;
    }

    function convertKNtoTonnes(kn) {
        // Convert kN to tonnes: Ceff_t = Ceff_kN / 9.80665
        return kn / 9.80665;
    }

    function calculateSpacing(effectiveCapacityT, rockLoad, fos, jf) {
        // Spacing rule (square grid): S = sqrt(Ceff_t / (RL × FoS × Jf))
        const denominator = rockLoad * fos * jf;
        if (denominator <= 0) {
            return 0;
        }
        return Math.sqrt(effectiveCapacityT / denominator);
    }

    function calculateSupportDensity(effectiveCapacityT, spacing) {
        // Support density = Ceff_t / (S²)
        if (spacing <= 0) {
            return 0;
        }
        return effectiveCapacityT / (spacing * spacing);
    }

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate inputs
        if (!validateInputs()) {
            return;
        }

        // Disable button to prevent spam clicking
        if (checkButton) {
            checkButton.disabled = true;
            checkButton.textContent = 'Calculating...';
        }

        // Small delay to show button state change and perform calculation
        setTimeout(() => {
            try {
                // Get input values
                const rmr = parseFloat(document.getElementById('rmr').value);
                const roofThickness = parseFloat(document.getElementById('roof-thickness').value);
                const boltCapacity = parseFloat(document.getElementById('bolt-capacity').value);
                const fos = parseFloat(document.getElementById('fos').value);
                const boltEfficiency = parseFloat(document.getElementById('bolt-efficiency').value);
                const plateEfficiency = parseFloat(document.getElementById('plate-efficiency').value);
                const jf = parseFloat(document.getElementById('location').value);

                // Perform calculations
                const rockLoad = calculateRockLoad(rmr, roofThickness);
                const effectiveCapacityKN = calculateEffectiveCapacityKN(boltCapacity, boltEfficiency, plateEfficiency);
                const effectiveCapacityT = convertKNtoTonnes(effectiveCapacityKN);
                const spacing = calculateSpacing(effectiveCapacityT, rockLoad, fos, jf);
                const supportDensity = calculateSupportDensity(effectiveCapacityT, spacing);

                // Display results
                const rockLoadEl = document.getElementById('rock-load');
                const effectiveCapacityKNEl = document.getElementById('effective-capacity-kn');
                const effectiveCapacityTEl = document.getElementById('effective-capacity-t');
                const spacingEl = document.getElementById('spacing');
                const supportDensityEl = document.getElementById('support-density');

                if (rockLoadEl) rockLoadEl.textContent = roundValue(rockLoad, 3);
                if (effectiveCapacityKNEl) effectiveCapacityKNEl.textContent = roundValue(effectiveCapacityKN, 2);
                if (effectiveCapacityTEl) effectiveCapacityTEl.textContent = roundValue(effectiveCapacityT, 3);
                if (spacingEl) spacingEl.textContent = roundValue(spacing, 3);
                if (supportDensityEl) supportDensityEl.textContent = roundValue(supportDensity, 3);

                // Show results card with animation
                if (resultsCard) {
                    resultsCard.classList.remove('hidden');
                    resultsCard.classList.add('visible');

                    // Scroll to results
                    setTimeout(() => {
                        resultsCard.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }, 100);
                }
            } catch (error) {
                console.error('Calculation error:', error);
                alert('An error occurred during calculation. Please check your inputs.');
            } finally {
                // Re-enable button
                if (checkButton) {
                    checkButton.disabled = false;
                    checkButton.textContent = 'Check';
                }
            }
        }, 300);
    });

    // Real-time validation on input
    inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('blur', function() {
                validateInputs();
            });
        }
    });

    // Clear errors on input
    inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                clearError(id);
            });
        }
    });
}

// Smooth scrolling for anchor links (if any on the same page)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
