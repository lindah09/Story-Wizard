require('dotenv').config();
const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const {
  getChunkConfig,
  buildStorySchema,
  buildSystemPrompt,
  buildUserMessage,
} = require('./lib/story');
const { generateSceneIllustration, generateCoverIllustration } = require('./lib/illustration');

const app = express();
const PORT = process.env.PORT || 3000;
const STORY_MODEL = 'claude-opus-5';

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY from env

// Illustration reference images travel through these routes as base64 data
// URLs, which run well over the default 1mb JSON body limit.
app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const REQUIRED_SETUP_KEYS = [
  'genre',
  'characterType',
  'characterTrait',
  'sidekick',
  'plotTwist',
  'endingVibe',
  'characterName',
];

function isValidSetup(setup) {
  return (
    setup &&
    typeof setup === 'object' &&
    REQUIRED_SETUP_KEYS.every((key) => typeof setup[key] === 'string' && setup[key].trim().length > 0)
  );
}

function parseDataUrl(dataUrl) {
  if (typeof dataUrl !== 'string') return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], base64Data: match[2] };
}

app.post('/api/story', async (req, res) => {
  try {
    const { setup, chunkNumber, storySoFar, latestResponse } = req.body || {};
    const chunkConfig = getChunkConfig(chunkNumber);

    if (!isValidSetup(setup) || !chunkConfig) {
      return res.status(400).json({ error: 'Invalid story request.' });
    }

    const schema = buildStorySchema(chunkConfig);

    const response = await anthropic.messages.create({
      model: STORY_MODEL,
      max_tokens: 4096,
      system: buildSystemPrompt(),
      output_config: {
        format: { type: 'json_schema', schema },
        effort: 'low',
      },
      messages: [
        {
          role: 'user',
          content: buildUserMessage({
            setup,
            chunkConfig,
            storySoFar: typeof storySoFar === 'string' ? storySoFar : '',
            latestResponse: typeof latestResponse === 'string' ? latestResponse : '',
          }),
        },
      ],
    });

    if (response.stop_reason === 'refusal') {
      return res.status(502).json({ error: 'The story writer could not continue that part. Please try again.' });
    }

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock) {
      throw new Error('No text content returned from the model.');
    }

    const parsed = JSON.parse(textBlock.text);

    res.json({
      chunkNumber: chunkConfig.number,
      text: parsed.text,
      hasIllustration: chunkConfig.hasIllustration,
      sceneDescription: chunkConfig.hasIllustration ? parsed.sceneDescription : null,
      interaction:
        chunkConfig.interactionType === 'none'
          ? null
          : {
              type: chunkConfig.interactionType,
              prompt: parsed.interaction.prompt,
              options: chunkConfig.interactionType === 'choice' ? parsed.interaction.options : null,
            },
      isFinal: !!chunkConfig.final,
    });
  } catch (err) {
    console.error('Story generation error:', err);
    res.status(500).json({ error: 'Something went wrong writing the next part of the story.' });
  }
});

app.post('/api/illustration', async (req, res) => {
  try {
    const { sceneDescription, setup, referenceImage } = req.body || {};

    if (typeof sceneDescription !== 'string' || !sceneDescription.trim() || !isValidSetup(setup)) {
      return res.status(400).json({ error: 'Missing scene description or story setup.' });
    }

    const { base64Data, mimeType } = await generateSceneIllustration(
      sceneDescription,
      setup,
      parseDataUrl(referenceImage)
    );
    res.json({ image: `data:${mimeType};base64,${base64Data}` });
  } catch (err) {
    console.error('Illustration generation error:', err.status || '', err.message);
    res.status(502).json({ error: 'Could not draw a picture right now.' });
  }
});

app.post('/api/cover', async (req, res) => {
  try {
    const { setup, referenceImage } = req.body || {};

    if (!isValidSetup(setup)) {
      return res.status(400).json({ error: 'Missing story setup.' });
    }

    const { base64Data, mimeType } = await generateCoverIllustration(setup, parseDataUrl(referenceImage));
    res.json({ image: `data:${mimeType};base64,${base64Data}` });
  } catch (err) {
    console.error('Cover generation error:', err.status || '', err.message);
    res.status(502).json({ error: 'Could not create the cover right now.' });
  }
});

app.listen(PORT, () => {
  console.log(`Story app listening on http://localhost:${PORT}`);
});
