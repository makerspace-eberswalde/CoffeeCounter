import { UApp } from '@src/app'
import { UTest } from '@utils/nodejs/test'

export async function main(): Promise<any> {
    let mainRun = false
    if (UTest.getEnv() !== 'testing') {
        await UApp.listen(4001)
        mainRun =  true
    }
    return { value: mainRun, app: UApp }
}

main()
