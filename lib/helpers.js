const fs = require('fs-extra')
const util = require('util')
const path = require('path')
const SolidityParser = require('solidity-parser')
const Table = require('cli-table2')

const Config = require('./config')

let readdir = util.promisify(fs.readdir)
let appendFile = util.promisify(fs.appendFile)
let readFile = util.promisify(fs.readFile)
let writeFile = util.promisify(fs.writeFile)
let unlink = util.promisify(fs.unlink)
let exists = util.promisify(fs.exists)
let access = util.promisify(fs.access)
let config = new Config();
let createKeccakHash = require('keccak')

const until = require('catchify')


async function deleteFile(filePath) {
  var [error, result] = await until(access(filePath))
  if (!error) await unlink(filePath)
};

function toTimestamp(date){
  var timestamp = Date.parse(date);
  return Math.floor(timestamp / 1000);
}

function getContractName(filePath) {
	return path.basename(filePath, '.sol')
}


//TODO take into account whether or not the contract name is camelized or not
function getContractPath(contractName) {
  let baseName = getContractBasename(contractName)
  let contractPath = path.join(config.localContractsDir, baseName)
  return contractPath
}

function getContractsPath(contracts) {
  let paths = contracts.map(function(contract) { return getContractPath(contract) })
  return paths
}


async function getContractPaths() {
  let files = await readdir(config.localContractsDir)
  let contracts = filterSolidityFiles(files)

  let contractPaths = contracts.map(function(contract) {
    return config.outputFolder + contract
  })

  return contractPaths
}

function getFlattenedContractPath(contractName) {
  let baseName = getContractBasename(contractName)
  return path.join(config.localFlattenedContractsDir, baseName)
}


function getArtifactPath(contractName) {
  let baseName = contractName.camelize().capitalize() + '.json'
  let filePath = path.join(config.localArtifactsDir, baseName)
  return filePath
}

async function getContracts() {
  let contracts = await readdir(config.localContractsDir)
  return contracts
}


function filterSolidityFiles(files) {
  return files.filter((file) => { return path.extname(file) === '.sol' })
}


async function getFlattenedContractPaths() {
  let files = await readdir(config.localFlattenedContractsDir)
  let contracts = filterSolidityFiles(files)

  let contractPaths = contracts.map(function(contract) {
    return config.localFlattenedContractsDir + contract
  })

  return contractPaths
}


async function getContractImports(contractName) {
  let fileContents = await readFile(config.outputFolder + contractName, 'utf-8')
  let imports = SolidityParser.parse(fileContents, "imports")
  return imports
}

//TODO check for string and proper format
async function getContractNames() {
  let contracts = await readdir(config.outputFolder)
  let contractNames = contracts.map((contract) => { return contract.substring(0, contract.length-4)})
  return contractNames
}

//TODO differentiate whether the input is absolute, relative, or just a name
function getContractBasename(file) {
  return file.camelize().capitalize() + '.sol'
}



function toChecksumAddress (address) {
  address = address.toLowerCase().replace('0x','');
  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

//TODO clean
function getTable(json) {

  let table = new Table();
  let keys = Object.keys(json)

  keys.forEach(function(key) {
    let row = {}
    row[key] = json[key]
    table.push(row)
  });

  return table.toString()
}


module.exports = {
  readdir,
  appendFile,
  readFile,
  writeFile,
  unlink,
  toTimestamp,
  getContractName,
  getContracts,
  getContractNames,
  getContractPaths,
  getContractPath,
  getContractsPath,
  getContractImports,
  getContractBasename,
  getFlattenedContractPath,
  getFlattenedContractPaths,
  getArtifactPath,
  getTable,
  deleteFile,
  toChecksumAddress
}