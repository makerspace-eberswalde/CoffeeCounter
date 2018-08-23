// https://gitlab.com/divramod/dm-tpl/issues/4

// IMPORT
const GIT_P = require('simple-git/promise')
const branchName = require('branch-name')
const SHELL = require('shelljs')
const PATH = require('path')

// IMPORT
import { UCommon } from '@utils/nodejs/common'
import { UTest } from '@utils/nodejs/test'

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// CLASS
export class UGitUtility {

    public static getInstance(): UGitUtility {
        return UGitUtility.INSTANCE
    }

    private static INSTANCE: UGitUtility = new UGitUtility()
    public name: string = 'UGitUtility'

    constructor() {
        if (UGitUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
        UGitUtility.INSTANCE = this
    }

    public async checkIsFeatureBranch(
        GIT_REPOSITORY_PATH: string,
    ): Promise<IResultOne> {

        // RESULT
        const RESULT: IResultOne = UCommon.getResultObjectOne()

        const R_CHECK_IS_REPO =
            await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const BRANCH_NAME = await this.getBranchName(GIT_REPOSITORY_PATH)
            if (BRANCH_NAME.indexOf('feature/') !== -1) {
                RESULT.value = true
                RESULT.message = 'Is on a Feature Branch'
            } else {
                RESULT.value = false
                RESULT.message = 'Is not a Feature Branch'
            }
        } else {
            RESULT.value = false
            RESULT.message = 'No Git Repository at path ' + GIT_REPOSITORY_PATH
        }
        return RESULT
    }

    public async checkIsRepo(
        DIRECTORY_PATH,
    ): Promise<IResultOne> {
        // RESULT
        const RESULT: IResultOne = UCommon.getResultObjectOne()

        const GIT = GIT_P(DIRECTORY_PATH)
        const CWD_BEFORE = process.cwd()
        process.chdir(DIRECTORY_PATH)
        const R_CHECK_IS_REPO = await GIT.checkIsRepo()
        RESULT.value = R_CHECK_IS_REPO
        process.chdir(CWD_BEFORE)

        return RESULT
    }

    public async getBranchName(GIT_REPOSITORY_PATH): Promise<string> {
        let result
        const R_CHECK_IS_REPO =
            await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            result = await branchName.get({
                cwd: GIT_REPOSITORY_PATH,
            })
        }
        return result
    }

    public async checkoutBranch(
        GIT_REPOSITORY_PATH,
        BRANCH_NAME,
    ): Promise<boolean> {
        let result = false
        const R_CHECK_IS_REPO =
            await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const GIT = GIT_P(GIT_REPOSITORY_PATH)
            await GIT.raw([
                'checkout',
                '-b',
                BRANCH_NAME,
            ])
            result = true
        }

        return result
    }

    public async checkIsClean(
        GIT_REPOSITORY_PATH,
    ): Promise<boolean> {
        let result = true
        const R_CHECK_IS_REPO =
            await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const GIT = GIT_P(GIT_REPOSITORY_PATH)
            const R = await GIT.status()
            if (R.files.length > 0) {
                result = false
            }
        }
        return result
    }

    public async getFeatureName(
        GIT_REPOSITORY_PATH,
    ): Promise<IResultMultiple> {
        const RESULT: IResultMultiple = UCommon.getResultObjectMultiple()
        const R_CHECK_IS_REPO =
            await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const R_IS_FEATURE_BRANCH =
                await this.checkIsFeatureBranch(GIT_REPOSITORY_PATH)
            if (R_IS_FEATURE_BRANCH.value) {
                const BRANCH_NAME =
                    await this.getBranchName(GIT_REPOSITORY_PATH)
                const FEATURE_BRANCH_NAME =
                    BRANCH_NAME.substring(8, BRANCH_NAME.length)
                const FEATURE_NAME =
                    FEATURE_BRANCH_NAME.substring(
                        FEATURE_BRANCH_NAME.indexOf('-') + 1,
                        FEATURE_BRANCH_NAME.length,
                    )
                RESULT.value = FEATURE_NAME
                RESULT.success = true
                RESULT.message = [
                    GIT_REPOSITORY_PATH,
                    'branch name is',
                    FEATURE_NAME,
                ].join(' ')
            } else {
                RESULT.success = false
                RESULT.message = [
                    GIT_REPOSITORY_PATH,
                    'is not on a feature Branch!',
                ].join(' ')
            }
        } else {
            RESULT.success = false
            RESULT.message = [
                GIT_REPOSITORY_PATH,
                'is not a git repository!',
            ].join(' ')
        }
        return RESULT
    }

    public async getFeatureIssueNumber(
        GIT_REPOSITORY_PATH,
    ): Promise<IResultMultiple> {
        const RESULT: IResultMultiple = UCommon.getResultObjectMultiple()
        const R_CHECK_IS_REPO =
            await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const R_IS_FEATURE_BRANCH =
                await this.checkIsFeatureBranch(GIT_REPOSITORY_PATH)
            if (R_IS_FEATURE_BRANCH.value) {
                const BRANCH_NAME =
                    await this.getBranchName(GIT_REPOSITORY_PATH)
                const FEATURE_BRANCH_NAME =
                    BRANCH_NAME.substring(8, BRANCH_NAME.length)
                const ISSUE_NUMBER =
                    Number(FEATURE_BRANCH_NAME.substring(
                        0,
                        FEATURE_BRANCH_NAME.indexOf('-'),
                    ))
                RESULT.value = ISSUE_NUMBER
                RESULT.success = true
                RESULT.message = [
                    GIT_REPOSITORY_PATH,
                    'issue number is',
                    ISSUE_NUMBER,
                ].join(' ')
            } else {
                RESULT.success = false
                RESULT.message = [
                    GIT_REPOSITORY_PATH,
                    'is not on a feature Branch!',
                ].join(' ')
            }
        } else {
            RESULT.success = false
            RESULT.message = [
                GIT_REPOSITORY_PATH,
                'is not a git repository!',
            ].join(' ')
        }
        return RESULT
    }

    public async pushOriginHead(
        GIT_REPOSITORY_PATH,
    ): Promise<IResultOne> {
        const RESULT: IResultOne = UCommon.getResultObjectOne()
        const R_CHECK_IS_REPO =
            await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const GIT = GIT_P(GIT_REPOSITORY_PATH)
            await GIT.raw([
                'push',
                'origin',
                'HEAD',
            ])

        }

        return RESULT
    }

}
export const UGit = UGitUtility.getInstance()
