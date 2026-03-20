import { Home, Briefcase, Users, Star, Bell } from 'lucide-react';
import { Link } from 'react-router';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Briefcase, label: 'My Work', path: '/' },
  { icon: Users, label: 'Shared', path: '/' },
  { icon: Star, label: 'Favorites', path: '/' },
  { icon: Bell, label: 'Alerts', path: '/' },
];

export function LeftRail() {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}