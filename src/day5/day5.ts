import * as fs from "node:fs";
import { resolve } from "node:path";

const inputFile = resolve("./src/day5/day5-input.txt");
const sampleFile = resolve("./src/day5/day5-sample.txt");

const run = (fileName) => {
	const input = fs.readFileSync(fileName, "utf-8").split("\n\n");

	const rulesMap = new Set(
		input[0].split("\n").map((rule) => rule.split("|").toReversed().join("|")),
	);
	const reports = input[1].split("\n");

	const correctReports = reports.filter((report) => {
		let isOrdered = true;
		report
			.split(",")
			.map((num) => Number.parseInt(num))
			.map((num, index, arr) => {
				arr.slice(index + 1).map((num2) => {
					if (isOrdered && rulesMap.has(`${num}|${num2}`)) {
						isOrdered = false;
					}
				});
			});
		return isOrdered;
	});

	const sumOfMiddles = correctReports.reduce((acc, curr) => {
		const report = curr.split(",").map((num) => Number.parseInt(num));
		const middle = Math.ceil(report.length / 2);
		return acc + report[middle - 1];
	}, 0);

	return sumOfMiddles;
};

console.log("Day 5 - pt 1 (correct reports): ");
console.log("sample: ", run(sampleFile));
console.log("input: ", run(inputFile));

if (run(sampleFile) !== 143) {
	console.log("WRONG");
}

// 6591 - wrong (too high)
// 4711 - wrong (too low)
