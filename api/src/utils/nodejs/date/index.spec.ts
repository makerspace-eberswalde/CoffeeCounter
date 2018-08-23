// https://gitlab.com/divramod/dm-tpl/issues/7
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UDate as U_INSTANCE, UDateUtility as U_CLASS } from './'

// TESTSUITE
describe(__filename, async () => {

    it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

    it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    it('getDateDiff()', async () => {

        const DATE1 = +new Date()
        const DATE2 = +new Date()
        const DIFF = (DATE2 - DATE1)
        const R = U_INSTANCE.getDateDiff(DATE1, DATE2)
        expect(R).to.equal(DIFF)

    })

})
