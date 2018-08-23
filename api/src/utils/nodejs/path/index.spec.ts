// https://gitlab.com/divramod/dm-tpl/issues/4
// IMPORT
import { describe, expect, it, TEST_PATH, UTest } from '@utils/nodejs/test'
import { UPath as U_INSTANCE, UPathUtility as U_CLASS } from './'

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

    describe('UPath.class()', async () => {

        it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

        it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    })

    describe('UPath.createDirectory()', async () => {

        it([
            'success',
        ].join(' '), async () => {

            // PREPARE

            // RUN
            const R: IResultOne = await U_INSTANCE.createDirectory(
                TEST_PATH,
            )

            // TEST
            expect(R.success).to.equal(true)
            expect(R.message).to.equal([
                'Directory',
                TEST_PATH,
                'created!',
            ].join(' '))

        })

        it([
            'success:',
            'bDeleteIfDirectoryExistant true',
        ].join(' '), async () => {

            // PREPARE

            // RUN
            const R_PREPARE: IResultOne = await U_INSTANCE.createDirectory(
                TEST_PATH,
            )
            const R: IResultOne = await U_INSTANCE.createDirectory(
                TEST_PATH,
                true,
            )

            // TEST
            expect(R.success).to.equal(true)
            expect(R.message).to.equal([
                'Directory',
                TEST_PATH,
                'removed and created!',
            ].join(' '))

        })

        it([
            'success:',
            'bDeleteIfDirectoryExistant false',
        ].join(' '), async () => {

            // PREPARE

            // RUN
            const R_PREPARE: IResultOne = await U_INSTANCE.createDirectory(
                TEST_PATH,
            )
            const R: IResultOne = await U_INSTANCE.createDirectory(
                TEST_PATH,
                false,
            )

            // TEST
            expect(R.success).to.equal(false)
            expect(R.message).to.equal([
                'Directory',
                TEST_PATH,
                'existant and not created!',
            ].join(' '))

        })

    })

    describe('UPath.createFile()', async () => {

        it([
            'success:',
            'file created',
        ].join(' '), async () => {

            // PREPARE
            await U_INSTANCE.createDirectory(TEST_PATH)
            const FILE_PATH = PATH.resolve(
                TEST_PATH,
                'test.json',
            )

                // RUN
            const R: IResultOne =
                await U_INSTANCE.createFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                )

            // TEST
            expect(R.success).not.to.equal(undefined)
            expect(R.message).to.equal([
                FILE_PATH,
                'created!',
            ].join(' '))
        })

        it([
            'success:',
            'file created,',
            'content default',
        ].join(' '), async () => {

            // PREPARE
            await U_INSTANCE.createDirectory(TEST_PATH)
            const FILE_PATH = PATH.resolve(
                TEST_PATH,
                'test.json',
            )

                // RUN
            const R: IResultOne =
                await U_INSTANCE.createFile(
                    FILE_PATH,
                )

            // TEST
            expect(R.success).not.to.equal(undefined)
            expect(R.message).to.equal([
                FILE_PATH,
                'created!',
            ].join(' '))
        })

        it([
            'success:',
            'file existant, overwrite true',
        ].join(' '), async () => {

            // PREPARE
            await U_INSTANCE.createDirectory(TEST_PATH)
            const FILE_PATH = PATH.resolve(
                TEST_PATH,
                'test.json',
            )
            const R_PREPARE: IResultOne =
                await U_INSTANCE.createFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                )

                // RUN
            const R: IResultOne =
                await U_INSTANCE.createFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                    true,
                )

            // TEST
            expect(R.success).not.to.equal(undefined)
            expect(R.message).to.equal([
                FILE_PATH,
                'overwritten!',
            ].join(' '))
        })

        it([
            'failure:',
            'file existant, overwrite false',
        ].join(' '), async () => {

            // PREPARE
            await U_INSTANCE.createDirectory(TEST_PATH)
            const FILE_PATH = PATH.resolve(
                TEST_PATH,
                'test.json',
            )
            const R_PREPARE: IResultOne =
                await U_INSTANCE.createFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                )

                // RUN
            const R: IResultOne =
                await U_INSTANCE.createFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                )

            // TEST
            expect(R.success).not.to.equal(undefined)
            expect(R.message).to.equal([
                FILE_PATH,
                'existant!',
            ].join(' '))
        })

        it([
            'failure:',
            'directory not existant',
        ].join(' '), async () => {

            // PREPARE
            const FILE_PATH = PATH.resolve(
                TEST_PATH,
                'test.json',
            )

                // RUN
            const R: IResultOne =
                await U_INSTANCE.createFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                )

            // TEST
            expect(R.success).not.to.equal(undefined)
            expect(R.message).to.equal([
                'Directory',
                PATH.dirname(FILE_PATH),
                'not existant!',
            ].join(' '))
        })

    })

})
