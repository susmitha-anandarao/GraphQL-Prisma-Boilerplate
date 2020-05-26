import {
    gql
} from 'apollo-boost'

const createUser = gql `
    mutation($data:CreateUserInput!) {
        createUser(
            data: $data
        ){
            token,
            user {
                id
                name
                email
            }
        }
    }
`

const login = gql `
    mutation($data: LoginUserInput!) {
        login(
            data: $data
        ) {
            token
        }
    }
`

const queryUsers = gql `
    query {
        users {
            id
            name
            email
        }
    }
`
const queryProfile = gql `
    query {
        me {
            id
            name
            email
        }
    }
`

export {
    createUser,
    login,
    queryUsers,
    queryProfile,
}