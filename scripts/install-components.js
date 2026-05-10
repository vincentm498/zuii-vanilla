#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * ZUI Component Installer
 * Copies .js and .css files from the library to the local project.
 */

// Dossier de destination par défaut
let targetBaseDir = path.join(process.cwd(), 'components', 'zuii');

// Vérification d'un dossier personnalisé via --out ou -o
const outIndex = process.argv.findIndex(arg => arg === '--out' || arg === '-o');
if (outIndex !== -1 && process.argv[outIndex + 1]) {
    targetBaseDir = path.resolve(process.cwd(), process.argv[outIndex + 1]);
}

// Resolve the source directory
// Case 1: Running from the monorepo root (npm run install-components)
// Case 2: Running from node_modules (npx zuii-install)
let sourcePackages = path.join(__dirname, '..', 'packages');

if (!fs.existsSync(sourcePackages)) {
    // If not in root, maybe we are in scripts/ inside node_modules/zuii/
    sourcePackages = path.resolve(__dirname, '..', 'packages');
}

// Fallback for different package layouts if needed
if (!fs.existsSync(sourcePackages)) {
    console.error(`❌ Erreur : Dossier des composants introuvable à ${sourcePackages}`);
    process.exit(1);
}

function copyFiles(src, dest) {
    if (!fs.existsSync(src)) return;

    const items = fs.readdirSync(src);

    items.forEach(item => {
        const srcPath = path.join(src, item);
        const stats = fs.statSync(srcPath);

        if (stats.isDirectory()) {
            // Ignore node_modules if they exist in source packages
            if (item === 'node_modules') return;
            copyFiles(srcPath, path.join(dest, item));
        } else {
            const ext = path.extname(item);
            if (ext === '.js' || ext === '.css') {
                if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                const destPath = path.join(dest, item);

                const force = process.argv.includes('--force') || process.argv.includes('-f');

                if (fs.existsSync(destPath) && !force) {
                    console.warn(`  ⚠️  Ignoré ${path.relative(sourcePackages, srcPath)} (existe localement)`);
                } else {
                    fs.copyFileSync(srcPath, destPath);
                    const action = fs.existsSync(destPath) && force ? 'Mis à jour' : 'Copié';
                    console.log(`  ✓ ${action} ${path.relative(sourcePackages, srcPath)}`);
                }
            }
        }
    });
}

console.log(`\n🚀 Installation des composants ZUI dans : ./${path.relative(process.cwd(), targetBaseDir)}`);

try {
    const packages = fs.readdirSync(sourcePackages);

    packages.forEach(pkg => {
        const pkgPath = path.join(sourcePackages, pkg);
        if (fs.statSync(pkgPath).isDirectory()) {
            copyFiles(pkgPath, path.join(targetBaseDir, pkg));
        }
    });

    console.log('\n✨ Installation terminée ! Vous pouvez maintenant importer les composants depuis votre dossier components/zuii.\n');
} catch (error) {
    console.error('❌ Une erreur est survenue lors de l\'installation :', error.message);
    process.exit(1);
}
