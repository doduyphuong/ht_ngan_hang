var configdev = {
    app: {
        appName: 'Internet Banking',
        baseUrl: '', //add refix dạng '/projectname'
        staticUrl: '',
        port: 3001,
        secretKey: 'th@sBz$90k1sWVqP',
        refreshTokenSecret: 'IFw2Nv%XAKWKoF3H',
        proxy: '',
        clientUrl: 'http://localhost:9527'
    },
    recaptcha: {
        sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        secretkey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
    },
    db: {
        host: '127.0.0.1',
        port: '27017',
        name: 'internet_banking',
        username: '',
        password: ''
    },
    mailJet: {
        enable: 1,
        apiKeyPublic: '8cce441bc6c4b27d380ebe2caa1fb69e',
        apiKeyPrivate: '67486efdde1ef5af136337aedd859d2e',
        emailToSend: 'bahung1221@gmail.com',
    },
    cors:{
        whitelist : ['https://localhost:3000']
    }
};

module.exports = configdev;
