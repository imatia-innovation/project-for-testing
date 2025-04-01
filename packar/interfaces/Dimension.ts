export default interface Dimension {
    length: number;
    width: number;
    height: number;
    weight: number;
}

export interface CompleteOrderDimension {
    boxQty: number;
    weight: number;
}
