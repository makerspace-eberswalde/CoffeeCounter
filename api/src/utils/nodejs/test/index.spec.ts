// https://gitlab.com/divramod/dm-tpl/issues/7

// REQUIRE
const RIMRAF = require('rimraf')
const PATH = require('path')

// IMPORT
import { describe, expect, it, TEST_PATH, UTest } from '@utils/nodejs/test'
import { UTest as U_INSTANCE, UTestUtility as U_CLASS } from './'

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
        process.env.DMTPL_ENV = 'testing'
    })

    afterEach(async () => {
        RIMRAF.sync(TEST_PATH) // REMOVE DIRECTORY
        process.env.DMTPL_ENV = 'testing'
    })

    describe('UTest.class()', async () => {

        it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))
        it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    })

    describe('UTest.userInputCleanup()', async () => {

        it([
            'success',
            '1 line',
        ].join(' '), async () => {
            console.log([ // tslint:disable-line:no-console
                'some very very very very very very long input',
            ].join())
            const R = await U_INSTANCE.userInputCleanup(1)
            expect(R).to.equal(true)
        })

        it([
            'success',
            '3 lines',
        ].join(' '), async () => {
            process.env.DMTPL_ENV = ''
            const R = await U_INSTANCE.userInputCleanup(3)
            expect(R).to.equal(false)
            process.env.DMTPL_ENV = 'testing'
        })

    })

    describe('UTest.getEnv()', async () => {

        it('success', async () => {
            const R = U_INSTANCE.getEnv()
            expect(R).to.equal('testing')
        })

    })

    describe('UTest.createTestDirectory()', async () => {

        it([
            'createTestDirectory():',
            'failure:',
            'wrong path,',
        ].join(' '), async () => {
            const WRONG_DIRECTORY_PATH = '/bla'
            const R = await U_INSTANCE.createTestDirectory(
                WRONG_DIRECTORY_PATH,
                true,
            )
            expect(R.success).to.equal(false)
            expect(R.message).to.equal([
                'You can\'t use the directory',
                WRONG_DIRECTORY_PATH,
                'for testing purposes!',
                'Please use a subdirectory of \'/tmp/test\'!',
            ].join(' '))
        })

        it([
            'createTestDirectory():',
            'success:',
            'right path,',
            'deleteIfExistant true',
        ].join(' '), async () => {
            const R_PREPARE = await U_INSTANCE.createTestDirectory(TEST_PATH)
            const R = await U_INSTANCE.createTestDirectory(TEST_PATH, true)
            expect(R.success).to.equal(true)
            expect(R.message).to.equal([
                'Directory',
                TEST_PATH,
                'removed and created!',
            ].join(' '))
        })

        it([
            'createTestDirectory():',
            'success:',
            'right path,',
            'deleteIfExistant false',
        ].join(' '), async () => {
            const R_PREPARE = await U_INSTANCE.createTestDirectory(TEST_PATH)
            const R = await U_INSTANCE.createTestDirectory(TEST_PATH, false)
            expect(R.success).to.equal(false)
            expect(R.message).to.equal([
                'Directory',
                TEST_PATH,
                'existant and not created!',
            ].join(' '))
        })

    })

    describe('UTest.gitCreateTestRepositoryAtPath()', async () => {

        it([
            'success',
        ].join(' '), async () => {

            // RUN
            const R_CREATED =
                await UTest.createTestDirectory(TEST_PATH)

            // TEST
            expect(R_CREATED.success).to.equal(true)

            // RUN
            const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(TEST_PATH)

            // TEST
            expect(R.success).to.equal(true)
        })

        it([
            'success:',
            'createDirectoryIfNotExistant true',
        ].join(' '), async () => {

            // RUN
            const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                TEST_PATH,
                true,
            )

            // TEST
            expect(R.success).to.equal(true)

            // RUN
            const R1 = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                TEST_PATH,
                false,
                true,
                true,
            )

            // TEST
            expect(R1.success).to.equal(true)

        })

        it([
            'success:',
            'removeDirectoryIfExistant false',
        ].join(' '), async () => {

            // RUN
            const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                TEST_PATH,
                true,
            )

            // TEST
            expect(R.success).to.equal(true)

            // RUN
            const R1 = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                TEST_PATH,
                true,
                false,
                true,
            )

            // TEST
            expect(R1.success).to.equal(true)

        })

        it([
            'success:',
            'rGRIE false, rDIE false',
        ].join(' '), async () => {

            // RUN
            const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                TEST_PATH,
                true,
            )

            // TEST
            expect(R.success).to.equal(true)

            // RUN
            const R1 = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                TEST_PATH,
                true,
                false,
                false,
            )

            // TEST
            expect(R1.success).to.equal(true)

        })

        it([
            'failure:',
            'createDirectoryIfNotExistant false',
        ].join(' '), async () => {

            // RUN
            const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                TEST_PATH,
                false,
            )

            // TEST
            expect(R.success).to.equal(false)

        })

    })

    describe('UTest.createTestFile()', async () => {

        it([
            'success:',
            'file created',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(TEST_PATH)
            const FILE_PATH = PATH.resolve(
                TEST_PATH,
                'test.json',
            )

                // RUN
            const R: IResultOne =
                await U_INSTANCE.createTestFile(
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
            'failure:',
            'directory not in',
            TEST_PATH,
        ].join(' '), async () => {

            // PREPARE
            const FILE_PATH = PATH.resolve(
                process.cwd(),
                'test.json',
            )

                // RUN
            const R: IResultOne =
                await U_INSTANCE.createTestFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                )

            // TEST
            expect(R.success).not.to.equal(undefined)
            expect(R.message).to.equal([
                FILE_PATH,
                'not in',
                TEST_PATH,
            ].join(' '))
        })

    })

})
