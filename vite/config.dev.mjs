import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const emptyModule = path.resolve(__dirname, '../src/empty-module.js');

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

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        react(),
    ],
    define: {
        'process.env': {},
        'process.platform': JSON.stringify('browser'),
        'process.version': JSON.stringify(''),
    },
    resolve: {
        alias: nodeOnlyModules
    },
    server: {
        port: 8080
    },
    optimizeDeps: {
        exclude: ['node-llama-cpp', 'onnxruntime-node', '@lancedb/lancedb']
    }
})
