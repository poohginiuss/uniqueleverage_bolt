# 🕒 Cursor Manual Backup System

A simple backup system that creates timestamped snapshots of your project when you manually run it. No automatic backups - you decide when to backup.

## 🚀 How to Use

### Create a Backup
```bash
npm run backup
```

That's it! The system will create one backup and exit.

## ⏰ How It Works

- **Manual only**: No automatic backups - you control when backups happen
- **Smart**: Ignores unnecessary files (node_modules, .git, etc.)
- **No auto-cleanup**: All backups are preserved (no automatic deletion)
- **Clean**: Creates complete project snapshots

## 📁 Backup Location

All backups are saved to: `~/Desktop/Cursor/`

Example backup folders:
```
~/Desktop/Cursor/
├── rebirth-main-2025-09-15T20-30-00/
├── rebirth-main-2025-09-15T20-40-00/
├── rebirth-main-2025-09-15T20-50-00/
└── ...
```

## 🎯 Perfect For

- **Experiment safely**: Try new features knowing you can always go back
- **Crash recovery**: If Cursor crashes, open any backup folder
- **Version comparison**: Compare different states of your code
- **Manual control**: You decide exactly when to create backups

## 💡 Tips

- Run `npm run backup` whenever you want to save your current progress
- Backups are complete project snapshots you can browse in Finder
- All backups are preserved - no automatic deletion
- Perfect for creating checkpoints before major changes

---

**Happy coding with manual backup control! 🎉**