import { blink } from '../../lib/blink';

export interface SceneDefinition {
  sceneNumber: number;
  content: string;
  visualPrompt: string;
  emotion: string;
  lighting: string;
  cameraAngle: string;
}

export interface CharacterDefinition {
  name: string;
  description: string;
  physicalTraits: string;
}

export interface StoryAnalysis {
  title: string;
  scenes: SceneDefinition[];
  characters: CharacterDefinition[];
  overallMood: string;
  backgroundMusicStyle: string;
}

export async function analyzeStory(story: string, style: string): Promise<StoryAnalysis> {
  const { object } = await blink.ai.generateObject({
    prompt: `Analyze the following story and prepare it for AI cinematic video generation in ${style} style.
    1. Split the story into a sequence of scenes (3-7 scenes).
    2. For each scene, provide the narrative content, a highly detailed visual prompt, the dominant emotion, lighting mood, and a cinematic camera angle.
    3. Identify all key characters and provide detailed physical descriptions to maintain visual consistency.
    4. Define the overall mood and the style of background music that would fit.

    Story: ${story}`,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        overallMood: { type: 'string' },
        backgroundMusicStyle: { type: 'string' },
        characters: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              physicalTraits: { type: 'string' }
            },
            required: ['name', 'description', 'physicalTraits']
          }
        },
        scenes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              sceneNumber: { type: 'number' },
              content: { type: 'string' },
              visualPrompt: { type: 'string' },
              emotion: { type: 'string' },
              lighting: { type: 'string' },
              cameraAngle: { type: 'string' }
            },
            required: ['sceneNumber', 'content', 'visualPrompt', 'emotion', 'lighting', 'cameraAngle']
          }
        }
      },
      required: ['title', 'scenes', 'characters', 'overallMood', 'backgroundMusicStyle']
    }
  });

  return object as StoryAnalysis;
}
