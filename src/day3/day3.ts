import * as fs from "node:fs";
import { resolve } from "node:path";

const filePath = resolve("./src/day3/day3-input.txt");
// const filePath = resolve("./src/day3/day3-sample.txt");

const input = fs.readFileSync(filePath, "utf-8").split("\n");

let sumOfOperations = 0;
for (const element of input) {
	element.match(/mul\([0-9]+\,[0-9]+\)/g).map((operation) => {
		const numbers = operation
			.replace(/mul|\(|\)/g, "")
			.split(",")
			.map((num) => Number.parseInt(num));
		sumOfOperations += numbers[0] * numbers[1];
	});
}

console.log("Day 3 - pt 1 (sum of operations): ", sumOfOperations);

// Part 2

let sumOfOperationsComplex = 0;
let isEnabled = true;
for (const element of input) {
	element
		.match(/(mul\([0-9]+\,[0-9]+\))|(don\'t\(\))|(do\(\))/g)
		.map((operation) => {
			if (operation === "do()" || operation === "don't()") {
				isEnabled = operation === "do()";
				return;
			}
			if (!isEnabled) {
				return;
			}
			const numbers = operation
				.replace(/mul|\(|\)/g, "")
				.split(",")
				.map((num) => Number.parseInt(num));
			sumOfOperationsComplex += numbers[0] * numbers[1];
		});
}

console.log(
	"Day 3 - pt 2 (sum of operations enable/disable): ",
	sumOfOperationsComplex,
);

// 97977612 - wrong (too high)
