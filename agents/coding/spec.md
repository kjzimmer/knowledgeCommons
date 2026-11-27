---
id: coding
name: Coding agent
kind: app-team
status: later
summary: "Claude Code running without a person at the keyboard, working from change briefs that have passed the requirements agent. Opens changes for review; never merges or deploys."
parents: [P-02, P-03, P-11]
source: "Agent definitions 0.2, section 6.2"
---

## Purpose

Implements accepted requirements, bundled into change briefs that have passed the requirements agent.

## Does

- Implements the change and writes its tests.
- Opens the change for review, with the requirements it addresses.
- Logs what it did; its instructions and logs are public.

## Never

- Merges or deploys on its own.
- Changes requirements, the definition or the design principles.
- Handles keys, money, legal matters, bans or governance (people only, D27).

## Checked by

The code reviewer, on a different model where possible; automated tests on every change; a person approves the
merge and the deploy.

## Status

Specification only. Today, Claude Code works with Karl at the keyboard.
