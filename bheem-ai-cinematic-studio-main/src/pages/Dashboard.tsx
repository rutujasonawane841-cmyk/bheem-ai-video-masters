import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlinkAuth } from '@blinkdotnew/react';
import { blink } from '../lib/blink';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Film, Clock, Play, Trash2, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useBlinkAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!user) return;
    try {
      const records = await blink.db.projects.list({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' }
      });
      setProjects(records);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await blink.db.projects.delete({ id });
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="h-64 w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold font-serif mb-2">My Studio</h1>
          <p className="text-muted-foreground">Manage and preview your AI cinematic creations.</p>
        </div>
        <Button asChild className="h-12 px-6 bg-primary hover:bg-primary/90 text-white shadow-glow">
          <Link to="/editor">
            <Plus className="mr-2 h-5 w-5" /> Create New Video
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border/50">
          <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Film className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-8">Start your first cinematic journey today.</p>
          <Button asChild size="lg" className="bg-primary text-white">
            <Link to="/editor">Get Started</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="group overflow-hidden bg-card border-border/50 hover:border-primary/50 transition-all hover:shadow-elegant">
              <div className="relative aspect-video overflow-hidden bg-muted">
                {project.thumbnail_url ? (
                  <img 
                    src={project.thumbnail_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="h-12 w-12 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button asChild variant="secondary" size="icon" className="rounded-full h-12 w-12 bg-white text-black hover:bg-white/90 shadow-xl scale-90 group-hover:scale-100 transition-all">
                    <Link to={`/editor/${project.id}`}>
                      <Play className="h-6 w-6 fill-current" />
                    </Link>
                  </Button>
                </div>
                {project.status === 'processing' && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">
                      Processing
                    </div>
                  </div>
                )}
              </div>
              <CardHeader className="p-5 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-bold line-clamp-1">{project.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem onClick={() => navigate(`/editor/${project.id}`)}>
                        Edit / View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardFooter className="p-5 pt-0 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDistanceToNow(new Date(project.created_at))} ago
                </div>
                <div className="bg-secondary/50 px-2 py-0.5 rounded-full capitalize">
                  {project.style}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
