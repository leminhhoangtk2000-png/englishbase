# ⚡ EDU-THEME QUICK START

## 🚀 Start Everything (3 commands)

```bash
npm run docker:up    # Start database
npm run dev          # Start server (port 9003)  
./scripts/verify-ubungen.sh  # Verify all OK
```

## 🎯 Expected Result

✅ **Server**: http://localhost:9003
✅ **Exercises**: Interactive inputs (not raw text)
✅ **Sidebar**: "On This Page" with navigation
✅ **Console**: No errors

## 🔧 Quick Fixes

| Problem | Solution |
|---------|----------|
| Page stuck on "Loading..." | Hard refresh: `Cmd+Shift+R` |
| Exercises show raw text | Restart: `Cmd+C` then `npm run dev` |
| Port 9003 in use | Kill it: `lsof -ti:9003 \| xargs kill -9` |
| Sidebar not showing | Wait 2-3 seconds, then reload |

## 📂 Key Files (DO NOT DELETE)

```
src/components/mdx-components-renderer.tsx  ⭐ MDX parsing
src/components/docs-toc-client.tsx         ⭐ Sidebar
src/app/a1niveau/[[...slug]]/page.tsx      ⭐ Routing
src/content/a1niveau/Übungen/*.mdx         ⭐ Content
```

## ✅ Health Check

```bash
# Quick verify
curl -I http://localhost:9003/a1niveau/%C3%9Cbungen/artikel/teil-1

# Full audit
./scripts/verify-ubungen.sh
```

## 🆘 Emergency Reset

```bash
lsof -ti:9003 | xargs kill -9
rm -rf .next
npm run dev
```

---

**Quick Test URL**: http://localhost:9003/a1niveau/%C3%9Cbungen/artikel/teil-1

**See full guide**: [STARTUP-GUIDE.md](./STARTUP-GUIDE.md)
