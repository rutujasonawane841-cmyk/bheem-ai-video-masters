import { blink } from '../../lib/blink';
import { SceneDefinition, CharacterDefinition } from './story-analyzer';

export async function generateSceneImage(
  scene: SceneDefinition, 
  characters: CharacterDefinition[], 
  style: string
): Promise<string> {
  // Combine scene visual prompt with character descriptions for consistency
  const characterContext = characters
    .map(c => `${c.name}: ${c.physicalTraits}`)
    .join('. ');
  
  const fullPrompt = `Cinematic ${style} style. ${scene.visualPrompt}. Characters involved: ${characterContext}. Lighting: ${scene.lighting}. Camera: ${scene.cameraAngle}. High quality, 4k, masterpiece.`;

  const { images } = await blink.ai.generateImage({
    prompt: fullPrompt,
    size: '1536x1024', // 16:9 approx
  });

  return images[0];
}

export async function generateSceneVoiceover(text: string, language: string): Promise<string> {
  // Map language to voice if needed, but blink.ai.generateSpeech handles it well
  // For now we'll use a neutral versatile voice
  const { url } = await blink.ai.generateSpeech({
    text,
    voice: 'nova',
    speed: 0.9, // Slightly slower for cinematic feel
  });

  return url;
}

export async function generateSceneVideo(imageUrl: string, prompt: string): Promise<string> {
  const { result } = await blink.ai.generateVideo({
    model: 'fal-ai/veo3.1/image-to-video',
    image_url: imageUrl,
    prompt: `Cinematic motion, ${prompt}. Smooth camera movement.`,
    duration: '5s',
  });

  return result.video.url;
}
