# Frontier: Global Market Intelligence for Founders

> "We scan every market in the world so founders can find where their idea is a gap, not a graveyard."

---

## 1. Executive Summary
**Frontier** is an AI-powered market arbitrage engine. It helps founders identify geographic gaps for proven business models by scanning live, fragmented, and multilingual data sources that traditional databases (like Crunchbase) cannot reach. Powered by **TinyFish**, Frontier turns "unscrapeable" local news, government portals, and foreign-language VC blogs into actionable market intelligence.

---

## 2. The Problem
Founders often kill great ideas because they see competition in mature markets (e.g., USA). However, they lack the tools to see:
- **Market Vacuum:** Where a model is proven but has zero local penetration.
- **Fragmented Data:** Signals buried in local languages (Vietnamese, Portuguese) or behind login-walled grant portals.
- **Timing:** Emerging trends in India/Brazil that are 18 months away from hitting Southeast Asia.

---

## 3. The Solution: Three Core Modules

### **I. Gap Radar (The Flagship)**
Takes a business model and scores "Opportunity Windows" across different regions.
- **Input:** "AI-powered legal document translation for SMEs."
- **Output:** A heatmap of market maturity vs. competition vs. regulatory tailwinds.

### **II. Signal Feed**
Real-time monitoring of "soft signals":
- Accelerator cohort themes (e.g., what is Antler or Surge looking for right now?).
- Hiring velocity in specific sectors.
- Regulatory changes (e.g., new ESG reporting requirements in Indonesia).

### **III. Trend Bridge**
Surfaces emerging categories in mature markets (US, India, Nigeria) that are statistically likely to migrate to SEA based on consumer adoption curves.

---

## 4. Technical Architecture (Powered by TinyFish)

Frontier leverages TinyFish's **Web Agent** to bypass the limitations of traditional APIs.

### **Data Orchestration**
- **Multilingual Scrapers:** Using TinyFish to navigate local news sites (e.g., *VNExpress* for Vietnam, *Infomoney* for Brazil) with goals like: *"Extract all news about seed-stage EdTech funding from the last 3 months."*
- **Auth-Walled Access:** Navigating government grant portals (e.g., Enterprise Singapore, MDI Ventures) to find open opportunities that require form interaction.
- **Anti-Detection:** Utilizing TinyFish's `stealth` mode and `proxy_config` to access region-locked data in Indonesia and Thailand.

### **The Stack**
- **Frontend:** React (TypeScript) for a high-fidelity dashboard.
- **Backend:** Node.js (Express) orchestrating parallel TinyFish agents.
- **Intelligence:** LLM (GPT-4o) to synthesize raw data from TinyFish into structured market briefs.

---

## 5. Hackathon Demo Script (3 Minutes)

### **Phase 1: The Setup (0:00 - 0:45)**
*Presenter:* "I'm a founder in Singapore. I have an idea for **AI legal translation for SMEs**. I've seen it work in India, but I don't know if it's viable here or in Jakarta. Let's ask Frontier."

### **Phase 2: The Action (0:45 - 2:00)**
1. **Input:** Type "AI legal translation for SMEs" into the search bar.
2. **Visual:** Show a "Scanning Global Signals" animation. Under the hood, Frontier fires 3 TinyFish agents:
   - **Agent A (Indonesia):** Scans *DailySocial.id* and *Kompas* for "LegalTech" or "Translation" funding.
   - **Agent B (Vietnam):** Checks *TechInAsia* and local accelerator portfolios.
   - **Agent C (Regional):** Scans government grant portals for "Digitization" or "SME" grants.
3. **Live Progress:** Display TinyFish progress events: *"Searching Indonesian regulatory portals..."*, *"Extracting VC activity in Ho Chi Minh City..."*

### **Phase 3: The Moment (2:00 - 2:45)**
The dashboard populates:
- 🟡 **Singapore:** "Saturated. 3 players found. Average Seed: $1.2M."
- 🟢 **Indonesia:** "High Gap. 60M SMEs. No direct AI legal translation competitors. **Signal:** Recent OJK regulation mandates digital records."
- 💰 **Opportunity:** "MDI Ventures SEA Digital Fund closes April 30. Grant focus: SME Digitization."

### **Phase 4: The Close (2:45 - 3:00)**
*Presenter:* "In 30 seconds, Frontier turned a vague idea into a roadmap. We didn't just search the web; we operated on it using TinyFish. This is the unfair advantage every founder needs."

---

## 6. Business Model
- **Free:** Gap Radar (basic searches).
- **Pro ($29/mo):** Full Signal Feed + Trend Bridge.
- **Team ($500/mo):** For Accelerators (e.g., SMU IIE) to monitor cohort progress and find market pivots.

---

## 7. Why We Win
1. **Technical Depth:** Real-world use of TinyFish for complex, multilingual web automation.
2. **Visceral Demo:** Moves from abstract AI chat to concrete, cited, real-time data.
3. **Market Fit:** Solves a pain point shared by every founder, VC, and accelerator in the room.
