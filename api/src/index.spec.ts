// gitlab.com/divramod/dm-tpl/issues/4
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { main } from './'

describe(__filename, async () => {

    describe('main()', async () => {

        it('env="testing"', async () => {
            const R = await main()
            expect(R.value).to.equal(false) // passes
        })

        it.skip('env="production"', async () => {
            const RE = require('./')
            process.env.DMTPL_ENV = 'production'
            const R = await RE.main()
            UTest.userInputCleanup(1, true)
            process.env.DMTPL_ENV = 'testing'
            expect(R.value).to.equal(true) // fails
            R.app.close()
            UTest.userInputCleanup(1)
        })

    })

})
