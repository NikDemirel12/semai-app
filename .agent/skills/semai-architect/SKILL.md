---
name: semai-architect
description: Core architectural rules, UI/UX standards, and agritech domain logic for the SEMAI web application. Use this skill whenever generating components, database queries, or business logic for SEMAI.
---

# SEMAI Project Guidelines

# SEMAI Project Guidelines

## 1. Visual Identity & Aesthetic (Editorial Organic Agritech)
- **NEVER** use dark-mode neon/crypto aesthetics.
- **Color Palette:**
  - Main Canvas Background: Warm Cream / Parchment (`bg-[#F5F2EB]`).
  - Sidebar & Almanak Weather Card: Deep Forest Green (`bg-[#163020]` with subtle topographic/organic borders and `text-[#F5F2EB]`).
  - Surface Cards: Crisp Off-White (`bg-[#FAF8F3]` or `bg-white`) with thin earthy borders (`border-[#E2DDD2]`).
  - Primary Accent & Growth Bars: Paddy/Leaf Green (`#2D6A4F` / `#15803D`).
  - Warning / Hidden Cost / Harvest Accent: Warm Ochre / Terracotta (`#B45309` / `#C2410C`).
  - Primary Typography: Deep Charcoal Earth (`text-[#1C251E]`).
- **Typography Style:** Pair a classic editorial serif font (e.g., `Lora` or `Playfair Display` via `next/font/google`) for main page greetings/headings (e.g., *"Selamat pagi, Pak Ahmad"*) with a clean sans-serif (`Plus Jakarta Sans` or `Inter`) for numbers, tables, and buttons.

## 2. Layout & Simplification Rules
- **Desktop:** Clean left sidebar (`bg-[#163020]`) with 5 consolidated navigation items + main warm-cream workspace (`bg-[#F5F2EB]`).
- **Mobile:** Collapsible drawer or clean bottom navigation bar with large thumb-friendly buttons (`h-12`).
- **Language:** All UI text MUST be in natural, warm Bahasa Melayu petani Utara Malaysia.

## 3. Domain Logic (Hidden Costs & Yield)
- Distinguish `DIRECT` expenses (benih, baja, racun) vs `HIDDEN` expenses (`isHidden: true`: minyak mesin, upah harian, pengangkutan, baiki alat).
- Trigger a warm terracotta/amber alert badge whenever `HIDDEN` expenses exceed 20% of total expenses.