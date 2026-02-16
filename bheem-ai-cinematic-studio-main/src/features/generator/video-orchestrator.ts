import { blink } from '../../lib/blink';
import { analyzeStory, StoryAnalysis } from './story-analyzer';
import { generateSceneImage, generateSceneVoiceover, generateSceneVideo } from './asset-generator';
import { v4 as uuidv4 } from 'uuid';

export interface GenerationProgress {
  status: string;
  currentScene: number;
  totalScenes: number;
  message: string;
}

export async function orchestrateVideoGeneration(
  userId: string,
  story: string,
  style: string,
  onProgress: (progress: GenerationProgress) => void
): Promise<string> {
  const projectId = uuidv4();
  
  onProgress({ status: 'analyzing', currentScene: 0, totalScenes: 0, message: 'Analyzing your story...' });
  
  const analysis = await analyzeStory(story, style);
  const totalScenes = analysis.scenes.length;

  // Save project
  await blink.db.projects.create({
    id: projectId,
    user_id: userId,
    title: analysis.title,
    original_story: story,
    style: style,
    status: 'processing'
  });

  // Save characters
  for (const char of analysis.characters) {
    await blink.db.characters.create({
      id: uuidv4(),
      project_id: projectId,
      name: char.name,
      description: char.description
    });
  }

  // Process Scenes
  for (let i = 0; i < totalScenes; i++) {
    const scene = analysis.scenes[i];
    const sceneId = uuidv4();

    onProgress({ 
      status: 'generating_assets', 
      currentScene: i + 1, 
      totalScenes, 
      message: `Generating visuals and voiceover for Scene ${i + 1}...` 
    });

    // Generate Image and Voiceover in parallel
    const [imageUrl, voiceoverUrl] = await Promise.all([
      generateSceneImage(scene, analysis.characters, style),
      generateSceneVoiceover(scene.content, 'English')
    ]);

    // Save scene initial state
    await blink.db.scenes.create({
      id: sceneId,
      project_id: projectId,
      scene_number: i + 1,
      content: scene.content,
      visual_prompt: scene.visualPrompt,
      image_url: imageUrl,
      voiceover_url: voiceoverUrl,
      status: 'processing'
    });

    onProgress({ 
      status: 'generating_video', 
      currentScene: i + 1, 
      totalScenes, 
      message: `Animating Scene ${i + 1}...` 
    });

    // Generate Video from Image (I2V)
    const videoUrl = await generateSceneVideo(imageUrl, scene.visualPrompt);

    // Update scene with video
    await blink.db.scenes.update(
      { video_url: videoUrl, status: 'completed' },
      { id: sceneId }
    );

    // Set project thumbnail to first scene image
    if (i === 0) {
      await blink.db.projects.update(
        { thumbnail_url: imageUrl },
        { id: projectId }
      );
    }
  }

  // Complete project
  await blink.db.projects.update(
    { status: 'completed' },
    { id: projectId }
  );

  onProgress({ status: 'completed', currentScene: totalScenes, totalScenes, message: 'Cinematic video ready!' });

  return projectId;
}
