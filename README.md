# Support-System-design-In-Coal-Mine-Galleries-and-Junctions

A computational tool designed to assist engineers in determining optimal rock support parameters for underground coal mine galleries and junctions. This project presents a semi-empirical, computation-aided approach to design roof-bolt support using rock mass classification (RMR/Q) with simplified CMRI–ISM style rock-load relations.

## Features

- **Support Design Calculator**: Calculate rock load, effective support capacity, and recommended spacing based on RMR classification and bolt parameters
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean Modern UI**: Professional, minimal design with smooth animations

## Tech Stack

- HTML5
- CSS3 (with CSS Variables for theming)
- JavaScript (Vanilla JS, no frameworks)
- Git & GitHub

## Project Structure

```
├── index.html          # Home page with calculator
├── about.html          # Detailed project information
├── team.html           # Team members page
├── style.css           # Shared stylesheet with dark mode support
├── script.js           # Calculator logic and interactions
└── README.md           # Project documentation
```

## Usage

1. Open `index.html` in a web browser
2. Enter the required parameters:
   - RMR (0-100)
   - Roof Thickness t (m)
   - Bolt Capacity Cb (kN)
   - Factor of Safety (FoS)
   - Bolt efficiency ηb
   - Plate efficiency ηp
   - Location (Gallery/Junction)
3. Click "Check" to calculate results
4. View the calculated rock load, effective capacity, spacing, and support density

## Calculation Formulas

- **Rock Load**: RL = 0.1 × (100 − RMR) × t (t/m²)
- **Effective Capacity (kN)**: C_eff(kN) = C_b × η_b × η_p
- **Effective Capacity (t)**: C_eff(t) = C_eff(kN) / 9.80665
- **Spacing**: S = √(C_eff(t) / (RL × FoS × J_f))
- **Support Density**: C_eff(t) / S²

## Team Members

- Sumit Chaturvedi – 221MN052
- Aditya Anshul – 221MN004
- Sushma – 221MN054

## License

This project is part of a Major Project assignment.

## References

- Paul et al., 2012 — Validation of RMR-based support design, Monnet Ispat (Raigarh), case study
- Bieniawski, 1989 — Engineering Rock Mass Classifications
- Barton, 2002 — Q-value correlations and tunnel design
- CMRI/DGMS guidance for Indian coal measures

