const graphql = require("graphql");
const _ = require('lodash')

const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLSchema, GraphQLID, GraphQLInt } = graphql;

//dummy data

var users = [
    {
        "uuid": 'XgbuVEXBU5gtSKdbQRP1Zbbby1i1',
        "password": 'admin',
        "role": 'admin',
        "userData": {
            "displayName": "Usman Khalil",
            "photoURL": "assets/images/avatars/chandler.jpg",
            "email": "admin@mpmedia.tv",
            "settings": {
                "layout": {
                    "style": "layout1",
                    "config": {
                        "scroll": "content",
                        "navbar": {
                            "display": true,
                            "folded": true,
                            "position": "left"
                        },
                        "toolbar": {
                            "display": true,
                            "style": "fixed",
                            "position": "below"
                        },
                        "footer": {
                            "display": true,
                            "style": "fixed",
                            "position": "below"
                        },
                        "mode": "fullwidth"
                    }
                },
                "customScrollbars": true,
                "theme": {
                    "main": "defaultDark",
                    "navbar": "defaultDark",
                    "toolbar": "defaultDark",
                    "footer": "defaultDark"
                }
            },
            "shortcuts": ["calendar", "mail", "contacts"]
        }
    },
    {
        uuid: 'XgbuVEXBU6gtSKdbTYR1Zbbby1i3',
        password: 'staff',
        role: 'staff',
        userData: {
            displayName: 'Arnold Matlock',
            photoURL: 'assets/images/avatars/Arnold.jpg',
            email: 'staff@fusetheme.com',
            settings: {
                layout: {
                    style: 'layout2',
                    config: {
                        mode: 'boxed',
                        scroll: 'content',
                        navbar: {
                            display: true
                        },
                        toolbar: {
                            display: true,
                            position: 'below'
                        },
                        footer: {
                            display: true,
                            style: 'fixed'
                        }
                    }
                },
                customScrollbars: true,
                theme: {
                    main: 'greeny',
                    navbar: 'mainThemeDark',
                    toolbar: 'mainThemeDark',
                    footer: 'mainThemeDark'
                }
            },
            shortcuts: ['calendar', 'mail', 'contacts', 'todo']
        }
    }
]

const UserThemeType = new GraphQLObjectType({
    name: 'UserThemeType',
    fields: () => ({
        main: { type: GraphQLString },
        navbar: { type: GraphQLString },
        toolbar: { type: GraphQLString },
        footer: { type: GraphQLString }
    })
})

const UserFooterType = new GraphQLObjectType({
    name: 'UserFooterType',
    fields: () => ({
        display: { type: GraphQLBoolean },
        style: { type: GraphQLString },
        position: { type: GraphQLString },
    })
})

const UserToolbarType = new GraphQLObjectType({
    name: 'UserToolbarType',
    fields: () => ({
        display: { type: GraphQLBoolean },
        style: { type: GraphQLString },
        position: { type: GraphQLString },
    })
})

const UserNavbarType = new GraphQLObjectType({
    name: 'UserNavbarType',
    fields: () => ({
        display: { type: GraphQLBoolean },
        folded: { type: GraphQLBoolean },
        position: { type: GraphQLString },
    })
})

const UserConfigType = new GraphQLObjectType({
    name: 'UserConfigType',
    fields: () => ({
        scroll: { type: GraphQLString },
        mode: { type: GraphQLString },
        footer: { type: UserFooterType },
        toolbar: { type: UserToolbarType },
        navbar: { type: UserNavbarType }
    })
})

const UserLayoutType = new GraphQLObjectType({
    name: 'UserLayoutType',
    fields: () => ({
        style: { type: GraphQLString },
        config: { type: UserConfigType }
    })
})

const UserSettings = new GraphQLObjectType({
    name: 'UserSettings',
    fields: () => ({
        customScrollbars: { type: GraphQLString },
        theme: { type: UserThemeType },
        layout: { type: UserLayoutType }
    })
})

const UserDataType = new GraphQLObjectType({
    name: 'UserDataType',
    fields: () => ({
        displayName: { type: GraphQLString },
        photoURL: { type: GraphQLString },
        email: { type: GraphQLString },
        shortcuts: { type: new GraphQLList(GraphQLString) },
        settings: { type: UserSettings }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        uuid: { type: GraphQLID },
        password: { type: GraphQLString },
        role: { type: GraphQLString },
        userData: { type: UserDataType }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { uuid: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(users, { uuid: args.uuid })
            }
        },
        auth: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                pass: { type: GraphQLString }
            },
            resolve(parent, args) {
                return _.find(users, { userData: { email: args.email }, password: args.pass })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})