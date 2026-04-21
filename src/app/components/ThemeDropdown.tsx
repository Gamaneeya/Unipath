import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Eye, ChevronDown } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface ThemeDropdownProps {
  variant?: "default" | "compact";
}

export function ThemeDropdown({ variant = "default" }: ThemeDropdownProps) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes = [
    { value: "light" as const, label: "Light Mode", icon: Sun },
    { value: "dark" as const, label: "Dark Mode", icon: Moon },
    { value: "colorblind" as const, label: "Color Blind Friendly Mode", icon: Eye },
  ];

  const currentTheme = themes.find((t) => t.value === theme);
  const Icon = currentTheme?.icon || Sun;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (variant === "compact") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-muted-foreground hover:text-primary px-3 py-2 transition-colors"
          aria-label="Select theme"
        >
          <Icon className="w-5 h-5" />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-card border-2 border-border rounded-2xl shadow-lg overflow-hidden z-50">
            {themes.map((themeOption) => {
              const ThemeIcon = themeOption.icon;
              const isSelected = theme === themeOption.value;

              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    isSelected
                      ? "bg-accent text-accent-foreground dark:bg-accent dark:text-foreground font-bold"
                      : "text-foreground dark:text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/50"
                  }`}
                >
                  <ThemeIcon className="w-4 h-4" />
                  <span>{themeOption.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground border-2 border-transparent hover:border-border transition-all font-bold"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span>{currentTheme?.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border-2 border-border rounded-2xl shadow-lg overflow-hidden z-50">
          {themes.map((themeOption) => {
            const ThemeIcon = themeOption.icon;
            const isSelected = theme === themeOption.value;

            return (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isSelected
                    ? "bg-accent text-accent-foreground font-bold"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                }`}
              >
                <ThemeIcon className="w-4 h-4" />
                <span>{themeOption.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}