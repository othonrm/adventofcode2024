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

	const blinks = 25;

	const finalStonesPerInitial = new Map<string, number>();

	for (let blinkIndex = 0; blinkIndex < blinks; blinkIndex++) {
		for (let stoneIndex = 0; stoneIndex < stones.length; stoneIndex++) {
			const stone = stones[stoneIndex];
			const stoneInscription = stone.toString();

			if (stone === 0) {
				stones[stoneIndex] = 1;
			} else if (
				stoneInscription.length > 1 &&
				stoneInscription.length % 2 === 0
			) {
				const firstHalf = Number.parseInt(
					stoneInscription.slice(0, stoneInscription.length / 2),
				);
				const secondHalf = Number.parseInt(
					stoneInscription.slice(stoneInscription.length / 2),
				);
				if (!fileName.includes("input")) {
					// console.log(stoneInscription, firstHalf, secondHalf);
				}
				stones.splice(stoneIndex, 1, ...[firstHalf, secondHalf]);
				stoneIndex++;
			} else {
				stones[stoneIndex] = stone * 2024;
			}

			// 			if (fileName.includes("input")) {
			// 				clearConsole();
			// 				console.log(`
			// 					stones: ${stones.join(" ")}
			// blink: ${blinkIndex + 1}/${blinks}
			// stone: ${stoneIndex}/${stones.length}
			// 					`);
			// 			}
		}
	}

	if (!fileName.includes("input") && blinks <= 6) {
		console.log(stones.join(" "));
	}

	console.log("Resulting amount of stones: ", stones.length);

	return stones.length;
};

(async () => {
	console.log("Day 11 - pt 1 (plutonian magic pebbles): ");

	// const sampleFile = resolve(getFilePath(exerciseDay, "sample"));
	// console.time("execution time for sample file");
	// const sampleResult = await run(sampleFile);
	// console.timeEnd("execution time for sample file");
	// console.log("sample: ", sampleResult);

	const inputFile = resolve(getFilePath(exerciseDay, "input"));
	console.time("execution time for input file");
	const inputResult = await run(inputFile);
	console.timeEnd("execution time for input file");
	console.log("input: ", inputResult);

	// Part 1
	// if (sampleResult !== 55312) {
	// 	console.log("SOMETHING IS WRONG");
	// }
})().then(() => process.exit());

//
