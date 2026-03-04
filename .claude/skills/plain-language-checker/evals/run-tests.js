#!/usr/bin/env node
/**
 * Test runner for plain-language-checker skill
 * Validates that skill produces expected output for test cases
 */

const fs = require('fs');
const path = require('path');

const EVALS_FILE = path.join(__dirname, 'evals.json');

function loadEvals() {
	const content = fs.readFileSync(EVALS_FILE, 'utf-8');
	return JSON.parse(content);
}

function runTest(testCase) {
	console.log(`\n${'='.repeat(60)}`);
	console.log(`Test #${testCase.id}: ${testCase.eval_name}`);
	console.log('='.repeat(60));
	console.log(`\nPrompt: ${testCase.prompt}`);
	console.log(`\nExpected: ${testCase.expected_output}`);
	console.log('\n---');
	console.log('Status: MANUAL VERIFICATION REQUIRED');
	console.log('Run: claude "Check this for plain language" with the prompt above');
	console.log('---');
}

function main() {
	console.log('Plain Language Checker - Test Runner');
	console.log('====================================');

	const evals = loadEvals();
	console.log(`\nLoaded ${evals.evals.length} test cases from ${EVALS_FILE}`);
	console.log(`Skill: ${evals.skill_name}`);

	for (const testCase of evals.evals) {
		runTest(testCase);
	}

	console.log('\n' + '='.repeat(60));
	console.log('All test cases displayed.');
	console.log('Note: Automated validation requires integration with Claude API.');
	console.log('='.repeat(60));
}

main();
