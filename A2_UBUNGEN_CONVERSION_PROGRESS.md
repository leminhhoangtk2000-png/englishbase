# A2 Übungen Conversion Progress

## Goal
Convert 21 A2 Übungen files from Lueckentext component to ExerciseTable component

## Completed ✅ (7/21)

1. **adjektivendungen/teil2.mdx** - ✅ Converted (30 exercises, 1 blank each)
2. **adjektivendungen/teil4.mdx** - ✅ Converted (25 exercises, 1 blank each)
3. **steigerung/teil1.mdx** - ✅ Converted (10 exercises, 1 blank each)
4. **steigerung/teil3.mdx** - ✅ Converted (20 exercises, 1 blank each)
5. **perfekt-prateritum/teil1.mdx** - ✅ Converted (25 exercises, 2 blanks each)
6. **perfekt-prateritum/teil2.mdx** - ✅ Converted (25 exercises, 2 blanks each)
7. **perfekt-prateritum/teil3.mdx** - ✅ Converted (25 exercises, 1 blank each - Präteritum)

## Remaining 🔄 (14/21)

### Plusquamperfekt (2 files)
8. **plusquamperfekt/teil2.mdx** - TODO (likely 2 blanks: auxiliary + partizip)
9. **plusquamperfekt/teil3.mdx** - TODO (likely 2 blanks: auxiliary + partizip)

### Nebensätze (1 file)
10. **nebensatze/teil1.mdx** - TODO (check blank count)

### Passiv (2 files)
11. **passiv/teil1.mdx** - TODO (check format)
12. **passiv/teil2.mdx** - TODO (check format)

### Futur (1 file)
13. **futur/teil1.mdx** - TODO (likely 2 blanks: werden + infinitiv)

### Possessivpronomen (2 files)
14. **possessivpronomen/teil1.mdx** - TODO (1 blank probably)
15. **possessivpronomen/teil2.mdx** - TODO (1 blank probably)

### Reflexivpronomen (5 files)
16. **reflexivpronomen/teil1.mdx** - TODO (likely 2 blanks: reflexive pronoun + verb)
17. **reflexivpronomen/teil2.mdx** - TODO 
18. **reflexivpronomen/teil3.mdx** - TODO
19. **reflexivpronomen/teil4.mdx** - TODO
20. **reflexivpronomen/teil5.mdx** - TODO

### Also convert (already converted manually earlier)
21. **adjektivendungen/teil1.mdx** - ✅ Already done (manual conversion before this session)

## Conversion Template

### Import Section
```tsx
import { ExerciseTable } from "@/components/exercises/exercise-table";
import { ExerciseAuthor, ExerciseHelp } from "@/components/exercises/exercise-author";
import ExerciseComments from "@/components/exercises/ExerciseComments";
```

### ExerciseTable Format (1 blank)
```tsx
<ExerciseTable
  title="Teil X: Title"
  subtitle="Description"
  exercises={[
    {id: 1, german: "Text __ more text. (hint)", correctAnswer: ["answer"]},
  ]}
/>
```

### ExerciseTable Format (2 blanks)
```tsx
<ExerciseTable
  title="Teil X: Title"
  subtitle="Description"
  exercises={[
    {id: 1, german: "Text __ more __ text. (hint)", correctAnswer: ["answer1", "answer2"]},
  ]}
/>
```

### Footer Section
```tsx
---

<ExerciseAuthor author="Lonia" />
<ExerciseHelp />

---

<ExerciseComments exerciseId="..." url="..." />
```

## Notes
- All files are in `/src/content/a2niveau/Übungen/`
- ExerciseTable component supports multiple blanks via correctAnswer array
- Always preserve complete exercise text (don't truncate)
- Check for duplicate ExerciseComments components (remove duplicates)
- Test in browser after conversion

## Next Steps
1. Convert plusquamperfekt files (2 files)
2. Convert nebensatze (1 file)
3. Convert passiv (2 files)
4. Convert futur (1 file)
5. Convert possessivpronomen (2 files)
6. Convert reflexivpronomen (5 files)
7. Test all pages in browser
8. Commit and push

## Commands
```bash
# Check progress
git status | grep Übungen

# Commit batch
git add -A && git commit -m "Convert [topic] files to ExerciseTable"

# Push
git push origin main
```
