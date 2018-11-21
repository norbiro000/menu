const fs = require('fs')
const parse = require('csv-parse')
const MenuProcess = require('./src/MenuProcess')
const parser = parse({
  delimiter: ','
})

const output = []

const menuProcessor = new MenuProcess()

// FILE READ
fs.createReadStream(process.argv[2]).pipe(parser)
try {
  fs.unlinkSync('options_sets.csv')
  fs.unlinkSync('menu.csv')
} catch (e) {}

parser.on('readable', function () {
  let record
  while (record = parser.read()) {
    processRow(record)
  }
})

parser.on('end', function () {
  console.log('done')
})

async function processRow (item, callback) {
  try {
    let NOT_DUPPLICATED_OPTIONS_SET_NAME = false

    // 1. Process item to options_set name.
    let options_set_name = await menuProcessor.getOptionSetNameFromOptionsChoicesInRow(item, 6)

    // 2. Check is dupplicated options_set.
    let result = await menuProcessor.isDupplicatedOptionName(options_set_name)

    let menu = await menuProcessor.processMenuCSV(item, options_set_name, 6)
    fs.appendFileSync('menu.csv', menu)

    if (result == NOT_DUPPLICATED_OPTIONS_SET_NAME) {
      // if not dupplicated 
      // 3. convert item row to csv comma style syntax.
      let csvOptionsText = await menuProcessor.processItemToOptionSetCSVText(item, options_set_name, 6)
      // console.log(csvOptionsText)

      // write file
      fs.appendFileSync('options_sets.csv', csvOptionsText)
    }

    // Callback to next main iterator
    // return callback()
  } catch(e) {
    console.log(e)
  }
}