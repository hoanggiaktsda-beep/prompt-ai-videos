# HOANGGIA AI — Creative Studio

HOANGGIA AI is evolving from a prompt generator into a multimodal creative decision system for architecture and interior design.

## Runtime architecture

VISION
→ SPATIAL BLUEPRINT
→ 17 MULTIMODAL EXPERT AGENTS
→ CREATIVE DIRECTOR AI
→ CREATIVE DECISION
→ GENERATION ADAPTER
→ IMAGE / VIDEO MODEL
→ OUTPUT
→ GEOMETRY VERIFICATION
→ REPAIR / REGENERATE

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

## 5. Generation Adapter
`/api/generate` converts the Creative Director decision into model-specific execution instructions. The current adapters are:

- Image: OpenAI image-generation tool, with source image passed as an input reference and `edit` / `generate` modes.
- Video: OpenAI Videos API with Sora 2 / Sora 2 Pro and optional source-image reference. Video jobs are asynchronous and are polled through `/api/generate-status`.

The frontend supports a repair loop: Geometry Verification returns repair instructions, which are appended to the Creative Decision and sent back through the Generation Adapter for another iteration.

## Important

Generation is now a real execution stage rather than a prompt-only placeholder. The final acceptance gate remains Geometry Verification; a generated asset is not considered accepted merely because it looks visually attractive.

The Expert Council names are reference-based craft influences, not direct endorsements or personal consultation.
