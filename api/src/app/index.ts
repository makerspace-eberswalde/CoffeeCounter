// https://gitlab.com/divramod/dm-tpl/issues/1

// IMPORT
import { UCommon } from '@utils/nodejs/common'
import EXPRESS = require('express')
const bodyParser = require('body-parser')

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// ROUTES
const button = require('@src/routes/button')

// CLASS
export class UAppUtility {

    public static getInstance(): UAppUtility {
        return UAppUtility.INSTANCE
    }
    private static INSTANCE: UAppUtility = new UAppUtility()
    public name: string = 'UAppUtility'

    private APP: any
    private SERVER: any
    private PORT: any

    constructor() {
        if (UAppUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
        this.APP = EXPRESS()
        // this.APP.use(EXPRESS.json())       // to support JSON-encoded bodies
        // this.APP.use(EXPRESS.urlencoded()) // to support URL-encoded bodies
        this.setRoutes()

        UAppUtility.INSTANCE = this
    }

    public async close(): Promise<any> {

        const R = this.SERVER.close()
        console.log( // tslint:disable-line:no-console
            'App, which was listening on port',
            this.PORT,
            'shut down!',
        )
        return R
    }

    public async listen(
        PORT,
    ): Promise<any> {

        this.PORT = PORT
        const R = this.SERVER = await this.APP.listen(
            PORT,
            () => {
                console.log( // tslint:disable-line:no-console
                    'App listening on port',
                    PORT,
                    '!',
                )
            },
        )
        return R
    }

    public async getApp(): Promise<any> {
        return this.APP
    }

    public setRoutes(): void {
        this.APP.get('/button/:id/click', button.click)
        this.APP.get('/button/list', button.list)
    }

}
export const UApp = UAppUtility.getInstance()
