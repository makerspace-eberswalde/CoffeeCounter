// https://gitlab.com/divramod/dm-tpl/issues/4

// IMPORT
import { UCommon } from '@utils/nodejs/common'

// REQUIRE
const FS = require('fs')
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// CLASS
export class UPathUtility {

    public static getInstance(): UPathUtility {
        return UPathUtility.INSTANCE
    }

    private static INSTANCE: UPathUtility = new UPathUtility()
    public name: string = 'UPathUtility'

    constructor() {
        if (UPathUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
        UPathUtility.INSTANCE = this
    }

    public async createDirectory(
        directoryPath: string,
        bDeleteIfDirectoryExistant: boolean = false,
    ): Promise<IResultMultiple> {
        // PREPARE
        const RESULT: IResultMultiple = UCommon.getResultObjectMultiple()
        const DIRECTORY_PATH = PATH.resolve(directoryPath)

        // PREPARE RESULT OBJECT
        const RESULTS_OBJECT =
        UCommon.getResultsObject([
            'bDirectoryExistant',
            'cDeletedIfDirectoryExistant',
        ])

        // RUN
        const DIRECTORY_EXISTANT = SHELL.test('-d', PATH.resolve(directoryPath))
        if (DIRECTORY_EXISTANT) {
            if (bDeleteIfDirectoryExistant) {
                RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
                SHELL.mkdir('-p', DIRECTORY_PATH) // CREATE DIRECTORY
                RESULT.success = RESULTS_OBJECT.bDirectoryExistant.value = true
                RESULT.message =
                    RESULTS_OBJECT.bDirectoryExistant.message =
                    [
                        'Directory',
                        DIRECTORY_PATH,
                        'removed and created!',
                    ].join(' ')
            } else {
                RESULT.success = RESULTS_OBJECT.bDirectoryExistant.value = false
                RESULT.message =
                    RESULTS_OBJECT.bDirectoryExistant.message =
                    [
                        'Directory',
                        DIRECTORY_PATH,
                        'existant and not created!',
                    ].join(' ')
            }
        } else {
            RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
            SHELL.mkdir('-p', DIRECTORY_PATH) // CREATE DIRECTORY
            RESULT.success = RESULTS_OBJECT.bDirectoryExistant.value = true
            RESULT.message =
                RESULTS_OBJECT.bDirectoryExistant.message =
                [
                    'Directory',
                    DIRECTORY_PATH,
                    'created!',
                ].join(' ')
        }

        // RETURN
        return RESULT
    }

    public async createFile(
        FILE_PATH,
        FILE_CONTENT = '',
        OVERWRITE_IF_EXISTANT = false,
    ): Promise<IResultOne> {
        // PREPARE
        const RESULT: IResultOne = UCommon.getResultObjectOne()

        // RUN
        const FILE_DIRECTORY_PATH = PATH.dirname(FILE_PATH)
        const FILE_DIRECTORY_PATH_EXISTANT =
        SHELL.test('-d', FILE_DIRECTORY_PATH)
        if (FILE_DIRECTORY_PATH_EXISTANT) {
            const FILE_EXSITANT =
                SHELL.test('-f', FILE_PATH)
            let writeFile = true
            if (FILE_EXSITANT) {
                if (!OVERWRITE_IF_EXISTANT) {
                    writeFile = false
                    RESULT.success = false
                    RESULT.message = [
                        FILE_PATH,
                        'existant!',
                    ].join(' ')
                }
            }
            if (writeFile) {
                FS.writeFileSync(FILE_PATH, FILE_CONTENT)
                RESULT.success = true
            }
            if (writeFile && FILE_EXSITANT) {
                RESULT.message = [
                    FILE_PATH,
                    'overwritten!',
                ].join(' ')
            }
            if (writeFile && !FILE_EXSITANT) {
                RESULT.message = [
                    FILE_PATH,
                    'created!',
                ].join(' ')
            }
            // SHELL.exec('ls -lisa ' + FILE_DIRECTORY_PATH)
            // SHELL.exec('cat ' + FILE_PATH)
        } else {
            RESULT.success = false
            RESULT.message = [
                'Directory',
                FILE_DIRECTORY_PATH,
                'not existant!',
            ].join(' ')
        }

        // RETURN
        return RESULT
    }

}
export const UPath = UPathUtility.getInstance()
