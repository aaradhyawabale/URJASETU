# PCCOE IGC — From Problem Space to Winning Solution
**Easy-English working document. Use this to build the PPT today.**

---

## STEP 1 — The Problem, In Simple Words

**1. Actual fundamental problem:** Small and mid-size Indian towns are growing fast, but the people planning them don't have a clear, current picture of their own land. So decisions about where to put solar, EV chargers, or new infrastructure get made ad-hoc, not based on data.

**2. Why it matters for Tier-2/3 towns:** Government data confirms these towns have *less* planning staff and *less* tooling than big metros, even as they're now being pulled into the next phase of the Smart Cities Mission. Big-city tools (Esri, GMIS, digital twins) exist, but they're expensive, complex, and built with big-city budgets in mind — not for a town with one overworked planning officer.

**3. Who suffers:** Municipal officers who have to make siting decisions with guesswork. Citizens who get infrastructure placed in the wrong spot, or don't get it for years. Investors/agencies who can't easily justify where to deploy solar or EV money in smaller towns.

**4. Who uses our solution:** Municipal/urban local body officers, town planning departments, state renewable-energy or EV-policy nodal agencies, and (as a stretch) private installers evaluating a town.

**5. Decisions that are currently hard:** "Where should we put the next solar installation / EV charging point in this town, given flood risk, land availability, and demand — and why?"

**6. Why current tools fall short (evidence, not guesses):**
- TERI's open-source rooftop-solar GIS tool was built and only ever deployed for **Chandigarh** — it was never generalized to other towns.
- EV charging site-selection work (GIS + AHP/TOPSIS methods) exists as **academic papers per city** — Varanasi, Mumbai — not as reusable software a non-GIS officer can run on a new town.
- Flood risk tools are either **commercial and limited to 51 major urban agglomerations** (RMSI FloodRisk) or **one-off academic studies for a single city** (Warangal, Kulgaon-Badlapur) — smaller towns are simply not covered.
- Big GIS/digital-twin platforms (Esri, GMIS, IGiS) are real and used in India, but they target the ~100 Smart Cities Mission cities with dedicated budgets — not the thousands of smaller municipalities.

**7. Most promising problem areas:** Energy (solar), Mobility (EV), Environment (flood risk) show the clearest evidence of *real, unmet* gaps at the tier-2/3 scale. Land-use and Economics are useful supporting layers but weaker as a standalone hackathon core.

**8. Which 2-3 areas connect naturally?** Solar potential + EV charging demand are already being studied together in research (a 2023 GIS+AHP study explicitly combines solar-farm and EV-charging-station site selection) — this is a *real, validated connection*, not a forced one. Flood-risk/land-conflict screening is a natural third layer: you don't want to recommend a great solar-EV site that floods every monsoon.

*(Assumption, not fact: that combining solar + EV siting produces better real-world outcomes than doing each separately — this is supported by research interest but not proven at scale. Worth stating honestly to judges.)*

---

## STEP 2 — Existing Solutions (Research Summary)

| Existing Solution | What it does | Who uses it | Data required | Strength | Weakness | Our opportunity |
|---|---|---|---|---|---|---|
| **TERI Rooftop Solar Web-GIS Tool** | Estimates rooftop solar potential per building | Individuals, planners (Chandigarh only) | Aerial/LIDAR building data | Open-source, easy to understand | Never scaled past one city; no EV or risk layer | Build it as a reusable engine for *any* town, not a one-city demo |
| **Esri / GMIS / IGiS enterprise GIS platforms** | Full smart-city GIS: utilities, land, infra layers | ~100 Smart Cities Mission cities, big municipal corporations | Survey-grade GIS data, DGPS, paid licenses | Powerful, proven at scale | Expensive, needs GIS specialists, not built for small towns | A lightweight, free-data version aimed at officers with zero GIS training |
| **Academic EVCS site-selection studies (Varanasi, Mumbai, etc.)** | Use GIS + AHP/TOPSIS/MCDM to rank EV charging sites | Researchers, published as papers | OSM, census, traffic data | Methodologically solid, India-specific | Locked in PDFs, one city at a time, never becomes usable software | Turn the *method* into a live, reusable tool any officer can run on their own town |
| **RMSI India FloodRisk™ (commercial)** | Probabilistic flood risk scoring | Insurers, large agencies | Proprietary DEM, rainfall, land-use data | High accuracy, nationwide | Paid, and detailed modeling only for 51 major urban agglomerations | A simpler, free-data flood/risk *screening* layer good enough to avoid bad siting decisions in smaller towns |
| **WebFRIS (IIT Bombay)** | Flood risk + socio-economic vulnerability mapping | Government, citizens (built per study region) | Hazard + vulnerability data | Adds vulnerability, not just hazard | Research tool, not built as an infra-siting decision layer | Reuse the *idea* (hazard + vulnerability) as a conflict filter for siting, not just disaster response |

