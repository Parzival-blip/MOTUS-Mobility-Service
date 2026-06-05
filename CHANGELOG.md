# Changelog

All notable changes to MOTUS will be documented in this file.

---

## v0.3.0 - Mobile Responsiveness & Azure Deployment Stability (5th June 2026)

### Added

* Mobile dashboard navigation drawer with sidebar toggle support
* Defensive fallbacks for missing NEXT_PUBLIC environment variables
* Graceful UI handling for API and network failures

### Improved

* Mobile responsiveness across iPhone, Android, and tablet viewports
* Navbar CTA and authentication visibility on smaller screens
* Responsive breakpoint behavior for navigation and dashboard layouts
* Mobile menu accessibility and interaction flow
* Azure deployment resilience and client-side rendering stability

### Fixed

* Missing Login button on mobile devices
* Missing dashboard sidebar/menu on mobile
* Hydration mismatches caused by client-only state initialization
* Mobile menu z-index conflicts with page content
* Navbar layering issues over hero and map sections
* Overflow clipping caused by fixed-height and overflow-hidden containers
* Component rendering inconsistencies on Azure Static Web Apps
* Sidebar open/close behavior on mobile devices
* Visibility issues caused by hidden md:flex, hidden lg:block, and lg:hidden breakpoint logic

-----

## v0.2.0 - Booking Flow & UX Refinements (1st June 2026)

### Added

* India-only phone number handling with +91 support
* Airport transfer auto-selection when only one ride type is available

### Improved

* Long address handling across booking, fare, and route cards
* Route summary readability and truncation behavior
* Dashboard branding consistency
* Responsive booking flow experience
* Phone autofill and paste compatibility

### Fixed

* Navbar CTA wrapping issue
* Address overflow in map cards
* Address overflow in fare estimate cards
* Layout instability caused by long route text

---

## v0.1.0 - Initial Release/Commit (28th May 2026)

### Added

* Landing page
* Booking workflow
* Dashboard
* Route estimation
* Fare calculation
* Authentication
