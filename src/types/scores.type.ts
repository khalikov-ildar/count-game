export type Score = {
	points: number;
	playedAt: string;
};

export type Scores = {
	highscore: Score | null;
	scores: Score[];
};
