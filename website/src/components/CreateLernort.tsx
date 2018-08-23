import * as React from 'react' 
import { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './LernortList'
import { LINKS_PER_PAGE } from '../constants'

class CreateLernort extends Component {
  props: any
  state = {
    name: '',
    description: '',
    url: '',
  }

  render() {
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
            type="text"
            placeholder="A name for the Lernort"
          />
          <input
            className="mb2"
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={this.state.url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button onClick={() => this._createLernort()}>Submit</button>
      </div>
    )
  }

  _createLernort = async () => {
    const { description, url, name } = this.state
    await this.props.postMutation({
      variables: {
        description,
        url,
        name,
      },
      update: (store, { data: { post } }) => {
        const first = LINKS_PER_PAGE
        const skip = 0
        const orderBy = 'createdAt_DESC'
        const data = store.readQuery({
          query: FEED_QUERY,
          variables: { first, skip, orderBy },
        })
        data.feed.lernorts.splice(0, 0, post)
        data.feed.lernorts.pop()
        store.writeQuery({
          query: FEED_QUERY,
          data,
          variables: { first, skip, orderBy },
        })
      },
    })
    this.props.history.push(`/new/1`)
  }
}

// 1
const POST_MUTATION = gql`
  # 2
  mutation PostMutation($description: String!, $url: String!, $name: String!) {
    post(description: $description, url: $url, name: $name) {
      id
      createdAt
      url
      description
      name
    }
  }
`

// 3
export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateLernort)
