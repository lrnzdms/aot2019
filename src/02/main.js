
const fs = require("fs");
const lineReader = require("readline");

// const reader = lineReader.createInterface({
//     input: fs.createReadStream("./src/01/input")
// });
// const INPUT = [];
// reader.on("line", (l) => {
//     INPUT.push(Number.parseInt(l));
// })
// reader.on("close", () => {
//     inputSum();
//     findDuplicates();
// })

const getLines = (path) => new Promise((res, rej) => {
    const reader = lineReader.createInterface({
        input: fs.createReadStream(path)
    });
    const input = [];
    reader.on("line", (l) => {
        input.push(Number.parseInt(l));
    })
    reader.on("close", () => {
        res(input);
    })  
})

const getNumbers = (path) => new Promise((res, rej) => {
    const reader = lineReader.createInterface({
        input: fs.createReadStream(path)
    });
    const input = [];
    reader.on("line", (l) => {
        const numbers = l.split(",").map(s => Number.parseInt(s))
        input.push(...numbers);
    })
    reader.on("close", () => {
        res(input);
    })  
})

const aot = (data) => {        
    
    const add = (a) => 	data[data[a+3]] = data[data[a+1]]+data[data[a+2]];
    const mul = (a) => 	data[data[a+3]] = data[data[a+1]]*data[data[a+2]];

    let pointer = 0;
    while (true) {
        if (data[pointer]===1) add(pointer);
        else if (data[pointer]===2) mul(pointer);
        else break;
        pointer += 4;
    }
    return data[0];
}

getNumbers("./src/02/input").then(numbers => {    
    const d = numbers.map(d => d);
    d[1] = 12;
    d[2] = 2;
    console.log("aot 1 ", aot(d))
    const search = 19690720;
    for (let i = 0; i<10000; ++i) {
        const noun = Math.floor(i/100);
        const verb = i%100;

        const data = numbers.map(d => d);
        data[1] = noun;
        data[2] = verb;

        const result = aot(data);
        if(result===search) {
            console.log("aot 2 ", i, noun, verb);
            break;
        }
    }
})
