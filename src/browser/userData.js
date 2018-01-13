import uuid from 'uuid'

const generateUsername = () => {
  const id = uuid().replace(/\-/g, '')
  return `3bladestestuser${id}`
}
const generateRandomString = () =>
  Math.random()
    .toString(36)
    .slice(2)
const generatePassword = () =>
  `${generateRandomString()}${generateRandomString().toUpperCase()}`

export const generateUserData = () => {
  const username = generateUsername()
  return {
    username,
    email: `${username}@testing.3blades.io`,
    password: generatePassword(),
    newPassword: generatePassword(),
  }
}
