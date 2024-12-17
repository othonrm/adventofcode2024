import * as fs from "node:fs";
import { resolve } from "node:path";

const inputFile = resolve("./src/day6/day6-input.txt");
const sampleFile = resolve("./src/day6/day6-sample.txt");

const clearConsole = () => {
	console.log("\x1b[2J");
};

const run = (fileName) => {
	const map: string[][] = fs
		.readFileSync(fileName, "utf-8")
		.split("\n")
		.map((row) => row.split(""));

	const isStuckInLoop = (targetMap) => {
		const visitedCell = new Set<string>();

		let currentIteration = 0;

		let currentX = 0;
		let currentY = 0;

		targetMap.forEach((row, y) => {
			const x = row.findIndex((s) => s === "^");
			if (x !== -1) {
				currentX = x;
				currentY = y;
			}
		});

		let direction = [0, -1];
		targetMap[currentY][currentX] = "X";

		do {
			if (
				visitedCell.has(
					[currentX, currentY, direction[0], direction[1]].join(","),
				)
			) {
				return true;
			}

			visitedCell.add(
				[currentX, currentY, direction[0], direction[1]].join(","),
			);

			currentIteration++;

			currentX = currentX + direction[0];
			currentY = currentY + direction[1];

			targetMap[currentY][currentX] = "X";

			const nextCell =
				targetMap[currentY + direction[1]]?.[currentX + direction[0]];

			if (nextCell === undefined) {
				break;
			}

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

			// This was the key, gotta turn twice if it's a dead end
			if (
				targetMap[currentY + direction[1]]?.[currentX + direction[0]] === "#"
			) {
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

		return false;
	};

	let loopPossibilities = 0;

	for (let row = 0; row < map.length; row++) {
		for (let column = 0; column < map[row].length; column++) {
			const newMap = JSON.parse(JSON.stringify(map));
			if (newMap[row][column] === "#" || newMap[row][column] === "^") {
				continue;
			}
			newMap[row][column] = "#";
			clearConsole();
			console.log(`
				fileName: ${fileName.slice(fileName.lastIndexOf("/") + 1)}
				loopPossibilities: ${loopPossibilities}
				${row}/${map.length - 1} - ${column}/${map[row].length - 1}
				`);
			const createsLoop = isStuckInLoop(newMap);
			if (createsLoop) {
				loopPossibilities++;
			}
		}
	}

	return loopPossibilities;
};

(async () => {
	console.log("Day 6 - pt 1 (guard's route): ");

	console.time("execution time for sample file");
	const sampleResult = run(sampleFile);
	console.timeEnd("execution time for sample file");
	console.log("sample: ", sampleResult);

	console.time("execution time for input file");
	const inputResult = run(inputFile);
	console.timeEnd("execution time for input file");
	console.log("input: ", inputResult);

	if (sampleResult !== 6) {
		console.log("SOMETHING IS WRONG");
	}
})().then(() => process.exit());

// 2037 - wrong (too high)
// 2036 - wrong
// 2361 - ????
// 2036 - wrong
// 2035 - wrong
// 2218 - wrong (no more hints - 15 minutes wait)
// 2012 - wrong (somebody else's solution) aaaaaaaaargh
// 1796 - wrong
// 2038 - wrong
// 2039 - wrong
