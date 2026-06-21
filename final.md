# GuardianAI — Explainability Enhancements

This document explains the two key features implemented to radically enhance the transparency and trustworthiness of the GuardianAI system.

## Option A: "Confidence That Explains Itself" (Counterfactual Reasoning)

**The Problem:** Most explainable AI dashboards only tell you *why* an AI made a decision (forward reasoning). This creates a "Calibration Uncertainty" pain point where the IT Admin doesn't understand the AI's boundary conditions.

**The Solution:** We implemented **Counterfactual Reasoning**. The UI now includes a dedicated "What would change this" section inside the AI Confidence Assessment box on the Detail Panel.
- Instead of just saying "I am confident because of X," the AI explicitly states, "If Y had happened, my confidence would drop to LOW."
- **Example:** For the Critical Patch alert (ALT001), GuardianAI now displays: *"If this device had received the patch 7 days ago instead of 14, confidence would drop to MEDIUM."*
- **Why it matters:** This builds a mental model for the administrator. It proves the AI isn't just a black box generating a static number, but a dynamic reasoning engine with defined boundaries.

## Option B: "Trust Score, Not Just Confidence Score" (Longitudinal Trust)

**The Problem:** Confidence badges typically reset to zero context with every new alert. Real admins don't build trust on a per-decision basis; they build trust based on a system's *historical track record*.

**The Solution:** We implemented a **Trust Ledger** derived directly from the system's Activity Log.
- Below the Confidence Assessment, a new panel now appears: **Trust Ledger: [Category] Alerts**.
- It dynamically calculates how GuardianAI has performed historically for that specific type of alert.
- **Example:** *"GuardianAI has made 3 recommendations of this type. 2 were approved, 1 overridden, and 0 escalated."*
- **Why it matters:** This reframes transparency from "trust this one decision" to "trust this system over time." It naturally solves the Accountability Gap by showing that historical accuracy is validated by the *human team's* past decisions, proving the AI learns and aligns with company policy.

---
Both of these features have been successfully built into the Detail Panel view and are fully integrated with the mock data telemetry of GuardianAI.
