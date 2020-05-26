import {
    GraphQLServer,
    PubSub
} from 'graphql-yoga'

import {
    resolvers,
    fragmentReplacements
} from './resolvers/index'
import prisma from './prisma'

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    fragmentReplacements,
    context(request) {
        return {
            pubsub,
            prisma,
            request
        }
    }
})

export { server as default}