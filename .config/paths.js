import * as path from 'path';

export const __dirname = new URL('.', import.meta.url).pathname;
export const rootDir = path.resolve(__dirname, '..');
export const devServerDir = path.join(rootDir, 'assets');
export const tsconfigPath = path.resolve(rootDir, 'tsconfig.json');
export const srcPath = path.resolve(rootDir, 'src/');
export const nodeModulesPath = path.resolve(rootDir, 'node_modules');
export const distPath = path.resolve(rootDir, 'dist');
