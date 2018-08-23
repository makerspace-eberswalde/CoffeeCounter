// https://gitlab.com/divramod/dm-tpl/issues/4
// IMPORT
import { describe, expect, it, TEST_PATH, UTest } from '@utils/nodejs/test'
import { UJson as U_INSTANCE, UJsonUtility as U_CLASS } from './'

// REQUIRE
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// TESTSUITE
describe(__filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(TEST_PATH) // REMOVE DIRECTORY
    })

    describe('UJson.class()', async () => {

        it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

        it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    })

    describe.skip('UJson.getKeyValueFromFile()', async () => {

        it([
            'success:',
            'key existant',
        ].join(' '), async () => {

            // PREPARE

            // RUN
            const R: IResultOne =
                await U_INSTANCE.getKeyValueFromFile(
                    PATH.resolve(
                        process.cwd(),
                        'dm-tpl.config.json',
                    ),
                    'name',
                )

            // TEST
            expect(R.value).not.to.equal(undefined)
            expect(R.value).to.equal('test')

        })

    })

})
