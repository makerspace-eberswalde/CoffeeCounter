// https://gitlab.com/divramod/dm-tpl/issues/4
// IMPORT
import { UCommon } from '@utils/nodejs/common'

// REQUIRE
const PATH = require('path')
const SHELL = require('shelljs')

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// CLASS
export class UJsonUtility {

    public static getInstance(): UJsonUtility {
        return UJsonUtility.INSTANCE
    }

    private static INSTANCE: UJsonUtility = new UJsonUtility()
    public name: string = 'UJsonUtility'

    constructor() {
        if (UJsonUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
        UJsonUtility.INSTANCE = this
    }

    public async getKeyValueFromFile(
        FILE_PATH,
        KEY_NAME,
    ): Promise<IResultOne> {
        // PREPARE
        const RESULT: IResultOne = UCommon.getResultObjectOne()

        // RUN
        const FILE_EXSITANT = SHELL.test('-f', PATH.resolve(FILE_PATH))
        if (FILE_EXSITANT) {
            delete require.cache[FILE_PATH]
            const FILE = require(FILE_PATH)
            if (FILE[KEY_NAME]) {
                RESULT.success = true
                RESULT.value = FILE[KEY_NAME]
            } else {
                RESULT.success = false
                RESULT.message = [
                    KEY_NAME,
                    'not existant in',
                    FILE_PATH,
                    '!',
                ].join(' ')
            }

        } else {
            RESULT.success = false
            RESULT.message = [
                FILE_PATH,
                'not existant!',
            ].join(' ')
        }

        // RETURN
        return RESULT
    }

}
export const UJson = UJsonUtility.getInstance()
