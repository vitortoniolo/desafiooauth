const express = require('express');
const session = require('express-session');
const passport = require('passport')

require('./auth');

const app = express();

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401)
}

app.use(session({secret: "cats", resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) =>{
    res.send('<a href="/auth/google">Autenticar com google</a>')
});

app.get('/auth/google',
    passport.authenticate('google', {scope: ['email', 'profile']})
)

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect:'/protected',
        failureRedirect: '/auth/failure',
    })
);

app.get('/auth/failure', (req, res) => {
    res.send('Erro no login');
});

app.get('/protected', isLoggedIn, (req, res) =>{
    res.send(`Hello ${req.user.displayName}`);
});

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });

app.listen(5000, () => console.log('listening on: 5000'));