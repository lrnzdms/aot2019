import { GetLines } from "../core";

const execute = (lines:string[]) => {
    const asteroids:{x:number, y:number}[] = [];
    lines.forEach((l,li) => {
        for(let i=0; i<l.length; ++i) {
            if (l[i]==="#") asteroids.push({x:i, y:li});
        }
    })

    const data = asteroids.map((fix, fixI) => {
        const hits:{
            angle:number, 
            data:{
                x:number, 
                y:number, 
                distance:number,
                x_base:number,
                y_base:number
            }[]
        }[] = [];

        for (let i=0; i<asteroids.length; ++i) {
            if (i===fixI) continue;
            
            const a = asteroids[i];

            let x = a.x - fix.x;
            let y = a.y - fix.y;
            
            let angle = Math.atan2(y, x)*180/Math.PI;
            if (angle<0) angle += 360;
            angle += 90;
            angle = angle%360;
            // if (x<0) angle += 180;
            // else if (y<0) angle += 360;

            let hit = hits.find(h => h.angle===angle);
            if (!hit) {
                hit = {angle, data: []};
                hits.push(hit);
            }

            hit.data.push({x, y, distance: (x*x + y*y), x_base: a.x, y_base: a.y});
        }

        return hits;
    })

    let index = 0;
    data.forEach((f,i) => {
        if (f.length>data[index].length) index = i;
    })

    const asteroid = data[index].sort((a,b) => a.angle<b.angle?-1:1);
    asteroid.forEach(a => a.data = a.data.sort((a,b) => a.distance<b.distance?1:-1));
    // console.log(JSON.stringify(asteroid, null, 2));
    console.log(asteroid.length);

    let killCount = 0;
    let i = -1;
    let lastKill;

    while (killCount<200) {
        ++i;
        const a = asteroid[i%asteroid.length];
        if (a.data.length>0) {
            lastKill = a.data.pop();
            ++killCount;
            console.log(killCount, lastKill);
        }
    }
}

GetLines("./src/10/input").then(execute)
