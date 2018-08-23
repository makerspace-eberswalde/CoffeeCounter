// https://gitlab.com/divramod/dm-tpl/issues/7

// IMPORT

// TYPINGS

// CLASS
export class UDateUtility {

    public static getInstance(): UDateUtility {
        return UDateUtility.INSTANCE
    }

    private static INSTANCE: UDateUtility = new UDateUtility()
    public name: string = 'UDateUtility'

    constructor() {
        if (UDateUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
        UDateUtility.INSTANCE = this
    }

    public getDateDiff(DATE1, DATE2): number {
        return DATE2 - DATE1
    }

}
export const UDate  = UDateUtility.getInstance()
