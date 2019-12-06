import { GetNumbers } from "../core";
const readline = require('readline');


class IntReader {
    input:number;
    pointer:number;
    data:number[];

    read = (immediate:boolean = false, move:boolean = false) => {
        const v = this.data[this.pointer];
        if (move) ++this.pointer;
        return immediate ? v : this.data[v];
    }

    write = (p:number, v:number) => {
        this.data[p] = v;
    }

    modes = () => {
        let res = Math.floor(this.read(true)/100);
        const modes:boolean[] = []
        while (res!=0) {
            modes.push(res%10===1)
            res = Math.floor(res/10);
        }
        return modes;
    }

    op_add = () => {
        const modes = this.modes();
        ++this.pointer;
        const a = this.read(modes[0], true);
        const b = this.read(modes[1], true);
        const c = this.read(true, true);
        this.write(c, a+b);
    }

    op_mul = () => {
        const modes = this.modes();
        ++this.pointer;
        const a = this.read(modes[0], true);
        const b = this.read(modes[1], true);        
        const c = this.read(true, true);
        this.write(c, a*b);
    }

    op_input = () => {
        ++this.pointer;
        const p = this.read(true, true);
        this.write(p, this.input);
    }

    op_output = () => {
        ++this.pointer;
        const p = this.read(true, true);
        console.log("Output: ", this.data[p], "(pointer: "+p+")");
    }

    op_jump_nzero = () => this.op_jump(true);
    op_jump_zero = () => this.op_jump(false);

    op_jump = (nzero:boolean) => {
        const modes = this.modes();
        ++this.pointer;
        const v = this.read(modes[0], true);
        const p = this.read(modes[1], true);
        if (nzero && v!==0) {
            this.pointer = p;
        }

        if (!nzero && v===0) {
            this.pointer = p;
        }
    }

    op_less = () => this.op_compare((a,b)=>a<b);
    op_equals = () => this.op_compare((a,b)=>a===b);
    op_compare = (f:(a:number,b:number)=>boolean) => {
        const modes = this.modes();
        ++this.pointer;
        const a = this.read(modes[0], true);
        const b = this.read(modes[1], true);
        const p = this.read(true, true);
        this.write(p, f(a,b)?1:0);
    }

    execute = (data:number[]):Promise<number> => {
        this.data = data;
        this.pointer = 0;

        return new Promise(res => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
              });
            rl.question("input: ", (answer:any) => {
                const i = Number.parseInt(answer);
                console.log("input parsed: ", i)
                this.input = i;
                rl.close();
                const result = this._execute();
                res(result);
            });
        })
    }

    _execute = () => {
        while (true) {
            const value = this.read(true);
            if (!value) throw new Error("Out of range. pointer: "+this.pointer+" value: "+value+" data: "+this.data);
            if (value===99) break;

            switch (value%10) {
                case 1: this.op_add(); break;
                case 2: this.op_mul(); break;
                case 3: this.op_input(); break;
                case 4: this.op_output(); break;
                case 5: this.op_jump_nzero(); break;
                case 6: this.op_jump_zero(); break;
                case 7: this.op_less(); break;
                case 8: this.op_equals(); break;
            }
        }

        return this.data[0];
    }
}

GetNumbers("./src/05/input").then(async numbers => { 
    const machine = new IntReader();
    const d = numbers.map(d => d);
    const r = await machine.execute(d);
    console.log("done ", r);

    // const asd = await machine.execute([3,3,1108,-1,8,3,4,3,99]);
})
