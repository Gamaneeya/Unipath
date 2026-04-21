const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('../src/app/pages');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace all hex colors
    content = content.replace(/\[#9a4444\]/g, 'primary');
    content = content.replace(/\[#6b2525\]/g, 'primary-foreground');
    content = content.replace(/\[#f0e2a6\]/g, 'accent');
    content = content.replace(/\[#d6c591\]/g, 'border');
    content = content.replace(/\[#4a3630\]/g, 'border');
    content = content.replace(/\[#ae9762\]/g, 'accent-foreground');
    
    // Generic color replacements
    // Text colors
    content = content.replace(/text-slate-900/g, 'text-foreground');
    content = content.replace(/text-slate-800/g, 'text-foreground');
    content = content.replace(/text-slate-700/g, 'text-foreground');
    content = content.replace(/text-slate-600/g, 'text-muted-foreground');
    content = content.replace(/text-slate-500/g, 'text-muted-foreground');
    content = content.replace(/text-slate-400/g, 'text-muted-foreground');
    
    content = content.replace(/text-gray-900/g, 'text-foreground');
    content = content.replace(/text-gray-800/g, 'text-foreground');
    content = content.replace(/text-gray-700/g, 'text-foreground');
    content = content.replace(/text-gray-600/g, 'text-muted-foreground');
    content = content.replace(/text-gray-500/g, 'text-muted-foreground');
    content = content.replace(/text-gray-400/g, 'text-muted-foreground');
    content = content.replace(/text-gray-300/g, 'text-muted-foreground');
    
    content = content.replace(/text-indigo-600/g, 'text-primary');
    content = content.replace(/text-indigo-500/g, 'text-primary');
    content = content.replace(/text-indigo-400/g, 'text-primary');
    content = content.replace(/text-blue-600/g, 'text-primary');
    content = content.replace(/text-blue-500/g, 'text-primary');
    
    content = content.replace(/text-emerald-600/g, 'text-secondary');
    content = content.replace(/text-emerald-500/g, 'text-secondary');
    
    content = content.replace(/text-red-600/g, 'text-destructive');
    content = content.replace(/text-red-500/g, 'text-destructive');
    content = content.replace(/text-red-400/g, 'text-destructive');
    
    content = content.replace(/text-amber-600/g, 'text-accent');
    content = content.replace(/text-amber-500/g, 'text-accent');
    
    // Background colors
    content = content.replace(/bg-slate-50/g, 'bg-muted');
    content = content.replace(/bg-slate-100/g, 'bg-muted');
    content = content.replace(/bg-slate-800/g, 'bg-foreground');
    content = content.replace(/bg-slate-900/g, 'bg-foreground');
    
    content = content.replace(/bg-gray-50/g, 'bg-muted');
    content = content.replace(/bg-gray-100/g, 'bg-muted');
    content = content.replace(/bg-gray-800/g, 'bg-foreground');
    content = content.replace(/bg-gray-900/g, 'bg-foreground');
    
    content = content.replace(/bg-indigo-50/g, 'bg-primary/10');
    content = content.replace(/bg-indigo-100/g, 'bg-primary/20');
    content = content.replace(/bg-indigo-500/g, 'bg-primary');
    content = content.replace(/bg-indigo-600/g, 'bg-primary');
    content = content.replace(/bg-blue-50/g, 'bg-primary/10');
    content = content.replace(/bg-blue-600/g, 'bg-primary');
    
    content = content.replace(/bg-emerald-50/g, 'bg-secondary/10');
    content = content.replace(/bg-emerald-100/g, 'bg-secondary/20');
    content = content.replace(/bg-emerald-500/g, 'bg-secondary');
    
    content = content.replace(/bg-amber-50/g, 'bg-accent/10');
    content = content.replace(/bg-amber-100/g, 'bg-accent/20');
    
    content = content.replace(/bg-red-50/g, 'bg-destructive/10');
    
    // Border colors
    content = content.replace(/border-slate-100/g, 'border-border');
    content = content.replace(/border-slate-200/g, 'border-border');
    content = content.replace(/border-slate-300/g, 'border-border');
    content = content.replace(/border-slate-800/g, 'border-border');
    
    content = content.replace(/border-gray-100/g, 'border-border');
    content = content.replace(/border-gray-200/g, 'border-border');
    content = content.replace(/border-gray-300/g, 'border-border');
    content = content.replace(/border-gray-800/g, 'border-border');
    
    content = content.replace(/border-indigo-100/g, 'border-primary/20');
    content = content.replace(/border-indigo-200/g, 'border-primary/30');
    content = content.replace(/border-indigo-400/g, 'border-primary');
    content = content.replace(/border-indigo-500/g, 'border-primary');
    content = content.replace(/border-indigo-600/g, 'border-primary');
    content = content.replace(/border-blue-200/g, 'border-primary/30');
    
    content = content.replace(/border-emerald-200/g, 'border-secondary/30');
    content = content.replace(/border-amber-200/g, 'border-accent/30');
    content = content.replace(/border-red-200/g, 'border-destructive/30');
    
    // Hover text
    content = content.replace(/hover:text-slate-800/g, 'hover:text-foreground');
    content = content.replace(/hover:text-slate-900/g, 'hover:text-foreground');
    content = content.replace(/hover:text-gray-800/g, 'hover:text-foreground');
    content = content.replace(/hover:text-gray-900/g, 'hover:text-foreground');
    content = content.replace(/hover:text-indigo-600/g, 'hover:text-primary');
    content = content.replace(/hover:text-indigo-700/g, 'hover:text-primary');
    
    // Hover backgrounds
    content = content.replace(/hover:bg-slate-50/g, 'hover:bg-muted');
    content = content.replace(/hover:bg-slate-100/g, 'hover:bg-muted');
    content = content.replace(/hover:bg-gray-50/g, 'hover:bg-muted');
    content = content.replace(/hover:bg-gray-100/g, 'hover:bg-muted');
    content = content.replace(/hover:bg-indigo-50/g, 'hover:bg-primary/10');
    content = content.replace(/hover:bg-indigo-600/g, 'hover:bg-primary');
    content = content.replace(/hover:bg-indigo-700/g, 'hover:bg-primary/90');
    content = content.replace(/hover:bg-emerald-50/g, 'hover:bg-secondary/10');
    content = content.replace(/hover:bg-emerald-600/g, 'hover:bg-secondary');
    
    // Ring colors
    content = content.replace(/ring-indigo-100/g, 'ring-ring/20');
    content = content.replace(/ring-indigo-500/g, 'ring-ring');
    content = content.replace(/ring-blue-500/g, 'ring-ring');
    
    // Focus borders
    content = content.replace(/focus:border-indigo-400/g, 'focus:border-ring');
    content = content.replace(/focus:border-indigo-500/g, 'focus:border-ring');
    content = content.replace(/focus:border-blue-500/g, 'focus:border-ring');

    // Remove remaining arbitrary colors if any (optional, let's just do known patterns)
    // Dark mode variants mapping
    // We should simplify this since the theme now has proper dark mode support built-in through semantic variables.
    // e.g., "dark:bg-slate-800", "dark:text-slate-200"
    content = content.replace(/dark:bg-slate-900/g, 'dark:bg-background');
    content = content.replace(/dark:bg-slate-800/g, 'dark:bg-card');
    content = content.replace(/dark:bg-gray-900/g, 'dark:bg-background');
    content = content.replace(/dark:bg-gray-800/g, 'dark:bg-card');
    
    content = content.replace(/dark:text-slate-200/g, 'dark:text-foreground');
    content = content.replace(/dark:text-slate-300/g, 'dark:text-foreground');
    content = content.replace(/dark:text-slate-400/g, 'dark:text-muted-foreground');
    content = content.replace(/dark:text-gray-200/g, 'dark:text-foreground');
    content = content.replace(/dark:text-gray-300/g, 'dark:text-foreground');
    content = content.replace(/dark:text-gray-400/g, 'dark:text-muted-foreground');
    
    content = content.replace(/dark:border-slate-700/g, 'dark:border-border');
    content = content.replace(/dark:border-slate-800/g, 'dark:border-border');
    content = content.replace(/dark:border-gray-700/g, 'dark:border-border');
    content = content.replace(/dark:border-gray-800/g, 'dark:border-border');
    
    // Some hardcoded light mode colors to clean up
    content = content.replace(/bg-white/g, 'bg-card');
    
    fs.writeFileSync(file, content);
});

console.log('Colors replaced successfully!');
