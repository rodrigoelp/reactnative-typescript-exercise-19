
export interface AssetSize { height: number, width: number }
export interface Point { x: number, y: number };

export class Asset {
    private _originalSize: AssetSize;

    public asset: any;
    public size: AssetSize;
    public initialPosition: Point;
    public intendedPosition: Point;

    constructor(resource: any, scaleX: number, scaleY: number, imgSize: AssetSize, initialPos: Point = { x: 0, y: 0 }, intendedPos: Point = { x: 0, y: 0 }) {
        this.asset = resource;

        this._originalSize = imgSize;
        this.size = { height: imgSize.height * scaleY, width: imgSize.width * scaleX };
        this.initialPosition = initialPos;
        this.intendedPosition = intendedPos;
    }
}
