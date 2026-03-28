import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const emptyModule = path.resolve(__dirname, '../src/empty-module.js');

const phasermsg = () => {
    return {
        name: 'phasermsg',
        buildStart() {
            process.stdout.write(`Building for production...\n`);
        },
        buildEnd() {
            const line = "---------------------------------------------------------";
            const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
            process.stdout.write(`${line}\n${msg}\n${line}\n`);

            process.stdout.write(`✨ Done ✨\n`);
        }
    }
}

// Node-only modules from forbocai SDK that must be stubbed for browser builds
const nodeOnlyModules = {
    'node-llama-cpp': emptyModule,
    'onnxruntime-node': emptyModule,
    '@lancedb/lancedb': emptyModule,
    'apache-arrow': emptyModule,
    'path': emptyModule,
    'fs': emptyModule,
    'http': emptyModule,
    'https': emptyModule,
    'node:path': emptyModule,
    'node:fs': emptyModule,
    'node:http': emptyModule,
    'node:https': emptyModule,
};

export default defineConfig({
    base: './',
    plugins: [
        react(),
        phasermsg()
    ],
    logLevel: 'warning',
    define: {
        'process.env': {},
        'process.platform': JSON.stringify('browser'),
        'process.version': JSON.stringify(''),
    },
    resolve: {
        alias: nodeOnlyModules
    },
    build: {
        rollupOptions: {
            external: ['electron'],
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                passes: 2
            },
            mangle: true,
            format: {
                comments: false
            }
        }
    }
});
