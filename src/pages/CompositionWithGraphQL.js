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
        props.data.allArticles.map(x =>
          <div key={x.id}>
            {x.title}&nbsp;
            <button onClick={() => props.deleteArticle({variables: {id: x.id}}).then(props.data.refetch)}>Delete article and refetch</button>
          </div>
        )
      }
    </div>
    <div className="widget">
      <input type="text" onBlur={e => props.action({type: 'UPDATE_TITLE', title: e.target.value})} placeholder="Enter a title" />&nbsp;
      <button onClick={() => props.upsertArticle({variables: {input: {title: props.model.title}}}).then(props.data.refetch)}>Upsert article and refetch</button>
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
        ...props,
        title: 'Empty',
      }
    }
  },
  update(model, msg) {
    switch(msg.type) {
      case 'UPDATE_TITLE':
        model.title = msg.title || 'Empty'
        break
    }
    return {model}
  },
})

const FetchArticlesQuery = gql`query fetchAllArticles {
  allArticles {
    id
    title
  }
}`

const UpsertArticleMutation = gql`mutation upsertArticle($input: ArticleInput) {
  upsertArticle(input: $input) {
    article {
      id
      title
    }
  }
}
`
const DeleteArticleMutation = gql`mutation deleteArticle($id: ID!) {
  deleteArticle(id: $id) {
    deletedArticleId
  }
}`

export const ArticleListWithGraphQLWithData = compose(
  enhanceWithElmish,
  graphql(FetchArticlesQuery),
  graphql(UpsertArticleMutation, {name: 'upsertArticle'}),
  graphql(DeleteArticleMutation, {name: 'deleteArticle'}),
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
