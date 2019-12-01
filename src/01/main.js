
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

const calcFuel = (mass) => Math.floor(mass/3)-2;
const calcFuelRec = (mass) => {
    const fuel = calcFuel(mass);    
    return fuel > 0 ? fuel + calcFuelRec(fuel) : 0
}

getLines("./src/01/input").then(lines => {
    const totalFuel = lines.reduce((all, mass) => {
        const fuel = calcFuel(mass);
        const fuelRec = calcFuelRec(mass);
        all[0] += fuel;
        all[1] += fuelRec
        //console.log(mass, fuel)
        return all;
    }, [0, 0]);
    console.log("total fuel: ", totalFuel);
});