**Concrete gap statement:** Existing tools each solve *one* slice (solar OR EV OR flood) for *one* well-resourced city, as either an expensive enterprise platform or a one-off academic study. No accessible, reusable tool combines solar potential + EV demand + flood-risk screening into one ranked, explainable shortlist that a non-technical municipal officer in a smaller town can actually use.

---

## STEP 3 — 5–7 Possible Hackathon Solutions

### 1. SolarEV Site Compass
**One-line idea:** Ranks locations in a town for solar-powered EV charging hubs, explaining exactly why each spot scored well or badly.
**Core problem:** No reusable tool combines solar potential + EV demand + flood risk for siting decisions in smaller towns.
**Target user:** Municipal planning officer, state EV/renewable nodal agency.
**Existing gap:** Solar and EV siting research exist, but only as single-city academic exercises or paid enterprise tools.
**How it works:** Grid the town → score each cell for solar potential (roof/open-land area, sun exposure) and EV demand proxy (road density, population, existing traffic) → subtract points for flood risk/encroachment/utility conflicts → rank + explain top sites.
**Unique innovation:** Combines 2 validated-but-separate research directions (solar+EV siting) with a flood/conflict filter, and makes it reusable across *any* town rather than one case study.
**Data:** Real — OSM building/road footprints, Bhuvan/Sentinel imagery, open rainfall/DEM data. Simulated — demand weighting, cost assumptions. Future — live grid capacity data.
**Technology:** GIS scoring (grid-based), simple weighted multi-criteria scoring (AHP-style), no heavy AI needed.
**AI necessity:** NO for the core score — transparent weighted scoring is more trustworthy and explainable to a municipal officer than a black-box model. Optional lightweight ML only for demand estimation if time allows.
**MVP:** One demo town, grid overlay, ranked site list with reasons, flood-risk exclusion shown visually.
**Demo:** Judge picks a location on the map → sees live score breakdown → sees why a nearby "obvious" spot was rejected (flood zone).
**Impact:** Faster, defensible siting decisions; avoids costly mistakes (infra built in flood-prone land).
**Scalability:** Works for any town with OSM + open satellite coverage — not locked to one city.
**Technical difficulty:** Medium. **Innovation:** High. **Judge appeal:** High.

### 2. Flood-Aware Infrastructure Screener
**One-line idea:** Before any infrastructure is proposed, screens it against flood/drainage risk automatically.
**Core problem:** Infrastructure gets approved without systematic flood-risk screening in smaller towns.
**Target user:** Municipal engineering/planning department.
**Existing gap:** Flood tools exist per-city as academic studies, not as a reusable screening step in planning workflow.
**How it works:** User marks a proposed site/project → tool overlays elevation, drainage proximity, historic rainfall intensity → returns a risk flag with reasoning.
**Unique innovation:** Positions flood risk as a *pre-approval checkpoint* in the workflow, not a post-disaster map.
**Data:** Real — DEM, OSM drainage layers, open rainfall data. Simulated — historic flood events if not available per town.
**AI necessity:** NO — rule-based/GIS overlay is sufficient and more explainable.
**Technical difficulty:** Medium. **Innovation:** Medium. **Judge appeal:** Medium (single-domain, narrower story).

### 3. Rooftop Solar Generalizer
**One-line idea:** Extends TERI's Chandigarh-only rooftop solar tool logic to work for any Indian town using free satellite data.
**Core problem:** Rooftop solar potential tools exist but were never made reusable beyond one city.
**Existing gap:** Tool exists conceptually but isn't generalized.
**Unique innovation:** Reusability, not new science.
**AI necessity:** NO — geometry + solar-angle math, not ML.
**Technical difficulty:** Medium. **Innovation:** Low-Medium (extending known work). **Judge appeal:** Medium (feels like "redo of an existing tool").

