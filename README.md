# SchemeSathi (स्कीम साथी) 🇮🇳
### AI-Powered Government Scheme Discovery & Eligibility Assistant

> **Hackathon Prototype** | Domain: Civic Tech / AI for Bharat / Digital Public Infrastructure (DPI)  
> **Tagline:** *"Bridging India's ₹1.2 Lakh Crore Unclaimed Welfare Gap with AI"*

---

## 📌 1. The Core Problem
Governments launch hundreds of welfare schemes every year across healthcare, agriculture, education, housing, and entrepreneurship. However, **more than 40% of eligible citizens miss out** on benefits they legally qualify for due to three chronic barriers:
1. **Discovery Deficit:** Citizens simply do not know what schemes exist or where to look.
2. **Bureaucratic Jargon:** Scheme eligibility criteria are published in lengthy official gazettes with confusing legal jargon that the average citizen cannot decipher.
3. **Document & Process Friction:** Citizens do not know which certificates (e.g., income certificate, caste certificate, land records) are mandatory before visiting a bank or Common Service Centre (CSC), leading to repeated rejections and frustration.

---

## 💡 2. The SchemeSathi Solution
**SchemeSathi** acts as a 24/7 intelligent digital companion for citizens:
- **1-Minute Citizen Profile Wizard:** Gathers basic non-sensitive parameters (Age, State, Gender, Occupation, Household Income, Category, Land status).
- **Intelligent Eligibility Scoring Engine:** Instant multi-parameter matching algorithm that calculates compatibility scores (e.g., 98% Match) and highlights exact reasons why the citizen qualifies.
- **AI Plain-Language Simplifier ("ELI5"):** Converts complex government terms into clear, 3-bullet explanations in layman's language with single-click English/Hindi vernacular toggles.
- **Interactive Document Readiness Meter:** Allows citizens to check off documents they already possess, highlights missing mandatory certificates, and tells them how to obtain them.
- **24/7 Conversational Voice & Text AI Assistant:** Interactive bot powered by NLP where citizens can ask open questions like *"I am a college student with family income 2 LPA, what scholarships can I get?"*.
- **Printable Citizen Welfare Dossier / Slip:** 1-click printable summary that rural citizens can physically take to their nearest CSC, MeeSeva, or bank branch.

---

## 🚀 3. How to Run the Prototype Locally

### Option A: Open directly in your browser (Instant)
Double-click on `index.html` or drag and drop it into Google Chrome, Microsoft Edge, or any modern web browser.

### Option B: Run via Python Local Server (Recommended for live demo)
Open PowerShell or Command Prompt in the project folder and run:
```bash
python server.py
```
Then open your browser to:
👉 **`http://localhost:8000`**

---

## 🏆 4. Why This Idea Wins Hackathons

| Hackathon Judging Metric | How SchemeSathi Scores High |
| :--- | :--- |
| **Social Impact (High)** | Directly addresses underprivileged groups (farmers, students, women entrepreneurs, street vendors, artisans, BPL families). |
| **Innovation & AI Integration** | Uses NLP summarization, vernacular language decoding, dynamic rule matching, and conversational voice queries. |
| **Practical Feasibility** | Solves an existing, recognized national bottleneck without requiring controversial policy changes. |
| **Presentation Appeal** | Live working demo with tangible outputs (instant scheme matching, document readiness bar, printable citizen slip). |

---

## 🎙️ 5. Winning 3-Minute Hackathon Pitch Script

### Minute 1: The Hook & The Problem
> *"Good morning respected judges! Imagine Ramesh, a small farmer in rural India, or Priya, an ambitious college student whose family earns ₹2 Lakhs a year. Ramesh qualifies for ₹6,000 yearly under PM-KISAN, and Priya qualifies for full college tuition fee reimbursement under the Post-Matric Scholarship. Yet, neither has applied.*  
> *Why? Because government schemes are buried across dozens of departmental websites, described in complicated legal jargon, and require documents they don't even know they need. Over ₹1.2 Lakh Crores in welfare remains unclaimed every year."*

### Minute 2: The Solution & Live Demo
> *"To solve this, we built **SchemeSathi** — India's AI-powered citizen welfare and eligibility navigator.*  
> *With SchemeSathi, a citizen takes just 30 seconds to enter their age, occupation, and income. Immediately, our AI engine matches them against hundreds of schemes.*  
> *(Show screen): Notice how it explains the scheme not in official legalese, but in simple layman's words — 'ELI5 style' — in English and Hindi.*  
> *Even better, it features an **Interactive Document Readiness Score**. The citizen checks off the documents they own, and SchemeSathi tells them exactly what's missing and where to get it, generating a ready-to-print slip they can take straight to their nearest CSC or bank."*

### Minute 3: Scalability, Impact & Future Roadmap
> *"SchemeSathi is designed to integrate with **Bhashini API** for regional voice dialects (Telugu, Tamil, Hindi, Marathi), **WhatsApp chatbots** for zero-smartphone rural accessibility, and **DigiLocker API** for instant 1-click document verification.*  
> *SchemeSathi transforms government welfare from 'hard to discover' into 'proactive citizen empowerment'. Thank you!"*

---

## ❓ 6. Expected Tough Questions from Judges & Winning Answers

#### Q1: *"Government already has myScheme.gov.in. Why do we need SchemeSathi?"*
**Winning Answer:**
> *"myScheme.gov.in is a commendable database, but it suffers from three key user hurdles:  
> 1) It presents raw bureaucratic text that rural citizens and first-time applicants find intimidating. SchemeSathi introduces an **AI Plain Language Simplifier** that translates legal text into 5th-grade reading level.  
> 2) myScheme does not offer an interactive **Document Readiness Tracker** or actionable step-by-step guidance on how to get missing documents.  
> 3) SchemeSathi includes a **conversational voice assistant** designed for semi-literate citizens who cannot navigate complex multi-page filters."*

#### Q2: *"How will rural citizens with poor internet access or illiteracy use this?"*
**Winning Answer:**
> *"We designed SchemeSathi with a dual approach:  
> 1) **Assisted Mode (CSC / VLEs):** Common Service Centre operators and village volunteers use SchemeSathi as a force multiplier to screen 50 citizens in an hour and hand them printed slips.  
> 2) **Voice & WhatsApp Integration:** Using India's Bhashini speech-to-text API, citizens can simply speak into WhatsApp or call an IVR number in their native dialect."*

#### Q3: *"How do you keep the scheme database updated when government rules change?"*
**Winning Answer:**
> *"In production, our backend uses a **Retrieval-Augmented Generation (RAG)** pipeline. We scrape official ministry press releases (PIB) and portal updates into a vector database (e.g., ChromaDB/Pinecone). When criteria change, the LLM re-indexes the rules without manual code rewrites."*

---

## 📂 7. Project File Structure
```
schemesathi/
├── index.html        # Main responsive UI with Tailwind CSS, wizard & results
├── app.js            # Core eligibility matching engine, modal logic & AI chatbot
├── schemes-data.js   # Structured database of Indian central & state welfare schemes
├── server.py         # Lightweight zero-dependency Python server with API endpoints
└── README.md         # Full project pitch, architecture & judging guide
```
