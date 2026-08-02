// Deterministic 8-chunk story plan. Illustrations land on chunks 1, 4, 7 —
// the final chunk (8) has no illustration of its own; the cover art on the
// ending screen serves as the story's closing image.
// Interactions alternate tap-choice / typed-answer, starting with a choice.
// The plot twist is woven in at chunk 5; chunk 8 resolves using the ending vibe.
const CHUNK_PLAN = [
  { number: 1, hasIllustration: true, interactionType: 'choice' },
  { number: 2, hasIllustration: false, interactionType: 'input' },
  { number: 3, hasIllustration: false, interactionType: 'choice' },
  { number: 4, hasIllustration: true, interactionType: 'input' },
  { number: 5, hasIllustration: false, interactionType: 'choice', plotTwist: true },
  { number: 6, hasIllustration: false, interactionType: 'input' },
  { number: 7, hasIllustration: true, interactionType: 'choice' },
  { number: 8, hasIllustration: false, interactionType: 'none', final: true },
];

function getChunkConfig(chunkNumber) {
  return CHUNK_PLAN.find((c) => c.number === chunkNumber) || null;
}

function buildStorySchema({ hasIllustration, interactionType }) {
  const properties = {
    text: {
      type: 'string',
      description: 'The next story chunk. 40 to 80 words. Simple, warm, and easy to read aloud to a young child.',
    },
  };
  const required = ['text'];

  if (hasIllustration) {
    properties.sceneDescription = {
      type: 'string',
      description:
        'One or two simple, vivid sentences describing a single visual moment from this chunk, for a gentle storybook illustration. Describe only what can be seen: characters, setting, colors, mood. Never include any text, words, letters, or labels that should appear in the image.',
    };
    required.push('sceneDescription');
  }

  if (interactionType === 'choice') {
    properties.interaction = {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'A short, friendly, in-story question inviting the child to choose what happens next.',
        },
        options: {
          type: 'array',
          items: { type: 'string' },
          description: 'Exactly 2 or 3 short, fun, tappable choices (a few words each).',
        },
      },
      required: ['prompt', 'options'],
      additionalProperties: false,
    };
    required.push('interaction');
  } else if (interactionType === 'input') {
    properties.interaction = {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'A short, friendly, in-story open-ended question the child can answer in a few words of their own.',
        },
      },
      required: ['prompt'],
      additionalProperties: false,
    };
    required.push('interaction');
  }

  return {
    type: 'object',
    properties,
    required,
    additionalProperties: false,
  };
}

function buildSystemPrompt() {
  return [
    'You are a warm, gentle storyteller co-writing a short interactive fantasy/adventure story',
    'live with a young child (age 5 to 8). You and the child build the story together, one short',
    'part at a time.',
    '',
    'Writing rules:',
    '- Use simple words and short sentences a 5-8 year old can follow when read aloud.',
    '- Use adjectives sparingly, only when a detail actually matters to the story (a clue, an',
    '  emotion, something the child needs to picture). Do not stack decorative adjectives before',
    '  nouns. Write "a baby dragon" or "a stone castle", not "a tiny, chubby, sparkly baby dragon"',
    '  or "a shiny, magnificent stone castle". Favor plain, concrete nouns and strong verbs over',
    '  flowery description — the writing should feel warm, not saccharine.',
    '- Every story chunk is warm, cozy, and gently exciting. NEVER scary, violent, graphic, or sad',
    '  in a heavy way. Any danger or trouble is mild, silly, or resolved quickly and safely.',
    '- No text, brand names, or real-world scary topics. Keep it timeless and playful.',
    '- Write in third person about the hero and their sidekick, using the hero\'s first name.',
    '- Naturally weave the child\'s previous choices and answers into the story so their ideas',
    '  clearly mattered, even if their answer was silly or unexpected.',
    '- Keep a consistent tone and setting across chunks.',
    '- Show the hero\'s trait and the sidekick\'s personality through what they actually do and say,',
    '  not by naming the trait. Never use the trait word itself (or an obvious synonym) in the prose.',
    '  For example, a curious hero pokes into things, asks questions, and notices odd details rather',
    '  than being called "curious"; a wise owl sidekick offers calm, thoughtful observations rather',
    '  than being called "wise". Let a small, specific action carry the personality in most chunks.',
    '',
    'When an interaction is requested:',
    '- For a "choice" interaction, write one short in-story sentence as the prompt, as if the',
    '  narrator is turning to the child, plus 2-3 short fun tap options.',
    '- For an "input" interaction, write one short in-story open-ended question the child can',
    '  answer in their own words (for example, naming something or describing an idea).',
    '',
    'When a sceneDescription is requested, describe one clear visual moment from the chunk you just',
    'wrote, suitable for a gentle, consistent storybook illustration style. Visual details only —',
    'no text, letters, or dialogue bubbles in the image. The illustrations are drawn to keep the',
    'hero and sidekick\'s exact appearance consistent from a reference image, so do NOT invent or',
    'restate physical details about them (hair color, eye color, specific facial features, exact',
    'outfit colors) — just refer to them simply (e.g. "the hero" / the hero\'s name, "the sidekick").',
    'Instead, give them a specific, distinctive pose or action for this exact moment — climbing,',
    'crouching down, reaching up, running, pointing at something, sitting cross-legged, etc. — and a',
    'camera angle or framing that differs from a plain front-facing standing shot. Each illustrated',
    'chunk should look clearly different from the others in pose and framing, not a repeat of the',
    'same standing pose in a new background.',
    '',
    'Never ask for or reference any personal information about the child beyond the hero\'s first',
    'name, which was already provided.',
  ].join('\n');
}

function buildUserMessage({ setup, chunkConfig, storySoFar, latestResponse }) {
  const lines = [];

  lines.push('Story setup:');
  lines.push(`- World / genre: ${setup.genre}`);
  lines.push(`- Hero: ${setup.characterName}, a ${setup.characterTrait} ${setup.characterType}`);
  lines.push(`- Sidekick: ${setup.sidekick}`);
  lines.push('');

  if (storySoFar) {
    lines.push('Story so far:');
    lines.push(storySoFar);
    lines.push('');
  } else {
    lines.push('This is the very first chunk — introduce the hero, the sidekick, and the world.');
    lines.push('');
  }

  if (latestResponse) {
    lines.push(`The child just answered: "${latestResponse}"`);
    lines.push('Weave this into the next chunk naturally, even if it is silly or unexpected.');
    lines.push('');
  }

  lines.push(`Now write chunk ${chunkConfig.number} of 8.`);

  if (chunkConfig.plotTwist) {
    lines.push(
      `This chunk should naturally introduce the story's surprise twist: ${setup.plotTwist}. Keep it fun and not scary.`
    );
  }

  if (chunkConfig.final) {
    lines.push(
      `This is the final chunk. Resolve the whole adventure warmly, using this ending feeling: ${setup.endingVibe}. ` +
        'Tie up the story in a satisfying, cozy way. Do not include an interaction — the story is complete.'
    );
  }

  return lines.join('\n');
}

module.exports = {
  CHUNK_PLAN,
  getChunkConfig,
  buildStorySchema,
  buildSystemPrompt,
  buildUserMessage,
};
