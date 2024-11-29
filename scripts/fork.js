import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const sourceDir = resolve('.');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const targetDir = resolve(`../lottery-app-fork-${timestamp}`);

// Create target directory
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

// Function to copy files recursively
function copyRecursive(source, target) {
  // Skip node_modules and .git
  if (source.includes('node_modules') || source.includes('.git')) {
    return;
  }

  const stats = statSync(source);
  
  if (stats.isDirectory()) {
    // Create directory if it doesn't exist
    if (!existsSync(target)) {
      mkdirSync(target, { recursive: true });
    }
    
    // Copy all files in directory
    const files = readdirSync(source);
    files.forEach(file => {
      const sourcePath = join(source, file);
      const targetPath = join(target, file);
      copyRecursive(sourcePath, targetPath);
    });
  } else {
    // Copy file
    copyFileSync(source, target);
  }
}

try {
  // Copy all files
  copyRecursive(sourceDir, targetDir);
  
  // Initialize new git repository
  process.chdir(targetDir);
  execSync('git init');
  
  // Install dependencies
  execSync('npm install');
  
  console.log(`
Successfully forked project to: ${targetDir}

To start working with the fork:
  cd ${targetDir}
  npm run dev
`);
} catch (error) {
  console.error('Failed to fork project:', error);
  process.exit(1);
}