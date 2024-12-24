import * as fs from "node:fs";
import { resolve } from "node:path";

const inputFile = resolve("./src/day9/day9-input.txt");
const sampleFile = resolve("./src/day9/day9-sample.txt");

const clearConsole = () => {
	console.log("\x1b[2J");
};

const waitDelay = async (delayMs: number) => {
	process.stdin.setRawMode(true);
	return new Promise<void>((resolve) => {
		process.stdin.once("data", () => {
			process.stdin.setRawMode(false);
			process.exit();
			resolve();
		});
		setTimeout(() => {
			process.stdin.setRawMode(false);

			resolve();
		}, delayMs);
	});
};

const run = async (fileName) => {
	const diskIdentifiers: string[] = fs
		.readFileSync(fileName, "utf-8")
		.split("");

	const expandedDisk: string[] = JSON.parse(JSON.stringify(diskIdentifiers));

	const uniqueIDsMap = new Map();

	for (let i = 0x0800; i < 0x0800 + 10000; i++) {
		const char = String.fromCharCode(i);

		// uniqueIDsMap.set(char, i - 0x0800);

		if (!fileName.includes("input")) {
			uniqueIDsMap.set(`${i - 0x0800}`, i - 0x0800);
		} else {
			uniqueIDsMap.set(char, i - 0x0800);
		}
	}
	const uniqueIDsArr = [...uniqueIDsMap.keys()];

	console.log(uniqueIDsMap.size);

	let posType: "file" | "space" = "file";
	let fileId = 0;
	for (let x = 0; x < diskIdentifiers.length; x++) {
		if (uniqueIDsArr[fileId] === undefined) {
			console.log("ERROR, UNDEFINED ID INDEX: ", fileId);
			process.exit();
		}
		const chunkSize = Number.parseInt(diskIdentifiers[x]);
		const replaceChar = posType === "file" ? uniqueIDsArr[fileId] : ".";
		const expanded = Array.from(Array(chunkSize).keys()).map(() => replaceChar);
		expandedDisk.splice(
			x,
			Number.parseInt(diskIdentifiers[x]),
			expanded.join(""),
		);
		if (posType === "file") {
			fileId++;
			posType = "space";
		} else {
			posType = "file";
		}
	}

	if (!fileName.includes("input")) {
		console.log("Expanded: ", expandedDisk.join(""));
	}

	// const organizedDisk = expandedDisk.join("").split("");
	let organizedDisk = [...expandedDisk];
	// console.log(organizedDisk);

	// console.log(organizedDisk);

	const fileMoveAttempts = new Set();

	// while (true) {
	// 	for (let index = 0; index < organizedDisk.length; index++) {
	// 		const blankChunk = organizedDisk[index];

	// 		if (blankChunk.length === 0 || blankChunk[0] !== ".") {
	// 			continue;
	// 		}

	// 		for (
	// 			let backIndex = organizedDisk.length - 1;
	// 			backIndex >= index;
	// 			backIndex--
	// 		) {
	// 			const possibleChunk = organizedDisk[backIndex];

	// 			if (
	// 				possibleChunk.length === 0 ||
	// 				possibleChunk[0] === "." ||
	// 				fileMoveAttempts.has(possibleChunk[0].toString())
	// 			) {
	// 				continue;
	// 			}

	// 			fileMoveAttempts.add(possibleChunk[0].toString());

	// 			if (possibleChunk.length <= blankChunk.length) {
	// 				organizedDisk.splice(
	// 					index,
	// 					1,
	// 					possibleChunk.padEnd(blankChunk.length, "."),
	// 				);

	// 				organizedDisk.splice(
	// 					backIndex,
	// 					1,
	// 					"".padEnd(possibleChunk.length, "."),
	// 				);

	// 				// console.log("___");
	// 				// console.log(organizedDisk.join(""));

	// 				break;
	// 			}
	// 		}
	// 	}

	// 	organizedDisk = organizedDisk
	// 		.flatMap((chunk) => {
	// 			if (!chunk.includes(".")) {
	// 				return chunk;
	// 			}
	// 			const parts = chunk.split(".");
	// 			return [parts[0], parts.slice(1).map(() => ".")].flat();
	// 		})
	// 		.filter((chunk) => chunk !== "");

	// 	const hasEmptySpaceThatFits =
	// 		organizedDisk.findIndex((c, index) => {
	// 			const isEmptySpace = c.includes(".");
	// 			return (
	// 				isEmptySpace &&
	// 				organizedDisk
	// 					.slice(index)
	// 					.some(
	// 						(c2) =>
	// 							!c2.includes(".") &&
	// 							c2.length === c.length &&
	// 							!fileMoveAttempts.has(c2[0].toString()),
	// 					)
	// 			);
	// 		}) !== -1;

	// 	if (!hasEmptySpaceThatFits) {
	// 		break;
	// 	}
	// }

	for (let backIndex = organizedDisk.length - 1; backIndex >= 0; backIndex--) {
		const possibleChunk = organizedDisk[backIndex];
		if (
			possibleChunk.length === 0 ||
			possibleChunk[0] === "." ||
			fileMoveAttempts.has(possibleChunk[0].toString())
		) {
			continue;
		}
		fileMoveAttempts.add(possibleChunk[0].toString());

		for (let index = 0; index < backIndex; index++) {
			const blankChunk = organizedDisk[index];

			if (blankChunk.length === 0 || blankChunk[0] !== ".") {
				continue;
			}

			if (possibleChunk.length <= blankChunk.length) {
				organizedDisk.splice(
					backIndex,
					1,
					"".padEnd(possibleChunk.length, "."),
				);

				organizedDisk.splice(
					index,
					1,
					possibleChunk,
					"".padEnd(blankChunk.length - possibleChunk.length, "."),
				);

				// console.log("___");
				// console.log(organizedDisk);
				// return;

				break;
			}
		}
	}

	organizedDisk = organizedDisk.join("").split("");

	if (!fileName.includes("input")) {
		console.log("final organized disk: ", organizedDisk.join(""));
	}
	const checksum = organizedDisk.reduce((acc, curr, index) => {
		if (curr !== ".") {
			return acc + Number.parseInt(uniqueIDsMap.get(curr.toString())) * index;
		}
		return acc;
	}, 0);

	return checksum;
};

(async () => {
	console.log("Day 9 - pt 2 (disk defrag per file): ");

	console.time("execution time for sample file");
	const sampleResult = await run(sampleFile);
	console.timeEnd("execution time for sample file");
	console.log("sample: ", sampleResult);

	console.time("execution time for input file");
	const inputResult = await run(inputFile);
	console.timeEnd("execution time for input file");
	console.log("input: ", inputResult);

	// Part 1
	if (sampleResult !== 2858) {
		console.log("SOMETHING IS WRONG");
	}
})().then(() => process.exit());

// 6376720125382 - wrong (too high)
// 12933616107161 - wrong (too high)
