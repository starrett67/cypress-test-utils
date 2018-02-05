const axios = require('axios')
const compose = require('promise-compose')
const { get, find, filter, head, reverse, sortBy } = require('lodash/fp')
const { loadAdapter } = require('./netlifyAdapters')

const { NETLIFY_KEY } = process.env

const { COMMIT, BRANCH, REPO_URL, EVENT_TYPE } = loadAdapter()
const delay = duration => new Promise(resolve => setTimeout(resolve, duration))
const api = axios.create({
  baseURL: 'https://api.netlify.com/api/v1/sites/',
  headers: { Authorization: `Bearer ${NETLIFY_KEY}` },
})
const getNetlifySites = () => api.get('?filter=all')
const getNetlifyBuilds = id => api.get(`${id}/deploys`)
const getNetlifyBuild = (siteId, id) => api.get(`${siteId}/deploys/${id}`)

const getSiteDetails = compose(
  getNetlifySites,
  get('data'),
  find({
    build_settings: {
      repo_branch: BRANCH,
      repo_url: REPO_URL,
    },
  })
)

const findBuild = () => {
  if (EVENT_TYPE === 'api') {
    return compose(
      filter({ branch: BRANCH }),
      sortBy(['created_at']),
      reverse,
      head
    )
  }
  return find({ commit_ref: COMMIT })
}

const getBuildDetails = compose(getNetlifyBuilds, get('data'), findBuild())

const MAX_ITERATIONS = 15
const DELAY = 20 * 1000 // 20 seconds
const pollBuildState = async (siteId, id, iteration = 1) => {
  const { data } = await getNetlifyBuild(siteId, id)
  if (!isBuildReady(data)) {
    if (iteration >= MAX_ITERATIONS) {
      throw new Error('Exceeded call limit in pollBuildState')
    }
    console.log(`\tIteration #${iteration} for id:`, id)
    console.log(`\tBuild is not ready. Waiting ${DELAY} milliseconds.`)
    await delay(DELAY)
    await pollBuildState(siteId, id, iteration + 1)
  }
}

const isBuildReady = build => build.state === 'ready'

const getBuildUrl = build => {
  if (build.context === 'deploy-preview') {
    return build.deploy_ssl_url
  }
  return build.ssl_url
}

module.exports = {
  getSiteDetails,
  getBuildDetails,
  pollBuildState,
  isBuildReady,
  getBuildUrl,
}
