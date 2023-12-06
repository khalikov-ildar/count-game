import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { definitions } from './definitions';
import { Score, Scores } from './types/scores.type';
import { State } from './types/state.type';

const scores: Scores = JSON.parse(
	await readFile(path.resolve(process.argv[1], '..', 'score.json'), 'utf-8'),
);

const rl = readline.createInterface({ input, output });

console.log('Type as many existing keywords in JavaScript within a 1 minute!');

setTimeout(() => {
	rl.close();
}, 1000 * 60);

rl.on('line', (input) => {
	const state: State = {
		exists: false,
		definition: { name: '', isGuessed: false },
		index: 0,
	};

	for (const definition of definitions) {
		if (definition.name === input.toLowerCase()) {
			state.exists = true;
			state.definition = definition;
			state.index = definitions.indexOf(definition);
		}
	}

	if (state.exists === true) {
		if (state.definition.isGuessed) {
			console.log("🟥 You've already guessed this keyword!");
		} else {
			definitions[state.index].isGuessed = true;
			console.log('✅ This keyword is exists indeed!');
		}
	}
	if (state.exists === false) {
		console.log("🗨️ This word doesn't exist in definiton list!");
	}
});

const finishGame = async (): Promise<void> => {
	let count = 0;
	for (const definition of definitions) {
		if (definition.isGuessed) count += 1;
	}
	const score: Score = {
		points: count,
		playedAt: new Date().toTimeString(),
	};
	scores.scores.push(score);
	if (!scores.highscore || scores.highscore.points < score.points) {
		scores.highscore = score;
	}
	console.log(
		`🎉 Congratulations, you've guessed ${count} keywords! Your highscore is ${scores.highscore.points}\n`,
	);
	await writeFile(
		path.resolve(process.argv[1], '..', 'score.json'),
		JSON.stringify(scores),
		'utf-8',
	);
	process.exit(1);
};

rl.on('close', finishGame);
