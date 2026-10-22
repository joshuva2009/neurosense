# NeuroSense – Early Detection & Monitoring of Brain Disorders
### *“Detect Early. Think Better. Live Healthier.”*
**University Design Thinking Project in Digital Healthcare Innovation**

---

## 🌟 Executive Summary & Project Overview

**NeuroSense** is a modern, accessible, AI-powered web platform developed as a university **Design Thinking** capstone project. Its objective is to empower individuals, families, and healthcare providers with accessible, non-threatening digital screening tools to identify subtle, early cognitive and motor changes that may precede formal diagnosis of conditions such as:

- **Alzheimer’s Disease**
- **Parkinson’s Disease**
- **Mild Cognitive Impairment (MCI)**
- **Dementia Spectrum (Vascular, Lewy Body, Frontotemporal)**
- **Acute Stroke (Emergency F.A.S.T. Protocol)**

NeuroSense bridges the critical gap between silent preclinical neurodegeneration and timely clinical consultation, fostering proactive brain health through evidence-based lifestyle optimization.

---

## 🎨 Design Thinking Framework (5 Stages)

| Stage | Process | Realized in NeuroSense |
| :--- | :--- | :--- |
| **1. Empathize** | Researched barriers in elderly cognitive screening, clinical test anxiety ("white-coat syndrome"), and caregiver hesitations. | Designed a frictionless, non-intimidating home assessment experience with one-click Guest Demo access and dual-language inclusivity. |
| **2. Define** | Pinpointed the problem statement: *“How might we provide objective baseline tracking of cognitive and motor trends without panic or unvalidated diagnostic labels?”* | Established an 8-activity multi-domain assessment battery linked directly to specific brain lobes. |
| **3. Ideate** | Brainstormed gamified neuropsychological paradigms (Trail Making, Stroop, Verbal Fluency, Finger Tapping) and transparent AI feedback. | Created an interactive 3D Brain Visualizer to foster neuro-literacy and demystify lobe functions. |
| **4. Prototype** | Rapidly architected a responsive web application utilizing React, Tailwind CSS, an HTML5 3D Brain canvas, and a FastAPI scoring engine. | Built high-contrast modes, font scaling up to 150%, audio narration, and English & Tamil dictionaries. |
| **5. Test & Refine** | Calibrated task timers, sensorimotor false-start detection, and medical safety guardrails. | Implemented automated emergency detection for stroke signs and non-diagnostic educational disclosures. |

---

## 🧠 Interactive 3D Brain Explorer

NeuroSense includes an interactive, GPU-accelerated 3D Brain Canvas:
- **Bi-hemispheric 3D particle mesh** (480 dynamic nodes) with depth-sorted perspective projection.
- **Animated synaptic impulses** simulating neural transmission and firing between functional hubs.
- **Inspectable Cognitive Lobes:**
  - **Frontal Lobe (Violet):** Executive Function & Task Switching ➔ *Linked to Cognitive Flexibility Test*
  - **Temporal Lobe & Hippocampus (Teal):** Memory Encoding & Retrieval ➔ *Linked to Memory Recall Test*
  - **Parietal Lobe (Amber):** Spatial Orientation & Sensory Filtering ➔ *Linked to Attention Test*
  - **Occipital Lobe (Emerald):** Visuospatial Perception ➔ *Linked to Visual Recognition Test*
  - **Cerebellum & Motor Strip (Rose):** Fine Motor Rhythm & Pacing ➔ *Linked to Finger Tapping Test*
- **Interactive Controls:** Mouse/touch drag rotation, auto-rotation toggle, synaptic pulse toggle, and view reset.

---

## 🔬 8 Interactive Screening Activities

Each test is fully functional with real-time timers, automatic score normalization (0–100), and immediate result feedback:

1. **Memory Recall Test (`Temporal Lobe & Hippocampus`)**
   - *Phase 1:* 8-second visual presentation of 8 target concept words.
   - *Phase 2:* 5-second retention delay interval to test working memory consolidation.
   - *Phase 3:* Active recall input & recognition grid selection.
2. **Reaction Time Test (`Thalamus & Motor Pathways`)**
   - Measures simple visual sensorimotor response speed across 5 randomized trials.
   - Includes random delay (1.5s–4.0s) and false-start anti-anticipation detection.
3. **Attention & Concentration Test (`Prefrontal & Parietal Cortex`)**
   - 30-second rapid cancellation search grid.
   - Users locate glowing target cyan hexagons while ignoring distractor shapes, penalizing false alarms.
4. **Cognitive Flexibility Test (`Dorsolateral Prefrontal Cortex`)**
   - Interactive digital adaptation of **Trail Making Test Part B**.
   - Requires alternating sequence switching: `1 ➔ A ➔ 2 ➔ B ➔ 3 ➔ C ➔ 4 ➔ D ➔ 5 ➔ E ➔ 6 ➔ F`.
   - Dynamic SVG trail connections and error penalties.
