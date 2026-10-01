# HOANGGIA AI — Generation Adapter

Closed loop:
Source Image -> Vision -> Spatial Blueprint -> 17 Expert Agents -> Creative Director -> Model-specific Instruction -> Image/Video Model -> Output -> Geometry Verification -> Repair -> Regeneration.

Image generation uses the OpenAI Responses API image-generation tool. Video generation uses the OpenAI Videos API with Sora 2 / Sora 2 Pro and optional source-image reference.

Required environment:
OPENAI_API_KEY

Optional:
HG_IMAGE_MODEL=gpt-image-2
HG_IMAGE_QUALITY=high
HG_IMAGE_SIZE=1536x1024
HG_VIDEO_SECONDS=8
HG_VIDEO_SIZE=1280x720

GitHub Pages remains the static frontend. Deploy the API routes to Vercel or another compatible serverless backend, then set the Backend API URL in the Generation Adapter panel.

Image output is automatically sent to Geometry Verification. Failed verification produces repair instructions for another edit iteration. Video generation is asynchronous; after the job completes, its output must be passed through the same verification gate before acceptance.