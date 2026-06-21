# GuardianAI — Explainable AI for IT Fleet Management

**GuardianAI** is a high-fidelity interactive dashboard designed for the Dell Hackathon. It addresses the critical challenge of trust in AI-driven IT management. Instead of acting as a "black box" that applies changes without context, GuardianAI is fully explainable, transparent, and human-gated, ensuring IT Administrators have complete oversight and understanding of every automated recommendation.

---

## 🚀 Key Features

1. **Explainable AI Recommendations (Dashboard)**
   - Prioritized list of system alerts sorted by severity (Critical, High, Medium, Low) and confidence level.
   - Clean summary cards displaying target device, model, category (Security, Hardware, Compliance, Performance), and a summary of telemetry.

2. **The Transparency Center (Detail Panel)**
   - **Reasoning Panel**: Step-by-step breakdown of the telemetry facts that led to the recommendation.
   - **Confidence Assessment**: Visual confidence meter with the specific driver (fleet statistics, direct hardware measurements, etc.).
   - **Data Sources**: Full metadata showing exactly where the AI extracted its data and when it was last verified.
   - **System Limitations**: Explicit disclosure of what the AI does *not* know (e.g. untested BIOS revisions, missing pay-load visibility).
   - **Alternatives Comparison**: Sideways comparison comparing the recommended action with other choices, analyzing pros, cons, and confidence scores.

3. **Human-in-the-Loop Controls**
   - **Approve**: Authorize and trigger the recommended action.
   - **Override**: Reject the recommendation, select a reason (e.g., policy constraints, manual override), and provide custom notes. GuardianAI logs this feedback to adapt and learn.
   - **Ask Why**: Quick overlay explaining the primary driver.
   - **See Alternatives**: Open comparison matrix modal.
   - **Escalate**: Forward the incident to specialized teams (e.g., Security, Hardware operations).

4. **Permanent Audit Trail (Activity Log)**
   - Interactive database logging every action, decision, human override, and execution outcome.
   - Advanced filtering (by date range, confidence level, and decision type) and quick search.
   - **Export as CSV**: Instant reports for compliance and auditing.

5. **AI Autonomy Settings Dial**
   - Configurable dial ranging from fully manual approval to semi-autonomous execution:
     - **Always Ask Me**: 100% human-gated.
     - **Recommend & Wait**: Standard daily queue.
     - **Act on Low-Risk**: Automated low-impact cleanup (e.g. disk space), gated critical alerts.
     - **Act and Notify**: Automated execution for all high-confidence recommendations with notification logs.

---

## 🛠️ Technology Stack

- **Core**: React 18 & Vite
- **Routing**: React Router Dom v6
- **Styling**: Tailwind CSS & PostCSS
- **Icons**: Lucide React
- **Bundler**: Vite (production-optimized)

---

## 📂 Project Directory Structure

```text
dell hackathon/
├── dist/                  # Production build output
├── src/
│   ├── components/        # Reusable UI widgets & modals
│   │   ├── ActionButtons.jsx      # Human-in-the-loop button controls
│   │   ├── AlternativesModal.jsx  # Modal for comparing alternative actions
│   │   ├── ConfidenceBadge.jsx    # Alert status and confidence level pills
│   │   ├── DataSourceBox.jsx      # Transparency box showing telemetry sources
│   │   ├── LimitationsBox.jsx     # Transparency box displaying system boundaries
│   │   ├── Navbar.jsx             # Top branding navigation header
│   │   ├── OverrideModal.jsx      # Modal for capturing human override reasons
│   │   ├── ReasoningPanel.jsx     # Step-by-step AI reasoning explorer
│   │   └── Toast.jsx              # Temporary toast notifications
│   ├── data/
│   │   └── alerts.js              # Mock database (alerts, activity log, settings)
│   ├── pages/             # Main screen layouts
│   │   ├── Dashboard.jsx          # Primary workspace list and stat summary
│   │   ├── DetailPanel.jsx        # Detailed view / Transparency Center
│   │   ├── ActivityLog.jsx        # Permanent audit database and CSV exporter
│   │   └── Settings.jsx           # Autonomy Mode selector dial
│   ├── App.jsx            # Routing and global state management
│   ├── index.css          # Tailwind base & custom design utility classes
│   └── main.jsx           # App entry point
├── index.html             # HTML entry point (SEO metadata included)
├── package.json           # Node dependencies and build scripts
├── postcss.config.js      # PostCSS setup
├── tailwind.config.js     # Tailwind CSS branding config (custom Dell colors)
└── vite.config.js         # Vite compilation setup
```

---

## ⚙️ How to Setup and Run

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Clone & Navigate
```bash
# Repository was cloned into:
cd "C:\Users\ss\Documents\dell hackathon"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
The optimized bundle will be compiled into the `dist/` directory, ready for static deployment.
