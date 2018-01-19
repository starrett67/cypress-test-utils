const axios = require('axios')
const compose = require('promise-compose')
const { head } = require('lodash')
const { get, find, nth } = require('lodash/fp')

const URL_REGEX = /(https?:\/\/(?:[\w\-\.]*?)3blades\.ai\S*)/
const matchUrlRegex = text => text.match(URL_REGEX) || []

const prepareLink = link => {
  try {
    let url = new URL(link)
    url.protocol = window.location.protocol
    if (!/3blades\.ai/i.test(window.location.hostname)) {
      url.host = window.location.host
    }
    return url.toString()
  } catch (ex) {
    return link
  }
}

const MAX_ITERATIONS = 3
const BACKOFF_FACTOR = 10
const delay = duration => new Promise(resolve => setTimeout(resolve, duration))
const pollForMessage = async (query, iteration = 1) => {
  console.log(`Iteration #${iteration} for query:`, query)
  imapServerUrl = 'http://localhost:' + (process.env.IMAP_SERVER_PORT || 9090)
  const { data: messages } = await axios.post(imapServerUrl, query)
  if (!messages.length) {
    if (iteration > MAX_ITERATIONS) {
      throw new Error('Exceeded call limit in pollForMessage')
    }
    const DELAY = iteration * BACKOFF_FACTOR * 1000
    console.log(`No message(s) found. Waiting ${DELAY} milliseconds.`)
    await delay(DELAY)
    return await pollForMessage(query, iteration + 1)
  }
  return messages
}

const getUrlFromEmailByQuery = compose(
  pollForMessage,
  head,
  get('parts'),
  find({ which: 'TEXT' }),
  get('body'),
  matchUrlRegex,
  nth(1),
  prepareLink
)

const SUBJECTS = {
  ACTIVATION: 'Account activation on 3Blades',
  PASSWORD_RESET: 'Password reset on 3Blades',
}

const getActivationLink = to =>
  getUrlFromEmailByQuery({ to, subject: SUBJECTS.ACTIVATION })

const getPasswordResetLink = to =>
  getUrlFromEmailByQuery({ to, subject: SUBJECTS.PASSWORD_RESET })

module.exports = {
  getActivationLink,
  getPasswordResetLink,
}
