# CarDekho AI Matchmaker

A fast, product-minded MVP for personalized car recommendations in the Indian market. This project blends a lightweight Next.js frontend, a clean preference questionnaire, and an AI-powered backend that ranks candidate cars using Gemini.

## 1. Project Overview

CarDekho AI Matchmaker helps users find the right car by turning choice overload into an instant recommendation.
The app asks a few high-value questions, filters candidate cars from a local dataset, and then uses a Gemini LLM to produce ranked, explainable matches.

Key outcomes:
- Fast first-time product experience
- AI-native recommendation flow
- Decision support with reasons, pros, and cons

## 2. Why this MVP

This MVP focuses on speed and product clarity.
It is designed to validate the core value proposition quickly: can a short user flow + AI deliver useful car matches?

Why this approach:
- Minimal friction: 1 hero screen, 1 questionnaire, 1 results view
- AI adds differentiation without overbuilding the UI
- Local dataset + prompt-based ranking avoids early dependence on complex infrastructure

## 3. Tech Stack

- Next.js 16 (App Router)
- React 19 + client-side page transitions
- Tailwind / Radix UI primitives for accessible form controls
- Framer Motion for polished transitions
- TypeScript for safe data flow
- Google Gemini via `@google/generative-ai`

## 4. AI Usage

The application uses AI in a focused, production-friendly way:
- A local candidate set is produced with heuristics and budget/family filters
- Gemini is asked to rank the best 3 cars from that shortlist
- The model returns structured JSON with `score`, `reason`, `pros`, and `cons`

This is an AI-native workflow because it preserves deterministic selection logic while using the model for the highest-value step: explanation and ranking.

The AI integration lives in `src/lib/gemini.ts`.
The service `src/lib/services/recommendation.ts` builds the candidate prompt, validates shape, and falls back safely if Gemini fails.

## 5. Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd CarDekho-Assignment
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create an env file:
   ```bash
   echo "GOOGLE_GENERATIVE_AI_API_KEY=your_api_key" > .env
   ```
4. Run the app locally:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## 6. Architecture

Core layers:
- `src/app/page.tsx`: hero and questionnaire-driven product flow
- `src/app/api/recommend/route.ts`: POST endpoint for preferences
- `src/lib/services/recommendation.ts`: filter, rank, prompt, and validate recommendations
- `src/lib/gemini.ts`: Gemini client wrapper with retry and JSON parsing
- `src/data/cars.json`: local car dataset for fast execution

The frontend sends user preferences to the API, which applies lightweight heuristics and then delegates ranking to the AI. The result is a fast recommendation loop with transparent output.

## 7. Tradeoffs

This MVP deliberately trades completeness for speed:
- Data is local, not real-time dealer inventory
- AI is used only for ranking and explanation, not raw candidate generation
- Candidate search is intentionally narrow to limit API calls and latency
- There is no auth, analytics, or persistent user profile yet

These tradeoffs keep the scope tight, reduce risk, and make the product easier to iterate.

## 8. Future Improvements

Potential next steps:
- Expand the car dataset and sync with live inventory
- Add user personas, saved searches, and follow-up recommendations
- Add multi-modal cards with real car images and comparisons
- Introduce A/B tests to measure AI recommendation quality
- Add a dealer availability and price transparency layer
- Improve the AI prompt with preference weighting and explainable ranking
- Add caching and cheaper fallback rules for offline/scale scenarios

## Notes

- `.env` is ignored by `.gitignore`.
- The app is built for fast validation of product and AI fit, not production scale yet.
- Keep the prompt small and the candidate pool controlled to preserve latency and reliability.
