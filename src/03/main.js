
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
    
    const map = {};

    const up = (v, c) => {
        const end = y+v;
        for (y; y<end; ++y) {
            const key = x+"_"+y;
            map[key] = c + (map[key] || 0);
        }
    }

    const down = (v, c) => {
        const end = y-v;
        for (y; y>end; --y) {
            const key = x+"_"+y;
            map[key] = c + (map[key] || 0);
        }
    }

    const left = (v, c) => {
        const end = x-v;
        for (x; x>end; --x) {
            const key = x+"_"+y;
            map[key] = c + (map[key] || 0);
        }
    }

    const right = (v, c) => {
        const end = x+v;
        for (x; x<end; ++x) {
            const key = x+"_"+y;
            map[key] = c + (map[key] || 0);
        }
    }

    lines.forEach((line, i) => {
        x = 0;
        y = 0;
        line.forEach(data => {
            const direction = data[0];
            const value = Number.parseInt(data.substring(1));
            const cable = (i+1)*10
            //console.log(direction, value);
            switch(direction) {
                case "U": up(value, cable); break;
                case "D": down(value, cable); break;
                case "L": left(value, cable); break;
                case "R": right(value, cable); break;
            }
        })
    });

    const distances = Object.keys(map).filter(k => map[k]===30).map(c => {
        return c.split("_").reduce((result, el) => {
            result += Math.abs(Number.parseInt(el));
            return result;
        }, 0)
    });
    console.log(distances.sort().find(d => d!==0));
})
