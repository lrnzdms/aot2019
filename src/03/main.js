
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

const getInput = (path) => new Promise((res, rej) => {
    const reader = lineReader.createInterface({
        input: fs.createReadStream(path)
    });
    const input = [];
    reader.on("line", (l) => {
        const directions = l.split(",");
        input.push(directions);
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

getInput("./src/03/input").then(lines => {
    let x;
    let y;
    let steps;
    let cable;
    const map = {};

    const up = v => { const end = y+v; for (y; y<end; ++y) record(); }
    const down = v => { const end = y-v; for (y; y>end; --y) record(); }
    const left = v => { const end = x-v; for (x; x>end; --x) record(); }
    const right = v => { const end = x+v; for (x; x<end; ++x) record(); }

    const record = () => {        
        const key = x+"_"+y;
        if (!map[key]) map[key] = {};
        if (!map[key][cable]) map[key][cable] = steps;
        steps++;
    }

    const cables = lines.map((line, i) => {
        cable = (i+1)*10;
        x = 0;
        y = 0;
        steps = 0;
        line.forEach(data => {
            const direction = data[0];
            const value = Number.parseInt(data.substring(1));
            switch(direction) {
                case "U": up(value); break;
                case "D": down(value); break;
                case "L": left(value); break;
                case "R": right(value); break;
            }
        })

        return cable;
    });

    const distances = Object.keys(map)
    .filter(k => {
        const entry = map[k];
        if (!entry) return false;
        const missing = cables.find(c => entry[c]===undefined);
        return missing===undefined;
    })
    .map(c => {
        const data = map[c];
        const distance = c.split("_").reduce((result, el) => {
            result += Math.abs(Number.parseInt(el));
            return result;
        }, 0)

        return {data, distance}
    });
    
    console.log(distances.sort((a, b) => a.distance>b.distance ? 1:-1));
    const firstCollision = distances.map(d => Object.keys(d.data).reduce((res, el) => {
        res += d.data[el];
        return res;
    }, 0));
    console.log(firstCollision.sort());
})
