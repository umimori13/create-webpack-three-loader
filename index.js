#! /usr/bin/env node
const { program } = require('commander')
const { version, description } = require('./package.json')
const fs = require('fs')
const os = require('os')
const fsp = fs.promises

const l = console.log
const s = os.platform === 'win32' ? '\\' : '/'
const bs4 = '    '
const bs2 = '  '
const startEmoji = `${bs4}💫${bs2}`
const processEmoji = () =>
    [`${bs4}🚀${bs2}`, `${bs4}🚀${bs2}`, `${bs4}🚀${bs2}`][Date.now() % 3]
const doneEmoji = `${bs4}🌟${bs2}`
const errorEmoji = `${bs4}💥${bs2}`
const tipsEmoji = `${bs4}💡${bs2}`

const createProject = (path) => {
    l(`\n${startEmoji}Start\n`)

    const tarPath = process.cwd() + s + path
    const srcPath = __dirname + s + 'source'

    const version = Number(process.version.substr(1).split('.')[0])
    if (version < 12) {
        l(
            `${errorEmoji}Sorry, but your node verison is less than 12, please update node.\n`
        )
        return
    }

    return fsp
        .mkdir(tarPath)
        .then(() => fsp.readdir(srcPath, { withFileTypes: true }))
        .then((dirs) => {
            const all = []

            dirs.forEach((dir) => {
                if (dir.isFile()) {
                    let tempName
                    if (dir.name === '.npmignore') tempName = '.gitignore'

                    all.push(
                        fsp.copyFile(
                            srcPath + s + dir.name,
                            tarPath + s + (tempName || dir.name)
                        )
                    )
                    l(
                        `${processEmoji()}\x1B[2mmake file, ${
                            tempName || dir.name
                        }\x1B[0m`
                    )
                } else {
                    all.unshift(dir)
                }
            })

            return Promise.all(all)
        })
        .then((dirs) =>
            Promise.all([
                ...dirs
                    .filter((dir) => dir && dir.isDirectory())
                    .map((dir) =>
                        fsp.readdir(srcPath + s + dir.name, {
                            withFileTypes: true,
                        })
                    ),
                dirs,
            ])
        )
        .then((dirs) => {
            const ds = dirs[dirs.length - 1]

            ds.filter((d) => d).forEach((d) => fsp.mkdir(tarPath + s + d.name))
            return dirs
        })
        .then((dirs) => {
            const all = []
            const pas = dirs.pop()

            pas.filter((pa) => pa).forEach((pa, idx) => {
                const tar = tarPath + s + pa.name
                const src = srcPath + s + pa.name
                const subs = dirs[idx]

                subs.forEach((file) => {
                    all.push(
                        fsp.copyFile(src + s + file.name, tar + s + file.name)
                    )
                    l(
                        `${processEmoji()}\x1B[2mmake file, ${pa.name}${s}${
                            file.name
                        }\x1B[0m`
                    )
                })
            })

            return Promise.all(all)
        })
        .then(() => {
            l(`\n${doneEmoji}Done!\n`)
            l(
                `${bs4}Success! Created \x1B[32m${path}\x1B[0m at \x1B[32m${tarPath}\x1B[0m`
            )
            l(`${bs4}Inside that directory, you can run several commands:\n`)
            l(`${tipsEmoji}\x1B[36myarn install\x1B[0m`)
            l(`${bs4}${bs4}${bs2}Install dependencies.\n`)
            l(`${tipsEmoji}\x1B[36myarn start\x1B[0m`)
            l(`${bs4}${bs4}${bs2}Starts the development server.\n`)
            l(`${tipsEmoji}\x1B[36myarn build\x1B[0m`)
            l(
                `${bs4}${bs4}${bs2}Bundles the app into static files for production.\n`
            )
            l(`${bs4}We suggest that you begin by typing:\n`)
            l(`${bs4}${bs2}\x1B[36mcd ${path}\x1B[0m`)
            l(`${bs4}${bs2}\x1B[36myarn install\x1B[0m`)
            l(`${bs4}${bs2}\x1B[36myarn start\x1B[0m\n`)
            l(`${bs4}\x1B[33mHappy Coding!\x1B[0m\n`)
        })
        .catch((err) => {
            l(`${errorEmoji}${err.message}.\n`) ///g
        })
}

program
    .version(version, '-v, --version', 'output the current version')
    .description(description)

program.arguments('<project-directory>').action(createProject)

program.parse(process.argv)
