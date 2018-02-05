const travisAdapter = function() {
  const {
    TRAVIS_BRANCH,
    TRAVIS_COMMIT,
    TRAVIS_COMMIT_RANGE,
    TRAVIS_EVENT_TYPE,
    TRAVIS_PULL_REQUEST,
    TRAVIS_REPO_SLUG,
  } = process.env
  return {
    COMMIT:
      TRAVIS_PULL_REQUEST !== 'false'
        ? TRAVIS_COMMIT_RANGE.split('...')[1]
        : TRAVIS_COMMIT,
    BRANCH: TRAVIS_BRANCH,
    REPO_URL: `https://github.com/${TRAVIS_REPO_SLUG}`,
    EVENT_TYPE: TRAVIS_EVENT_TYPE,
  }
}

const teamcityAdapter = function() {
  const { VCS_BRANCH, VCS_COMMIT, VCS_URL } = process.env
  return {
    COMMIT: VCS_COMMIT,
    BRANCH: VCS_BRANCH,
    REPO_URL: VCS_URL,
    EVENT_TYPE: 'TeamCity',
  }
}

module.exports.loadAdapter = function() {
  if (process.env.TRAVIS_BRANCH) {
    return travisAdapter()
  } else {
    return teamcityAdapter()
  }
}
