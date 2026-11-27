# 0010: Artifact files in R2, read through the app

- **Status:** proposed. Cloudflare R2 was named in change brief 0.1 (section 7); the rest is for Karl's decision.
- **Date:** 2026-11-27
- **Drafted by:** Claude Code (claude-opus-5-5), change brief 0.1, stage 1
- **Decision:** not yet made (Karl decides)

## Question

Where are artifact files (full texts, PDFs, transcripts; later recordings) kept, and how does access follow each
artifact's rights status?

## Context

Today the only full text the commons holds is its own definition, stored in the repository. The scout will acquire
open works (PDFs, often several megabytes), which do not belong in git. Rights statuses (`map/standards.yaml`):
own work, open licence and public domain may be read by anyone; permission granted follows the recorded terms
(default: readable by Holon and the agents, not downloadable); everything else has no file. The store must stay
portable (P-01). The bucket and how its credentials reach Railway are Karl's to set (brief section 0: Railway
variables on `livingSystems`, answers A1).

## Options

For the store:

| Option | For | Against |
|---|---|---|
| **A. Cloudflare R2** through its S3-compatible interface | No charge for data leaving the store; S3 interface means any S3-compatible store (Backblaze B2, MinIO, AWS S3) can replace it without code changes | A second provider account |
| B. AWS S3 | The reference S3 | Egress charges; nothing it adds is needed |
| C. A Railway volume | Same host | Tied to one host; awkward to back up or export; no direct public access |
| D. Git LFS in the repository | Files travel with the clone | Storage and bandwidth limits; copyrighted files with permission must not be public, and a public repository cannot hold them |

For access:

| Option | For | Against |
|---|---|---|
| **1. A private bucket; files read through the app**, which checks the rights status before streaming the file or issuing a short-lived signed link | The rights rule lives in one place (the app), next to the artifact record; nothing in the bucket is public by mistake | Every read goes through the app (fine at this scale) |
| 2. Two buckets: a public one for open works, a private one for the rest | Open files served without the app | Two places where rights are enforced; a wrong move exposes a permission-granted file |

## Recommendation

**A with 1.** Layout in the bucket: `artifacts/<artifact-id>/<file>` and `exports/<date>/…`. The artifact's
metadata in the repository names its file (`file: artifacts/<id>/<name>`, with size and checksum). Variables on
`livingSystems`: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` (set by Karl; never in
the repository). The content check fails when an artifact whose rights allow no full text names a file.

## Consequences

- New dependency in stage 2: an S3 client (`@aws-sdk/client-s3`, Node 20 compatible), in `dependencies`.
- The full export (decision 0007) includes every file the rights allow; permission-granted files are included only
  where their terms allow redistribution.
- The definition's full text can stay in the repository (own work), or move to R2 with the rest; recommended: stay,
  since it is part of the commons' own record.

## Traces to

P-01, P-02.
