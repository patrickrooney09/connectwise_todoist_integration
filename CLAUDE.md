# ConnectWise Manage to Todoist Integration

## What This Is

A Cloud Run Service that receives ConnectWise Manage webhook callbacks and creates corresponding Todoist tasks. When a ticket is assigned to `Patrick` in ConnectWise, a task appears in Todoist automatically.

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Package manager:** npm
- **Hosting:** Google Cloud Run (Service, not Function)
- **Secrets:** Google Secret Manager (injected as env vars at runtime)

## Core Flow

1. ConnectWise fires a callback (POST) to the Cloud Run service
2. App validates the shared secret token
3. App fetches the full ticket from the CW REST API (`na.myconnectwise.net`) — callbacks only contain the entity ID, not the full data
4. App checks if the ticket is assigned to member `Patrick`
5. App looks up the board name in the routing config to determine the Todoist destination
6. App searches Todoist for an existing task (`CW #<ticketId>`) to prevent duplicates
7. If no duplicate found, creates the Todoist task

## Project Structure

Six modules:

- `config` — Routing map (board name → Todoist project/section) and constants. Pure data.
- `logger` — Lightweight structured JSON logger (`info`, `warn`, `error`). Outputs `severity` field for Cloud Logging. No external dependencies.
- `connectwise` — CW Manage API client. Auth via API keys + Client ID. Exposes `getTicket(ticketId)`.
- `todoist` — Todoist API client. Exposes `resolveProjectAndSectionIds()`, `searchTask()`, `createTask()`.
- `webhook` — Express route handler. Validates secret, orchestrates the full flow, delegates to other modules.
- `server` — Express app setup, middleware, startup tasks (Todoist ID resolution), port listener.

## Routing Config

Hardcoded in `config.ts`:

| ConnectWise Board | Todoist Project  | Todoist Section     |
|-------------------|------------------|---------------------|
| Parking           | Time Equipment   | Parking             |
| Service Desk      | Time Equipment   | Time + Attendance   |
| (unmapped)        | Inbox            | (none)              |

Todoist project/section names are resolved to IDs at startup. App logs an error if a name doesn't resolve.

## Todoist Task Format

- **Title:** `CW #12345 - Ticket Summary`
- **Description:** Company name, contact name, direct link to CW ticket
- **Priority:** Mapped 1:1 from CW priority (both use 1-4 scale)
- **Due date:** Pulled from CW ticket if present

## Authentication

- **ConnectWise:** API key pair (public + private) as Basic auth + `clientId` header
- **Todoist:** Personal API token as Bearer token
- **Webhook:** Shared secret token validated on every incoming request

### Environment Variables (from Secret Manager)

- `CW_COMPANY_ID`
- `CW_PUBLIC_KEY`
- `CW_PRIVATE_KEY`
- `CW_CLIENT_ID`
- `TODOIST_API_TOKEN`
- `WEBHOOK_SECRET`

## Callback Events

Registered for `added`, `updated`, and `deleted` on the `ticket` entity type. `deleted` is received and logged but not acted on in v1.

## Deduplication

Before creating a Todoist task, search for an existing task matching `CW #<ticketId>`. Skip if found. No database needed.

## Testing

Tests go on these modules (mock HTTP calls, test logic):

- `connectwise` — API URL construction, auth headers, ticket parsing, error handling
- `todoist` — Task creation payloads, search queries, ID resolution, error handling
- `webhook` — Secret validation, assignee filtering, board routing, deduplication, task creation

Do NOT test: `config` (pure data), `logger` (trivial wrapper), `server` (boilerplate).

## Not In v1

- Auto-completing Todoist tasks on CW status change (planned — trigger on "Work Completed" status)
- Handling ticket reassignment
- Multi-user support / OAuth
- Bidirectional sync
- UI/dashboard

## CW Status Pipeline (for future reference)

In Progress → Work Completed → Ready to Invoice → Closed

"Work Completed" is when the technician's job is typically done.

## PRD

Full PRD: https://github.com/patrickrooney09/connectwise_todoist_integration/issues/1
