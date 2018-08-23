// https://gitlab.com/divramod/dm-tpl/issues/7

// IMPORT
import { UCommon } from '@utils/nodejs/common'
import { UGit } from '@utils/nodejs/git'

// TYPINGS / SuperTask
import {
    ITaskClass,
    ITaskConstructorParams,
    SuperTask,
} from '@utils/dmTpl/task/index'
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// CLASS Task
export class Task extends SuperTask implements ITaskClass {

    constructor(opts: ITaskConstructorParams) {
        super({
            cwd: opts.cwd,
            logging: opts.logging || false,
            name: 'Npm Publish',
        })
    }

    public async run(PARAMS: {
        projectPath: string,
    }): Promise<IResultMultiple> {

        // SUPER runBefore()
        await super.runBefore()

        // DESTRUCT PRAMS
        const { projectPath } = PARAMS

        // INTERFACE for Task.run()
        interface INpmPublishTaskRunSubResults extends IResults {
            isGitRepository: IResultOne;
            isFeatureBranch: IResultOne;
        }

        // Initialize Results
        const RM: IResultMultiple = UCommon.getResultObjectMultiple()
        const RE: INpmPublishTaskRunSubResults = UCommon.getResultsObject([
            'isGitRepository',
            'isFeatureBranch',
            'isClean',
            'getFeatureName',
            'getFeatureIssueNumber',
        ])

        // INIT PROCEED
        let proceed = true

        // isGitRepository
        if (proceed) {
            if (await UGit.checkIsRepo(projectPath)) {
                RM.success = RE.isGitRepository.value = proceed = true
                RM.message = RE.isGitRepository.message = [
                    projectPath,
                    ' is a git repository!',
                ].join(' ')
            } else {
                RM.success = RE.isGitRepository.value = proceed = false
                RM.message = RE.isGitRepository.message = [
                    projectPath,
                    ' is not a git repository!',
                ].join(' ')
            }
        }

        // checkIsFeatureBranch
        if (proceed) {
            if (await UGit.checkIsFeatureBranch(projectPath)) {
                RM.success = RE.isFeatureBranch.value = proceed = true
                RM.message = RE.isFeatureBranch.message = [
                    projectPath,
                    ' is a feature branch!',
                ].join(' ')
            } else {
                RM.success = RE.isFeatureBranch.value = proceed = false
                RM.message = RE.isFeatureBranch.message = [
                    projectPath,
                    ' is not a feature branch!',
                ].join(' ')
            }
        }

        // isClean
        if (proceed) {
            if (await UGit.checkIsClean(projectPath)) {
                RM.success = RE.isClean.value = proceed = true
                RM.message = RE.isClean.message = [
                    projectPath,
                    ' is clean!',
                ].join(' ')
            } else {
                RM.success = RE.isClean.value = proceed = false
                RM.message = RE.isClean.message = [
                    projectPath,
                    ' is not clean!',
                ].join(' ')
            }
        }

        // get feature name and issue number
        const FEATURE_NAME = RE.getFeatureName.value =
            await UGit.getFeatureName(projectPath)
        const ISSUE_NUMBER = RE.getFeatureIssueNumber.value =
            await UGit.getFeatureIssueNumber(projectPath)

        // gitPushOriginHead
        if (proceed) {
            //
        }

        // SET RM RE
        RM.results = RE

        // SUPER runAfter()
        await super.runAfter()

        // RETURN
        return RM
    }

}
