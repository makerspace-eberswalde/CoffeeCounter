
export interface IResults {
    [key: string]: IResultOne;
}

export interface IResultOne {
    error: undefined | any;
    message: undefined | any;
    success: undefined | boolean;
    value: undefined | any;
}

export interface IResultMultiple {
    error: undefined | any;
    results: undefined | IResults;
    success: undefined | boolean;
    message: undefined | string;
    value: undefined | any;
}
