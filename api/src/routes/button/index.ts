import { UPath } from '@utils/nodejs/path'
const SHELL = require('shelljs')
const PATH = require('path')
const FS = require('fs')
const FILE_PATH = PATH.resolve(
    process.cwd(),
    '..',
    '..',
    'CoffeeCounter_data',
    'buttons.json',
)

exports.click = async (req, res) => {
    await initDirectoryAndFile()
    const BTN_ID = req.params.id
    const TIMESTAMP = new Date()
    const RESULT = {
        result: {
            id: BTN_ID,
            timestamp: TIMESTAMP,
        },
        success: true,
    }
    delete require.cache[FILE_PATH]
    const FILE = require(FILE_PATH)
    let key
    if (Number(BTN_ID) === 1) {
        key = 'button' + BTN_ID
    } else if (Number(BTN_ID) === 2) {
        key = 'button' + BTN_ID
    }
    const BTN_ARR = FILE[key]
    BTN_ARR.push(RESULT)
    FILE[key] = BTN_ARR
    FS.writeFileSync(FILE_PATH, JSON.stringify(FILE, null, 2))
    res.status(201).send(RESULT)
}

exports.list = async (req, res) => {
    await initDirectoryAndFile()
    delete require.cache[FILE_PATH]
    const FILE = require(FILE_PATH)
    res.status(201).send(FILE)
}

// https://gitlab.com///issues/

/**
 * initDirectoryAndFile() TODO
 */
async function initDirectoryAndFile(): Promise<any> {
    const FILE_EXISTANT = SHELL.test('-f', FILE_PATH)
    if (!FILE_EXISTANT) {
        await UPath.createDirectory(
            PATH.dirname(FILE_PATH),
        )
        await UPath.createFile(
            FILE_PATH,
            JSON.stringify({
                button1: [],
                button2: [],
            }),
        )
    }

}
