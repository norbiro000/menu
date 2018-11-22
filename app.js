#!/usr/bin/env node

let usage = 'USAGE: menu ${file_path} ${OPTION_COLUMN}'
const currentPath = process.cwd()

if (!process.argv[2]) {
  console.log(usage)
  process.exit(2)
}

const fs = require('fs')
const parse = require('csv-parse')
const MenuProcess = require('./src/MenuProcess')
const parser = parse({
  delimiter: ','
})

const menuProcessor = new MenuProcess(6)

// FILE READ
fs.createReadStream(process.argv[2]).pipe(parser)

parser.on('readable', function () {
  let record
  while (record = parser.read()) {
    menuProcessor.pushItem(record)
  }
})

parser.on('end', function () {
  setTimeout(function () {
    menuProcessor.saveOptionSetsTo(`${currentPath}/options_set.csv`)
    menuProcessor.saveMenuTo(`${currentPath}/menu.csv`)
  }, 1000)
})
