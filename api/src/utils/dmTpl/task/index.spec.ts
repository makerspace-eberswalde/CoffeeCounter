// https://gitlab.com/divramod/dm-tpl/issues/7
import {
    IResultMultiple,
    IResultOne,
    IResults,
    UCommon,
} from '@utils/nodejs/common'
import { describe, expect, it } from '@utils/nodejs/test'
import { ITaskClass, ITaskConstructorParams, SuperTask } from './'

// TEST CLASS Task
class Task extends SuperTask implements ITaskClass {

    constructor(opts: ITaskConstructorParams) {
        super({ name: 'Test', cwd: opts.cwd, logging: opts.logging || false })
    }

    public async run(): Promise<IResultMultiple> {
        // PREPARE
        await super.runBefore()

        // RUN
        const RESULT_MAIN: IResultMultiple = UCommon.getResultObjectMultiple()
        const RESULTS: IResults = UCommon.getResultsObject([
            'someResult1',
            'someResult2',
        ])
        RESULT_MAIN.results = RESULTS

        // PRODUCE SUB RESULT
        const someResult1: IResultOne = UCommon.getResultObjectOne()
        someResult1.success = true
        RESULT_MAIN.results.someResult1 = someResult1

        // PRODUCE SUB RESULT
        const someResult2: IResultOne = UCommon.getResultObjectOne()
        someResult2.success = false
        RESULT_MAIN.results.someResult2 = someResult2

        // PRODUCE RESULT
        RESULT_MAIN.success = true
        RESULT_MAIN.message = 'message'

        // FINISH
        await super.runAfter()

        // RETURN
        return RESULT_MAIN
    }

}

describe(__filename, async () => {

    it('run()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = await T.run()
        expect(R.results.someResult1.success).to.equal(true)
        expect(R.results.someResult2.success).to.equal(false)

    })

    it('constructor()', async () => {

        const T = new Task({ cwd: __dirname})
        expect(T).to.deep.equal(T)

    })

    it('printName()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.printName()
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = T1.printName()
        expect(R1).to.equal(true)

    })

    it('getTaskPath()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.getTaskPath()
        expect(R).to.equal('@utils/dmTpl/task')

    })

    it('getName()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.getName()
        expect(R).to.equal('Test')

    })

    it('async runBefore()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = await T.runBefore()
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = await T1.runBefore()
        expect(R1).to.equal(true)
    })

    it('async runAfter()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = await T.runAfter()
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = await T1.runAfter()
        expect(R1).to.equal(true)

    })

    it('logValue()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.logValue('', '')
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = T1.logValue('', '')
        expect(R1).to.equal(true)
    })

    it('logHeader()', async () => {
        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.logHeader('', '')
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = T1.logHeader('', '')
        expect(R1).to.equal(true)
    })

})
