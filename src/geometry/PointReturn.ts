import {Object, ReturnType} from "typescript";

type NumberReturnType = number | ReturnType<typeof Object.Number>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface PointReturn{

    x: number | ReturnType<typeof Object.Number>;
    y: number | ReturnType<typeof Object.Number>;

    // constructor(x:number, y:number);

    getX():NumberReturnType;
    getY():NumberReturnType;
}