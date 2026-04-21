# UniPath Color Audit & Theme Compliance

## Summary
This document tracks hardcoded colors that need to be replaced with theme palette colors across the UniPath application.

## Theme Palette Reference

### Light Mode (Green)
- `--primary`: #1F3A2B (dark green)
- `--primary-foreground`: #ffffff (white)
- `--secondary`: #3F5F4E (medium green)
- `--secondary-foreground`: #ffffff (white)
- `--accent`: #BFA97A (tan/beige)
- `--accent-foreground`: #0F1A14 (dark)
- `--muted-foreground`: #1F3A2B (dark green)
- `--destructive`: #dc2626 (red)

### Dark Mode (Blue)
- `--primary`: #2D6DA3 (blue)
- `--primary-foreground`: #EAF2F9 (light)
- `--secondary`: #9AA7B3 (gray-blue)
- `--secondary-foreground`: #0B1D3A (dark)
- `--accent`: #9AA7B3 (gray-blue)
- `--accent-foreground`: #0B1D3A (dark)
- `--muted-foreground`: #9AA7B3 (gray-blue)
- `--destructive`: #dc2626 (red)

### Color Blind Mode
- `--primary`: #0072b2 (blue)
- `--primary-foreground`: #ffffff (white)
- `--secondary`: #009e73 (green)
- `--secondary-foreground`: #ffffff (white)
- `--accent`: #f0e442 (yellow)
- `--accent-foreground`: #1a1a1a (dark)
- `--muted-foreground`: #666666 (gray)
- `--destructive`: #d55e00 (orange-red)

## Replacement Strategy

| Hardcoded Color | Theme Replacement | Use Case |
|----------------|-------------------|----------|
| emerald-* (green) | `secondary` or `accent` | Success states, completed items |
| indigo-*, blue-* | `primary` | Primary actions, active states |
| purple-* | `secondary` or `accent` | Custom JD, special features |
| amber-*, yellow-* | `accent` | Warning states, pending items |
| red-* | `destructive` | Error states, delete actions |
| slate-*, gray-* | `muted-foreground` or `foreground` | Text, borders |

## Files Requiring Updates

### ✅ COMPLETED
1. `/src/styles/theme.css` - Fixed contrast issues
   - Changed `primary-foreground` and `secondary-foreground` to white in light mode
   - Changed `muted-foreground` to darker color for better contrast

2. `/src/app/components/ThemeDropdown.tsx` - Created dropdown component

3. `/src/app/pages/LandingPage.tsx` - Added theme dropdown

4. `/src/app/pages/student/StudentLayout.tsx` - Fixed Sign Out button hover colors

5. `/src/app/pages/student/Dashboard.tsx` - Fixed MatchRing component to use CSS variables

### ⚠️ NEEDS UPDATES

#### High Priority (Student Pages)
1. **`/src/app/pages/student/Dashboard.tsx`** (500+ lines)
   - Multiple emerald-* colors for success states → use `secondary`
   - Multiple indigo-*, blue-* colors → use `primary`
   - Multiple purple-* colors for custom JD → use `secondary` or `accent`
   - amber-* for warnings → use `accent`
   - yellow-* for top match stats → keep or use `accent`
   - Match percentage bars (emerald/amber/red) → keep as visual indicators or map to secondary/accent/destructive

2. **`/src/app/pages/student/Profile.tsx`**
   - Check for hardcoded colors

3. **`/src/app/pages/student/RoleBrowser.tsx`**
   - Check for hardcoded colors

4. **`/src/app/pages/student/RoleDetail.tsx`**
   - Check for hardcoded colors

5. **`/src/app/pages/student/CustomAnalysis.tsx`**
   - Check for hardcoded colors

6. **`/src/app/pages/student/CustomRoleDetail.tsx`**
   - Check for hardcoded colors

7. **`/src/app/pages/student/UploadCurriculum.tsx`**
   - Check for hardcoded colors

8. **`/src/app/pages/student/SavedProjects.tsx`**
   - Check for hardcoded colors

9. **`/src/app/pages/student/CareerMatches.tsx`**
   - Check for hardcoded colors

#### Medium Priority (Auth & University Pages)
10. **`/src/app/pages/AuthPages.tsx`**
    - amber-* colors in consent notice → use `accent`
    - purple-* colors in university registration → use `secondary` or `primary`
    - emerald-* in success page → use `secondary`
    - indigo-* in buttons → use `primary`

11. **`/src/app/pages/university/UniDashboard.tsx`**
    - Check for hardcoded colors

12. **`/src/app/pages/university/DataUpload.tsx`**
    - Check for hardcoded colors

13. **`/src/app/pages/university/UniAnalytics.tsx`**
    - Check for hardcoded colors

14. **`/src/app/pages/university/UniStudents.tsx`**
    - Check for hardcoded colors

#### Low Priority (Components)
15. **`/src/app/components/AddRolesModal.tsx`**
    - red-* colors for low match → use `destructive`

## Specific Color Mappings

### Dashboard Color Replacements
```
OLD COLOR               NEW CLASS/VARIABLE           REASONING
---------               ------------------           ---------
bg-emerald-100          bg-secondary/20              Success/completion indicator
text-emerald-600        text-secondary-foreground    Success text
border-emerald-200      border-secondary             Success border

bg-indigo-100           bg-primary/20                Primary action background
text-indigo-600         text-primary                 Primary action text
border-indigo-200       border-primary               Primary border

bg-purple-100           bg-secondary/20              Custom JD background
text-purple-600         text-secondary-foreground    Custom JD text
border-purple-200       border-secondary             Custom JD border

bg-amber-100            bg-accent/30                 Warning background
text-amber-600          text-accent-foreground       Warning text
border-amber-200        border-accent                Warning border

bg-red-100 (hover)      bg-destructive/10            Destructive hover
text-red-600 (hover)    text-destructive             Destructive text
```

### Match Percentage Colors
Keep visual distinction for match percentages:
- >= 70%: Use `secondary` (green/blue/green depending on mode)
- >= 50%: Use `accent` (tan/gray-blue/yellow depending on mode)
- < 50%: Use `destructive` (red in all modes)

## Implementation Notes

1. **CSS Variables**: Use `var(--primary)`, `var(--secondary)`, etc. for inline styles and SVG elements
2. **Tailwind Classes**: Use `bg-primary`, `text-primary-foreground`, etc. for class-based styling
3. **Opacity Variants**: Use `/10`, `/20`, `/30` for subtle backgrounds
4. **Dark Mode**: The `dark:` prefix will automatically use dark mode values
5. **Color Blind Mode**: The `.colorblind` class will automatically use colorblind-safe values

## Testing Checklist
- [ ] Light mode - check all green palette colors are used
- [ ] Dark mode - check all blue palette colors are used
- [ ] Color blind mode - check accessible colors are used
- [ ] Text contrast - ensure all text is readable (WCAG AA minimum)
- [ ] Interactive elements - buttons, links have sufficient contrast
- [ ] Success/warning/error states - visually distinct in all modes
