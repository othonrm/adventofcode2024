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
		uniqueIDsMap.set(char, i - 0x0800);
	}
	const uniqueIDsArr = [...uniqueIDsMap.keys()];

	let posType: "file" | "space" = "file";
	let fileId = 0;
	for (let x = 0; x < diskIdentifiers.length; x++) {
		if (!uniqueIDsArr[fileId]) {
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

	for (const [index, blankChunk] of organizedDisk.entries()) {
		if (blankChunk.length === 0 || blankChunk[0] !== ".") {
			continue;
		}
		const blankSpaces = blankChunk.length;
		// console.log(index, blankChunk, blankSpaces);
		let movingChunk = [];
		for (
			let backIndex = organizedDisk.length - 1;
			backIndex >= index;
			backIndex--
		) {
			const targetChunk = organizedDisk[backIndex];
			if (targetChunk.length === 0 || targetChunk[0] === ".") {
				continue;
			}
			const spacesLeft = blankSpaces - movingChunk.length;
			if (spacesLeft <= 0) {
				break;
			}

			const addingPiece = targetChunk.split("").slice(0, spacesLeft).flat();

			movingChunk = [...movingChunk, ...addingPiece];

			organizedDisk[backIndex] = targetChunk.slice(
				0,
				targetChunk.length - addingPiece.length,
			);
		}

		// console.log("ADD: ", movingChunk.join(""));
		organizedDisk[index] = movingChunk.join("");
		// console.log(organizedDisk.join(""));
		// if (index >= 1) {
		// 	break;
		// }
	}

	organizedDisk = organizedDisk.join("").split("");

	// for (let index = organizedDisk.length - 1; index >= 0; index--) {
	// 	// console.log(index, organizedDisk[index]);
	// 	const firstEmptySpaceIndex = organizedDisk.findIndex((c) => c === ".");
	// 	// console.log("firstEmptySpaceIndex: ", firstEmptySpaceIndex);
	// 	if (
	// 		organizedDisk[index] !== "." &&
	// 		firstEmptySpaceIndex !== -1 &&
	// 		firstEmptySpaceIndex < index
	// 	) {
	// 		const movingChar = organizedDisk.splice(index, 1, ".")[0];
	// 		organizedDisk[firstEmptySpaceIndex] = movingChar;
	// 	}

	// 	const spacesLeft = organizedDisk.join("").match(/(\.)+([0-9]+)/g)?.length;

	// 	c

	// 	// clearConsole();
	// 	// console.log(`
	// 	// 		fileName: ${fileName.slice(fileName.lastIndexOf("/") + 1)}
	// 	// 		chars: ${index}/${organizedDisk.length}
	// 	// 		available spaces: ${spacesLeft}
	// 	// 	`);

	// 	const isFragmented = /(\.)+([0-9]+)/g.test(organizedDisk.join(""));
	// 	if (!isFragmented) {
	// 		break;
	// 	}
	// }

	if (!fileName.includes("input")) {
		console.log("final organized disk: ", organizedDisk.join(""));
	}
	const checksum = organizedDisk.reduce((acc, curr, index) => {
		if (curr !== ".") {
			return acc + Number.parseInt(uniqueIDsMap.get(curr)) * index;
		}
		return acc;
	}, 0);

	return checksum;
};

(async () => {
	console.log("Day 9 - pt 1 (disk defrag): ");

	console.time("execution time for sample file");
	const sampleResult = await run(sampleFile);
	console.timeEnd("execution time for sample file");
	console.log("sample: ", sampleResult);

	console.time("execution time for input file");
	const inputResult = await run(inputFile);
	console.timeEnd("execution time for input file");
	console.log("input: ", inputResult);

	// Part 1
	if (sampleResult !== 1928) {
		console.log("SOMETHING IS WRONG");
	}
})().then(() => process.exit());

// 89558806610 - too low
// 90895909707 - too low
