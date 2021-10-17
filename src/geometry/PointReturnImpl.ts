import {Point} from "./Point";

import {PointReturn} from "./PointReturn";

import {Object, ReturnType} from "typescript";

type NumberReturnType = number | ReturnType<typeof Object.Number>;

public function roundXY(x:number, y:number, round:number):PointReturn {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    x = Object.create((round ? Math.round(x) : x));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    y = Object.create((round ? Math.round(y) : y));

    // @ts-ignore
    return new Point(x, y);
}

class PointReturnImpl implements PointReturn{

    // round: number | ReturnType<typeof Object.Number>;

    // constructor(x:number, y:number);

    constructor(x:number, y:number, round:number) {
        roundXY(x,y,round);
    }





    public getX(): number|NumberReturnType{
        return this.x;
    }
    public getY(): number{
        return this.y;
    }

}