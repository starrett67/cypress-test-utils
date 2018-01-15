const axios = require('axios')
const { login, createUser } = require('./apiActions')

jest.mock('axios', () => jest.fn())

describe('apiActions', () => {
  beforeEach(() => {
    axios.mockReset()
  })
  describe('login', () => {
    it('works', async () => {
      axios.mockReturnValue({ data: { token: 'ASDF' } })
      await login({ API_URL: 'example.com' })({
        username: 'asdf',
        password: 'qwer',
      })
      expect(axios.mock.calls[0][0].url).toContain('example.com')
      expect(axios.mock.calls[0][0].data.username).toEqual('asdf')
      expect(axios.mock.calls[0][0].data.password).toEqual('qwer')
    })
  })
  describe('createUser', () => {
    it('works', async () => {
      await createUser({ API_URL: 'example.com', ADMIN_TOKEN: '1234' })({
        username: 'asdf',
        password: 'qwer',
        email: 'a@example.com',
      })
      expect(axios.mock.calls[0][0].url).toContain('example.com')
      expect(axios.mock.calls[0][0].headers.Authorization).toContain('1234')
      expect(axios.mock.calls[0][0].data.username).toEqual('asdf')
      expect(axios.mock.calls[0][0].data.password).toEqual('qwer')
      expect(axios.mock.calls[0][0].data.email).toEqual('a@example.com')
    })
  })
})
