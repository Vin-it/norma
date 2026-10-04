# AGENTS.md

Norma (**No**str **R**elay **Ma**nager) is a client-only React admin panel for Nostr relays that implement
[NIP-86 Relay Management API](https://nips.nostr.com/86). There is no backend: the browser signs requests
with the user's NIP-07 extension (`window.nostr`) and calls the relay directly.

## Commands

Node 20 (`.nvmrc`).

```bash
npm install
npm run dev        # rsbuild dev server, opens browser
npm run build      # production build to dist/
npm run preview    # serve the production build
npm run lint:fix   # biome lint --write ./src
npm run format     # biome format --write ./src
npx tsc            # type-check (noEmit; rsbuild does not type-check)
```

There are no tests. Verify changes with `npx tsc`, `npm run lint:fix`, and `npm run build`.
Exercising the UI for real needs a NIP-86 relay and a NIP-07 browser extension.

## Architecture

- `src/index.tsx`: router. Every route renders inside `<App />` (`src/App.tsx`), which shows a setup form
  until the relay URL is configured.
- **Relay config**: base URL (http(s), not ws(s), no trailing slash) + management endpoint path (e.g.
  `/admin/manage`). Stored in `localStorage` by the static `UrlStore` class (`src/utils/url.store.ts`),
  exposed to React via `useUrlStore` / `UrlContext`. API helpers read `UrlStore` directly, not the context.
- **Auth** (`src/utils/general.utils.ts`): `fromPayload()` signs a kind `27235` (NIP-98) event with tags
  `u` (relay **base** URL, intentionally, not the full endpoint URL), `method: POST`, and `payload` (sha256
  of the JSON body), then base64-encodes it for `Authorization: Nostr <base64>`.
- **RPC** (`src/utils/api.utils.ts`): `makeReq({ method, params })` POSTs to the management URL;
  `handleResponse<T>()` returns `Nip86Response<T>` = `{ result, error: null } | { result: null, error }`.
- **Features**: one folder per page in `src/components/<Feature>/`, with `<Feature>.tsx` for UI and
  `api.ts` for calls. API function names match the NIP-86 method names (`allowPubkey` → `allowpubkey`).

| Route      | Component  | Methods                                                                       |
| ---------- | ---------- | ----------------------------------------------------------------------------- |
| `/`        | `Metadata` | NIP-11 info doc (GET base URL), `supportedmethods`, `changerelay{name,description,icon}` |
| `/events`  | `Events`   | `listbannedevents`, `banevent`, `allowevent`                                  |
| `/pubkeys` | `Pubkeys`  | whitelist/blacklist modes: `listallowedpubkeys`, `listbannedpubkeys`, `allowpubkey`, `banpubkey` |
| `/ips`     | `IPs`      | `listblockedips`, `blockip`, `unblockip`                                      |
| `/kinds`   | `Kinds`    | `listallowedkinds`, `allowkind`, `disallowkind`                               |
| `/blossom` | `Blossom`  | Blossom HTTP API (not NIP-86): `PUT /upload`, `GET /list/<pubkey>`, `DELETE /<sha256>` |

Blossom uses kind `24242` auth events (`src/utils/blossom.utils.ts`) and assumes the Blossom server lives
at the **same base URL** as the relay.

## Adding a NIP-86 method

1. Add a function to the feature's `api.ts`: build `{ method, params }`, `await makeReq(payload)`, return
   `handleResponse<T>(res)`.
2. In the component, check `response.error !== null`, show it with `<Errors errors={[...]} />`
   (`src/components/Errors/Errors.tsx`), otherwise update local state.
3. Tick the method off in `README.md`.

## Conventions

- Biome: tabs, single quotes, recommended rules (`noStaticOnlyClass` / `noThisInStatic` are off for `UrlStore`).
- TypeScript strict with `noUnusedLocals` / `noUnusedParameters`.
- Styling: Milligram + `src/App.css`; keep it minimal and mobile-friendly.
- Pubkeys are entered as `npub` and converted to hex with `npubToHex()` before sending.
- Commits are conventional with a feature scope, e.g. `feat(ips): ...`, `chore(blossom): ...`,
  `fix(metadata): ...`.

## Known issues (unfixed as of 2026-10)

- `Pubkeys.tsx` blacklist mode: removing an entry calls `allowPubkey(hex)`, but `allowPubkey` runs
  `npubToHex()` and throws on hex input. Adding a ban sends the raw npub (not hex), and the button is labelled
  "Whitelist npub".
- `getPayloadSha256(file)` hashes `JSON.stringify(file)` (`"{}"`), so the Blossom upload `x` tag is wrong.
  It should hash `await file.arrayBuffer()`.
- No guard when `window.nostr` is missing; requests go out with an invalid auth header.
- Removing a whitelisted pubkey calls `banpubkey`, since NIP-86 has no "unallow" method.
