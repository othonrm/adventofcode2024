use regex::Regex;
use std::{collections::HashSet, fs};

fn clear_console() {
    print!("{}[2J", 27 as char);
}

// const printMapArray = (map) => {
// 	println!(map.map((row) => row.join("")).join("\n"));
// };

// const SAMPLE_FILE: &str = "./src/day6/day6-sample.txt";
const SAMPLE_FILE: &str = "./src/day6/day6-input.txt";

fn run(file_name: &str) -> i32 {
    println!("Starting file {file_name}");

    let contents = fs::read_to_string(file_name).expect("Error reading file");

    let rows: Vec<&str> = contents.split("\n").collect();
    let map: Vec<Vec<&str>> = rows.iter().map(|f| f.split("").collect()).collect();

    fn is_stuck_in_loop(targetMap: &mut Vec<Vec<&str>>) -> bool {
        let mut visited_positions: HashSet<[i32; 2]> = HashSet::new();

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

        loop {
            currentX += direction.0;
            currentY += direction.1;
            targetMap[(currentY) as usize][(currentX) as usize] = "X";

            // visited_positions.insert([currentY, currentX]);

            let nextCellY = currentY + direction.1;
            let nextCellX = currentX + direction.0;

            if nextCellX as usize >= (targetMap[0].len())
                || nextCellY as usize >= (targetMap.len())
                || nextCellX < 0
                || nextCellY < 0
            {
                let re = Regex::new(r"X").unwrap();
                let string: String = targetMap
                    .iter()
                    .map(|row| row.join(""))
                    .collect::<Vec<String>>()
                    .join("");
                let amount = re.find_iter(&string).count();
                println!("AAAAA: {amount}");
                println!("Visit count: {:#}", visited_positions.len());
                return false;
            }

            let nextCell = targetMap[nextCellY as usize][nextCellX as usize];

            if nextCell == "#" {
                if direction.0 == 0 && direction.1 == -1 {
                    direction = (1, 0);
                } else if direction.0 == 1 && direction.1 == 0 {
                    direction = (0, 1);
                } else if direction.0 == 0 && direction.1 == 1 {
                    direction = (-1, 0);
                } else if direction.0 == -1 && direction.1 == 0 {
                    direction = (0, -1);
                }
            }
        }
    }

    let loop_possibilities: i32 = 0;

    let mut new_map = map.clone();

    use std::time::Instant;
    let now = Instant::now();
    {
        is_stuck_in_loop(&mut new_map);
    }
    let elapsed = now.elapsed();
    println!("Elapsed: {:.2?}", elapsed);

    return loop_possibilities;
}

fn main() {
    println!("Day 6 - pt 1 (guard's route): ");

    // const sampleResult = await run(sampleFile);

    run(SAMPLE_FILE);

    // use std::time::Instant;
    // let now = Instant::now();
    // {
    //     let sampleResult = run(SAMPLE_FILE);
    // }
    // let elapsed = now.elapsed();
    // println!("Elapsed: {:.2?}", elapsed);

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
