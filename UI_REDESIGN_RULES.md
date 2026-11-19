# HeatLedger AI: Google AI Studio UI Redesign Guide & Rules

Welcome to the pure frontend bundle of **HeatLedger AI**. This isolated environment is optimized for Google AI Studio Build Mode, allowing you to rapidly iterate on aesthetics, layouts, typography, micro-interactions, and visual polish without touching or breaking the Python backend or automated test suites.

---

## 1. Operating Rules for AI Studio

1. **Auto-Hydrated Mock Session Active:**
   - `.env` specifies `VITE_UI_PREVIEW_MODE=true`.
   - The application automatically logs in as QA Inspector **R. K. Chatterjee** (`QA_INSPECTOR`, Liluah Works, `org_howrah_steel_01`).
   - All dashboard views (`/app`, `/design`, `/verify/:code`, `/share/:token`, `/supplier-request/:token`) render offline immediately without requiring the FastAPI Python server.

2. **Routes Must Be Preserved Exactly:**
   The following routes are strictly required:
   - `/` : Public Marketing Landing Page & Hero
   - `/login` : Inspector & Exporter Authentication
   - `/app` : Factory QA Console & Command Center
   - `/verify/:code` : Public Customs & Verifier QR Code Verification Screen
   - `/share/:token` : Buyer & Customs-Broker Shared Dossier Portal
   - `/supplier-request/:token` : Supplier Precursor Ingestion Portal
   - `/design` : Live Design System Tokens & Component Kit

3. **Component Prop Contracts:**
   - Do NOT delete or rename props on views inside `src/components/dashboard/views/` (e.g., `MtcWorkbenchView`, `CbamDossierView`, `HeatInventoryView`, `SignOffQueueView`, `SupplierIntelligenceView`).
   - Preserve existing form input types, data attributes, and callback parameters (`onSelect`, `onSave`, `onClose`, `onSubmit`).

4. **Style & Aesthetics Principles:**
   - **Industrial Precision:** Clean dark-slate console backgrounds (`#0B0F19`, `#111827`) paired with crisp slate hairline borders (`#334155`).
   - **Signal Colors:**
     - Emerald (`#10B981`): ASTM/CBAM pass, valid signatures, compliant emission intensity.
     - Molten Amber (`#F59E0B`): Upstream heat trace, melt-and-pour lineage, warnings.
     - Cobalt Blue (`#2563EB`): EN 10204 Clause 6 telemetry, PDF coordinates, verification seals.
     - Crimson Oxide (`#EF4444`): Metallurgical rejections, off-spec chemistry, missing proofs.
   - **Typography:**
     - Body & Headings: `Plus Jakarta Sans`
     - Metrics, Heat Numbers, Coordinates & Hashes: `JetBrains Mono`

---

## 2. Mandatory Compliance Lexicon (Statutory Claims Register)

HeatLedger AI is built under strict compliance with Regulation (EU) 2023/956 (CBAM), Implementing Regulation (EU) 2025/2621 (Statutory Markups), Implementing Regulation (EU) 2026/1963 (Melt-and-Pour Origin), and EN 10204:2004 Clause 6.

### Prohibited Words (DO NOT USE in copy or labels):
| âŒ Prohibited Word / Phrase | âœ… Mandatory Compliant Replacement | Reason |
|---|---|---|
| `"Guaranteed"` / `"100% Audit Guaranteed"` | `"Verifiable SHA-256 audit trail"` or `"Supports verifier audit readiness"` | Software does not guarantee third-party regulatory certification. |
| `"Zero-Forgery"` | `"Byte-identical original preservation"` or `"EN 10204 Clause 6 deliverable"` | Unprovable superlative. |
| `"Certified & Locked"` | `"Digitally Signed (Ed25519)"` | Software cannot certify engineering properties on its own authority. |
| `"Tamper-Proof"` | `"Tamper-evident"` or `"cryptographically verifiable with SHA-256"` | Cryptography provides tamper-evidence, not physical impossibility. |
| `"penalty"` / `"punitive fine"` | `"statutory markup under Implementing Regulation (EU) 2025/2621"` | CBAM default adjustments are border adjustments, not criminal penalties. |
| `"tax savings"` | `"estimated cost difference versus default values"` | Creates legal and tax liability. |
| `"Eliminate"` | `"Defend against"` or `"Reduce exposure to"` | Overpromises operational outcomes. |
| `"ZDR guarantee"` | `"Zero-Data-Retention processing"` | Avoid commercial warranty exposure. |

### Mandatory Legal Disclaimer:
All public and shared footers must retain the canonical notice:
> *"HeatLedger supports compliance preparation. It is not legal advice and not an accredited verification body."*

---

## 3. How to Preview & Redesign Locally

```bash
# 1. Enter the exported UI directory
cd aistudio-ui

# 2. Install pure UI dependencies
npm install

# 3. Start Vite dev server
npm run dev
```

Visit `http://localhost:3000` to interact with every screen offline.

When you finish your redesign in Google AI Studio, simply download the updated files or `.zip` and use:
```powershell
.\scripts\import-from-aistudio.ps1 -SourcePath <path-or-zip>
```
