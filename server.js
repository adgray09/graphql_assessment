const { ApolloServer, gql, PubSub, PubSubEngine } = require('apollo-server');
const { on } = require('nodemon');
const pubsub = new PubSub();

const typeDefs = gql`

    enum Priority {
        low
        medium
        high
    }
        
    type Todo {
        name: String!
        completed: Boolean!
        date: String!
        id: Int!
        priority: Priority!
    }

    type Query {
        getAllTodos: [Todo!]!
        getTodo(id: Int!): Todo!
        getCompletedTodos: [Todo!]!
        getNotCompletedTodos: [Todo]
    }

    type Mutation {
        addTodo(name: String!, priority: Priority!): Todo!
        completeTodo(id: Int!): Todo!
        changePriority(priority: Priority!, id: Int!): Todo!
    }

    type Subscription {
        newTodo: Todo!
        todoCompleted: Todo!
    }
`

const allTodos = [
    { name: "clean room", completed: false, date: Date(), id: 0, priority: "high" },
    { name: "take out trash", completed: false, date: Date(), id: 1, priority: "low" },
    { name: "take dog for walk", completed: true, date: Date(), id: 2, priority: "low" },
    { name: "go to get food", completed: true, date: Date(), id: 3, priority: "medium" },
]

const resolvers = {
    Query: {
        getAllTodos: () => {
            return allTodos
        },
        getTodo: (_, args) => {
            return allTodos[args.id]
        },
        getCompletedTodos: () => {
            completedList = []

            for (let i = 0; i < allTodos.length; i++) {
                if (allTodos[i].completed === true) {
                    completedList.push(allTodos[i])
                }
            }
            return completedList
        },
        getNotCompletedTodos: () => {
            notComplete = []

            for (let i = 0; i < allTodos.length; i++) {
                if (allTodos[i].completed === false) {
                    notComplete.push(allTodos[i])
                }
            }
            return notComplete
        }
    },
    Mutation: {
        addTodo: (_, { name, priority }) => {

            prio = { low: "low", medium: "medium", high: "high" }

            newTodo = {
                name: name,
                completed: false,
                date: Date(),
                id: allTodos.length,
                priority: prio[priority]
            }
            allTodos.push(newTodo)
            pubsub.publish('NEW_TODO', { newTodo: newTodo })
            return newTodo
        },
        completeTodo: (_, args) => {
            objectIndex = allTodos.findIndex((obj => obj.id == args.id))

            allTodos[objectIndex].completed = true

            pubsub.publish('TODO_COMPLETE', { todoCompleted: allTodos[objectIndex] })
            return allTodos[objectIndex]
        },
        changePriority: (_, args) => {
            prio = { low: "low", medium: "medium", high: "high" }

            objectIndex = allTodos.findIndex((obj => obj.id == args.id))

            allTodos[objectIndex].priority = prio[args.priority]

            return allTodos[objectIndex]
        }
    },
    Subscription: {
        newTodo: {
            subscribe: () => pubsub.asyncIterator('NEW_TODO')
        },
        todoCompleted: {
            subscribe: () => pubsub.asyncIterator('TODO_COMPLETE')
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
