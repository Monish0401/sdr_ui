import { Radio, Settings, Sun, Moon } from 'lucide-react';
// TypeScript type imports removed: import type { Page, Theme } from '../App';

// TypeScript interface removed:
// interface NavigationProps {
//   currentPage: Page;
//   setCurrentPage: (page: Page) => void;
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
// }

export function Navigation({ currentPage, setCurrentPage, theme, setTheme }) {
  const navItems = [
    // Type assertion 'as Page' removed
    { id: 'home', label: 'Payload Status', icon: Radio },
    { id: 'config', label: 'Configurations', icon: Settings },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border-b`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-600 text-white'
                      : theme === 'dark'
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}