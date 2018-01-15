const micro = require('micro')
const imaps = require('imap-simple')

const defaultImapConfig = {
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  authTimeout: 3000,
}

const createCriteria = (query = {}) =>
  Object.keys(query).reduce((criteria, key) => {
    const KEY = key.toUpperCase()
    if (query[key] === true) return [...criteria, KEY]
    if (Array.isArray(query[key])) return [...criteria, [KEY, ...query[key]]]
    return [...criteria, [KEY, query[key]]]
  }, [])

const getMessageFromServer = config => async query => {
  const connection = await imaps.connect(config)
  await connection.openBox('INBOX')
  const searchCriteria = createCriteria(query)
  const fetchOptions = {
    bodies: ['HEADER', 'TEXT'],
  }
  return await connection.search(searchCriteria, fetchOptions)
}

module.exports = function createImapServer(userImapConfig) {
  const imapConfig = Object.assign({}, defaultImapConfig, userImapConfig)
  const getMessage = getMessageFromServer({ imap: imapConfig })

  micro(async (req, res) => {
    const query = await micro.json(req)
    try {
      return await getMessage(query)
    } catch (e) {
      micro.send(res, 500, e)
    }
  }).listen(9090)
}
