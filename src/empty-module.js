// Stub for Node-only modules in browser builds
const noop = () => '';
const noopObj = () => ({ write: noop, end: noop, on: noop, pipe: noop });

// path stubs
export const join = (...args) => args.join('/');
export const resolve = (...args) => args.join('/');
export const basename = (p) => p.split('/').pop();
export const dirname = (p) => p.split('/').slice(0, -1).join('/');
export const extname = (p) => { const m = p.match(/\.[^.]+$/); return m ? m[0] : ''; };

// fs stubs
export const existsSync = () => false;
export const mkdirSync = noop;
export const readFileSync = () => '';
export const writeFileSync = noop;
export const createWriteStream = noopObj;
export const unlink = (p, cb) => cb && cb();

// http/https stubs
export const get = (url, cb) => { if (cb) cb({ pipe: noop, on: noop, statusCode: 200, headers: {} }); return { on: noop }; };
export const request = (opts, cb) => { if (cb) cb({ pipe: noop, on: noop, statusCode: 200, headers: {} }); return { on: noop, end: noop, write: noop }; };

export default {
    join, resolve, basename, dirname, extname,
    existsSync, mkdirSync, readFileSync, writeFileSync, createWriteStream, unlink,
    get, request,
};
