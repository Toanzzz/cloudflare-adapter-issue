// See https://kit.svelte.dev/docs/types#app
import type { Eip1193Provider } from "ethers";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export {};
