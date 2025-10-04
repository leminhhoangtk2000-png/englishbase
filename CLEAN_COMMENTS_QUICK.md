# QUICK: Clean All Comments

## 🚀 Fastest Way (1 Step)

**While dev server is running (`npm run dev`):**

### Option 1: Open in Browser
```
http://localhost:9003/api/admin/clean-comments
```

### Option 2: Curl Command
```bash
curl -X DELETE http://localhost:9003/api/admin/clean-comments
```

## ✅ Expected Result

```json
{
  "success": true,
  "deleted": {
    "likes": X,
    "comments": Y
  },
  "remaining": {
    "likes": 0,
    "comments": 0
  },
  "message": "All exercise comments cleaned successfully!"
}
```

## 🔒 Safety

- ✅ Only works in development
- ❌ Blocked in production (403 error)
- ⚠️ Deletes ALL comments from ALL pages

## 📚 Need More Info?

See: `HOW_TO_CLEAN_COMMENTS.md` for detailed guide

---

**That's it!** Database is now clean! 🎉
