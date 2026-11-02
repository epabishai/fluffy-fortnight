# Changelog Radar

A small, fixture-backed Node.js app that turns the GitHub changelog RSS feed into filterable cards with a short summary for each entry.

The demo reads from [`fixtures/feed.xml`](fixtures/feed.xml), so it works without a network connection.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm start
```

Open <http://localhost:3000>. Choose a topic to filter the cards. The API also supports `GET /api/entries?tag=Security`, and `GET /fixtures/feed.xml` serves the committed fixture.

Run the tests with `npm test` and JavaScript syntax checks with `npm run lint`.

## Run with Docker

Requires Docker with Compose.

```sh
docker compose up --build
```

Open <http://localhost:3000>. Stop the app with `Ctrl+C`, or run `docker compose down`.

## Presenter setup

Follow [the demo walkthrough](demo/demo.md) for the acts and pre-flight checklist.
Preview the eleven demo issues with `./scripts/seed-issues.sh --dry-run`, then run
`./scripts/seed-issues.sh` to create them in this checkout's GitHub repository
(requires authenticated `gh`). Existing issue titles are skipped, including closed
issues within the first 1,000 results. Issue numbers match the walkthrough only in
a new repository.

The parser remains callback-style for Act 2; dark mode and a Deprecations view
are not implemented.

The fixture includes synthetic community and deprecation entries. Title markup
is rendered as literal text, and fixture access stays restricted to `feed.xml`.
The security act verifies safeguards rather than introducing vulnerabilities.

## Project structure

- `server.js` serves the static app, `/api/entries`, and the committed fixture.
- `src/legacy/parseFeed.js` is a callback-style, regex-based RSS parser retained as a legacy example.
- `src/lib/tagFilter.js` provides tested, case-insensitive topic filtering.
- `public/` contains the browser app and styles.
- `fixtures/feed.xml` provides offline sample data.
- `test/` contains deterministic regression tests.
- `scripts/` provides syntax checking and repeatable demo issue setup.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidance.