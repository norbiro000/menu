class Menu {
  constructor () {
    this.options = []
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
}

module.exports = Menu
