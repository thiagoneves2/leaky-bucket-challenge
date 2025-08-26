import Koa from 'koa';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
} from 'graphql';

export type GraphQLKoaContext = { ctx: Koa.Context };

const sendPixMutation = {
  type: GraphQLString, // mutation return (In this case a message)
  args: {
    pixKey: { type: GraphQLString }, 
    value: { type: GraphQLFloat }
  },
  resolve: () => 'Success in pix transfer'
};

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    sendPix: sendPixMutation
  }
});

// Empty query type 
const queryType = new GraphQLObjectType({

  name: 'Query',
  fields:{
    hello:{
      type: GraphQLString,
      resolve: ()=> 'Query String',
    },
  },

});

// final schema
export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
