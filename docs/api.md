# Get Started with Web3 API

The Get Started with Web3 API provides free, read-only access to the project's bilingual lesson index, glossary, search, and role-based learning paths.

## Deployment status

The API implementation is ready for Vercel Functions. The production URL below is the deployment target and must return `application/json` before the API is submitted to a public directory.

## Base URL

```text
https://get-started-with-web3.vercel.app/api/v1
```

Local development:

```bash
npm run ai:index
npm run api:dev
```

The local API starts at `http://127.0.0.1:3001/api/v1` by default. Set `PORT` to use another port.

## Contract

- Authentication: none
- Methods: `GET`, `OPTIONS`
- Content type: `application/json`
- CORS: `Access-Control-Allow-Origin: *`
- License: MIT
- Versioning: the `/api/v1` prefix remains stable for backward-compatible additions
- OpenAPI: `GET /api/v1/openapi.json`

## Endpoints

| Endpoint                                           | Purpose                             |
| -------------------------------------------------- | ----------------------------------- |
| `GET /api/v1`                                      | API metadata and discovery          |
| `GET /api/v1/manifest`                             | AI-native service manifest          |
| `GET /api/v1/lessons`                              | Paginated lesson metadata           |
| `GET /api/v1/lessons/{lang}/{moduleId}/{lessonId}` | One lesson's metadata and citations |
| `GET /api/v1/search`                               | Search lessons and glossary entries |
| `GET /api/v1/glossary`                             | Search or list glossary entries     |
| `GET /api/v1/learning-path`                        | Get a role-based learning path      |
| `GET /api/v1/openapi.json`                         | OpenAPI 3.1 document                |

## Examples

Search Chinese content:

```bash
curl "https://get-started-with-web3.vercel.app/api/v1/search?q=Bitcoin%20RPC&lang=zh&limit=5"
```

List English lessons in the first module:

```bash
curl "https://get-started-with-web3.vercel.app/api/v1/lessons?lang=en&moduleId=module-1&limit=10"
```

Read stable lesson metadata:

```bash
curl "https://get-started-with-web3.vercel.app/api/v1/lessons/en/module-1/1-1"
```

Look up a glossary term:

```bash
curl "https://get-started-with-web3.vercel.app/api/v1/glossary?q=Gas&limit=5"
```

Build a learner path:

```bash
curl "https://get-started-with-web3.vercel.app/api/v1/learning-path?role=builder&lang=zh"
```

Supported languages are `zh` and `en`. Supported roles are `beginner`, `builder`, `researcher`, and `investor`.

## Errors

Errors use a stable JSON envelope:

```json
{
  "error": {
    "code": "INVALID_QUERY",
    "message": "lang must be one of: zh, en"
  }
}
```

Client input errors return `400`, missing resources return `404`, unsupported methods return `405`, and unexpected server failures return `500`.

## Data and citations

The API is backed by the generated `ai/content-index.json` artifact. Lesson and glossary results retain GitHub and website citations so clients can link back to the source material. Regenerate the index after changing the course map, lesson content, glossary, or tool metadata:

```bash
npm run ai:index
npm run ai:publish
npm run ai:verify
```
