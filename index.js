module.exports = {
  email: require('./browser/email'),
  imap: require('./server/imap'),
  netlify: require('./server/netlify'),
  netlifyAdapters: require('./server/netlifyAdapters'),
  apiActions: require('./shared/apiActions'),
  userData: require('./shared/userData'),
}