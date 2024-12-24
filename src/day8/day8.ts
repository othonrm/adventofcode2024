import * as fs from "node:fs";
import { resolve } from "node:path";

const inputFile = resolve("./src/day8/day8-input.txt");
const sampleFile = resolve("./src/day8/day8-sample.txt");

const clearConsole = () => {
	console.log("\x1b[2J");
};

const run = (fileName) => {
	const map: string[][] = fs
		.readFileSync(fileName, "utf-8")
		.split("\n")
		.map((row) => row.split(""));

	const antennas = new Set<`${number},${number}`>();

	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (map[y][x] !== ".") {
				antennas.add(`${y},${x}`);
			}
		}
	}

	const antinodes = new Set<`${number},${number}`>();

	const checkAndMarkAntinode = (y, x) => {
		const spot = map[y]?.[x];
		if (spot) {
			antinodes.add(`${y},${x}`);
		}
		if (spot === ".") {
			map[y][x] = "#";
		}
	};

	for (const antennaPosString of antennas) {
		const antennaPos = antennaPosString
			.split(",")
			.map((coordinate) => Number.parseInt(coordinate));
		const antennaType = map[antennaPos[0]][antennaPos[1]];

		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				const possibleAlignedAntennaPos = `${y},${x}`;
				if (
					map[y][x] === antennaType &&
					antennaPosString !== possibleAlignedAntennaPos
				) {
					const yAxisDiff = Math.abs(y - antennaPos[0]);
					const xAxisDiff = Math.abs(x - antennaPos[1]);

					if (y < antennaPos[0] && x < antennaPos[1]) {
						checkAndMarkAntinode(y - yAxisDiff, x - xAxisDiff);
					} else if (y > antennaPos[0] && x > antennaPos[1]) {
						checkAndMarkAntinode(y + yAxisDiff, x + xAxisDiff);
					} else if (y < antennaPos[0] && x > antennaPos[1]) {
						checkAndMarkAntinode(y - yAxisDiff, x + xAxisDiff);
					} else if (y > antennaPos[0] && x < antennaPos[1]) {
						checkAndMarkAntinode(y + yAxisDiff, x - xAxisDiff);
					}
				}
			}
		}
	}

	// clearConsole();
	console.log(map.map((row) => row.join("")).join("\n"));

	return antinodes.size;
};

(async () => {
	console.log("Day 8 - pt 1 (antenna antinode locations): ");

	console.time("execution time for sample file");
	const sampleResult = run(sampleFile);
	console.timeEnd("execution time for sample file");
	console.log("sample: ", sampleResult);

	console.time("execution time for input file");
	const inputResult = run(inputFile);
	console.timeEnd("execution time for input file");
	console.log("input: ", inputResult);

	// Part 1
	if (sampleResult !== 14) {
		console.log("SOMETHING IS WRONG");
	}
})().then(() => process.exit());
