// https://gitlab.com/divramod/dm-tpl/issues/4
import { describe, expect, it, TEST_PATH, UTest } from '@utils/nodejs/test'
import { UGit as U_INSTANCE, UGitUtility as U_CLASS } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')
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

    describe('UGit.class()', async () => {

        it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

        it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    })

    describe('UGit.getFeatureName()', async () => {

        it([
            'failure:',
            'is not a git repository',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(TEST_PATH)

            // RUN
            const R: IResultMultiple =
                await U_INSTANCE.getFeatureName(TEST_PATH)

            // TEST
            expect(R.success).to.equal(false)
            expect(R.value).to.equal(undefined)
            expect(R.message).to.equal([
                TEST_PATH,
                'is not a git repository!',
            ].join(' '))

        })

        it([
            'failure:',
            'is not a feature branch',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)

            // RUN
            const R: IResultMultiple =
                await U_INSTANCE.getFeatureName(TEST_PATH)

            // TEST
            expect(R.success).to.equal(false)
            expect(R.value).to.equal(undefined)
            expect(R.message).to.equal([
                TEST_PATH,
                'is not on a feature Branch!',
            ].join(' '))

        })

        it([
            'success:',
            'returns issue number',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)
            await U_INSTANCE.checkoutBranch(
                TEST_PATH,
                'feature/004-job-npm-publish',
            )

            // RUN
            const R: IResultMultiple =
                await U_INSTANCE.getFeatureName(TEST_PATH)

            // TEST
            expect(R.success).to.equal(true)
            expect(R.value).to.equal('job-npm-publish')
            expect(R.message).to.equal([
                TEST_PATH,
                'branch name is',
                'job-npm-publish',
            ].join(' '))

        })
    })

    describe('UGit.getFeatureIssueNumber()', async () => {

        it([
            'failure:',
            'is not a git repository',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(TEST_PATH)

            // RUN
            const R: IResultMultiple =
                await U_INSTANCE.getFeatureIssueNumber(TEST_PATH)

            // TEST
            expect(R.success).to.equal(false)
            expect(R.value).to.equal(undefined)
            expect(R.message).to.equal([
                TEST_PATH,
                'is not a git repository!',
            ].join(' '))

        })

        it([
            'failure:',
            'is not a feature branch',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)

            // RUN
            const R: IResultMultiple =
                await U_INSTANCE.getFeatureIssueNumber(TEST_PATH)

            // TEST
            expect(R.success).to.equal(false)
            expect(R.value).to.equal(undefined)
            expect(R.message).to.equal([
                TEST_PATH,
                'is not on a feature Branch!',
            ].join(' '))

        })

        it([
            'success:',
            'returns issue number',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)
            await U_INSTANCE.checkoutBranch(
                TEST_PATH,
                'feature/004-job-npm-publish',
            )

            // RUN
            const R: IResultMultiple =
                await U_INSTANCE.getFeatureIssueNumber(TEST_PATH)

            // TEST
            expect(R.success).to.equal(true)
            expect(R.value).to.equal(4)
            expect(R.message).to.equal([
                TEST_PATH,
                'issue number is',
                4,
            ].join(' '))

        })

    })

    describe('UGit.checkIsClean()', async () => {

        // checkIsClean
        it([
            'success:',
            'repo clean',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)

            // RUN
            const R: boolean = await U_INSTANCE.checkIsClean(TEST_PATH)

            // TEST
            expect(R).to.equal(true)
        })

        // checkIsClean
        it([
            'failure:',
            'repo not clean',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)
            SHELL.touch(PATH.resolve(TEST_PATH, 'README.md'))

            // RUN
            const R: boolean = await U_INSTANCE.checkIsClean(TEST_PATH)

            // TEST
            expect(R).to.equal(false)
        })

    })

    describe('UGit.checkIsRepo()', async () => {

        it([
            'failure:',
            'repo not existant',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(TEST_PATH)

            // RUN
            const R: IResultOne = await U_INSTANCE.checkIsRepo(TEST_PATH)

            // TEST
            expect(R.value).to.equal(false)
        })

        it([
            'success:',
            'repo existant',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)

            // RUN
            const R: IResultOne = await U_INSTANCE.checkIsRepo(TEST_PATH)

            // TEST
            expect(R.value).to.equal(true)
        })

    })

    describe('UGit.getBranchName()', async () => {

        it([
            'success:',
            'repo existant',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)

            // RUN
            const R = await U_INSTANCE.getBranchName(TEST_PATH)

            // TEST
            expect(R).to.equal('master')
        })

        it([
            'success:',
            'repo not existant',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(TEST_PATH)

            // RUN
            const R = await U_INSTANCE.getBranchName(TEST_PATH)

            // TEST
            expect(R).to.equal(undefined)
        })

    })

    describe('UGit.checkoutBranch()', async () => {

        it([
            'success:',
            'repo existant',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)

            // RUN
            const R: boolean =
                await U_INSTANCE.checkoutBranch(
                    TEST_PATH,
                    'feature/123',
                )

            // TEST
            expect(R).to.equal(true)
        })

        it([
            'failure:',
            'repo not existant',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(TEST_PATH)

            // RUN
            const R: boolean =
                await U_INSTANCE.checkoutBranch(
                    TEST_PATH,
                    'feature/123',
                )

            // TEST
            expect(R).to.equal(false)

        })

    })

    describe('UGit.checkIsFeatureBranch()', async () => {

        it([
            'failure:',
            'repo not existant',
        ].join(' '), async () => {
            // PREPARE
            await UTest.createTestDirectory(TEST_PATH)

            // RUN
            const R = await U_INSTANCE.checkIsFeatureBranch(TEST_PATH)

            // TEST
            expect(R.value).to.equal(false)
        })

        it([
            'failure:',
            'not a feature branch',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)

            // RUN
            const R = await U_INSTANCE.checkIsFeatureBranch(TEST_PATH)

            // TEST
            expect(R.value).to.equal(false)
            expect(R.message).to.equal('Is not a Feature Branch')
        })

        it([
            'success:',
            'repo existant, feature checked out',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)
            await U_INSTANCE.checkoutBranch(TEST_PATH, 'feature/123')

            // RUN
            const R = await U_INSTANCE.checkIsFeatureBranch(TEST_PATH)

            // TEST
            expect(R.value).to.equal(true)
        })

    })

    describe.skip('UGit.gitPushOriginHead()', async () => {

        it([
            'success:',
            '',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)

            // RUN
            const R = await U_INSTANCE.pushOriginHead(TEST_PATH)

            // TEST
            expect(0).to.equal(1) // fails

        })

    })

})
