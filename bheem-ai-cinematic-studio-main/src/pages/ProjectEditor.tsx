import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlinkAuth } from '@blinkdotnew/react';
import { blink } from '../lib/blink';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { orchestrateVideoGeneration, GenerationProgress } from '../features/generator/video-orchestrator';
import { Sparkles, Wand2, Play, ChevronRight, ChevronLeft, Download, RefreshCw, Layers, Music, Type } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { Card, CardContent } from '../components/ui/card';
import toast from 'react-hot-toast';

const STYLES = ['Realistic', 'Anime', 'Disney/Pixar Style 3D', 'Cartoon', 'Studio Ghibli', 'Modern'];
const LANGUAGES = ['English', 'Hindi', 'Marathi'];

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useBlinkAuth();
  
  const [project, setProject] = useState<any>(null);
  const [scenes, setScenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(!!id);
  
  // New Project State
  const [story, setStory] = useState('');
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('Realistic');
  const [language, setLanguage] = useState('English');
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  
  // Preview State
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (id) {
      fetchProjectData(id);
    }
  }, [id]);

  const fetchProjectData = async (projectId: string) => {
    try {
      const [projectData, scenesData] = await Promise.all([
        blink.db.projects.get({ id: projectId }),
        blink.db.scenes.list({ where: { project_id: projectId }, orderBy: { scene_number: 'asc' } })
      ]);
      setProject(projectData);
      setScenes(scenesData);
    } catch (error) {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!story.trim()) return toast.error('Please enter a story');
    if (!user) return;

    setIsGenerating(true);
    try {
      const projectId = await orchestrateVideoGeneration(
        user.id,
        story,
        style,
        (p) => setProgress(p)
      );
      navigate(`/editor/${projectId}`);
      toast.success('Cinematic video generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // View 1: Create Mode
  if (!id && !isGenerating) {
    return (
      <div className="container py-12 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Create Your Masterpiece</h1>
          <p className="text-muted-foreground text-lg">Enter your story and let Bheem AI handle the rest.</p>
        </div>

        <div className="space-y-8 bg-card p-8 rounded-3xl border border-border/50 shadow-elegant">
          <div className="space-y-4">
            <Label className="text-lg font-bold">What's the story?</Label>
            <Textarea 
              placeholder="Once upon a time, in a world where magic was real..."
              className="min-h-[200px] text-lg bg-background border-border/60 focus:border-primary/60 transition-all"
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-lg font-bold">Visual Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="h-12 bg-background">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label className="text-lg font-bold">Voiceover Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-12 bg-background">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            className="w-full h-16 text-xl bg-primary hover:bg-primary/90 text-white shadow-glow hover:scale-[1.01] transition-all"
          >
            Generate Cinematic Video <Sparkles className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  // View 2: Generating Mode
  if (isGenerating && progress) {
    return (
      <div className="container py-24 max-w-2xl mx-auto px-4 text-center">
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
          <Wand2 className="h-20 w-20 text-primary mx-auto animate-pulse relative z-10" />
        </div>
        
        <h2 className="text-3xl font-bold font-serif mb-4">We're building your vision...</h2>
        <p className="text-muted-foreground mb-10">{progress.message}</p>
        
        <div className="space-y-4 max-w-md mx-auto">
          <div className="flex justify-between text-sm font-medium mb-1">
            <span>{Math.round((progress.currentScene / (progress.totalScenes || 1)) * 100)}% Complete</span>
            {progress.totalScenes > 0 && <span>Scene {progress.currentScene} of {progress.totalScenes}</span>}
          </div>
          <Progress value={(progress.currentScene / (progress.totalScenes || 1)) * 100} className="h-3 bg-secondary" />
        </div>
        
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-50">
          <div className="flex flex-col items-center gap-2">
            <Layers className="h-6 w-6" />
            <span className="text-xs">Visuals</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Music className="h-6 w-6" />
            <span className="text-xs">Atmosphere</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Type className="h-6 w-6" />
            <span className="text-xs">Script</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Play className="h-6 w-6" />
            <span className="text-xs">Motion</span>
          </div>
        </div>
      </div>
    );
  }

  // View 3: Preview/Editor Mode
  const currentScene = scenes[currentSceneIndex];

  return (
    <div className="container py-8 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5 group">
            {currentScene?.video_url ? (
              <video 
                key={currentScene.id}
                ref={videoRef}
                src={currentScene.video_url} 
                className="w-full h-full object-cover"
                controls={false}
                autoPlay
                onEnded={() => {
                  if (currentSceneIndex < scenes.length - 1) {
                    setCurrentSceneIndex(i => i + 1);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-card">
                <RefreshCw className="h-10 w-10 animate-spin text-primary" />
              </div>
            )}

            {/* Cinematic Overlay Controls */}
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setCurrentSceneIndex(Math.max(0, currentSceneIndex - 1))}
                    disabled={currentSceneIndex === 0}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
                      }
                    }}
                    className="h-14 w-14 rounded-full bg-white text-black hover:bg-white/90"
                  >
                    <Play className="h-8 w-8 fill-current" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setCurrentSceneIndex(Math.min(scenes.length - 1, currentSceneIndex + 1))}
                    disabled={currentSceneIndex === scenes.length - 1}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
               </div>
               
               <div className="flex items-center space-x-4">
                 <span className="text-white font-medium text-sm">
                   Scene {currentSceneIndex + 1} / {scenes.length}
                 </span>
                 <Button className="bg-primary/20 hover:bg-primary/40 text-white backdrop-blur-md border border-white/10">
                   <Download className="mr-2 h-4 w-4" /> Export HD
                 </Button>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold font-serif">{project?.title}</h1>
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Narration</h3>
                <p className="text-lg leading-relaxed text-foreground/80 italic">
                  "{currentScene?.content}"
                </p>
                {currentScene?.voiceover_url && (
                  <audio src={currentScene.voiceover_url} controls className="mt-4 w-full h-8 opacity-50 hover:opacity-100 transition-opacity" />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar: Scenes & Assets */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Scenes</h2>
            <span className="text-xs bg-secondary px-2 py-1 rounded-full">{scenes.length} Total</span>
          </div>
          
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {scenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => setCurrentSceneIndex(idx)}
                className={`w-full text-left p-3 rounded-2xl border transition-all ${
                  idx === currentSceneIndex 
                  ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' 
                  : 'bg-card border-border/50 hover:border-border'
                }`}
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {scene.image_url && <img src={scene.image_url} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-[10px] font-bold text-white uppercase">
                      Scene {scene.scene_number}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2 text-foreground/80">
                      {scene.content}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10">
             <h3 className="font-bold mb-2 flex items-center">
               <Sparkles className="h-4 w-4 mr-2 text-primary" /> Visual Logic
             </h3>
             <p className="text-xs text-muted-foreground leading-relaxed">
               Bheem AI has matched the lighting, mood, and characters for this {project?.style} style production.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
