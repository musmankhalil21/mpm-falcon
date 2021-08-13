const { app, db, gql, GraphQLClient, syncForeach } = require('../app')

const endpoint = 'https://api.onsign.tv/graphql'

const graphQlQueries = {
    fetchPlayerCount: gql`query{organization{players(first: 100){totalCount}}}`
}

app.get('/getOrgs', (req, res) => {
    db.query(`SELECT * FROM organizations`, function (err, result) {
        if (err) throw err;
        if (result && result.length > 0) {
            syncForeach(result, (nextOrg, org, orgIndex, array) => {
                GraphQLQuery({
                    token: org.api_key,
                    query: graphQlQueries.fetchPlayerCount
                }, (data) => {
                    result[orgIndex].playerCount = data.organization.players.totalCount;
                    nextOrg();
                })
            }).done(() => {
                res.status(200).json(result)
            })
        } else {
            res.status(200).json({ authenticated: false })
        }
    });
})

app.post('/addOrg', (req, res) => {
    var sql = `INSERT INTO organizations (userId, name, email, status, api_key, joined)
    VALUES (${req.body.org.userId}, '${req.body.org.name}', '${req.body.org.email}', ${req.body.org.accountStatus},'${req.body.org.api_key}',${req.body.org.created});`
    db.query(sql, function (err, result) {
        if (err) throw err;
        if (result && result.length > 0) {
            res.status(200).json(result)
        } else {
            res.status(200).json({ authenticated: false })
        }
    });
})

app.post('/removeOrg', (req, res) => {
    // var sql = `INSERT INTO organizations (userId, name, email, status, api_key, joined)
    // VALUES (${req.body.org.userId}, '${req.body.org.name}', '${req.body.org.email}', ${req.body.org.accountStatus},'${req.body.org.api_key}',${req.body.org.created});`
    db.query(`DELETE FROM organizations WHERE id = ${req.body.orgId};`, function (err, result) {
        if (err) throw err;
        if (result && result.length > 0) {
            res.status(200).json(result)
        } else {
            res.status(200).json({ authenticated: false })
        }
    });
})

const GraphQLQuery = (queryObj, callback) => {
    var graphQLClient = new GraphQLClient(endpoint, {
        headers: {
            Authorization: `token ${queryObj.token}`,
        },
    })
    graphQLClient.request(queryObj.query).then((data) => {
        callback(data)
    })
}


app.get('/auth/access_token', (req, res) => {
    console.log(req.query)
    // var token = jwt.sign({ email: req.query.email, password: req.query.password }, 'shhhhh');
    db.query(`SELECT * FROM users where access_token = "${req.query.token}"`, function (err, result) {
        if (err) throw err;
        if (result && result.length > 0) {
            result[0].data = JSON.parse(result[0].userData)
            // result[0].access_token = token
            delete result[0].password
            delete result[0].userData
            console.log(result[0])
            res.status(200).json({ authenticated: true, user: result[0] })
        } else {
            res.status(200).json({ authenticated: false })
        }
    });
})
