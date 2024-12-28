export const getFilePath = (day: number, type: "input" | "sample") =>
	`./src/day${day}/day${day}-${type}.txt`;

export const clearConsole = () => {
	// console.log("\x1b[2J");
	console.clear();
};

export const waitDelay = async (delayMs: number) => {
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
