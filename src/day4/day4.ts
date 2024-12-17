import * as fs from "node:fs";
import { resolve } from "node:path";

const filePath = resolve("./src/day4/day4-input.txt");
// const filePath = resolve("./src/day4/day4-sample.txt");

const input = fs.readFileSync(filePath, "utf-8").split("\n");

let totalWords = 0;

const isXmas = (word) => {
	if (word.toLowerCase() === "xmas") {
		return true;
	}
	return false;
};

const isXmasBoth = (word) => {
	if (
		isXmas(word) ||
		word.split("").toReversed().join("").toLowerCase() === "xmas"
	) {
		return true;
	}
	return false;
};

const horizontalFinder = (input) => {
	for (let rowIndex = 0; rowIndex < input.length; rowIndex++) {
		const row = input[rowIndex];
		for (let index = 0; index <= row.length; index++) {
			const possibleWord = [
				row[index],
				row[index + 1],
				row[index + 2],
				row[index + 3],
			].join("");

			if (possibleWord.length < 4) {
				continue;
			}

			if (isXmasBoth(possibleWord)) {
				totalWords++;
			}
		}
	}
};

const verticalFinder = (input) => {
	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x <= input[y].length; x++) {
			const possibleWord = [
				input[y]?.[x],
				input[y + 1]?.[x],
				input[y + 2]?.[x],
				input[y + 3]?.[x],
			].join("");

			if (possibleWord.length < 4) {
				continue;
			}

			if (isXmasBoth(possibleWord)) {
				totalWords++;
			}
		}
	}
};

const diagonalFinder = (input) => {
	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x <= input[y].length; x++) {
			const startLetter = input[y]?.[x]?.toLowerCase();
			if (startLetter !== "x" && startLetter !== "s") {
				continue;
			}

			const possibleWordDownRight = [
				input[y]?.[x],
				input[y + 1]?.[x + 1],
				input[y + 2]?.[x + 2],
				input[y + 3]?.[x + 3],
			].join("");

			if (isXmas(possibleWordDownRight)) {
				totalWords++;
			}

			const possibleDownLeft = [
				input[y]?.[x],
				input[y + 1]?.[x - 1],
				input[y + 2]?.[x - 2],
				input[y + 3]?.[x - 3],
			].join("");

			if (isXmas(possibleDownLeft)) {
				totalWords++;
			}

			const possibleWordUpRight = [
				input[y]?.[x],
				input[y - 1]?.[x + 1],
				input[y - 2]?.[x + 2],
				input[y - 3]?.[x + 3],
			].join("");

			if (isXmas(possibleWordUpRight)) {
				totalWords++;
			}

			const possibleWordUpLeft = [
				input[y]?.[x],
				input[y - 1]?.[x - 1],
				input[y - 2]?.[x - 2],
				input[y - 3]?.[x - 3],
			].join("");

			if (isXmas(possibleWordUpLeft)) {
				totalWords++;
			}
		}
	}
};

horizontalFinder(input);
verticalFinder(input);
diagonalFinder(input);

console.log("Day 4 - pt 1 (total words): ", totalWords);
