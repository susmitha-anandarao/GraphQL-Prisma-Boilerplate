import '@babel/polyfill/noConflict'
import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, login, queryUsers, queryProfile } from './utils/operations'

jest.setTimeout(30000)

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
    
    const variables = {
        data: {
            name: 'Sus',
            email: 'sus@example.com',
            password: 'pass1234'
        }
    }

    const response = await client.mutate({
        mutation: createUser,
        variables
    })

    const userExists = await prisma.exists.User({
        id: response.data.createUser.user.id
    })

    expect(userExists).toBe(true)
})

test('Should expose public author profiles', async () => {

    const response = await client.query({
        query: queryUsers
    })

    expect(response.data.users.length).toBe(2)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('Jess')
    expect(response.data.users[1].email).toBe(null)
    expect(response.data.users[1].name).toBe('Jack')
})

test('Should not login with bad credentials', async () => {

    const variables = {
        data: {
            email: 'Jess@example.com',
            password: '1234passfg'                    
        }
    }

    await expect(
        client.mutate({
            mutation: login,
            variables
        })
    ).rejects.toThrow()
})

test('Should not signup with invalid password', async () => {

    const variables = {
        data: {
            name: 'Sus',
            email: 'sus@example.com',
            password: 'pass'
        }
    }

    await expect(
        client.mutate({
            mutation: createUser,
            variables
        })
    ).rejects.toThrow()
})

test('Should fetch user profile', async () => {

    const client = getClient(userOne.jwt)

    const { data } = await client.query({
        query: queryProfile
    })

    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)
    expect(data.me.id).toBe(userOne.user.id)
})