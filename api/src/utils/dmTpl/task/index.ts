const MOMENT = require('moment')
const COLORS = require('colors/safe')
import { UDate } from '@utils/nodejs/date'
import { UTest } from '@utils/nodejs/test'

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
    UCommon,
} from '@utils/nodejs/common'
import {
    ISuperTaskConstructorParams,
    ISuperTaskLogHeaderColorTheme,
    ISuperTaskLogValueColorTheme,
} from './index.d'

export {
    ITaskClass,
    ITaskConstructorParams,
} from './index.d'

export class SuperTask {

    private cwd: string
    private name: string
    private logging: boolean
    private runStartTime: Date
    private runEndTime: Date
    private LOG_VALUE_COLOR_THEME: ISuperTaskLogValueColorTheme = {
        description: ['rainbow'],
        value: ['white'],
    }
    private LOG_HEADER_COLOR_THEME: ISuperTaskLogHeaderColorTheme = {
        devider: ['rainbow'],
        value: ['white', 'bold'],
    }

    constructor( { name, cwd, logging }: ISuperTaskConstructorParams ) {
        this.cwd = cwd
        this.logging = logging
        this.name = name
    }

    public printName(): boolean {
        let printed = false
        if (this.logging) {
            this.logHeader(
                this.name,
                '=',
                6,
                20,
                this.LOG_HEADER_COLOR_THEME,
            )
            printed = true
        }
        return printed
    }

    public getTaskPath(): string {
        const CURRENT_PATH = this.cwd
        const TASK_PATH = '\@' +
            CURRENT_PATH.substring(
                CURRENT_PATH.lastIndexOf('src') + 4,
                CURRENT_PATH.length,
            )
        return TASK_PATH
    }

    public getName(): string {
        return this.name
    }

    public async runBefore(): Promise<boolean> {
        let runBefore = false
        if (this.logging) {
            this.runStartTime = MOMENT(new Date())
            this.printName()
            this.logValue(
                'start:',
                MOMENT(this.runStartTime).format('hh:mm:ss SSS'),
                this.LOG_VALUE_COLOR_THEME,
            )
            runBefore = true
        }
        return runBefore
    }

    public async runAfter(): Promise<boolean> {
        let runAfter = false
        if (this.logging) {
            this.runEndTime = MOMENT(new Date())
            this.logValue(
                'end:',
                MOMENT(this.runEndTime).format('hh:mm:ss SSS'),
                this.LOG_VALUE_COLOR_THEME,
            )
            this.logValue(
                'duration:',
                UDate.getDateDiff(this.runStartTime, this.runEndTime),
                this.LOG_VALUE_COLOR_THEME,
            )
            runAfter = true
        }
        return runAfter
    }

    public logValue(
        DESCRIPTION: string,
        VALUE: any,
        THEME?,
    ): boolean {
        if (this.logging) {
            let msg: string
            let description = DESCRIPTION.toString()
            const RUNS = 15 - DESCRIPTION.length
            for (let i = 0; i < RUNS; i++) {
                description = ' ' + description
            }
            if (THEME) {
                COLORS.setTheme(THEME)
                msg = [
                    COLORS.description(description),
                    ' ',
                    COLORS.value(VALUE.toString()),
                ].join('')
            } else {
                msg = [
                    description,
                    ' ',
                    VALUE,
                ].join('')
            }
            console.log(msg) // tslint:disable-line:no-console
            UTest.userInputCleanup(1)
        }
        return this.logging
    }

    public logHeader(
        VALUE: string,
        DEVIDER: string,
        OFFSET: number = 0,
        DEVIDER_LENGTH: number = 0,
        THEME?,
    ): boolean {
        if (this.logging) {
            let msg: string
            let offset: string = ''
            let devider: string = ''
            for (let i = 0; i < OFFSET; i++) {
                offset = offset + ' '
            }
            for (let i = 0; i < DEVIDER_LENGTH; i++) {
                devider = devider + DEVIDER
            }
            if (THEME) {
                COLORS.setTheme(THEME)
                msg = [
                    offset,
                    COLORS.devider(devider),
                    ' ',
                    COLORS.value(VALUE),
                    ' ',
                    COLORS.devider(devider),
                ].join('')
            } else {
                msg = [
                    offset + VALUE,
                ].join('')
            }
            console.log(msg) // tslint:disable-line:no-console
            UTest.userInputCleanup(1)
        }
        return this.logging
    }

}