### 4. EV Demand-Grid Stress Predictor
**One-line idea:** Predicts where EV charging growth will strain the local electricity grid before it happens.
**Core problem:** EV siting studies ignore grid-capacity constraints.
**Existing gap:** Most EVCS papers optimize for user convenience, not grid impact.
**AI necessity:** Possibly YES for demand growth forecasting, but real grid-capacity data is very hard to get in India at this level — high data risk.
**Technical difficulty:** High (data availability risk). **Innovation:** High. **Judge appeal:** Medium (data risk hurts credibility of demo).

### 5. Municipal "What-If" Land Simulator
**One-line idea:** Lets an officer simulate "what happens if we build X here" across multiple infrastructure types.
**Core problem:** Broad — tries to cover too much (land use + energy + mobility + environment at once).
**Risk:** This is exactly the "everything dashboard" the brief warns against. Rejected as too broad for a focused hackathon story, unless narrowed sharply.

### 6. Green Corridor Mapper
**One-line idea:** Maps and protects green cover/open land from being lost to random infrastructure placement.
**Core problem:** Green space loss isn't factored into infra siting.
**Existing gap:** Real, but weaker connection to energy/mobility; would need its own separate narrative.
**Technical difficulty:** Medium. **Innovation:** Medium. **Judge appeal:** Medium.

### 7. Citizen Infrastructure Feedback Loop
**One-line idea:** Lets citizens flag where infrastructure decisions went wrong (flooding, badly placed chargers) to improve future siting.
**Core problem:** No feedback loop from real outcomes back into planning data.
**Existing gap:** Real but needs long-term data collection — weak for a 24-72 hour hackathon demo since there's no historical feedback data yet.
**Technical difficulty:** Low. **Innovation:** Medium. **Judge appeal:** Low-Medium (nothing to demo without existing data).

---

## STEP 4 — Scoring Table

| Solution | Problem importance | Uniqueness | Innovation | Tech feasibility | Data availability | Demo potential | Real impact | Scalability | Judge appeal | PPT story | **Total /100** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1. SolarEV Site Compass | 9 | 8 | 9 | 7 | 7 | 9 | 8 | 9 | 9 | 9 | **84** |
| 2. Flood-Aware Screener | 8 | 6 | 6 | 8 | 7 | 7 | 7 | 8 | 6 | 6 | **69** |
| 3. Rooftop Solar Generalizer | 6 | 4 | 4 | 8 | 6 | 6 | 6 | 7 | 5 | 5 | **57** |
| 4. EV Grid Stress Predictor | 8 | 8 | 8 | 4 | 3 | 5 | 7 | 6 | 6 | 6 | **61** |
| 5. What-If Land Simulator | 7 | 5 | 6 | 4 | 5 | 6 | 6 | 5 | 6 | 5 | **55** |
| 6. Green Corridor Mapper | 6 | 5 | 5 | 7 | 6 | 6 | 6 | 7 | 5 | 5 | **58** |
| 7. Citizen Feedback Loop | 6 | 6 | 5 | 6 | 2 | 3 | 6 | 6 | 4 | 4 | **48** |

**Winner: Solution 1 — SolarEV Site Compass.** It has the best combination of impact, innovation, feasibility, demo strength, and defensibility — not just the highest single score on any one axis.

---

## STEP 5 — Why This One

1. It's grounded in *two real, cited research gaps* (solar-only tools stuck at one city; EVCS siting stuck in academic PDFs), not an invented idea.
2. It naturally connects only 2-3 things (solar, EV, flood-risk-as-filter) — it doesn't try to be an "everything dashboard."
3. It's reusable across towns by design, which directly answers the brief's core problem statement (fragmented, one-off, non-integrated planning).
4. It needs no exotic data — OSM, Bhuvan, and open rainfall/DEM data are enough for a credible MVP.
5. It doesn't force AI — the core logic is transparent scoring, which is *more* credible to a judge (and a real municipal officer) than an unexplainable model.
6. It has a strong, visual, map-based demo that's easy to understand in under a minute.
7. It has a clear "why now" — EV adoption and solar rollout are actively expanding into tier-2/3 towns right now, so the timing story is real.

