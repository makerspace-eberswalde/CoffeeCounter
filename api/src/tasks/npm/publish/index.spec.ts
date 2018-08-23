// https://gitlab.com/divramod/dm-tpl/issues/7
import { UGit } from '@utils/nodejs/git'
import { describe, expect, it, TEST_PATH, UTest } from '@utils/nodejs/test'
import { Task } from './'

// REQUIRE
const RIMRAF = require('rimraf')

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// TESTSUITE
describe.skip(__filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(TEST_PATH) // REMOVE DIRECTORY
    })

    it([
        'run()',
        'success:',
        'all conditions fulfilled',
    ].join(' '), async () => {

        // PREPARE TASK
        const TASK = new Task({ cwd: __dirname, logging: false })

        // PREPARE Repository
        await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)
        const R_CHECKOUT_BRANCH: boolean =
            await UGit.checkoutBranch(TEST_PATH, 'feature/123')

        // RUN
        const R: IResultMultiple = await TASK.run({
            projectPath: TEST_PATH,
        })

        // isGitRepository
        expect(R.results.isGitRepository.value).not.to.be.undefined
        expect(R.results.isGitRepository.value).to.equal(true)

        // checkIsFeatureBranch
        const R_IS_FEATURE_BRANCH =
            await UGit.checkIsFeatureBranch(TEST_PATH)
        expect(R.results.isFeatureBranch.value).not.to.be.undefined
        expect(R.results.isFeatureBranch.value).to.equal(true)

        // isClean
        expect(R.results.isClean.value).not.to.be.undefined
    })

})
