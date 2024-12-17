import * as fs from "node:fs";
import { resolve } from "node:path";

const inputFile = resolve("./src/day6/day6-input.txt");
const sampleFile = resolve("./src/day6/day6-sample.txt");

const keypress = async () => {
	process.stdin.setRawMode(true);
	return new Promise<void>((resolve) =>
		process.stdin.once("data", () => {
			process.stdin.setRawMode(false);
			resolve();
		}),
	);
};

const clearConsole = () => {
	console.log("\x1b[2J");
};

const printMapArray = (map) => {
	console.log(map.map((row) => row.join("")).join("\n"));
};

const run = async (fileName) => {
	const map: string[][] = fs
		.readFileSync(fileName, "utf-8")
		.split("\n")
		.map((row) => row.split(""));
	const visitedPositions = new Set();

	let currentX = 0;
	let currentY = 0;

	map.forEach((row, y) => {
		const x = row.findIndex((s) => s === "^");
		if (x !== -1) {
			currentX = x;
			currentY = y;
		}
	});

	let direction = [0, -1];

	visitedPositions.add(`${currentX}, ${currentY}`);
	map[currentY][currentX] = "X";

	do {
		currentX += direction[0];
		currentY += direction[1];
		visitedPositions.add(`${currentX}, ${currentY}`);
		map[currentY][currentX] = "X";

		if (fileName.includes("sample")) {
			clearConsole();
			printMapArray(map);
			await keypress();
		}

		const nextCell = map[currentY + direction[1]]?.[currentX + direction[0]];

		if (nextCell === "#") {
			if (direction[0] === 0 && direction[1] === -1) {
				direction = [1, 0];
			} else if (direction[0] === 1 && direction[1] === 0) {
				direction = [0, 1];
			} else if (direction[0] === 0 && direction[1] === 1) {
				direction = [-1, 0];
			} else if (direction[0] === -1 && direction[1] === 0) {
				direction = [0, -1];
			}
		}
	} while (
		currentX < map[0].length - 1 &&
		currentY < map.length - 1 &&
		currentX > 0 &&
		currentY > 0
	);

	return visitedPositions.size;
};

(async () => {
	console.log("Day 6 - pt 1 (guard's route): ");

	const sampleResult = await run(sampleFile);

	console.log("sample: ", sampleResult);
	console.time("execution time for input file");
	console.log("input: ", await run(inputFile));
	console.timeEnd("execution time for input file");

	// if (sampleResult !== 41) {
	// 	console.log("SOMETHING IS WRONG");
	// }
})().then(() => process.exit());
