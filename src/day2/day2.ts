import * as fs from "node:fs";
import { resolve } from "node:path";

const filePath = resolve("./src/day2/day2-input.txt");
// const filePath = resolve("./src/day2/day2-sample.txt");

const input = fs.readFileSync(filePath, "utf-8").split("\n");

let safeReports = 0;

const isReportSafe = (report) => {
	let isSafe = true;
	const sortOrder = report[0] > report[1] ? "desc" : "asc";
	for (let index = 1; index < report.length; index++) {
		if (!isSafe) {
			continue;
		}
		if (report[index] === report[index - 1]) {
			isSafe = false;
		}
		if (sortOrder === "asc" && report[index] < report[index - 1]) {
			isSafe = false;
		}
		if (sortOrder === "desc" && report[index] > report[index - 1]) {
			isSafe = false;
		}
		if (Math.abs(report[index] - report[index - 1]) > 3) {
			isSafe = false;
		}
	}
	return isSafe;
};

input.map((x) => {
	const report = x.split(" ").map((txt) => Number.parseInt(txt));
	if (isReportSafe(report)) {
		safeReports++;
	}
});

console.log("Day 2 - pt 1 (safe reports): ", safeReports);

// Part 2

let safeReportsWithDampener = 0;

input.map((x) => {
	const report = x.split(" ").map((txt) => Number.parseInt(txt));
	const isBaseReportSafe = isReportSafe(report);
	if (isBaseReportSafe) {
		safeReportsWithDampener++;
	} else {
		for (let index = 0; index < report.length; index++) {
			const partialReport = report.toSpliced(index, 1);
			if (isReportSafe(partialReport)) {
				safeReportsWithDampener++;
				break;
			}
		}
	}
});

console.log(
	"Day 2 - pt 1 (safe reports with dampener): ",
	safeReportsWithDampener,
);
