const path = require('path')
const fs = require('fs-extra')

class UserConfiguration {

  constructor() {
    this.settings = path.join(process.cwd(), './user/user_settings.json')
    this.wallet_records = path.join(process.cwd(), './user/wallet_settings.json')
    this.wallets = path.join(process.cwd(), './user/wallets/')
  }

  _parseSettings() {
    let json = fs.readJSONSync(this.settings)
    return json
  }

  parseWalletRecords() {
    let json = fs.readJSONSync(this.wallet_records)
    return json
  }

  parseDeploymentSettings() {
    let json = fs.readJSONSync(this.settings)
    return json
  }

  updateInfuraToken(value) {
    let json = this._parseSettings()
    json["infuraToken"] = value
    fs.writeJSONSync(this.settings, json)
  }

  updateDefaultWallet(value) {
    let json = this._parseSettings()
    json["defaultWallet"] = value
    fs.writeJSONSync(this.settings, json)
  }

  updateDefaultNetwork(value) {
    let json = this._parseSettings()
    json["defaultNetwork"] = value
    fs.writeJSONSync(this.settings, json)
  }

  updateDefaultGasLimit(value) {
    let json = this._parseSettings()
    json["defaultGasLimit"] = value
    fs.writeJSONSync(this.settings, json)
  }

  updateDefaultGasPrice(value) {
    let json = this._parseSettings()
    json["defaultGasPrice"] = value
    fs.writeJSONSync(this.settings, json)
  }

  saveWallet(filePath, keystore) {
    fs.writeFileSync(filePath, keystore.serialize())
    process.stdout.write(`Saved keystore: \n${filePath}\n`)
  }

  saveWalletRecord(name, filePath, network, address) {
    let records = this.parseWalletRecords()
    records[network].push({name: name, filePath: filePath, address: address})
    fs.writeJSONSync(this.wallet_records, records)
  }

  getWalletRecord(network, name) {
    let wallets = this.parseWalletRecords()
    if (wallets[network].length == 0) return {}
      for (let wallet of wallets[network]) {
        if (name == wallet["name"]) return wallet
      }
  }

  getWalletRecordByFilePath(network, filePath) {
    let wallets = this.parseWalletRecords().network
    if (wallets.length == 0) return {}

    for (let wallet of wallets) {
      if (filePath == wallet["filePath"]) return wallet
    }
  }

  getWalletRecordByAddress(network, address) {
    let wallets = this.parseWalletRecords().network
    if (wallets.length == 0) return {}

    for (let wallet of wallets) {
      if (address == wallet["address"]) return wallet
    }
  }

}

module.exports = UserConfiguration