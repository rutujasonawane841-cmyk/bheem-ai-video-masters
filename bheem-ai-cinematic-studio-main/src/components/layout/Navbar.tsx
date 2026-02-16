import { Link, useNavigate } from 'react-router-dom';
import { useBlinkAuth } from '@blinkdotnew/react';
import { Button } from '../ui/button';
import { blink } from '../../lib/blink';
import { Film, User, LogOut, LayoutDashboard, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function Navbar() {
  const { user, isAuthenticated } = useBlinkAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    blink.auth.login(window.location.origin + '/dashboard');
  };

  const handleLogout = () => {
    blink.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Film className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight font-serif text-white">BHEEM AI</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                <Link to="/editor">
                  <Plus className="mr-2 h-4 w-4" /> New Video
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={user?.avatar_url || ''} alt={user?.display_name || 'User'} />
                      <AvatarFallback className="bg-secondary text-primary">
                        {user?.display_name?.charAt(0) || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90 text-white shadow-glow">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