**"Why can't an existing GIS/smart-city platform already do this?"**
Because the platforms that *could* (Esri, GMIS, IGiS) are enterprise products built for the ~100 funded Smart Cities Mission cities, requiring GIS specialists and paid licenses — not designed for a small municipality with one planning officer and no GIS budget. And the tools that *are* free (TERI's solar tool) were never generalized past a single pilot city. Nobody has combined the two into one lightweight, explainable, reusable tool.

---

## STEP 6 — Making It Genuinely Unique (the "WOW" layer)

Add these 2-3 mechanisms — not random extra features:

1. **"Why this location?" explainable reasoning** — every ranked site shows a plain-language breakdown ("High score because: strong sun exposure, near main road, low flood risk. Rejected nearby site because: low-lying, 200m from drainage channel."). This is the single biggest judge-appeal lever — it turns a black-box score into something a municipal officer could actually defend to their boss.
2. **Conflict detection, not just scoring** — actively flag when a high-opportunity site overlaps a flood-prone or already-congested zone, instead of just quietly scoring it lower. This "catches a mistake before it happens" framing is far more memorable in a demo than a plain ranked list.
3. **Reusability switch** — show the *same tool* instantly re-running on a second, different town live in the demo. This single moment is what proves "not a one-city case study" — directly answering the brief's core complaint about existing tools.

---

## STEP 7 — The Product

**5 name options:** UrjaSetu ("energy bridge"), SolarEV Compass, GridSight, SiteSense, GreenRoute.
*(Recommended: **UrjaSetu** — memorable, India-rooted, and literally means "the bridge to energy decisions.")*

**One-line pitch (10 seconds):** "UrjaSetu tells any Indian town exactly where to put its next solar-EV charging point — and exactly why — in seconds, not months."

**Problem statement (max 3 sentences):** Small and mid-size Indian towns want to add solar and EV infrastructure, but have no affordable, reusable way to decide *where*. Existing tools are either built for big, funded cities, or are one-off academic studies that never leave a single city. As a result, siting decisions are made on guesswork, sometimes landing infrastructure in flood-prone or poorly-connected spots.

**Solution statement (max 3 sentences):** UrjaSetu scores every part of a town for solar-EV site potential, using free satellite and open map data, then automatically screens out flood-risk or conflict zones. It explains every recommendation in plain language, so a municipal officer can defend the decision. It's built to work on any town, not just one pilot city.

**Target users:** Primary — municipal/ULB planning officers. Secondary — state renewable energy/EV nodal agencies, private solar-EV installers scouting towns.

**Main workflow:**
`INPUT (town boundary + free map/satellite data) → PROCESSING (grid the town, pull solar + road + population layers) → ANALYSIS (score opportunity, screen for flood/conflict) → RECOMMENDATION (ranked, explained shortlist) → DECISION (officer picks a site) → IMPACT (faster, defensible, safer infrastructure placement)`

---

## STEP 8 — The 2–3 Core Capabilities

**Capability 1: Opportunity Scoring**
- Problem: No easy way to compare sites for solar+EV potential.
- Input: OSM roads/buildings, Bhuvan/Sentinel imagery, population density.
- Processing: Grid-based weighted scoring (sun exposure + road proximity + demand proxy).
- Output: A heat-map of opportunity scores across the town.
- User benefit: See at a glance where potential is highest.
- Technology: GIS grid scoring, simple weighted multi-criteria logic.
- Demo: Colored heat-map appears live over the town map.

**Capability 2: Risk & Conflict Screening**
- Problem: High-potential sites can still be bad choices (flood-prone, already congested).
- Input: Open DEM/elevation, drainage proximity, rainfall data.
- Processing: Flag/penalize cells that fail risk thresholds.
- Output: Risk overlay + automatic exclusion of unsafe top picks.
- User benefit: Avoids costly siting mistakes.
- Technology: Rule-based GIS overlay (no ML needed).
- Demo: A "great-looking" spot gets visibly rejected with a flood-icon and reason.

**Capability 3: Explainable Recommendation**
- Problem: Officers can't act on a score they can't explain to their superiors.
- Input: Outputs of Capability 1 + 2.
- Processing: Convert scores into plain-language reasoning.
- Output: Ranked shortlist, each with a "why" statement.
- User benefit: Decision becomes defensible, not just a number.
- Technology: Simple templated reasoning logic over the scoring breakdown.
- Demo: Clicking any ranked site shows its reasoning card instantly.

**How they connect:** Capability 1 finds *where opportunity is*, Capability 2 removes *where it's unsafe*, Capability 3 makes the result *usable by a human decision-maker*. Remove any one and the product breaks: without scoring there's nothing to rank; without risk screening the recommendations could be dangerous; without explanation the officer can't act on it.

---

## STEP 9 — Technical Architecture (hackathon-realistic)

```
Data Sources (OSM, Bhuvan/Sentinel, open DEM, open rainfall data)
        ↓
Data Processing (Python: grid generation, feature extraction)
        ↓
GIS Layer / Lightweight DB (PostGIS or GeoJSON + SQLite for hackathon speed)
        ↓
Scoring Engine (weighted multi-criteria scoring, rule-based risk flags)
        ↓
Explanation Layer (templated reasoning generator)
        ↓
Web Application (React + Leaflet map frontend, Node/Express or FastAPI backend)
        ↓
Municipal Officer (interactive map + ranked shortlist)
```
- **Frontend:** React + Leaflet (free, map-friendly, fast to build).
- **Backend:** Node.js/Express or Python FastAPI (whichever the team is faster with).
- **Database:** SQLite/GeoJSON for hackathon speed; PostGIS if time allows.
- **GIS tools:** Turf.js or GeoPandas for spatial operations.
- **AI/ML:** None required for MVP; optional lightweight regression later for demand estimation.
- **Datasets:** Open only (see Step 10) — no paid APIs.
- **Hosting:** Any free-tier host (Render/Vercel) for the demo.
- **Auth:** Skip for hackathon MVP — not the story.

---

## STEP 10 — Dataset Plan

| Dataset | Source | What it gives us | Resolution | Freshness | Free? | Useful for MVP? |
|---|---|---|---|---|---|---|
| Building/road footprints | OpenStreetMap | Roads, buildings, land use tags | Variable — good in mapped towns, patchy in very small ones | Community-updated | Yes | Yes — core input; must manually verify coverage for the chosen demo town first |
| Satellite imagery | Bhuvan (ISRO) | Visual base layer, land cover | 1m for 177 mapped cities, 2.5m elsewhere | Periodic | Yes | Yes, for visualization; resolution good enough for grid-level scoring, not individual rooftops everywhere |
| Elevation/DEM | Bhuvan / open global DEM (SRTM) | Terrain height for flood-risk screening | ~30m (SRTM) | Static | Yes | Yes — sufficient for coarse flood-risk flagging |
| Rainfall/climate data | IMD open data / open climate portals | Rainfall intensity for risk scoring | District/town level | Historical, periodic | Yes (some registration needed) | Yes, for risk weighting |
| Population/demand proxy | Census/town open data or OSM POI density | Demand estimation proxy | Ward/town level | Census is dated (verify latest available) | Yes | Yes, as a proxy — flag as approximate in the pitch |

**Honest note for the pitch:** OSM coverage and Bhuvan's 1m imagery are strongest for larger/mapped towns; for very small or remote towns, resolution and freshness genuinely drop — this should be stated upfront as a known limitation, not hidden.

---

## STEP 11 — MVP vs Future Version

**HACKATHON MVP (24-72 hrs, REAL where possible):**
- One demo town with verified OSM + Bhuvan coverage.
- Grid-based opportunity scoring (solar + EV proxy) — REAL data + REAL logic.
- Flood-risk screening using SRTM DEM + rainfall data — REAL data, simplified rule-based logic.
- Explainable "why" cards — REAL, generated from actual score components.
- A second town shown live to prove reusability — can use SIMULATED/lighter data if full real data isn't ready in time, clearly labeled as such in the demo.

**FUTURE VERSION (not built now, mentioned only):**
- Live grid-capacity data integration.
- ML-based demand forecasting.
- Multi-department workflow integration (approvals, budgeting).
- Citizen feedback loop.
- Mobile app for field verification.

---

## STEP 12 — 2–3 Minute WOW Demo Sequence

1. Open UrjaSetu — map of Town A loads.
2. Click "Show Opportunity" — heat-map appears over the town in seconds.
3. Judges see a bright, "obviously good" spot near a main road.
4. Click that spot — it's flagged red: "Rejected: high flood risk, 150m from drainage channel."
5. Tool auto-suggests the next-best nearby spot instead — green, with a "why" card: "Selected: strong solar exposure, near arterial road, low flood risk."
6. Presenter says: "Now watch this work on a completely different town" — switches to Town B live.
7. Same process runs again in seconds — heat-map, screening, explained recommendation.
8. Final screen: side-by-side comparison of Town A's and Town B's top picks.
9. Closing line: "This isn't a one-city case study. It's a decision tool any Indian town can use today."

---

## STEP 13 — Pitch Story

**BEFORE:** Municipal officers in smaller towns pick infrastructure sites largely by instinct or convenience, because the data-driven tools that exist are either built for big funded cities or trapped in one-off research papers for a single city.

**PROBLEM:** This leads to infrastructure placed in flood-prone or poorly-connected spots, wasted investment, and slower rollout of solar and EV infrastructure exactly when India is trying to scale both.

**INSIGHT:** Solar potential and EV demand are already known to be connected in research — and flood risk is the missing safety check nobody has paired with it in a reusable, explainable way.

**AFTER:** UrjaSetu turns a guesswork decision into a ranked, explainable, few-seconds recommendation — reusable on any town, not just one pilot city.

**IMPACT:** Faster siting decisions, fewer costly mistakes, and a tool small municipalities can actually afford to use.

---

## STEP 14 — 10-Slide PPT Structure

| # | Title | Main message | Bullets (max 5) | Visual | What to say |
|---|---|---|---|---|---|
| 1 | UrjaSetu | One-line pitch | — | Logo + tagline over a map background | Deliver the 10-second pitch |
| 2 | The Problem | Towns lack data-driven siting decisions | Fragmented data; reactive planning; smaller towns under-resourced; guesswork siting | Simple icon-based problem graphic | Explain the BEFORE story |
| 3 | Why Existing Solutions Fail | Real, cited gaps | TERI tool = 1 city only; EVCS research = academic PDFs; flood tools = 51 big cities only; enterprise GIS = too expensive/complex | Comparison table (from Step 2) | Walk through the gap table quickly |
| 4 | Our Insight | Solar+EV siting is a validated connection; flood-risk is the missing safety layer | 2-3 bullets max | Simple 3-circle Venn: Solar / EV / Flood-risk | Explain the insight in one breath |
| 5 | Our Solution | UrjaSetu explained | Opportunity scoring; risk screening; explainable recommendation; reusable across towns | Screenshot of the map tool | Show, don't just tell |
| 6 | How It Works | The workflow | Input → Processing → Analysis → Recommendation → Decision → Impact | Workflow diagram (Step 7) | Walk through the flow once |
| 7 | Core Capabilities | The 2-3 capabilities | One line per capability | 3-column icon layout | Quickly cover each capability |
| 8 | Technology & Architecture | Hackathon-realistic stack | Frontend/backend/data layers | Architecture diagram (Step 9) | Keep this slide fast, technical judges will ask follow-ups anyway |
| 9 | Impact & Innovation | Why it matters, why it's different | Reusability; explainability; real data; no forced AI | Before/after comparison graphic | Emphasize reusability as the core innovation |
| 10 | MVP + What's Next | What's real today vs. future | MVP bullets; future-vision bullets | Two-column MVP vs Future table | Close with confidence: "what you saw today is real" |

---

## STEP 15 — Visual Direction

- **Theme:** Dark background, single accent color (a solar-yellow or energy-green) — reads as serious/product, not a college slide.
- **Typography:** One clean sans-serif (e.g., Inter/Poppins), large headers, minimal body text.
- **Map visuals:** Use real Leaflet/OSM screenshots, not stock images — authenticity matters to judges.
- **Diagrams:** Simple flow arrows (workflow, architecture) — no cluttered boxes.
- **Before/after:** Split-screen style — "guesswork" vs. "explained recommendation."
- **Icons:** Consistent icon set (outline style) for solar, EV, flood, map pin.
- **Charts:** Only if you have a real comparison number (e.g., scoring table) — skip decorative charts.
- **Rule of thumb:** If a slide has more than 5 bullet points or 2 visuals, split it.

---

## STEP 16 — 15 Hardest Judge Questions

1. **Why does this problem matter?** → Tier-2/3 towns are being pulled into the next Smart Cities phase but have the least planning capacity — this is where the gap is most real, backed by MoHUA's own tier classification.
2. **Why can't Google Maps solve this?** → Google Maps shows what exists, not what *should* be built where, and has no flood-risk or solar-potential scoring layer.
3. **Why can't existing GIS platforms solve this?** → They're built for the ~100 funded Smart Cities Mission cities with GIS specialists on staff — not a small town with one officer and no GIS budget.
4. **Why not use AI for the scoring?** → A transparent weighted score is more trustworthy and legally defensible for a government decision than a black-box model; we keep AI optional for demand forecasting only, later.
5. **Why GIS at all then?** → Because the core problem is spatial — which land is where, sun exposure, distance to roads/drainage — GIS is the right tool for spatial comparison, not just a buzzword.
6. **Where did your data come from?** → Name the specific sources used in the demo (OSM, Bhuvan, SRTM/DEM, rainfall data) — be exact, not vague.
7. **How accurate is your model?** → We're transparent that this is a screening/ranking tool, not a certified engineering assessment — it narrows options fast, a final site still needs on-ground survey.
8. **What happens if data is missing for a town?** → The tool flags low-confidence areas explicitly rather than silently guessing — this is safer than existing one-off studies which assume complete data.
9. **Can this work outside one city?** → Yes — that's the entire point; demo shows it running live on a second, different town.
10. **What is actually implemented (real) vs. simulated?** → State clearly per Step 11 — don't blur this, judges respect honesty here.
11. **What is your biggest technical limitation?** → OSM/Bhuvan data quality varies by town size; very small/remote towns have patchier coverage — we say this upfront.
12. **Who pays for this?** → State/municipal renewable-energy or Smart Cities budgets already exist for planning tools; this is far cheaper than enterprise GIS licensing.
13. **Why would a municipality adopt this over doing nothing?** → Because doing nothing means continuing guesswork siting, which has a real cost (flood-damaged infrastructure, wasted subsidy money).
14. **What is genuinely innovative here, not just a mashup?** → The explainable "why this site / why not that one" reasoning layer, and proven reusability across towns — not the individual technologies themselves.
15. **How is this different from the academic MCDM papers you cited?** → Those are single-city research outputs in PDF form; this is working, reusable software with a UI a non-researcher can operate.

---

## STEP 17 — Final Recommendation

**WINNING SOLUTION**

**Name:** UrjaSetu (SolarEV Site Compass)
**One-line pitch:** Tells any Indian town exactly where to put its next solar-EV charging point — and exactly why — in seconds.
**Core problem:** Small/mid-size Indian towns have no affordable, reusable, explainable way to decide where to site solar-EV infrastructure safely.
**Target user:** Municipal/ULB planning officers; state renewable-energy/EV nodal agencies.
**3 core capabilities:** Opportunity scoring (solar + EV demand) · Risk & conflict screening (flood-aware) · Explainable recommendation.
**Unique innovation:** Combines two validated-but-separate research directions into one reusable, explainable tool — proven live on more than one town, unlike every existing single-city study or enterprise-only platform.
**MVP:** Grid-based scoring + flood screening + explainable ranked shortlist, running on a real demo town with verified open data, shown again live on a second town.
**Tech stack:** React + Leaflet frontend, Node/FastAPI backend, GeoJSON/SQLite (or PostGIS if time allows), Turf.js/GeoPandas for spatial logic — no forced AI.
**Key datasets:** OpenStreetMap, Bhuvan (ISRO), SRTM/open DEM, open rainfall data, census/OSM POI density as demand proxy.
**2-minute demo:** Heat-map reveal → reject a flood-risk "obvious" spot with reasoning → surface the real best spot → repeat live on a second town → close on reusability.
**Why it can win:** It's the only concept in the shortlist backed by two independently confirmed research gaps, needs no exotic/unavailable data, tells a clean 3-step story, and directly proves the brief's central complaint (fragmented, one-off, non-reusable planning tools) wrong — live, in the room.
