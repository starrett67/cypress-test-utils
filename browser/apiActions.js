const axios = require('axios')

const login = ({ API_URL }) => async ({ username, password } = {}) => {
  const response = await axios({
    method: 'POST',
    url: API_URL + '/auth/jwt-token-auth/',
    data: {
      username,
      password,
    },
  })
  localStorage.setItem('3blades_token', response.body.token)
}

const createUser = ({ API_URL, ADMIN_TOKEN }) => ({
  username,
  email,
  password,
}) =>
  axios({
    method: 'POST',
    url: API_URL + '/v1/users/profiles/',
    data: {
      username,
      email,
      password,
    },
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
  })

module.exports = {
  login,
  createUser,
}
