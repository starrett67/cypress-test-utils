import axios from 'axios'
import { getActivationLink, getPasswordResetLink } from './email'

jest.useFakeTimers()
jest.mock('axios', () => ({ post: jest.fn() }))
console.log = () => {}
// prettier-ignore
const ACTIVATION_EMAIL = { parts: [ { which: 'TEXT', body: "\r\nYou're receiving this email because you created an account on 3Blades.\r\n\r\nPlease go to the following page to activate account:\r\n\r\nhttp://dev.3blades.ai/auth/activate?uid=YTc3ZjNkOTMtM2QyZi00NmRjLTg0OWYtZmU4NDI0NjM3Yzk1&token=4ss-5cb83717b9b15347234c\r\n\r\n\r\nThanks for using our site!\r\n\r\nThe 3Blades team\r\n\r\n\r\n"}]}
// prettier-ignore
const PASSWORD_RESET_EMAIL = { parts: [ { which: 'TEXT', body: "\r\nYou're receiving this email because you requested a password reset for your user account at 3Blades.\r\n\r\nPlease go to the following page and choose a new password:\r\n\r\nhttp://dev.3blades.ai/auth/password-reset?uid=YTc3ZjNkOTMtM2QyZi00NmRjLTg0OWYtZmU4NDI0NjM3Yzk1&token=4ss-5cb83717b9b15347234c\r\n\r\nYour username, in case you've forgotten: 3bladestestuser2136c376d8134b41b235f6541b447e9c\r\n\r\nThanks for using our site!\r\n\r\nThe 3Blades team\r\n\r\n\r\n"}]}

describe('email', () => {
  beforeEach(() => {
    axios.post.mockReset()
  })
  describe('getActivationLink', () => {
    it('works', async () => {
      axios.post
        .mockReturnValueOnce({ data: [] })
        .mockReturnValueOnce({ data: [ACTIVATION_EMAIL] })
      process.nextTick(() => jest.advanceTimersByTime(10000))
      const link = await getActivationLink('a@example.com')
      expect(link).toEqual(
        'http://dev.3blades.ai/auth/activate?uid=YTc3ZjNkOTMtM2QyZi00NmRjLTg0OWYtZmU4NDI0NjM3Yzk1&token=4ss-5cb83717b9b15347234c'
      )
      expect(axios.post.mock.calls.length).toEqual(2)
      expect(axios.post.mock.calls[0][1].to).toContain('a@example.com')
    })
  })
  describe('getPasswordResetLink', () => {
    it('works', async () => {
      axios.post.mockReturnValueOnce({ data: [PASSWORD_RESET_EMAIL] })
      const link = await getPasswordResetLink('a@example.com')
      expect(link).toEqual(
        'http://dev.3blades.ai/auth/password-reset?uid=YTc3ZjNkOTMtM2QyZi00NmRjLTg0OWYtZmU4NDI0NjM3Yzk1&token=4ss-5cb83717b9b15347234c'
      )
      expect(axios.post.mock.calls[0][1].to).toContain('a@example.com')
    })
  })
  // TODO: add test for localhost replacement once Jest supports
  // mocking window.location.hostname, etc.
})
