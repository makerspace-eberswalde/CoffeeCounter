// https://gitlab.com/divramod/dm-tpl/issues/1
// IMPORT
import { describe, expect, it, TEST_PATH, UTest } from '@utils/nodejs/test'
import { UApp as U_INSTANCE, UAppUtility as U_CLASS } from './'

// REQUIRE
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')
const request = require('supertest')

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// TESTSUITE
describe(__filename, async () => {

    describe('UApp.class()', async () => {

        it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

        it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    })

    describe('listen()', async () => {

        it([
            'success',
        ].join(' '), async () => {

            // LISTEN
            const LISTEN = await U_INSTANCE.listen(3000)
            expect(LISTEN._eventsCount).to.be.gt(0)
            expect(LISTEN).not.to.equal(undefined)
            UTest.userInputCleanup(1)

            // CLOSE
            const CLOSE = await U_INSTANCE.close()
            expect(CLOSE._eventsCount).to.be.gt(0)
            expect(CLOSE).not.to.equal(undefined)
            UTest.userInputCleanup(1)

        })

    })

    describe('close()', async () => {

        it([
            'success',
        ].join(' '), async () => {

            // LISTEN
            const LISTEN = await U_INSTANCE.listen(3000)
            expect(LISTEN._eventsCount).to.be.gt(0)
            expect(LISTEN).not.to.equal(undefined)
            UTest.userInputCleanup(1)

            // CLOSE
            const CLOSE = await U_INSTANCE.close()
            expect(CLOSE._eventsCount).to.be.gt(0)
            expect(CLOSE).not.to.equal(undefined)
            UTest.userInputCleanup(1)

        })

    })

})
