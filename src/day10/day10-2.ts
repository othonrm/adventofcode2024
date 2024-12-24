import * as fs from "node:fs";
import { resolve } from "node:path";
import { getFilePath } from "../utils/console";

const exerciseDay = 10;

const inputFile = resolve(getFilePath(exerciseDay, "input"));
const sampleFile = resolve(getFilePath(exerciseDay, "sample"));

const run = async (fileName) => {
	const topoMap: string[][] = fs
		.readFileSync(fileName, "utf-8")
		.split("\n")
		.map((row) => row.split(""));

	if (!fileName.includes("input")) {
		console.log(topoMap);
	}

	let score = 0;

	const summitPerTrailhead = new Map<
		`${number},${number}`,
		Set<`${number},${number}`>
	>();

	const trailsPerTrailhead = new Map<`${number},${number}`, Set<string>>();

	for (let y = 0; y < topoMap.length; y++) {
		for (let x = 0; x < topoMap[y].length; x++) {
			if (topoMap[y][x] === "0") {
				const currentTrailhead: `${number},${number}` = `${y},${x}`;

				if (!fileName.includes("input")) {
					console.log("TRAIL HEAD AT: ", currentTrailhead);
				}

				const walkDownPath = (
					currentPos: [number, number],
					breadcrumbs: string,
				) => {
					const currentPath = `${breadcrumbs}-${currentPos[0]},${currentPos[1]}`;
					const currentPosHeight = Number.parseInt(
						topoMap[currentPos[0]]?.[currentPos[1]],
					);

					const top = Number.parseInt(
						topoMap[currentPos[0] - 1]?.[currentPos[1]],
					);
					const bottom = Number.parseInt(
						topoMap[currentPos[0] + 1]?.[currentPos[1]],
					);
					const left = Number.parseInt(
						topoMap[currentPos[0]]?.[currentPos[1] - 1],
					);
					const right = Number.parseInt(
						topoMap[currentPos[0]]?.[currentPos[1] + 1],
					);

					const noValidPaths =
						(!top || top !== currentPosHeight + 1) &&
						(!bottom || bottom !== currentPosHeight + 1) &&
						(!left || left !== currentPosHeight + 1) &&
						(!right || right !== currentPosHeight + 1);

					const hasTop = top && top === currentPosHeight + 1;
					const hasBottom = bottom && bottom === currentPosHeight + 1;
					const hasLeft = left && left === currentPosHeight + 1;
					const hasRight = right && right === currentPosHeight + 1;

					if (hasTop) {
						walkDownPath([currentPos[0] - 1, currentPos[1]], currentPath);
					}
					if (hasBottom) {
						walkDownPath([currentPos[0] + 1, currentPos[1]], currentPath);
					}
					if (hasLeft) {
						walkDownPath([currentPos[0], currentPos[1] - 1], currentPath);
					}
					if (hasRight) {
						walkDownPath([currentPos[0], currentPos[1] + 1], currentPath);
					}

					if (currentPosHeight === 9) {
						// const existingScoresForTrailHead: Set<`${number},${number}`> =
						// 	summitPerTrailhead.get(currentTrailhead) || new Set();

						// existingScoresForTrailHead.add(`${currentPos[0]},${currentPos[1]}`);

						// summitPerTrailhead.set(
						// 	currentTrailhead,
						// 	existingScoresForTrailHead,
						// );
						const existingScoresForTrailHead: Set<string> =
							trailsPerTrailhead.get(currentTrailhead) || new Set();

						existingScoresForTrailHead.add(currentPath);

						trailsPerTrailhead.set(
							currentTrailhead,
							existingScoresForTrailHead,
						);
						// console.log("NINE!");
					}

					if (noValidPaths) {
						// console.log("DEAD END: ", iteration);
						// console.log("top: ", top);
						// console.log("bottom: ", bottom);
						// console.log("left: ", left);
						// console.log("right: ", right);
						// break;
					}
				};

				const currentPos: [number, number] = [y, x];
				walkDownPath(currentPos, "");
			}
		}
	}

	if (!fileName.includes("input")) {
		console.log(topoMap.map((row) => row.join("")).join("\n"));

		// console.log(summitPerTrailhead);
		console.log(trailsPerTrailhead);
	}

	Array.from(trailsPerTrailhead.values()).map((r) => {
		score += r.size;
	});

	return score;

	// const expandedDisk: string[] = JSON.parse(JSON.stringify(diskIdentifiers));
};

(async () => {
	console.log(
		"Day 10 - pt 1 (hiking trails at the lava production facility): ",
	);

	console.time("execution time for sample file");
	const sampleResult = await run(sampleFile);
	console.timeEnd("execution time for sample file");
	console.log("sample: ", sampleResult);

	console.time("execution time for input file");
	const inputResult = await run(inputFile);
	console.timeEnd("execution time for input file");
	console.log("input: ", inputResult);

	// Part 1
	if (sampleResult !== 81) {
		console.log("SOMETHING IS WRONG");
	}
})().then(() => process.exit());

//
