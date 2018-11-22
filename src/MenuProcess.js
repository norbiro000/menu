const fs = require('fs')
const fontColor = require('../commons/cmd_color')

let NOT_DUPPLICATED_OPTIONS_SET_NAME = false

class Menu {
  constructor (options_sets_column) {
    this.options_sets_column = options_sets_column
    this.options = []
    this.menu = []
    this.options_sets = []
  }
  isDupplicatedOptionName (optionName) {
    return new Promise ((resolve, reject) => {
      let filters = this.options.filter(option => {
        return option === optionName
      })
    
      let dupplicated = filters.length != 0
      if (!dupplicated) {
        this.options.push(optionName)
      }
      resolve(dupplicated) // if dupplicated return true
    })
  }
  getOptionSetNameFromOptionsChoicesInRow (rowItem, OPTION_SETS_COLUMN) {
    return new Promise ((resolve, reject) => {
      try {
        let options_set_name = ''
        for (let i = OPTION_SETS_COLUMN; i < rowItem.length; i++ ) {
          options_set_name = options_set_name + rowItem[i].replace(/ /g ,'')
        }
        resolve(options_set_name)
      } catch (e) {
        reject(e)
      }
    })
  }
  processItemToOptionSetCSVText (item, options_set_name, OPTION_FROM) {
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
  processMenuCSV (item, options_set_name, OPTION_FROM) {
    return new Promise ((resolve, reject) => {
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
  async pushItem (item) {
    try {
      // 1. Process item to options_set name.
    let options_set_name = await this.getOptionSetNameFromOptionsChoicesInRow(item, this.options_sets_column)

    // 2. Check is dupplicated options_set.
    let result = await this.isDupplicatedOptionName(options_set_name)

    this.menu.push(await this.processMenuCSV(item, options_set_name, this.options_sets_column))

    if (result == NOT_DUPPLICATED_OPTIONS_SET_NAME) {
      // if not dupplicated 
      // 3. convert item row to csv comma style syntax.
      let csvOptionsText = await this.processItemToOptionSetCSVText(item, options_set_name, this.options_sets_column)
      // write file
      this.options_sets.push(csvOptionsText)
    }

    } catch (e) {
      console.log(e)
    }
  }
  saveOptionSetsTo (outputPath) {
    try {
      fs.unlinkSync(outputPath)
    } catch (e) {
      // console.error(e)
    }

    console.log(fontColor.Yellow, `Saving to: ${outputPath}`)
    this.options_sets.forEach(item => {
      fs.appendFileSync(outputPath, item)
    })
  }
  saveMenuTo (outputPath){
    try {
      fs.unlinkSync(outputPath)
    } catch (e) {
      // console.error(e)
    }
    console.log(fontColor.Yellow, `Saving to: ${outputPath}`)
    this.menu.forEach(item => {
      fs.appendFileSync(outputPath, item)
    })
  }
}

module.exports = Menu
