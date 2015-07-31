// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '389626825637-ac0g5af84tsa8msfgdm7rs4gq4uba503.apps.googleusercontent.com',
        'clientSecret'  : 'XJCOABVBFsrFJuOPJedtiNy8',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};