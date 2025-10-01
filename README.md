# software-engineering-class-project```md
# Navigation & Discovery for Informal Transport

**One-line:** A rider-first, driver-protecting app that makes multi-leg journeys on informal transport predictable, safer, and more profitable — starting with a focused pilot and scaling across African cities.

---

## What this project does
Intwana maps the real world of informal commuting — walk → junction → hop on → transfer — and gives riders and drivers visibility without disrupting how they work. Riders get step-by-step routes, verified pickup points, ETAs, and discreet alight alerts. Drivers get a lightweight way to signal availability, fill seats faster, and see demand hotspots so they can make more trips and increase earnings. The product is explicitly designed to protect drivers’ income and reduce the unpredictable losses that kill adoption.

---

## Why it matters
- **This is livelihood first.** For drivers and conductors, minibuses/kekes/kombis are a primary source of income. Any tech that threatens earnings will be rejected — Intwana is built to increase trips and protect take-home pay, not replace people.  
- **Time on road = money.** Faster pickups, fewer deadhead miles and better route predictability directly translate to higher daily income. The app targets features that increase throughput.  
- **Extortion & enforcement are real.** Drivers lose serious money to petty corruption and inconsistent policing. The product treats this as a core user problem and prioritizes evidence, trust, and anonymity features instead of empty promises of protection.

---

## Core non-technical features (MVP mindset)
These are user-facing, practical capabilities — no engineering detail here:
- Multi-leg routing that matches real journeys (walk + informal ride + transfers).  
- Verified pickup points (local partner / union endorsed).  
- Real-time-ish driver availability and proximity information with low-data fallbacks.  
- Discreet alight alerts and passive stop-detection with post-ride feedback.  
- Tamper-resistant trip receipts and anonymized incident reporting routed to trusted partners (unions/NGOs).  
- USSD/SMS fallback so non-smartphone drivers and riders can participate.

---

## Design & policy principles (non-negotiable)
- **Protect earnings first.** Every feature must clearly preserve or grow drivers’ income.  
- **Low friction.** Onboarding must be easy; support phones without apps.  
- **Privacy by default.** Minimize exact-location exposure; avoid photo/video evidence by default.  
- **Trust through partners.** Unions, market associations and NGOs are core partners, not optional.  
- **Be honest about limits.** Don’t promise protection from violent or organized extortion — provide mitigation, evidence and partner escalation paths.

---

## Key risks — and how we respond (summary)
- **Smartphone gap:** Many drivers may not have smartphones. → Provide USSD/SMS fallback and simple signalling.  
- **Organizational resistance:** Associations may distrust digital tools. → Co-design with unions; offer clear economic incentives.  
- **Surveillance fears:** Drivers worry app = policing. → Use heatmaps/demand zones instead of exposing precise rider locations; be transparent about data use.  
- **Extortion & safety:** Corrupt actors or levy networks can punish adoption. → Collect anonymized, time-stamped evidence; route reports to unions/NGOs; run pilots with legal/safety partners.  
- **Chicken-and-egg adoption:** Drivers won’t join without riders, and vice versa. → Focus pilots on tight corridors with incentives and partner support so benefits appear fast.

---

## Stakeholder voice (high level)
- “If deployed properly, can change a lot of lives.”  
- “It simply adds on top of what they’re already doing.”  
- “It is a huge assumption” that drivers will have smartphones.  
- “No pictures, no videos” — prefer passive detection + post-ride prompts.  
- “Drivers need to see immediate earnings wins” — adopt features that increase filled seats first.

---

## Pilot approach (high level)
- Start small: one dense corridor in one city.  
- Partner with local unions/market associations and one NGO.  
- Recruit a targeted group of drivers and riders; offer short-term incentives (airtime, referral rewards) and measure income impact quickly.  
- Run rapid feedback cycles (2-week sprints) and iterate on the smallest set of features that deliver real earnings uplift.

---

## Next non-technical deliverables
- One-page partner pitch for unions/associations.  
- Pilot recruitment plan and field script for drivers & riders.  
- Interview guide + 3-question commuter script for quick field testing.  
- One-page “Driver Priorities” and “Police & Enforcement” briefing cards for stakeholder meetings.

---

If you want this saved as `README.md` in the repo or converted into a one-page pitch or partner outreach email, tell me which and I’ll produce the file or copy next.
::contentReference[oaicite:0]{index=0}
```
