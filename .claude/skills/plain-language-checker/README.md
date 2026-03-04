# Plain Language Checker

A Claude Code skill for reviewing documents against plain language principles.

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill reference - loaded when skill is invoked |
| `references/sec-plain-english-rules.md` | SEC Rule 421 plain English requirements |
| `references/sec-handbook-reference.md` | Complete principles with examples (EN/中文) |
| `examples/sample-review.md` | Example review output format |
| `evals/evals.json` | Test cases for validation |

## Usage

```bash
# Check a document for plain language issues
claude "Check this document for plain language issues" < document.md

# Review specific text
claude "Is this clear? 'The stock is bought by the investor'"
```

## Principles

Based on SEC's "A Plain English Handbook" (1998), adapted for universal application:

1. Active voice
2. Short sentences (15-20 words)
3. Personal pronouns
4. Concrete terms
5. Omit superfluous words
6. Write positively
7. Replace jargon
8. Natural word order
9. If-then conditionals
10. Parallel structure
11. Avoid "respectively"
12. Spell it out literally
13. Brevity above cleverness

## Testing

Run test cases from `evals/`:

```bash
node evals/run-tests.js
```

## Reference

- SEC "A Plain English Handbook" (1998): https://www.sec.gov/pdf/handbook.pdf
- 17 CFR § 230.421 (Rule 421)
