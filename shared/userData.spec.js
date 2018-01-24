const { generateUserData } = require('./userData')

describe('generateUserDate', () => {
  const userData = generateUserData()
  it('username', () => {
    expect(userData.username).toMatch(/illumidesktestuser[0-9a-f]{32}/)
  })
  it('email', () => {
    expect(userData.email).toEqual(`${userData.username}@testing.illumidesk.com`)
  })
  it('password', () => {
    expect(userData.password).toMatch(/[a-z0-9]{9}[A-Z0-9]{9}/)
  })
  it('newPassword', () => {
    expect(userData.newPassword).toMatch(/[a-z0-9]{9}[A-Z0-9]{9}/)
  })
})
