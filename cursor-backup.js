#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class CursorBackup {
  constructor() {
    this.projectPath = process.cwd();
    this.desktopPath = path.join(require('os').homedir(), 'Desktop');
    this.cursorBackupPath = path.join(this.desktopPath, 'Cursor');
    this.ignorePatterns = [
      'node_modules',
      '.git',
      '.next',
      'dist',
      'build',
      'cursor-backup.js',
      '*.log',
      '.DS_Store',
      'Thumbs.db'
    ];
    
    this.setupBackupDirectory();
    this.createBackup('manual');
  }

  setupBackupDirectory() {
    if (!fs.existsSync(this.cursorBackupPath)) {
      fs.mkdirSync(this.cursorBackupPath, { recursive: true });
      console.log(`✅ Created Cursor backup directory: ${this.cursorBackupPath}`);
    }
  }

  shouldIgnoreFile(filePath) {
    return this.ignorePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(path.basename(filePath));
      }
      return filePath.includes(pattern);
    });
  }

  createBackup(reason = 'scheduled') {
    const now = Date.now();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupName = `rebirth-main-${timestamp}`;
    const backupPath = path.join(this.cursorBackupPath, backupName);

    try {
      // Create backup directory
      fs.mkdirSync(backupPath, { recursive: true });

      // Copy project files
      this.copyDirectory(this.projectPath, backupPath);
      
      this.lastBackupTime = now;
      console.log(`📸 Backup created (${reason}): ${backupName}`);
      
      // Clean up old backups (keep last 10) - DISABLED
      // this.cleanupOldBackups();
      
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
    }
  }

  copyDirectory(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (this.shouldIgnoreFile(srcPath)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  cleanupOldBackups() {
    try {
      const backups = fs.readdirSync(this.cursorBackupPath)
        .filter(name => name.startsWith('rebirth-main-'))
        .sort()
        .reverse();
      
      if (backups.length > 10) {
        const toDelete = backups.slice(10);
        toDelete.forEach(backup => {
          const backupPath = path.join(this.cursorBackupPath, backup);
          fs.rmSync(backupPath, { recursive: true, force: true });
          console.log(`🗑️  Cleaned up old backup: ${backup}`);
        });
      }
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
    }
  }

}

// Create a single manual backup
console.log('🚀 Creating manual backup...\n');
new CursorBackup();
console.log('✅ Backup complete!');
