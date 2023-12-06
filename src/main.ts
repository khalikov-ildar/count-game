import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { definitions } from './definitions';
import { Score, Scores } from './types/scores.type';

const scores: Scores = JSON.parse(
	await readFile(path.resolve(process.argv[1], '..', 'score.json'), 'utf-8'),
);

const rl = readline.createInterface({ input, output });

// const start = await rl.question('To start the game enter "start"\n');

const finishGame = (): void => {
	let count = 0;
	for (const definition of definitions) {
		if (definition.isGuessed) count += 1;
	}
	const score: Score = {
		points: count,
		playedAt: Date.now().toLocaleString(),
	};
	scores.scores.push(score);
	if (!scores.highscore || scores.highscore.points < score.points) {
		scores.highscore = score;
	}
	console.log(
		`🎉 Congratulations, you've guessed ${count} keywords! Your highscore is ${scores.highscore.points}`,
	);
	writeFile(
		path.resolve(process.argv[1], '..', 'score.json'),
		JSON.stringify(scores),
		'utf-8',
	);
};

console.log('Type as many existing keywords in JavaScript within a 1 minute!');
setTimeout(() => {
	rl.close();
}, 1000 * 60);
rl.on('line', (input) => {
	for (const definition of definitions) {
		if (definition.name === input.toLowerCase()) {
			if (!definition.isGuessed) {
				definition.isGuessed = true;
				console.log('✅ This keyword is exists indeed!');
			} else {
				console.log("🟥 You've already guessed this keyword!");
			}
		}
	}
});

rl.on('close', finishGame);
