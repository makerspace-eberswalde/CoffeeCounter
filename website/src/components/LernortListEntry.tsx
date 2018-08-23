import * as React from 'react'
import { Component, Props } from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

interface MyProps extends Props<any> {
    start: number;
    index: number;
    lernort: {
        name: string;
        description: string;
        url: string;
        votes: number[];
        postedBy: any;
        createdAt: any;
        id: any;

    };
    voteMutation: Function;
    updateStoreAfterVote: Function;
}

class LernortListEntry extends Component<MyProps & Props<any>, any> {
    props: MyProps
    // props: any
    render() {
      const authToken = localStorage.getItem(AUTH_TOKEN)
      let start = 0
      if (this.props.start) {
         start = this.props.start
      }
      return (
        <div className="flex mt2 items-start">
          <div className="flex items-center">
            <span className="gray">{this.props.index + 1 + start}.</span>
            {authToken && (
              <div className="ml1 gray f11" onClick={() => this._voteForLernort()}>
                ▲
              </div>
            )}
          </div>
          <div className="ml1">
            <div>
                {this.props.lernort.name} - {this.props.lernort.description} 
                    (<a target="_blank" href={this.props.lernort.url}>{this.props.lernort.url}</a>)
            </div>
            <div className="f6 lh-copy gray">
                {this.props.lernort.votes.length} votes | <a href="../test/1">edit</a> |
              by{' '}
              {this.props.lernort.postedBy
                ? this.props.lernort.postedBy.name
                : 'Unknown'}{' '}
              {timeDifferenceForDate(this.props.lernort.createdAt)}
            </div>
          </div>
        </div>
      )
    }
  
    _voteForLernort = async () => {
      const lernortId = this.props.lernort.id
      await this.props.voteMutation({
        variables: {
          lernortId,
        },
        update: (store, { data: { vote } }) => {
          this.props.updateStoreAfterVote(store, vote, lernortId)
        },
      })
    }
}

const VOTE_MUTATION = gql`
  mutation VoteMutation($lernortId: ID!) {
    vote(lernortId: $lernortId) {
      id
      lernort {
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
`

export default graphql<any, any>(VOTE_MUTATION, {
  name: 'voteMutation',
})(LernortListEntry)
