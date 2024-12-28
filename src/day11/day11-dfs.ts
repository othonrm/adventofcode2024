import * as fs from "node:fs";
import { resolve } from "node:path";
import { clearConsole, getFilePath } from "../utils/console";

const exerciseDay = 11;

const run = async (fileName) => {
	const stones: number[] = fs
		.readFileSync(fileName, "utf-8")
		.split(" ")
		.map((stone) => Number.parseInt(stone));

	if (!fileName.includes("input")) {
		console.log(stones);
	}

	const blinks = 75;

	let stoneCount = 0;
	let cacheHit = 0;
	let calls = 0;

	const recursiveResultAtStepMap = new Map<`${number},${number}`, number>();

	const blink = (stone: number, iteration: number) => {
		calls++;
		const stoneInscription = stone.toString();

		if (fileName.includes("input")) {
			clearConsole();
			console.log(`
blinks: ${iteration + 1}/${blinks}
current stone inscription: ${stone}
stone count: ${stoneCount}
cache hit: ${cacheHit}/${calls} (${((cacheHit / calls) * 100).toFixed(0)}%)
				`);
		}

		if (iteration >= blinks) {
			return 1;
		}

		if (stone === 0) {
			if (recursiveResultAtStepMap.has(`${1},${iteration + 1}`)) {
				cacheHit++;
				return recursiveResultAtStepMap.get(`${1},${iteration + 1}`);
			}
			const result = blink(1, iteration + 1);
			recursiveResultAtStepMap.set(`${1},${iteration + 1}`, result);
			return result;
		}
		if (stoneInscription.length > 1 && stoneInscription.length % 2 === 0) {
			const firstHalf = stoneInscription.slice(0, stoneInscription.length / 2);
			const secondHalf = stoneInscription.slice(stoneInscription.length / 2);

			if (
				recursiveResultAtStepMap.has(
					`${Number.parseInt(firstHalf)},${iteration + 1}`,
				)
			) {
				cacheHit++;
			}
			if (
				recursiveResultAtStepMap.has(
					`${Number.parseInt(secondHalf)},${iteration + 1}`,
				)
			) {
				cacheHit++;
			}

			const firstHalfResult = recursiveResultAtStepMap.has(
				`${Number.parseInt(firstHalf)},${iteration + 1}`,
			)
				? recursiveResultAtStepMap.get(
						`${Number.parseInt(firstHalf)},${iteration + 1}`,
					)
				: blink(Number.parseInt(firstHalf), iteration + 1);

			const secondHalfResult = recursiveResultAtStepMap.has(
				`${Number.parseInt(secondHalf)},${iteration + 1}`,
			)
				? recursiveResultAtStepMap.get(
						`${Number.parseInt(secondHalf)},${iteration + 1}`,
					)
				: blink(Number.parseInt(secondHalf), iteration + 1);

			recursiveResultAtStepMap.set(
				`${Number.parseInt(firstHalf)},${iteration + 1}`,
				firstHalfResult,
			);
			recursiveResultAtStepMap.set(
				`${Number.parseInt(secondHalf)},${iteration + 1}`,
				secondHalfResult,
			);
			return firstHalfResult + secondHalfResult;
		}

		if (recursiveResultAtStepMap.has(`${stone * 2024},${iteration + 1}`)) {
			cacheHit++;
			return recursiveResultAtStepMap.get(`${stone * 2024},${iteration + 1}`);
		}
		const fallbackCaseResult = blink(stone * 2024, iteration + 1);
		recursiveResultAtStepMap.set(
			`${stone * 2024},${iteration + 1}`,
			fallbackCaseResult,
		);
		return fallbackCaseResult;
	};

	for (const [stoneIndex, stone] of stones.entries()) {
		console.log("started for:", stoneIndex, stones[stoneIndex]);
		stoneCount += blink(stone, 0);
	}

	if (!fileName.includes("input") && blinks <= 6) {
		console.log(stones.join(" "));
	}

	console.log("Resulting amount of stones: ", stoneCount);

	return stoneCount;
};

(async () => {
	console.log("Day 11 - pt 1 (plutonian magic pebbles): ");

	const sampleFile = resolve(getFilePath(exerciseDay, "sample"));
	console.time("execution time for sample file");
	const sampleResult = await run(sampleFile);
	console.timeEnd("execution time for sample file");
	console.log("sample: ", sampleResult);

	const inputFile = resolve(getFilePath(exerciseDay, "input"));
	console.time("execution time for input file");
	const inputResult = await run(inputFile);
	console.timeEnd("execution time for input file");

	// Part 1
	if (sampleResult !== 55312) {
		console.log("SOMETHING IS WRONG");
	}
})().then(() => process.exit());

//
