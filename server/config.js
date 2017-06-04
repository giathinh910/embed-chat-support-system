var secret = 'cogaithang10';

module.exports = {
    db: {
        url: 'mongodb://mongo/embed-chat'
    },
    bcrypt: {
        secret: secret,
        saltRounds: 10
    },
    jwt: {
        secret: secret
    },
    session: {
        secret: secret
    },
    userLevel: {
        admin: 1,
        agent: 11,
        customer: 21
    }
};