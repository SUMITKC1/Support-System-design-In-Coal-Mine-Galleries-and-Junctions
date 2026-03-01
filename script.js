// Set current year in footer and initialize theme
document.addEventListener('DOMContentLoaded', function() {
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        if (el) el.textContent = currentYear;
    });

    initializeTheme();
});

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        updateToggleState(savedTheme === 'dark');

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
    if (!themeToggle) return;

    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    document.addEventListener('click', function(event) {
        const isClickInsideNav = event.target.closest('.nav-container');
        if (!isClickInsideNav && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

const form = document.getElementById('calculator-form');
if (form) {
    const resultsCard = document.getElementById('results-card');
    const checkButton = document.getElementById('check-button');
    const errorMessages = {};

    const inputIds = [
        'rmr',
        'roof-thickness',
        'gallery-span',
        'rock-unit-weight',
        'bolt-capacity',
        'fos',
        'bolt-efficiency',
        'plate-efficiency',
        'grid-spacing',
        'location'
    ];

    inputIds.forEach(id => {
        const errorElement = document.getElementById(id + '-error');
        if (errorElement) errorMessages[id] = errorElement;
    });

    function validateRMR(value) {
        const num = parseFloat(value);
        if (isNaN(num)) return 'RMR must be a number';
        if (num < 0 || num > 100) return 'RMR must be between 0 and 100';
        return '';
    }

    function validatePositive(value, fieldName) {
        const num = parseFloat(value);
        if (isNaN(num)) return `${fieldName} must be a number`;
        if (num <= 0) return `${fieldName} must be greater than 0`;
        return '';
    }

    function validateEfficiency(value, fieldName) {
        const num = parseFloat(value);
        if (isNaN(num)) return `${fieldName} must be a number`;
        if (num <= 0 || num > 1) return `${fieldName} must be between 0 and 1`;
        return '';
    }

    function validateFoS(value) {
        const num = parseFloat(value);
        if (isNaN(num)) return 'Factor of Safety must be a number';
        if (num <= 1.0) return 'Factor of Safety must be greater than 1.0';
        return '';
    }

    function validateJf(value) {
        const num = parseFloat(value);
        if (isNaN(num)) return 'Location factor must be a number';
        if (num < 1) return 'Location factor (Jf) must be greater than or equal to 1';
        return '';
    }

    function validateOptionalGridSpacing(value) {
        if (value === '' || value === null || value === undefined) return '';
        return validatePositive(value, 'Grid spacing');
    }

    function showError(inputId, message) {
        if (!errorMessages[inputId]) return;
        errorMessages[inputId].textContent = message;
        const input = document.getElementById(inputId);
        if (input) input.style.borderColor = '#d32f2f';
    }

    function clearError(inputId) {
        if (!errorMessages[inputId]) return;
        errorMessages[inputId].textContent = '';
        const input = document.getElementById(inputId);
        if (input) input.style.borderColor = '#d0d0d0';
    }

    function validateInputs() {
        let isValid = true;

        const values = {
            rmr: document.getElementById('rmr')?.value,
            roofThickness: document.getElementById('roof-thickness')?.value,
            gallerySpan: document.getElementById('gallery-span')?.value,
            rockUnitWeight: document.getElementById('rock-unit-weight')?.value,
            boltCapacity: document.getElementById('bolt-capacity')?.value,
            fos: document.getElementById('fos')?.value,
            boltEfficiency: document.getElementById('bolt-efficiency')?.value,
            plateEfficiency: document.getElementById('plate-efficiency')?.value,
            gridSpacing: document.getElementById('grid-spacing')?.value,
            location: document.getElementById('location')?.value
        };

        const checks = [
            { id: 'rmr', err: validateRMR(values.rmr) },
            { id: 'roof-thickness', err: validatePositive(values.roofThickness, 'Roof Thickness') },
            { id: 'gallery-span', err: validatePositive(values.gallerySpan, 'Gallery span') },
            { id: 'rock-unit-weight', err: validatePositive(values.rockUnitWeight, 'Rock unit weight') },
            { id: 'bolt-capacity', err: validatePositive(values.boltCapacity, 'Bolt Capacity') },
            { id: 'fos', err: validateFoS(values.fos) },
            { id: 'bolt-efficiency', err: validateEfficiency(values.boltEfficiency, 'Bolt efficiency') },
            { id: 'plate-efficiency', err: validateEfficiency(values.plateEfficiency, 'Plate efficiency') },
            { id: 'grid-spacing', err: validateOptionalGridSpacing(values.gridSpacing) },
            { id: 'location', err: validateJf(values.location) }
        ];

        checks.forEach(item => {
            if (item.err) {
                showError(item.id, item.err);
                isValid = false;
            } else {
                clearError(item.id);
            }
        });

        return isValid;
    }

    function roundValue(value, decimals = 3) {
        if (isNaN(value) || !isFinite(value)) return '-';
        return parseFloat(value.toFixed(decimals));
    }

    function calculateRockLoadSimplified(rmr, roofThickness) {
        return 0.1 * (100 - rmr) * roofThickness;
    }

    function calculateRockLoadCMRI(rmr, gamma, span) {
        return gamma * span * (1.7 - 0.037 * rmr + 0.0002 * rmr * rmr);
    }

    function calculateEffectiveCapacityKN(boltCapacity, boltEfficiency, plateEfficiency) {
        return boltCapacity * boltEfficiency * plateEfficiency;
    }

    function convertKNtoTonnes(kn) {
        return kn / 9.80665;
    }

    function calculateSpacing(effectiveCapacityKN, rockLoad, fos, jf) {
        const denominator = rockLoad * fos * jf;
        if (denominator <= 0) return 0;
        return Math.sqrt(effectiveCapacityKN / denominator);
    }

    function calculateSupportDensity(effectiveCapacityT, spacing) {
        if (spacing <= 0) return 0;
        return effectiveCapacityT / (spacing * spacing);
    }

    function calculateAchievedFoS(effectiveCapacityKN, rockLoad, jf, spacing) {
        const denominator = rockLoad * jf * spacing * spacing;
        if (denominator <= 0) return 0;
        return effectiveCapacityKN / denominator;
    }

    function buildReferenceRows(gamma, span, effectiveCapacityKN, fos) {
        const rmrValues = [30, 40, 50, 60, 70, 80];
        return rmrValues.map(rmrValue => {
            const rockLoad = calculateRockLoadCMRI(rmrValue, gamma, span);
            const spacing = calculateSpacing(effectiveCapacityKN, rockLoad, fos, 1);
            return { rmr: rmrValue, rockLoad, spacing };
        });
    }

    function renderReferenceTable(rows) {
        const tableBody = document.getElementById('reference-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.rmr}</td>
                <td>${roundValue(row.rockLoad, 4)}</td>
                <td>${roundValue(row.spacing, 9)}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function drawArrow(ctx, x1, y1, x2, y2) {
        const headLength = 8;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(
            x2 - headLength * Math.cos(angle - Math.PI / 6),
            y2 - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(x2, y2);
        ctx.lineTo(
            x2 - headLength * Math.cos(angle + Math.PI / 6),
            y2 - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
    }

    function renderGridDiagram(displaySpacing) {
        const canvas = document.getElementById('grid-diagram-canvas');
        const spacingValueEl = document.getElementById('diagram-spacing-value');
        const burdenValueEl = document.getElementById('diagram-burden-value');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#f7f7f7';
        ctx.fillRect(0, 0, width, height);

        const cols = 5;
        const rows = 4;
        const left = 130;
        const top = 70;
        const dx = 85;
        const dy = 55;

        ctx.strokeStyle = '#b0b0b0';
        ctx.lineWidth = 1;
        for (let r = 0; r < rows; r += 1) {
            const y = top + r * dy;
            ctx.beginPath();
            ctx.moveTo(left, y);
            ctx.lineTo(left + (cols - 1) * dx, y);
            ctx.stroke();
        }
        for (let c = 0; c < cols; c += 1) {
            const x = left + c * dx;
            ctx.beginPath();
            ctx.moveTo(x, top);
            ctx.lineTo(x, top + (rows - 1) * dy);
            ctx.stroke();
        }

        ctx.fillStyle = '#333';
        for (let r = 0; r < rows; r += 1) {
            for (let c = 0; c < cols; c += 1) {
                const x = left + c * dx;
                const y = top + r * dy;
                ctx.beginPath();
                ctx.arc(x, y, 4.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.strokeStyle = '#1f4e79';
        ctx.fillStyle = '#1f4e79';
        ctx.lineWidth = 2;

        const xStart = left;
        const xEnd = left + dx;
        const ySpacing = top + (rows - 1) * dy + 35;
        drawArrow(ctx, xStart, ySpacing, xEnd, ySpacing);
        drawArrow(ctx, xEnd, ySpacing, xStart, ySpacing);
        ctx.font = '14px Arial';
        ctx.fillText(`Spacing = ${roundValue(displaySpacing, 4)} m`, xStart + 6, ySpacing - 8);

        const yStart = top;
        const yEnd = top + dy;
        const xBurden = left - 35;
        drawArrow(ctx, xBurden, yStart, xBurden, yEnd);
        drawArrow(ctx, xBurden, yEnd, xBurden, yStart);
        ctx.fillText(`Burden = ${roundValue(displaySpacing, 4)} m`, 16, yStart + dy / 2 + 6);

        if (spacingValueEl) spacingValueEl.textContent = roundValue(displaySpacing, 4);
        if (burdenValueEl) burdenValueEl.textContent = roundValue(displaySpacing, 4);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateInputs()) return;

        if (checkButton) {
            checkButton.disabled = true;
            checkButton.textContent = 'Calculating...';
        }

        setTimeout(() => {
            try {
                const rmr = parseFloat(document.getElementById('rmr').value);
                const roofThickness = parseFloat(document.getElementById('roof-thickness').value);
                const gallerySpan = parseFloat(document.getElementById('gallery-span').value);
                const rockUnitWeight = parseFloat(document.getElementById('rock-unit-weight').value);
                const boltCapacity = parseFloat(document.getElementById('bolt-capacity').value);
                const fos = parseFloat(document.getElementById('fos').value);
                const boltEfficiency = parseFloat(document.getElementById('bolt-efficiency').value);
                const plateEfficiency = parseFloat(document.getElementById('plate-efficiency').value);
                const gridSpacingInput = document.getElementById('grid-spacing').value;
                const jf = parseFloat(document.getElementById('location').value);

                const hasProposedGrid = gridSpacingInput !== '' && !isNaN(parseFloat(gridSpacingInput));
                const proposedGridSpacing = hasProposedGrid ? parseFloat(gridSpacingInput) : null;

                const rockLoadCMRI = calculateRockLoadCMRI(rmr, rockUnitWeight, gallerySpan);
                const rockLoadSimplified = calculateRockLoadSimplified(rmr, roofThickness);
                const effectiveCapacityKN = calculateEffectiveCapacityKN(boltCapacity, boltEfficiency, plateEfficiency);
                const effectiveCapacityT = convertKNtoTonnes(effectiveCapacityKN);
                const spacing = calculateSpacing(effectiveCapacityKN, rockLoadCMRI, fos, jf);
                const supportDensity = calculateSupportDensity(effectiveCapacityT, spacing);
                const supportDensityProposed = hasProposedGrid ? calculateSupportDensity(effectiveCapacityT, proposedGridSpacing) : null;
                const achievedFoS = hasProposedGrid ? calculateAchievedFoS(effectiveCapacityKN, rockLoadCMRI, jf, proposedGridSpacing) : null;
                const spacingAdequacy = hasProposedGrid ? (proposedGridSpacing <= spacing ? 'Adequate' : 'Not adequate') : 'Not provided';
                const referenceRows = buildReferenceRows(rockUnitWeight, gallerySpan, effectiveCapacityKN, fos);
                const diagramSpacing = hasProposedGrid ? proposedGridSpacing : spacing;

                const rockLoadEl = document.getElementById('rock-load');
                const rockLoadSimplifiedEl = document.getElementById('rock-load-simplified');
                const effectiveCapacityKNEl = document.getElementById('effective-capacity-kn');
                const effectiveCapacityTEl = document.getElementById('effective-capacity-t');
                const spacingEl = document.getElementById('spacing');
                const proposedGridSpacingEl = document.getElementById('proposed-grid-spacing');
                const supportDensityEl = document.getElementById('support-density');
                const supportDensityProposedEl = document.getElementById('support-density-proposed');
                const achievedFoSEl = document.getElementById('achieved-fos');
                const gridSpacingStatusEl = document.getElementById('grid-spacing-status');

                if (rockLoadEl) rockLoadEl.textContent = roundValue(rockLoadCMRI, 4);
                if (rockLoadSimplifiedEl) rockLoadSimplifiedEl.textContent = roundValue(rockLoadSimplified, 4);
                if (effectiveCapacityKNEl) effectiveCapacityKNEl.textContent = roundValue(effectiveCapacityKN, 2);
                if (effectiveCapacityTEl) effectiveCapacityTEl.textContent = roundValue(effectiveCapacityT, 3);
                if (spacingEl) spacingEl.textContent = roundValue(spacing, 4);
                if (proposedGridSpacingEl) proposedGridSpacingEl.textContent = hasProposedGrid ? roundValue(proposedGridSpacing, 4) : '-';
                if (supportDensityEl) supportDensityEl.textContent = roundValue(supportDensity, 4);
                if (supportDensityProposedEl) supportDensityProposedEl.textContent = hasProposedGrid ? roundValue(supportDensityProposed, 4) : '-';
                if (achievedFoSEl) achievedFoSEl.textContent = hasProposedGrid ? roundValue(achievedFoS, 4) : '-';

                if (gridSpacingStatusEl) {
                    gridSpacingStatusEl.textContent = spacingAdequacy;
                    gridSpacingStatusEl.classList.remove('status-good', 'status-bad', 'status-neutral');
                    if (!hasProposedGrid) {
                        gridSpacingStatusEl.classList.add('status-neutral');
                    } else if (spacingAdequacy === 'Adequate') {
                        gridSpacingStatusEl.classList.add('status-good');
                    } else {
                        gridSpacingStatusEl.classList.add('status-bad');
                    }
                }

                renderReferenceTable(referenceRows);
                renderGridDiagram(diagramSpacing);

                if (resultsCard) {
                    resultsCard.classList.remove('hidden');
                    resultsCard.classList.add('visible');
                    setTimeout(() => {
                        resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                }
            } catch (error) {
                console.error('Calculation error:', error);
                alert('An error occurred during calculation. Please check your inputs.');
            } finally {
                if (checkButton) {
                    checkButton.disabled = false;
                    checkButton.textContent = 'Check';
                }
            }
        }, 300);
    });

    inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('blur', function() {
                validateInputs();
            });
            input.addEventListener('input', function() {
                clearError(id);
            });
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});
