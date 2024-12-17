// use std::env;
use std::{collections::HashSet, fs};

fn clear_console() {
    print!("{}[2J", 27 as char);
}

// const printMapArray = (map) => {
// 	println!(map.map((row) => row.join("")).join("\n"));
// };

const SAMPLE_FILE: &str = "./src/day6/day6-input.txt";
// const SAMPLE_FILE: &str = "./src/day6/day6-input.txt";

fn run(file_name: &str) -> i32 {
    println!("Starting file {file_name}");

    let contents = fs::read_to_string(file_name).expect("Error reading file");

    let rows: Vec<&str> = contents.split("\n").collect();
    let map: Vec<Vec<&str>> = rows.iter().map(|f| f.split("").collect()).collect();

    fn is_stuck_in_loop(targetMap: &mut Vec<Vec<&str>>) -> bool {
        let mut turn_spots: Vec<String> = Vec::new();

        let mut visited_positions: HashSet<[i32; 2]> = HashSet::new();
        // const positionVisitCount = new Map<`${number}-${number}`, number>();

        let max_iteration = targetMap.len() * targetMap[0].len();
        let mut currentIteration = 0;

        let mut currentX: i32 = 0;
        let mut currentY: i32 = 0;

        for (y, row) in targetMap.iter().enumerate() {
            if let Some(x) = row.iter().position(|&s| s == "^") {
                currentX = x as i32;
                currentY = y as i32;
            }
        }

        let mut direction: (i32, i32) = (0, -1);

        targetMap[currentY as usize][currentX as usize] = "X";

        let lowestCount = 0;
        let highestCount = 0;

        let lastIterationWithNewSpot = currentIteration;

        let countOfSamePositionLength = 0;
        let lastArrayLength = 0;

        loop {
            // println!("current iteration: {currentIteration}");
            currentX += direction.0;
            currentY += direction.1;
            targetMap[(currentY) as usize][(currentY) as usize] = "X";
            // targetMap[currentY][currentX] = "X";
            // if (!positionVisitCount.has(`${currentX}-${currentY}`)) {
            // 	lastIterationWithNewSpot = currentIteration;
            // }
            visited_positions.insert([currentY, currentX]);
            currentIteration = currentIteration + 1;
            // const existingCount =
            // 	positionVisitCount.get(`${currentX}-${currentY}`) || 0;
            // const positionCount = existingCount + 1;
            // if (positionCount >= highestCount) {
            // 	highestCount = positionCount;
            // }
            // if (lowestCount <= highestCount - 10) {
            // 	lowestCount = positionCount;
            // }
            // positionVisitCount.set(`${currentX}-${currentY}`, positionCount);

            // if (fileName.includes("sample")) {
            // }
            // clearConsole();
            // printMapArray(targetMap);
            // await waitDelay(100);

            let nextCellY = currentY + direction.1;
            let nextCellX = currentX + direction.0;

            // println!("nextCell: {nextCellY}, {nextCellX}");

            if nextCellX as usize > (targetMap[0].len()) - 1
                || nextCellY as usize > (targetMap.len()) - 1
                || nextCellX < 0
                || nextCellY < 0
            {
                // println!("OUT!");
                // println!("Visited Positions: {:#?}", visited_positions);
                println!("Visit count: {:#}", visited_positions.len());
                return false;
            }

            let nextCell = targetMap[nextCellY as usize][nextCellX as usize];

            // const spotsWithMoreThanTwoVisits = [
            // 	...positionVisitCount.values(),
            // ].filter(
            // 	(count) =>
            // 		count > 2 &&
            // 		(count === highestCount - 1 ||
            // 			count === highestCount ||
            // 			count === highestCount + 1),
            // );

            if (nextCell == "#") {
                // turnSpots.push(`${currentX},${currentY}`);
                // if (turnSpots.length > spotsWithMoreThanTwoVisits.length) {
                // 	turnSpots.splice(0, 1);
                // }
                if (direction.0 == 0 && direction.1 == -1) {
                    direction = (1, 0);
                } else if (direction.0 == 1 && direction.1 == 0) {
                    direction = (0, 1);
                } else if (direction.0 == 0 && direction.1 == 1) {
                    direction = (-1, 0);
                } else if (direction.0 == -1 && direction.1 == 0) {
                    direction = (0, -1);
                }
            }

            // println!("current iteration: {currentIteration}");

            // if currentIteration > max_iteration.pow(2) {
            //     println!("LOOP!");
            //     return true;
            // }
        }

        return false;
    };

    let mut loop_possibilities: i32 = 0;

    let mut new_map = map.clone();
    is_stuck_in_loop(&mut new_map);

    // for row in 0..map.len() {
    //     for column in 0..map[row].len() {
    //         let mut new_map = map.clone();
    //         if new_map[row][column] == "#" || new_map[row][column] == "^" {
    //             continue;
    //         }
    //         new_map[row][column] = "#";
    //         // clear_console();
    //         println!(
    //             "fileName: {}\nloopPossibilities: {}\n{}/{} - {}/{}",
    //             file_name,
    //             loop_possibilities,
    //             row,
    //             map.len() - 1,
    //             column,
    //             map[row].len() - 1
    //         );
    //         // println!("trying: ", row, column);
    //         let creates_loop = is_stuck_in_loop(&mut new_map);
    //         if creates_loop {
    //             loop_possibilities += 1;
    //         }
    //     }
    // }

    return loop_possibilities;
}

fn main() {
    println!("Day 6 - pt 1 (guard's route): ");

    // const sampleResult = await run(sampleFile);

    use std::time::Instant;
    let now = Instant::now();

    // Code block to measure.
    {
        let sampleResult = run(SAMPLE_FILE);
        // my_function_to_measure();
        println!("I'm being measured");
    }

    let elapsed = now.elapsed();
    println!("Elapsed: {:.2?}", elapsed);

    // console.time("execution time for sample file");
    // println!("sample: ", sampleResult);
    // console.timeEnd("execution time for sample file");
    // console.time("execution time for input file");
    // println!("input: await run(inputFile)");
    // console.timeEnd("execution time for input file");

    // if (sampleResult !== 6) {
    // 	println!("SOMETHING IS WRONG");
    // }
}

// 2037 - wrong (too high)
// 2361 - ????
// 2036 - wrong
// 2035 - wrong
// 2218 - wrong (no more hints - 15 minutes wait)
