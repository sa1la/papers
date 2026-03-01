---
name: plain-english-checker
description: Use when users want to review, edit, or improve documents for clarity, readability, and plain English standards. Use when user mentions plain English, readability, document review, writing improvement, jargon, passive voice, or asks to check if writing is clear and understandable.
---

# Plain English Checker

Review and improve documents using SEC's "A Plain English Handbook" principles.

## Overview

This skill analyzes documents against established plain English guidelines to create clearer, more understandable writing. It identifies common problems like jargon, passive voice, long sentences, and provides specific recommendations.

**Reference:** See @sec-handbook-reference.md for complete principle details and examples.

## When to Use

- Reviewing any document for clarity and readability
- Editing legal, financial, or technical documents for general audiences
- Converting complex documents into plain English
- Training writers on plain English principles
- Preparing disclosure documents, reports, or communications

## Quick Reference: The 11 Principles

| #   | Principle              | Quick Check                                   |
| --- | ---------------------- | --------------------------------------------- |
| 1   | Active voice           | Look for "is/are/was/were" + past verb + "by" |
| 2   | Short sentences        | Average 15-20 words; rarely over 30           |
| 3   | Personal pronouns      | Use "we/us/our" and "you/your"                |
| 4   | Concrete terms         | Replace abstractions with specific examples   |
| 5   | Omit superfluous words | "in order to" → "to", "prior to" → "before"   |
| 6   | Write positively       | "not able" → "unable", "not many" → "few"     |
| 7   | Replace jargon         | "terminate" → "end", "utilize" → "use"        |
| 8   | Natural word order     | Keep subject-verb-object together             |
| 9   | If-then conditionals   | One if → one then; tabulate multiples         |
| 10  | Parallel structure     | Lists use same grammatical form               |
| 11  | Avoid "respectively"   | State relationships explicitly                |

## Review Process

1. **First Pass - Overview**: Read without notes to understand general flow
2. **Second Pass - Analysis**: Identify issues using the checklist below
3. **Third Pass - Rewrite**: Apply plain English principles systematically

## Checklist for Plain English Review

### Sentence Structure

- [ ] Are most sentences in active voice?
- [ ] Are sentences generally under 20-25 words?
- [ ] Is the subject-verb-object order natural?
- [ ] Are lists and series parallel?

### Word Choice

- [ ] Are verbs strong and specific (not hidden in nouns)?
- [ ] Have superfluous words been removed?
- [ ] Is jargon explained or replaced with common words?
- [ ] Are personal pronouns used appropriately?
- [ ] Are concrete terms used instead of abstractions?
- [ ] Are negative constructions minimized?

### Organization

- [ ] Does the document start with the big picture?
- [ ] Are headers descriptive and informative?
- [ ] Is related information grouped together?
- [ ] Are bullet lists used for complex information?
- [ ] Are tables used for comparative data?

## How to Use This Skill

When the user asks you to check a document for plain English compliance:

1. **Read the document** provided by the user
2. **Identify specific issues** using the principles above
3. **Provide concrete examples** showing before/after rewrites
4. **Prioritize recommendations** by impact on readability
5. **Explain the reasoning** behind each suggestion

## Output Format

Structure your review as follows:

```
# Plain English Review: [Document Name]

## Summary
Brief overview of the document's readability and main issues identified.

## Key Findings

### 1. [Issue Category, e.g., "Passive Voice"]
**Location**: [Section/Paragraph]
**Original**: "[Quote the problematic text]"
**Issue**: [Explain the problem]
**Recommendation**: "[Provide the rewritten version]"

### 2. [Next Issue]
...

## General Recommendations
- [Bullet list of overarching suggestions]

## Positive Observations
- [Note what the document does well]
```

## Red Flags - STOP and Check

These thoughts indicate you're about to skip plain English principles:

| Red Flag                                                | Reality                                                         |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| "This is a formal document, it needs to sound official" | Formal ≠ unclear. Plain English works for legal/financial docs. |
| "The audience is sophisticated, they understand jargon" | Experts prefer clarity too. Jargon excludes and confuses.       |
| "Changing this might alter the legal meaning"           | Check with legal, but most legal language can be clearer.       |
| "This is just a style preference"                       | Plain English is backed by readability research, not opinion.   |
| "It's too time-consuming to rewrite everything"         | Focus on high-impact changes first (headings, key sentences).   |

## Common Rationalizations (And Why They're Wrong)

| Excuse                                     | Reality                                                          |
| ------------------------------------------ | ---------------------------------------------------------------- |
| "The original author is an expert"         | Expertise in content ≠ expertise in clear communication.         |
| "Industry standards require this language" | Industry standards evolve. Plain English IS becoming standard.   |
| "Short sentences sound choppy"             | Short sentences can flow well. Choppiness is a transition issue. |
| "Passive voice sounds more objective"      | Passive voice often hides who did what—reducing accountability.  |
| "We've always written it this way"         | "Always done this way" is not a defense of clarity.              |

## Important Notes

- **Don't create new boilerplate**: The goal is clearer communication, not a new template.
- **Context matters**: Some technical terms may be necessary for legal or regulatory reasons—explain them instead of eliminating them.
- **Audience awareness**: Consider who will read the document and adjust complexity accordingly.
- **Substance first**: Plain English enhances communication but doesn't replace accurate, complete information.

## Reference

Based on "A Plain English Handbook: How to Create Clear SEC Disclosure Documents" by the U.S. Securities and Exchange Commission (1998).
