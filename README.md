
  # Build full functional app

  This is a code bundle for Build full functional app. The original project is available at https://www.figma.com/design/5FBSB7kMyKS8GXzcjgd030/Build-full-functional-app.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  Run `npm run test` for unit/component workflow tests.

  Run `npm run test:e2e` for Playwright E2E tests (first install browsers with `npx playwright install`).

  ## New Workflow + AI Setup

  ### 1. Supabase schema + RLS
  - SQL migration is in `supabase/migrations/20260409_knowlab_core.sql`.
  - Apply it using Supabase CLI or dashboard SQL editor.

  ### 2. Gemini RAG edge function
  - Function source: `supabase/functions/gemini-rag/index.ts`
  - Required env vars on Supabase:
    - `SUPABASE_URL`
    - `SUPABASE_ANON_KEY`
    - `GEMINI_API_KEY`

  ### 2b. Local Qwen (Ollama) option
  If you want local AI instead of Gemini:

  1. Install Ollama from [https://ollama.com](https://ollama.com)
  2. Pull and run Qwen:

  ```bash
  ollama pull qwen2.5:7b-instruct
  ollama run qwen2.5:7b-instruct
  ```

  3. In `.env.local`, enable local Qwen:

  ```bash
  VITE_USE_LOCAL_QWEN=true
  VITE_LOCAL_QWEN_URL=http://127.0.0.1:11434/api/chat
  VITE_LOCAL_QWEN_MODEL=qwen2.5:7b-instruct
  ```

  Notes:
  - Local Qwen is called first when enabled.
  - If local Qwen is unavailable, the app falls back to built-in local knowledge retrieval.
  - Keep `VITE_USE_REMOTE_AI=false` if you want to avoid Gemini/Supabase AI.

  ### 3. Frontend env
  Create `.env.local`:

  ```bash
  VITE_SUPABASE_URL=...
  VITE_SUPABASE_ANON_KEY=...
  VITE_USE_REMOTE_AI=true
  VITE_USE_LOCAL_QWEN=false
  ```

  If these are not set, the app uses local mock workflow storage and local RAG fallback.
  
