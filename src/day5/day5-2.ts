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

	const wrongReports = reports.filter((report) => {
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
		return !isOrdered;
	});

	console.time("execution time");
	const correctReports = wrongReports.map((report) => {
		const temp = report.split(",").map((num) => Number.parseInt(num));

		for (let index = 0; index < temp.length; index++) {
			const num = temp[index];

			let hasChanged = false;
			temp.slice(index + 1).map((num2, index2) => {
				if (rulesMap.has(`${num}|${num2}`) && !hasChanged) {
					hasChanged = true;
					temp[index] = num2;
					temp[index + index2 + 1] = num;
				}
			});
			if (hasChanged) {
				index--;
			}
		}
		return temp.join(",");
	});
	console.timeEnd("execution time");

	const sumOfMiddles = correctReports.reduce((acc, curr) => {
		const report = curr.split(",").map((num) => Number.parseInt(num));
		const middle = Math.ceil(report.length / 2);
		return acc + report[middle - 1];
	}, 0);

	return sumOfMiddles;
};

const sampleResult = run(sampleFile);
const sampleExpected = 123;

console.log("Day 5 - pt 2 (correct reports): ");
console.log("sample: ", sampleResult);
console.log("input: ", run(inputFile));

if (sampleResult !== sampleExpected) {
	console.log("SAMPLE RESULT IS WRONG");
}
