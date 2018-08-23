// https://gitlab.com/divramod/dm-tpl/issues/4

// IMPORT
import { IResultMultiple, IResultOne, IResults } from './index.d'

// EXPORT
export * from './index.d'

// TYPINGS

// CLASS
export class UCommonUtility {

    public static getInstance(): UCommonUtility {
        return UCommonUtility.INSTANCE
    }

    private static INSTANCE: UCommonUtility = new UCommonUtility()
    public name: string = 'UCommonUtility'

    constructor() {
        if (UCommonUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
        UCommonUtility.INSTANCE = this
    }

    public getResultObjectOne(): IResultOne {
        return {
            error: undefined,
            message: undefined,
            success: undefined,
            value: undefined,
        }
    }

    public getResultObjectMultiple(): IResultMultiple {
        return {
            error: undefined,
            message: undefined,
            results: {},
            success: undefined,
            value: undefined,
        }
    }

    public getResultsObject(
        ATOMIC_RESULT_STRINGS,
    ): IResults | any {
        const resultsObject = {}
        for (const resultString of ATOMIC_RESULT_STRINGS) {
            const RESULT_OBJECT: IResultOne = this.getResultObjectOne()
            resultsObject[resultString] = RESULT_OBJECT
        }
        return resultsObject
    }

}
export const UCommon = UCommonUtility.getInstance()
