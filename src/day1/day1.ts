import * as fs from "node:fs";
import { resolve } from "node:path";

const filePath = resolve("./src/day1/day1-input.txt");
// const filePath = resolve("./src/day1/day1-sample.txt");

const input = fs.readFileSync(filePath, "utf-8").split("\n");

const leftTower = [];
const rightTower = [];

input.map((x) => {
	const [left, right] = x.split("   ");
	leftTower.push(Number.parseInt(left));
	rightTower.push(Number.parseInt(right));
});

leftTower.sort((a, b) => b - a);
rightTower.sort((a, b) => b - a);

const totalDistance = leftTower.reduce((acc, curr, index) => {
	return acc + Math.abs(curr - rightTower[index]);
}, 0);

console.log("Day 1 - pt 1 (total distance): ", totalDistance);

// 676465 -- wrong

// Part 2

const rightTowerAppearanceQtyMap = new Map();

for (const num of rightTower) {
	rightTowerAppearanceQtyMap.set(
		num,
		(rightTowerAppearanceQtyMap.get(num) || 0) + 1,
	);
}

const similarityScore = leftTower.reduce((acc, curr) => {
	return acc + Math.abs(curr * (rightTowerAppearanceQtyMap.get(curr) || 0));
}, 0);

console.log("Day 2 - pt 2 (similarity score): ", similarityScore);
