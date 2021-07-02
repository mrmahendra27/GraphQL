const express =require('express');
const { graphqlHTTP }  = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull} = require('graphql');
 
const app = express();

/***Dummy Data */
const Authors = [
    { id: 1, name: 'Mahendra', age: 21 },
    { id: 2, name: 'Antonny', age: 25 },
    { id: 3, name: 'Jake', age: 20 },
];


const Books = [
    { id: 1, name: "Ways to Waste Time", authorId: 1 },
    { id: 2, name: "Ways to Waste Time1", authorId: 1 },
    { id: 3, name: "Ways to Waste Time2", authorId: 1 },
    { id: 4, name: "How to do nothing", authorId: 2 },
    { id: 5, name: "How to do nothing1", authorId: 2 },
    { id: 6, name: "How to do nothing2", authorId: 2 },
    { id: 7, name: "Ways to code effeciently", authorId: 3 },
    { id: 8, name: "Ways to code effeciently1", authorId: 3 },
    { id: 9, name: "Ways to code effeciently2", authorId: 3 },
];
/**End */

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: "Book of an author",
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt),
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
        },
        authorId: {
            type: GraphQLNonNull(GraphQLInt),
        },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return Authors.find(author => author.id === book.authorId)
            }
        }
    })

});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: "authors details",
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt),
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
        },
        age: {
            type: GraphQLNonNull(GraphQLInt),
        },
        books: {
            type: GraphQLList(BookType),
            resolve: (author) => {
                return  Books.filter(books => books.authorId === author.id)
            }
        }
    })
})

const MainQueryType = new GraphQLObjectType({
    name: 'Query',
    description: "Main Query",
    /**By adding object inside a parenthesis we don't need to return the object its automatically returns is */
    fields: () => ({
        books: {
            type: GraphQLList(BookType),
            description: "Lists of all Books",
            resolve: () => Books
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: 'List of all authors',
            resolve: () => Authors,
        }
    })
});

const schema = new GraphQLSchema({
    query: MainQueryType
})


app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.get('/', (req, res) => {
    res.send(Authors);
});

app.listen(3000, () => console.log('started server at 3000'));