import * as React from 'react'
import { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import LernortListEntry from './LernortListEntry'

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      lernorts {
        id
        name
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
    }
  }
`

/** @augments {React.Component<object, object>} */
class Search extends Component {
  props: any
  state = {
    lernorts: [],
    filter: ''
  }

  render() {
    return (
      <div>
        <div>
          Search
          <input
            type="text"
            onChange={(e) => this.setState({ filter: e.target.value })}
          />
          <button
            onClick={() => this._executeSearch()}
          >
            OK
          </button>
        </div>
        {this.state.lernorts.map((link: any, index) => <LernortListEntry key={link.id} link={link} index={index}/>)}
      </div>
    )
  }

  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    })
    const lernorts = result.data.feed.lernorts
    this.setState({ lernorts })
  }

}

export default withApollo(Search)
