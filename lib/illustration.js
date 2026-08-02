// Illustration generation via the Gemini API's image-generation model.
//
// Note: Imagen 4 (imagen-4.0-generate-001 and friends) is no longer available
// to new users as of mid-2026 and is being retired — Google's current
// guidance (ai.google.dev/gemini-api/docs/image-generation) points to the
// "Nano Banana" Gemini image models instead, called via the /v1beta/interactions
// endpoint. That's what this module uses.
//
// Character consistency: text-to-image generation has no memory between
// separate calls, so re-describing "a knight with brown hair" every time
// does not reliably produce the same-looking knight twice. Instead, the
// first illustration generated in a story is passed back in as a reference
// image on every later illustration/cover call, so the model has an actual
// visual anchor for the hero and sidekick's appearance instead of only text.
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const IMAGE_MODEL = 'gemini-3.1-flash-image';
const REQUEST_TIMEOUT_MS = 60000; // reference-image requests take longer than plain text-to-image

const STYLE_INSTRUCTIONS =
  'A warm, gentle children\'s storybook illustration. Soft, painterly watercolor style with ' +
  'rounded, friendly shapes, warm inviting colors, and simple uncluttered backgrounds — the same ' +
  'consistent art style used across an entire picture book. Absolutely no text, letters, numbers, ' +
  'or words anywhere in the image. Nothing scary, violent, graphic, or dark.';

const REFERENCE_INSTRUCTIONS =
  'The attached reference image shows this story\'s hero and sidekick — match ONLY their identity: ' +
  'same hair color and style, same face, same skin tone, same outfit colors. Do NOT copy their pose, ' +
  'expression, camera angle, or framing from the reference image — that reference happens to be a ' +
  'different moment in the story. Draw a fresh pose, expression, and camera angle that fits the new ' +
  'scene described below; vary the composition (close-up, wide shot, from the side, from behind, ' +
  'etc.) so illustrations don\'t all look like the same standing portrait redrawn in a new setting.';

// Stated plainly and always included, from the setup data itself rather than
// from Claude's freeform scene text — this is what actually tells the image
// model the hero is a knight, or a robot, or a monster, etc. (not just a
// generic child). Without it, illustrations tend to default to drawing a
// regular kid regardless of the chosen character type.
function buildCharacterLine({ characterName, characterTrait, characterType, sidekick }) {
  return (
    `The hero, named ${characterName}, is a ${characterTrait.toLowerCase()} ${characterType.toLowerCase()} — ` +
    `draw them clearly as a ${characterType.toLowerCase()}, not as a regular child, ` +
    `unless "${characterType.toLowerCase()}" itself describes an ordinary kid. ` +
    `Their sidekick is a ${sidekick.toLowerCase()}.`
  );
}

function buildScenePrompt(sceneDescription, setup, hasReference) {
  const characterLine = buildCharacterLine(setup);
  const consistencyNote = hasReference ? ` ${REFERENCE_INSTRUCTIONS}` : '';
  return `${STYLE_INSTRUCTIONS} ${characterLine}${consistencyNote}\n\nScene: ${sceneDescription}`;
}

function buildCoverPrompt(setup, hasReference) {
  const characterLine = buildCharacterLine(setup);
  const consistencyNote = hasReference ? ` ${REFERENCE_INSTRUCTIONS}` : '';

  return (
    `${STYLE_INSTRUCTIONS} A charming children's book cover illustration, portrait orientation. ` +
    `${characterLine}${consistencyNote} Setting: a ${setup.genre}. A warm, inviting, heroic ` +
    `composition that works well as a book cover, with open sky or simple background near the ` +
    `bottom third of the image so a title can be placed over it later.`
  );
}

function extractImage(interaction) {
  // Preferred: the documented convenience property.
  if (interaction && interaction.output_image && interaction.output_image.data) {
    return {
      base64Data: interaction.output_image.data,
      mimeType: interaction.output_image.mime_type || interaction.output_image.mimeType || 'image/jpeg',
    };
  }

  // Fallback: manually scan interleaved step/content blocks for an image.
  const steps = (interaction && interaction.steps) || [];
  for (const step of steps) {
    const content = step && step.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (block && block.type === 'image' && (block.data || block.imageBytes)) {
        return {
          base64Data: block.data || block.imageBytes,
          mimeType: block.mime_type || block.mimeType || 'image/jpeg',
        };
      }
    }
  }

  return null;
}

async function generateImage(prompt, { aspectRatio = '4:3', referenceImage = null } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const input = [{ type: 'text', text: prompt }];
  if (referenceImage) {
    input.push({ type: 'image', mime_type: referenceImage.mimeType, data: referenceImage.base64Data });
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'x-goog-api-key': process.env.GEMINI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        input,
        response_format: {
          type: 'image',
          mime_type: 'image/jpeg',
          aspect_ratio: aspectRatio,
        },
      }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = (data && data.error && data.error.message) || `Gemini API error (${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    const image = extractImage(data);
    if (!image) {
      throw new Error('Gemini API response did not contain image data.');
    }

    return image;
  } finally {
    clearTimeout(timeout);
  }
}

async function generateSceneIllustration(sceneDescription, setup, referenceImage) {
  return generateImage(buildScenePrompt(sceneDescription, setup, !!referenceImage), { referenceImage });
}

async function generateCoverIllustration(setup, referenceImage) {
  return generateImage(buildCoverPrompt(setup, !!referenceImage), { aspectRatio: '3:4', referenceImage });
}

module.exports = {
  IMAGE_MODEL,
  buildScenePrompt,
  buildCoverPrompt,
  generateImage,
  generateSceneIllustration,
  generateCoverIllustration,
};
