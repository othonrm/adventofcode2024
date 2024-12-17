import * as fs from "node:fs";
import { resolve } from "node:path";

const filePath = resolve(".src/day4/day4-input.txt");
// const filePath = resolve("./src/day4/day4-sample.txt");

const input = fs.readFileSync(filePath, "utf-8").split("\n");

let totalWords = 0;

const isMas = (...letters) => {
	const word = letters.join("");
	if (word.toLowerCase() === "mas") {
		return true;
	}
	return false;
};

const isMasBoth = (...letters) => {
	const word = letters.join("");
	if (
		isMas(...letters) ||
		word.split("").toReversed().join("").toLowerCase() === "mas"
	) {
		return true;
	}
	return false;
};

const xMasFinder = (input) => {
	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x <= input[y].length; x++) {
			const startLetter = input[y]?.[x]?.toLowerCase();
			if (startLetter !== "m" && startLetter !== "s") {
				continue;
			}

			const hasFirstMas = isMasBoth(
				input[y]?.[x],
				input[y + 1]?.[x + 1],
				input[y + 2]?.[x + 2],
			);
			const hasSecondMas = isMasBoth(
				input[y]?.[x + 2],
				input[y + 1]?.[x + 1],
				input[y + 2]?.[x],
			);

			if (hasFirstMas && hasSecondMas) {
				totalWords++;
			}
		}
	}
};

xMasFinder(input);

console.log("Day 4 - pt 2 (total x-mas): ", totalWords);
