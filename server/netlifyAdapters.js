module.exports.travisAdapter = function() {
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
