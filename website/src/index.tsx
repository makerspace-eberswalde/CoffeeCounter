import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
// 1
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { AUTH_TOKEN } from './constants'

// ws
import { ApolloLink, split } from 'apollo-client-preset'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const hostname = window && window.location && window.location.hostname;
// let httpUri = 'http://localhost:4002'
// let wsUri = 'ws://localhost:4002'
let httpUri = 'http://192.168.178.48:4002'
let wsUri = 'ws://192.168.178.48:4002'

if (hostname === 'lernorte.de') {
    // wsUri = 'ws://178.254.26.23:4000'
    // httpUri = 'http://graphql.lernorte.de'
    httpUri = 'http://graphql.lernorte.de'
    wsUri = 'ws://ws.graphql.lernorte.de:4002'
}

// 2
const httpLink = new HttpLink({ uri: httpUri })
const middlewareAuthLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(AUTH_TOKEN)
    const authorizationHeader = token ? `Bearer ${token}` : null
    operation.setContext({
        headers: {
            authorization: authorizationHeader
        }
    })
    return forward(operation)
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

// 3
const wsLink = new WebSocketLink({
    uri: wsUri,
    options: {
        reconnect: true,
        connectionParams: {
            authToken: localStorage.getItem(AUTH_TOKEN),
        }
    }
})

const link = split(
    ({ query }) => {
        // const { kind, operation } = getMainDefinition(query)
        const test: any = getMainDefinition(query)
        const kind = test.kind
        const operation = test.operation
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLinkWithAuthToken,
)

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
})

// 4
ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root'),
)
registerServiceWorker()
