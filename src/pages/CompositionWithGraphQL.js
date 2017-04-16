import React from 'react'
import { ApolloClient, ApolloProvider, createNetworkInterface, gql, graphql } from 'react-apollo'
import { compose, withElmish } from '../../lib'

export const ArticleList = props => (
  <div>
    <div className="widget">
      <h4>GraphQL data</h4>
      { props.data &&
        props.data.loading &&
        <div>...fetching data via GraphQL</div>
      }
      { props.data &&
        props.data.allArticles &&
        props.data.allArticles.map(x => <div key={x.id}>{x.title}</div>)
      }
    </div>
    <div className="widget">
      <h4>Elmish data</h4>
      <pre>{JSON.stringify(props.model, null , 2)}</pre>
    </div>
  </div>
)

const enhanceWithElmish = withElmish({
  init(props) {
    return {
      model: {
        ...props.model,
        demoData1: 'A',
      }
    }
  },
  update(model, msg) {
    return {model}
  },
})

const enhanceEnhanceWithElmish = withElmish({
  init(props) {
    return {
      model: {
        ...props.model,
        demoData2: 'B',
      }
    }
  },
  update(model, msg) {
    return {model}
  },
})

const FetchArticlesQuery = gql`query fetch_all_articles {
  allArticles {
    id
    title
  }
}`

export const ArticleListWithGraphQLWithData = compose(
  enhanceWithElmish,
  enhanceEnhanceWithElmish,
  graphql(FetchArticlesQuery), // order to last, because issue in Apollo enhancements
)(ArticleList)

const networkInterface = createNetworkInterface({uri: `${window.__env.GRAPHQL_ENDPOINT}/graphql`})
const client = new ApolloClient({networkInterface: networkInterface})

export const CompositionWithGraphQL = props => (
  <ApolloProvider client={client}>
    <div>
      <h1>Component composition with GraphQL (Apollo-Client)</h1>
      <ArticleListWithGraphQLWithData />
    </div>
  </ApolloProvider>
)

export default CompositionWithGraphQL
