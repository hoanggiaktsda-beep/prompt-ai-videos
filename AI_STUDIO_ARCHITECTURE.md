# HOANGGIA AI — Creative Studio

HOANGGIA AI is evolving from a prompt generator into a multimodal creative decision system for architecture and interior design.

## Runtime architecture

VISION
→ SPATIAL BLUEPRINT
→ 17 MULTIMODAL EXPERT AGENTS
→ CREATIVE DIRECTOR AI
→ CREATIVE DECISION
→ IMAGE / VIDEO MODEL
→ GEOMETRY VERIFICATION

### 1. Vision Engine
`/api/vision` reads a render/photo and returns a Spatial Blueprint containing visible geometry, openings, ceiling/floor, furniture regions, materials, lighting, spatial relationships, preservation constraints and uncertainty.

### 2. Expert Agents
`/api/agent` runs one independent multimodal call per expert. Every Agent receives the actual image and the Spatial Blueprint. It must observe the image itself, apply its own principles/checklist/questions, and produce recommendations, risks and critique.

### 3. Creative Director
`/api/director` receives the image plus all 17 Agent reviews and resolves conflicts using the HOANGGIA hierarchy:

1. Spatial Truth / geometry
2. Existing furniture identity
3. Creative intent
4. Visual language / materials
5. Camera / light
6. AI generation freedom
7. Post-production

### 4. Geometry Verification
`/api/verify` compares SOURCE and OUTPUT against the Spatial Blueprint. It returns preservation scores, detected changes, violations, approval state and repair instructions.

## Backend

The GitHub Pages front-end is static. AI inference must run on a serverless backend so the API key is never exposed in browser code.

This repository includes Vercel-compatible `/api` functions. Deploy the repository to Vercel (or another Node-compatible serverless host) and configure:

- `OPENAI_API_KEY` — required
- `HG_VISION_MODEL` — optional, default `gpt-5.6-luna`
- `HG_AGENT_MODEL` — optional, default `gpt-5.6-luna`
- `HG_DIRECTOR_MODEL` — optional, default `gpt-5.6-luna`
- `HG_VERIFY_MODEL` — optional, default `gpt-5.6-luna`

Then point the front-end API base to the deployed backend if the static site and API are hosted separately.

## Important

The current generation stage produces a production-ready Creative Decision / AI instruction. It does not pretend that an image/video provider has rendered the final asset. The next adapter layer can connect approved image/video providers without changing the Expert Agent architecture.

The Expert Council names are reference-based craft influences, not direct endorsements or personal consultation.
