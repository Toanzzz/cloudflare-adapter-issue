import { Buffer as _NodeBuffer } from "node:buffer";

globalThis.Buffer = _NodeBuffer;

export { _NodeBuffer as Buffer };
