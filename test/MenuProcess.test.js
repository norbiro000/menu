const MenuProcess = require('../src/MenuProcess')
const assert = require('assert')

describe('src/MenuProcess.js', function() {
  const menuProcess = new MenuProcess()

  describe('isDupplicatedOptionName()', function () {
    it('ShouldReturnFalseWhenSendFirstTime', async function () {
      let response = await menuProcess.isDupplicatedOptionName('test')
      assert.equal(response, false)
    })

    it('ShouldReturnFalseWhenSendSecondTime', async function () {
      let response = await menuProcess.isDupplicatedOptionName('test')
      assert.equal(response, true)
    })
  })

  describe('getOptionSetNameFromOptionsChoicesInRow()', async function () {
    it('sendPerfectDataShouldReturn78910', async function () {
      let optionSetsStartFromColumn = 6
      let mockRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      let expectResponse = '78910'

      let response = await menuProcess.getOptionSetNameFromOptionsChoicesInRow(mockRow, optionSetsStartFromColumn)
      assert.equal(response, expectResponse)
    })

    it('sendDataWithSpaceShouldReturn78910', async function () {
      let optionSetsStartFromColumn = 6
      let mockRow = ['1', '2', '3', '4', '5', '6', '7 ', '8 ', '9 ', '10   ']
      let expectResponse = '78910'

      let response = await menuProcess.getOptionSetNameFromOptionsChoicesInRow(mockRow, optionSetsStartFromColumn)
      assert.equal(response, expectResponse)
    })
  })

  describe('processItemToOptionSet()', function () {
    it('ShoudReturnCSVFormatCorrectlyThaiFood,option1,option2,option3,option4,option5,option6,\n', async function () {
      let mockItem = [
        'Food',
        'Thai Food',
        'Code#1',
        'Phadthai',
        'Description',
        '200.00',
        'option1',
        'option2',
        'option3',
        'option4',
        'option5',
        'option6',
      ]
      let OPTION_FROM = 6
      let mockOptionSetName = 'ThaiFood'

      let expectCSVReponse = 'ThaiFood,option1,option2,option3,option4,option5,option6,\n'
      let response = await menuProcess.processItemToOptionSetCSVText(mockItem, mockOptionSetName, OPTION_FROM)

      assert.equal(response, expectCSVReponse)
    })
  })

  describe('processMenuCSV()', function () {
    it('ShouldReturnMenuWithOptionSets', async function () {
      let mockItem = [
        'Food',
        'Thai Food',
        'Code#1',
        'Phadthai',
        'Description',
        '200.00',
        'option1',
        'option2',
        'option3',
        'option4',
        'option5',
        'option6',
      ]
      let OPTION_FROM = 6
      let mockOptionSetName = 'ThaiFood'

      let expectCSVReponse = `Food,Thai Food,Code#1,Phadthai,Description,200.00,${mockOptionSetName}\n`
      let response = await menuProcess.processMenuCSV(mockItem, mockOptionSetName, OPTION_FROM)

      assert.equal(response, expectCSVReponse)
    })
  })
});