5. **Finger Tapping Motor Test (`Motor Strip & Basal Ganglia`)**
   - 10-second rapid repetitive motor pacing test via screen tap or keyboard Spacebar.
   - Calculates tapping frequency (Hz) and Inter-Tap Interval (ITI) coefficient of variation to detect motor rhythm irregularity (relevant in Parkinson's).
6. **Visual Recognition Test (`Occipital & Posterior Parietal`)**
   - 5 rounds of abstract geometric matrix puzzles.
   - Tests pattern discrimination, orientation matching, and visual reasoning.
7. **Language Fluency Test (`Left Perisylvian Language Cortex`)**
   - 30-second semantic verbal fluency test (Category: Animals).
   - Validates words against a built-in semantic dictionary with duplicate prevention and words-per-minute counter.
8. **Problem-Solving & Logic Test (`Frontoparietal Reasoning Network`)**
   - 5 progressive inductive logic, Fibonacci, and sequence completion puzzles.
   - Measures fluid intelligence and rule deduction.

---

## 🤖 AI-Based Health Analysis & NeuroBot Assistant

- **Multi-Domain Synthesis:** Aggregates raw test outputs into 6 normalized cognitive domains: *Memory*, *Executive Function*, *Attention*, *Processing Speed*, *Motor Coordination*, and *Language*.
- **Longitudinal Trend Tracking:** Visualizes weekly and monthly trajectories with interactive Recharts radar and area graphs.
- **Clinical Summary PDF Download:** Generates downloadable, printable clinical summary reports with timestamp, session codes, and doctor discussion checklists.
- **NeuroBot AI Chatbot:**
  - Conversational assistant answering questions about cognitive exercises, disorders, and sleep hygiene.
  - **Emergency Stroke Detector:** Automatically flags acute stroke signs (facial droop, arm weakness, slurred speech) and surfaces immediate F.A.S.T. emergency protocol.
  - Supports both **English** and **Tamil** inquiries.

---

## ♿ Elderly Accessibility & Dual-Language Inclusivity

- **Dual-Language Dictionary:** Comprehensive English and Tamil (தமிழ்) translation for every screen, button, and test prompt.
- **Font Scaling:** 4 scalable text sizes (`Normal`, `Medium`, `Large`, `Extra Large` up to 150%) for low-vision and elderly users.
- **High-Contrast Mode:** High-contrast toggle for maximum legibility.
- **Speech Synthesis (Read Aloud):** Web Speech API narration of test instructions and AI responses.
- **Privacy First (Right to be Forgotten):** One-click complete deletion of user data and assessment history.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React Icons, HTML5 3D Canvas, Recharts, jsPDF, html2canvas, Canvas Confetti.
- **Backend:** Python FastAPI, SQLAlchemy, SQLite, Pydantic, Uvicorn.
- **Architecture:** Decoupled RESTful API with automated fallback handling for zero-crash presentation reliability.

---

## 🚀 Quick Start & Live Demonstration

### 1. Launch with One Command (PowerShell)
Double-click `run.ps1` or execute:
```powershell
.\run.ps1
```

### 2. Manual Launch
**Backend:**
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

Open your browser to: **`http://127.0.0.1:5173`** or **`http://127.0.0.1:8000`**

---

## 🌐 Making It Fully Online (Shareable with Anyone)

### Option 1: Immediate Wi-Fi Access (No setup needed)
Anyone on the same Wi-Fi / campus network can open:
```text
http://10.3.238.56:8000
```
*(Your phone, tablet, or peers can test it directly on their screens!)*

### Option 2: Worldwide Public Link with ngrok
To share a secure public link across the internet:
1. Get a free token from [ngrok.com](https://ngrok.com)
2. Run in PowerShell:
```powershell
.\start-tunnel.ps1 -Authtoken "YOUR_NGROK_TOKEN"
```
You will receive an official public HTTPS link (e.g. `https://xxxx.ngrok-free.app`) that anyone in the world can open immediately.

### Option 3: Permanent 24/7 Free Cloud Hosting (Render / Railway)
The project includes a ready-to-deploy [`Dockerfile`](file:///C:/Users/joshu/.gemini/antigravity/scratch/neurosense/Dockerfile) and [`render.yaml`](file:///C:/Users/joshu/.gemini/antigravity/scratch/neurosense/render.yaml):
1. Push this folder to a GitHub repository.
2. Sign in to [Render.com](https://render.com) (free).
3. Select **New ➔ Blueprint** and point it to your repo.
4. Render will automatically build the React app and deploy the FastAPI backend, giving you a permanent 24/7 link: `https://neurosense-health.onrender.com`.

---


## ⚖️ Medical Safety & Ethical Guidelines

> **IMPORTANT NOTICE:** NeuroSense is an educational and digital health research platform developed for university Design Thinking exploration. The activities, scores, and AI feedback represent functional performance on digital tasks and **do not constitute a medical diagnosis** of Alzheimer's disease, Parkinson's disease, or any neurological condition. Clinical validation is required before medical application. Users experiencing persistent cognitive or motor changes are strongly advised to seek formal evaluation from a licensed healthcare provider or neurologist.
