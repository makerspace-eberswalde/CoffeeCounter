// IMPORT
import { UApp } from '@src/app'
import { describe, expect, it, TEST_PATH, UTest } from '@utils/nodejs/test'

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
    let APP

    beforeEach(async () => {
        RIMRAF.sync(TEST_PATH) // REMOVE DIRECTORY
        APP = await UApp.getApp()
    })

    afterEach(async () => {
        RIMRAF.sync(TEST_PATH) // REMOVE DIRECTORY
    })

    it([
        '/button/1/click',
    ].join(' '), async () => {
        await request(APP)
            .get('/button/1/click')
            .expect(201)
    })

})
