# L3: agents in the app

What the app does for and around every agent (change brief 0.1, section 8; agent definitions 0.2, sections 1 and 8).
Each agent's own behaviour is in its specification, `agents/<name>/spec.md`. Ids `CAP-AGT-NNN`.

### CAP-AGT-001 · Every call logged

```yaml
statement: The system shall record for every model call its agent role, provider, model, instruction version, tokens and cost.
rationale: Transparency, reproducibility and the budget all depend on it. Built in the concept demo (ModelCall).
parents: [P-02, P-05]
verification: [T-AGT-001]
phase: now
status: verified
origin: brief v0.2; change brief 0.1, section 8
decisions: ["0009"]
```

### CAP-AGT-002 · Structured output validated

```yaml
statement: The system shall validate every agent's structured output against its schema before storing anything from it.
rationale: Model output is never trusted; validation in code keeps agents replaceable (agent definitions 0.2, section 8).
parents: [P-05, P-08]
verification: [T-AGT-002]
phase: now
status: proposed
origin: change brief 0.1, section 8
decisions: []
```

### CAP-AGT-003 · Invalid output rejected

```yaml
statement: If an agent's output fails validation, then the system shall store nothing from it and log the failure.
rationale: A malformed reading must never reach a page.
parents: [P-08]
verification: [T-AGT-002]
phase: now
status: proposed
origin: change brief 0.1, section 8
decisions: []
```

### CAP-AGT-004 · Auditor model differs

```yaml
statement: The system shall run the auditor on a model different from the model that produced the work it checks.
rationale: No agent checks its own work; the auditor's model is set per kind of work (answers to change brief 0.1, C).
parents: [P-03, P-05]
verification: [T-AGT-004]
phase: now
status: proposed
origin: answers to change brief 0.1, C
decisions: ["0009"]
```

### CAP-AGT-005 · Challenger model differs

```yaml
statement: The system shall run the challenger on a model different from the curator's.
rationale: "Agent definitions 0.2, section 1: checks across models."
parents: [P-03, P-05]
verification: [T-AGT-004]
phase: now
status: proposed
origin: change brief 0.1, section 8
decisions: ["0009"]
```

### CAP-AGT-006 · Model separation stated

```yaml
statement: The system shall state on the Agents page which model each agent uses for each kind of work, and that these are different Claude models rather than different providers.
rationale: "Change brief 0.1, section 8: honest labels until a second provider is added."
parents: [P-02, P-04]
verification: [T-AGT-006]
phase: now
status: verified
origin: change brief 0.1, section 8
decisions: []
```

### CAP-AGT-007 · AI-made label

```yaml
statement: The system shall label every item an agent produced as AI-made, permanently.
rationale: Agent definitions 0.2, section 2.
parents: [P-04]
verification: [T-AGT-007]
phase: now
status: proposed
origin: change brief 0.1, section 16 (definition of done)
decisions: []
```

### CAP-AGT-008 · Retrieved text is data

```yaml
statement: The system shall pass text retrieved from the commons or from posts to every agent marked as data, separate from its instructions.
rationale: Retrieved text is data, never instructions (agent definitions 0.2, section 7.3); a post must not be able to steer an agent.
parents: [P-03, P-06]
verification: [T-AGT-008]
phase: now
status: proposed
origin: agent definitions 0.2, sections 7.3 and 8
decisions: []
```

### CAP-AGT-009 · Agents published

```yaml
statement: The system shall publish every agent's specification, instructions, settings, test set, test results and change history on its agent page.
rationale: Every agent's instructions are public; app-team agents are specified before they run.
parents: [P-02]
verification: [T-AGT-009]
phase: now
status: verified
origin: change brief 0.1, section 4
decisions: []
```

### CAP-AGT-010 · Agent test harness

```yaml
statement: The system shall run each agent's test set on request and record per case the result, the model, the instruction version and the cost.
rationale: Change brief 0.1, section 14; results committed to agents/<name>/tested-on.yaml.
parents: [P-02, P-05, P-11]
verification: [T-AGT-010]
phase: now
status: proposed
origin: change brief 0.1, section 14
decisions: []
```
