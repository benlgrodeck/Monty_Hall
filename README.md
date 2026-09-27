# Monty Hall — Switch or stay?

An interactive, mobile-friendly Monty Hall game. Players pick a door, watch the host reveal a goat, then switch or stay. Separate records show wins, rounds played, and winning percentage for each strategy.

## Play locally

Open `index.html` in a browser. For reliable browser storage, serve this folder with `python3 -m http.server 8000` and visit http://localhost:8000.

No installation, build process, API keys, or external dependencies are required.

## Put it on GitHub Pages

1. Create a GitHub repository (for example, `monty-hall`).
2. Upload this folder's **contents** to the repository's root. `index.html`, `style.css`, `game.js`, and `app.js` must be together. Do not upload just the ZIP file.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/(root)**, then save.
6. Once deployment finishes, use the website link displayed on the Pages settings screen.

[Official GitHub Pages instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## What is recorded?

Only completed rounds count. Each strategy's rate is its wins divided by its completed rounds. Before a strategy has been tried, its rate is shown as a dash, not 0%.

Results persist in localStorage in the player's browser. They are not sent to a server, shared between devices, or aggregated across a class. Students sharing a browser profile share its record; use **Reset results** between players. Private browsing, clearing site data, or changing the site's origin may clear or separate records. When storage is unavailable, the game still works for the current page session.

Reloading abandons the unfinished round without counting it. Resetting clears both records and starts a fresh round, after an in-page confirmation.

## Rules and probability

The car is randomly assigned to one of three doors. The host always opens an unchosen goat door, choosing randomly if both are available, and always offers a switch. Staying wins if the initial pick was correct (1/3); switching wins if it was incorrect (2/3). Observed rates fluctuate, especially in small samples.

The explanation is in a collapsed panel so students can experiment before reading the answer. Emoji appearance varies by device; accessible door labels include the prize as text.

## Files and verification

- `index.html`: page structure
- `style.css`: responsive styling
- `game.js`: game rules
- `app.js`: interactions and browser storage
- `game.test.cjs`: exhaustive rule checks; run `node game.test.cjs`

The rule checks cover all car/first-pick combinations, both possible host tie-breaks, invalid inputs, and duplicate completion prevention. Browser checks covered both strategy records, keyboard play, and persistence after reload.
