<script lang="ts">
  import { onMount } from "svelte";
  import { BrowserProvider, isError } from "ethers";

  let loading = false;
  let error = "";
  let address = "";
  let provider: BrowserProvider | undefined;
  $: connected = !!address;

  onMount(() => {
    if (window.ethereum) provider = new BrowserProvider(window.ethereum);
    else error = "MetaMask extension not found!";
  });

  const siwe_init = (address: string) =>
    fetch("/q", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        query: `#graphql
          mutation ($input: SiweInitInput!) {
            siwe_init(input: $input)
          }
        `,
        variables: { input: { address } },
      }),
    })
      .then((a) => a.json())
      .then((a) => a.data.siwe_init);

  const siwe_verify = (message: string, signature: string) =>
    fetch("/q", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        query: `#graphql
          mutation ($input: SiweVerifyInput!) {
            siwe_verify(input: $input)
          }
        `,
        variables: { input: { message, signature } },
      }),
    })
      .then((a) => a.json())
      .then((a) => a.data.siwe_verify);

  async function signinWithMetamask() {
    if (!provider) return;
    loading = true;
    error = "";
    try {
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const message = await siwe_init(signer.address);
      const signature = await signer.signMessage(message);
      const accessToken = await siwe_verify(message, signature);
      console.log("⚡️ SIWE access token", accessToken);
      address = signer.address;
    } catch (e) {
      if (isError(e, "ACTION_REJECTED")) error = "Sign in request rejected!";
      else error = JSON.stringify(e);
    } finally {
      loading = false;
    }
  }
</script>

<h1>Welcome to SvelteKit</h1>
{#if !connected}
  <button disabled={loading} on:click={signinWithMetamask}>
    <img class="logo" src="/icon-metamask.svg" alt="MetaMask" />
    {loading ? "Connecting..." : "Connect Wallet"}
  </button>
{:else}
  <pre>{address}</pre>
{/if}
{#if error}<p class="error">{error}</p>{/if}

<style>
  button {
    display: inline-flex;
    align-items: center;
    font-size: 16px;
    gap: 4px;
  }
  img.logo {
    width: 24px;
    height: 24px;
  }
  p.error {
    color: red;
  }
</style>
