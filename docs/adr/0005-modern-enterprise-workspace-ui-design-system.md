# ADR 0005: Modern Enterprise Workspace UI Design System (2026 Edition)

## Status

Accepted

## Context

The initial UI implementation adhered to a traditional enterprise tabular aesthetic. However, user feedback noted that the visual appearance felt dated and reminiscent of legacy software rather than a sleek, modern productivity application.

## Decision

Adopt the **Modern Enterprise Workspace Pro (2026 Edition)** design architecture:
1. **Design Archetype:** Linear / Raycast / Modern Notion style — clean micro-borders, subtle ambient elevation, refined typography, and high visual hierarchy.
2. **Palette Preservation:** Maintain EGAT Brand Identity (`#005B9A` primary, `#F0B323` amber accent, `#0F2747` navy) but modernize with layered surface tones, subtle tinted badge backgrounds, and glow status pips.
3. **Component Modernization:**
   - Floating frosted header with live sync pulse.
   - Interactive Bento KPI cards with mini progress rings.
   - Segmented view toggles (Table vs Kanban).
   - High-density data grid with floating hover actions.
   - Quick-action modal dialogs with backdrop blur and sleek input presets.
4. **Performance & Lightweight Principles (Ponytail):** No heavy UI libraries added; purely executed via Tailwind CSS v4, CSS variables, and native React 19 features.

## Consequences

- Significantly elevated user experience and modern aesthetic appeal.
- Enhanced readability and fast visual scanning for engineers and managers.
- Zero performance penalty or external bundle bloat.
