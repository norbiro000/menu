const fs = require('fs')
const parse = require('csv-parse')
const parser = parse({
  delimiter: ','
})

const output = []
const OPTION_SETS_COLUMN = process.argv[3]
const OPTION_FROM = 6


// FILE READ
fs.createReadStream(process.argv[2]).pipe(parser)
try {
  fs.unlinkSync('options_sets.csv')
  fs.unlinkSync('menu.csv')
} catch (e) {}

parser.on('readable', function () {
  let record
  while (record = parser.read()) {
    output.push(record)
  }
})

parser.on('end', function () {
  main()
})


// OPTIONS
let options = []
function isDupplicatedOptionName (optionName) {
  return new Promise ((resolve, reject) => {
    let filters = options.filter(option => {
      return option === optionName
    })
  
    let dupplicated = filters.length != 0
    if (!dupplicated) {
      options.push(optionName)
    }
    resolve(dupplicated) // if dupplicated return true
  })
}

function getOptionSetNameFromOptionsChoicesInRow (item) {
  return new Promise ((resolve, reject) => {
    try {
      let options_set_name = ''
      for (let i = OPTION_SETS_COLUMN; i < item.length; i++ ) {
        options_set_name = options_set_name + item[i].replace(/ / ,'')
      }
      resolve(options_set_name)
    } catch (e) {
      reject(e)
    }
  })
}

async function processItemToOptionSet (item, options_set_name) {
  return new Promise ((resolve, reject) => {
    if (!options_set_name) {
      return resolve()
    }
    let csv = ''
      csv = csv + '' + options_set_name + ','
      for (var i = OPTION_FROM; i < item.length; i++) {
        if ('' !== item[i].replace(/ /, '')) {
          csv = csv + '' + item[i] + ','
        }
      }
      csv = csv + '\n'

      return resolve(csv)
  })
}

async function processMenuCSV (item, options_set_name) {
  return new Promise ((resolve, reject) => {
    // TODO: Create file menu.csv
    let menu = ''
    for (let i = 0; i < OPTION_FROM; i++) {
      menu += item[i]
      menu += ','
    }
    menu += options_set_name
    menu += '\n'
    resolve(menu)
  })
}

async function processRow (item, callback) {
  try {
    let NOT_DUPPLICATED_OPTIONS_SET_NAME = false

    // 1. Process item to options_set name.
    let options_set_name = await getOptionSetNameFromOptionsChoicesInRow(item)

    // 2. Check is dupplicated options_set.
    let result = await isDupplicatedOptionName(options_set_name)

    let menu = await processMenuCSV(item, options_set_name)
    fs.appendFileSync('menu.csv', menu)

    if (result == NOT_DUPPLICATED_OPTIONS_SET_NAME) {
      // if not dupplicated 
      // 3. convert item row to csv comma style syntax.
      let csvOptionsText = await processItemToOptionSet(item, options_set_name)
      // console.log(csvOptionsText)

      // write file
      fs.appendFileSync('options_sets.csv', csvOptionsText)
    }

    // Callback to next main iterator
    return callback()
  } catch(e) {
    console.log(e)
  }
}

function main () {
  try {
    // 1. Push row to process
    function iterator (i) {
      processRow(output[i], function () {
        if (i == output.length - 1) {
          process.exit()
        }

        iterator(++i)
      })
    }
    iterator(0)
  } catch (e) {
    console.log(e)
  }
}

