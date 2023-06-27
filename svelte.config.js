// import adapter from '@sveltejs/adapter-cloudflare'
// FIXME: temporary fix, waiting for https://github.com/sveltejs/kit/pull/10214 to merged
import adapter from "@nerd-coder/svelte-adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter({
      routes: { include: ["/q"] },
      esbuildOptions: {
        external: ["node:buffer"],
        inject: ["./src/lib/buffer-shim.ts"],
      },
    }),
  },
};

export default config;
