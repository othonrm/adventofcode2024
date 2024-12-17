import * as fs from "node:fs";
import { resolve } from "node:path";

const inputFile = resolve("./src/day7/day7-input.txt");
const sampleFile = resolve("./src/day7/day7-sample.txt");

const clearConsole = () => {
	console.log("\x1b[2J");
};

const evalLeftToRight = (equation: string[], operationQty: number) => {
	const result = equation.join("").split(" ");

	for (let index = 0; index < operationQty; index++) {
		const nextOperatorIndex = result.findIndex(
			(char) => char === "+" || char === "*" || char === "||",
		);
		if (nextOperatorIndex === -1) {
			break;
		}
		let subResult: string;
		if (result[nextOperatorIndex] === "||") {
			subResult = `${result[nextOperatorIndex - 1]}${result[nextOperatorIndex + 1]}`;
		} else {
			// biome-ignore lint/security/noGlobalEval: WE NEED IT!
			subResult = eval(result.slice(nextOperatorIndex - 1, 3).join(""));
		}
		result.splice(nextOperatorIndex - 1, 3, subResult);
	}

	return Number.parseInt(result[0]);
};

const run = (fileName) => {
	const equations: {
		result: number;
		equation: string;
	}[] = fs
		.readFileSync(fileName, "utf-8")
		.split("\n")
		.map((row) => {
			const temp = row.split(": ");
			return {
				result: Number.parseInt(temp[0]),
				equation: temp[1],
			};
		});

	let sumOfPossibleEquations = 0;

	// const operators = ["+", "*"]; // Part 1
	const operators = ["+", "*", "||"]; // Part 2

	let totalCombinations = 0;
	let attempts = 0;
	let equationsCalculated = 0;

	for (const row of equations) {
		equationsCalculated++;
		const testedOperators = new Set();
		const equationArray = row.equation.split("");

		const emptyIndexes = equationArray.reduce((acc, curr, index) => {
			if (curr === " ") {
				acc.push(index);
			}
			return acc;
		}, []);

		// console.log("Equation: ", row.equation, emptyIndexes.length);

		const maxCombinations = operators.length ** emptyIndexes.length;
		totalCombinations += maxCombinations;

		while (testedOperators.size < maxCombinations) {
			const newCombination = emptyIndexes.map(() => {
				return operators[Math.floor(Math.random() * operators.length)];
			});

			if (testedOperators.has(newCombination.join(""))) {
				continue;
			}

			testedOperators.add(newCombination.join(""));

			const tempEquation = [...equationArray];

			for (const [index, idx] of emptyIndexes.entries()) {
				tempEquation[idx] = ` ${newCombination[index]} `;
			}

			attempts++;
			const res = evalLeftToRight(tempEquation, newCombination.length);
			// console.log(
			// 	"POSSIBLE: ",
			// 	row.equation,
			// 	" / final equation: ",
			// 	tempEquation.join(""),
			// 	" / result: ",
			// 	row.result,
			// 	" got: ",
			// 	res,
			// );
			if (res === row.result) {
				sumOfPossibleEquations += row.result;
				break;
			}
		}

		clearConsole();
		console.log(`
			fileName: ${fileName.slice(fileName.lastIndexOf("/") + 1)}
			possible equations found: ${sumOfPossibleEquations}
			tested equations: ${equationsCalculated}/${equations.length}
		`);
	}

	console.log(`Attempts: ${attempts}/${totalCombinations}`);

	return sumOfPossibleEquations;
};

(async () => {
	console.log("Day 7 - pt 1 (equation calibration): ");

	console.time("execution time for sample file");
	const sampleResult = run(sampleFile);
	console.timeEnd("execution time for sample file");
	console.log("sample: ", sampleResult);

	console.time("execution time for input file");
	const inputResult = run(inputFile);
	console.timeEnd("execution time for input file");
	console.log("input: ", inputResult);

	// Part 1
	// if (sampleResult !== 3749) {
	// Part 2
	if (sampleResult !== 11387) {
		console.log("SOMETHING IS WRONG");
	}
})().then(() => process.exit());

// 156121079426 - too low
// 92010392340
// 69931494569
// 30460765354
// 632216504484 - too low
// Formula is broken, giving different answers
// 620655456634
// Number of possibilities was being calculated wrongly :D
// options ^ slots

// Part 2
// straight correct, not that hard (but it took almost 3 minutes to run lol)
