import axios from 'axios'
import compose from 'promise-compose'
import { head } from 'lodash'
import { get, find, nth } from 'lodash/fp'

const URL_REGEX = /(https?:\/\/(?:[\w\-\.]*?)3blades\.ai\S*)/
const matchUrlRegex = text => text.match(URL_REGEX) || []

const prepareLink = link => {
  let url = new URL(link)
  url.protocol = window.location.protocol
  if (!/3blades\.ai/i.test(window.location.hostname)) {
    url.host = window.location.host
  }
  return url.toString()
}

const MAX_ITERATIONS = 3
const BACKOFF_FACTOR = 10
const delay = duration => new Promise(resolve => setTimeout(resolve, duration))
const pollForMessage = async (query, iteration = 1) => {
  console.log(`Iteration #${iteration} for query:`, query)
  const { data: messages } = await axios.post('http://localhost:9090', query)
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

export const getActivationLink = to =>
  getUrlFromEmailByQuery({ to, subject: SUBJECTS.ACTIVATION })

export const getPasswordResetLink = to =>
  getUrlFromEmailByQuery({ to, subject: SUBJECTS.PASSWORD_RESET })
