import { GetLines } from "../core";

const execute = (lines:string[]) => {
    const asteroids:{x:number, y:number}[] = [];
    lines.forEach((l,li) => {
        for(let i=0; i<l.length; ++i) {
            if (l[i]==="#") asteroids.push({x:i, y:li});
        }
    })

    // console.log(asteroids);
    const hitCounts = asteroids.map((fix, fixI) => {
        const hits:number[] = [];

        for (let i=0; i<asteroids.length; ++i) {
            if (i===fixI) continue;
            
            const a = asteroids[i];

            let x = a.x - fix.x;
            let y = a.y - fix.y;
            
            // const l = Math.sqrt(x*x + y*y) || 1;
            // x /= l;
            // y /= l;
            // const hit = hits.find(h => h.x===x && h.y===y);
            // if (!hit) {
            //     hits.push({x, y});
            // }

            // const hit = y===0 ? x/Math.abs(x) : x/y;

            const hit = Math.atan2(x, y)*180/Math.PI;
            if (hits.indexOf(hit)===-1) {
                hits.push(hit);
            }
        }

        // console.log(hits)

        return hits.length;
    })

    let max = 0;
    hitCounts.forEach(f => {
        max = Math.max(max, f)
    })

    console.log(max)

}

GetLines("./src/10/input").then(execute)
