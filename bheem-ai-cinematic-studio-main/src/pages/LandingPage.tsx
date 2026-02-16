import { Button } from '../components/ui/button';
import { blink } from '../lib/blink';
import { Play, Sparkles, Wand2, Zap, Shield, Globe, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const handleGetStarted = () => {
    blink.auth.login(window.location.origin + '/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000" 
            alt="Cinematic Background" 
            className="w-full h-full object-cover scale-105 animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
        </div>

        <div className="container relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary-foreground">AI-Powered Cinematic Magic</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif mb-6 tracking-tight leading-tight">
              Bring Your Stories <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient">To Life</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform simple text into breathtaking cinematic videos. Automatically generate scenes, characters, and voiceovers with production-grade quality.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 text-white shadow-glow hover:scale-[1.02] transition-all"
              >
                Start Creating Free <Zap className="ml-2 h-5 w-5 fill-current" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-10 text-lg border-white/20 hover:bg-white/10 text-white backdrop-blur-sm"
              >
                Watch Demo <Play className="ml-2 h-5 w-5 fill-current" />
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements for Depth */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary/50 to-transparent"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4">The Bheem AI Engine</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to create production-quality content in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Scene Detection',
                desc: 'Automatically splits your story into optimized cinematic scenes.',
                icon: Wand2,
                color: 'text-purple-400'
              },
              {
                title: 'Character Consistency',
                desc: 'Maintains character visual identity across different environments.',
                icon: Shield,
                color: 'text-blue-400'
              },
              {
                title: 'Global Voiceover',
                desc: 'Generate natural voices in Hindi, Marathi, and English perfectly synced.',
                icon: Globe,
                color: 'text-emerald-400'
              },
              {
                title: 'Multiple Styles',
                desc: 'Choose from Anime, Disney/Pixar, Studio Ghibli, or Realistic styles.',
                icon: Star,
                color: 'text-amber-400'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-elegant"
              >
                <div className={`p-3 rounded-xl bg-background border border-border mb-6 group-hover:scale-110 transition-transform w-fit`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
