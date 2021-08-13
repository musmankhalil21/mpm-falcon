const { app, db, jwt } = require('../app')
// const { db } = require('../config/db')


// console.log(JSON.stringify({
//     displayName: 'Usman Khalil',
//     photoURL: 'assets/images/avatars/chandler.jpg',
//     email: 'admin@mpmedia.tv',
//     settings: {
//         layout: {
//             style: 'layout1',
//             config: {
//                 scroll: 'content',
//                 navbar: {
//                     display: true,
//                     folded: true,
//                     position: 'left'
//                 },
//                 toolbar: {
//                     display: true,
//                     style: 'fixed',
//                     position: 'below'
//                 },
//                 mode: 'fullwidth'
//             }
//         },
//         customScrollbars: true,
//         theme: {
//             main: 'defaultDark',
//             navbar: 'defaultDark',
//             toolbar: 'defaultDark',
//             footer: 'defaultDark'
//         }
//     },
//     shortcuts: ['calendar', 'mail', 'contacts']
// }))

// db.query("SELECT * FROM users", function (err, result) {
//     if (err) throw err;
//     result[0].userData = JSON.parse(result[0].userData)
//     console.log(result);
// });


// db.query(`SELECT * FROM users where 'email' = ${req.params.email} AND 'password' = ${req.params.password}`, function (err, result) {
//     if (err) throw err;
//     result[0].userData = JSON.parse(result[0].userData)
//     res.json({ authenticated: true })
//     console.log(result);
// });

app.get('/auth', (req, res) => {
    // console.log(req.query)
    var token = jwt.sign({ email: req.query.email, password: req.query.password }, 'shhhhh');
    db.query(`SELECT * FROM users where email = "${req.query.email}" AND password = "${req.query.password}"`, function (err, result) {
        if (err) throw err;
        if (result && result.length > 0) {
            result[0].data = JSON.parse(result[0].userData)
            result[0].access_token = token
            db.query(`UPDATE users SET access_token = "${token}" where email = "${req.query.email}"`, function (err, result) {
                if (err) throw err
                // console.log(result)
            })
            delete result[0].password
            delete result[0].userData
            // console.log(result[0])
            res.status(200).json({ authenticated: true, user: result[0] })
        } else {
            res.status(200).json({ authenticated: false })
        }
    });
})


app.get('/auth/access_token', (req, res) => {
    // console.log(req.query)
    // var token = jwt.sign({ email: req.query.email, password: req.query.password }, 'shhhhh');
    db.query(`SELECT * FROM users where access_token = "${req.query.token}"`, function (err, result) {
        if (err) throw err;
        if (result && result.length > 0) {
            result[0].data = JSON.parse(result[0].userData)
            // result[0].access_token = token
            delete result[0].password
            delete result[0].userData
            // console.log(result[0])
            res.status(200).json({ authenticated: true, user: result[0] })
        } else {
            res.status(200).json({ authenticated: false })
        }
    });
})
