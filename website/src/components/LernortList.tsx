import * as React from 'react'
import { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import LernortListEntry from './LernortListEntry'
import { LINKS_PER_PAGE } from '../constants'

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LernortOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      lernorts {
        id
        createdAt
        name
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`

class LernortList extends Component {
  props: any
  render() {
  
    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <div>Loading</div>
    }
  
    if (this.props.feedQuery && this.props.feedQuery.error) {
      return <div>Error</div>
    }
  
    const isNewPage = this.props.location.pathname.includes('new')
    const lernortsToRender = this._getLernortsToRender(isNewPage)
    const page = parseInt(this.props.match.params.page, 10)
  
    return (
      <div>
        <div>
          {lernortsToRender.map((lernort, index) => (
            <LernortListEntry
              key={lernort.id}
              updateStoreAfterVote={this._updateCacheAfterVote}
              index={index}
              start={(page - 1) * LINKS_PER_PAGE}
              lernort={lernort}
            />
          ))}
        </div>
        {isNewPage &&
        <div className="flex ml4 mv3 gray">
          <div className="pointer mr2" onClick={() => this._previousPage()}>Previous</div>
          <div className="pointer" onClick={() => this._nextPage()}>Next</div>
        </div>
        }
      </div>
    )

  }

  _getLernortsToRender = (isNewPage) => {
    if (isNewPage) {
      return this.props.feedQuery.feed.lernorts
    }
    const rankedLernorts = this.props.feedQuery.feed.lernorts.slice()
    rankedLernorts.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedLernorts
  }

  _nextPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= this.props.feedQuery.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }
  
  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

  _updateCacheAfterVote: any = (store, createVote, lernortId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    const data = store.readQuery({ query: FEED_QUERY, variables: { first, skip, orderBy } })
    const votedLernort = data.feed.lernorts.find(lernort => lernort.id === lernortId)
    votedLernort.votes = createVote.lernort.votes
    store.writeQuery({ query: FEED_QUERY, data })
  }

  _subscribeToNewLernorts = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newLernort {
            node {
              id
              createdAt
              name
              url
              description
              postedBy {
                id
                name
              }
              votes {
                id
                user {
                  id
                }
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const result = {
          ...previous,
          feed: {
            ...previous.feed,
            lernorts: [
                ...previous.feed.lernorts,
                subscriptionData.data.newLernort.node
            ]
          },
        }
        return result
      },
    })
  }

  componentDidMount() {
    this._subscribeToNewLernorts()
    this._subscribeToNewVotes()
  }

  _subscribeToNewVotes = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newVote {
            node {
              id
              lernort {
                id
                url
                description
                createdAt
                postedBy {
                  id
                  name
                }
                votes {
                  id
                  user {
                    id
                  }
                }
              }
              user {
                id
              }
            }
          }
        }
      `,
    })
  }
}

// 3
export default graphql(FEED_QUERY, {
  name: 'feedQuery',
  options: (ownProps: any) => {
    const page = parseInt(ownProps.match.params.page, 10)
    const isNewPage = ownProps.location.pathname.includes('new')
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return {
      variables: { first, skip, orderBy },
    }
  },
})(LernortList)
