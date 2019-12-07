
const fs = require("fs");
const lineReader = require("readline");

export const GetLines = (path:string):Promise<string[]> => new Promise((res, rej) => {
    const reader = lineReader.createInterface({
        input: fs.createReadStream(path)
    });
    const input:string[] = [];
    reader.on("line", (l:string) => {
        input.push(l);
    })
    reader.on("close", () => {
        res(input);
    })  
})

export const GetNumbers = (path:string):Promise<number[]> => new Promise((res, rej) => {
    const reader = lineReader.createInterface({
        input: fs.createReadStream(path)
    });
    const input:number[] = [];
    reader.on("line", (l:string) => {
        const numbers = l.split(",").map(s => Number.parseInt(s))
        input.push(...numbers);
    })
    reader.on("close", () => {
        res(input);
    })  
})