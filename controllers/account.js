var express = require("express");
var crypto = require('crypto');
var nJwt = require('njwt');
var account = express.Router();
var db = require('../models');
var bols = require('../model_bols');
var middleware = require('../configs/middlewware');
var mailjet = require('../helpers/mailjet')

account.get("/:username", async function (req, res) {
    const { username } = req.params;
    if (username.trim().length > 0) {
        const result = await bols.My_model.find('Account', { username }, 'username name phone email');

        if (result.length > 0) {
            return res.status(200).json({ message: 'Find account success.', data: Object.assign({}, result[0], {
                roles: ['admin'] // TODO dummy
            }) });
        } else {
            return res.status(500).json({ message: 'Find account error.', data: req.params });
        }
    }

    return res.status(400).json({ message: 'Username error.', data: req.params });
});

account.post("/", async function (req, res) {
    req.checkBody("username", "Vui lòng nhập tài khoản").notEmpty();
    req.checkBody("password", "Vui lòng nhập mật khẩu").notEmpty();
    req.checkBody("name", "Vui lòng nhập mật khẩu").notEmpty();
    req.checkBody("email", "Vui lòng nhập mật khẩu").notEmpty();
    req.checkBody("phone", "Vui lòng nhập mật khẩu").notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json(errors);
    } else {
        const username = req.body.username;
        var checkUnitUsername = await bols.My_model.find('Account', { username }, 'username status');
        if (checkUnitUsername.length === 0) {
            var data = req.body;
            data.password = data.password + config.app.secretKey;
            var createAccount = await bols.My_model.create(req, 'Account', data);
            if (createAccount.status == 200) {
                delete (createAccount.password);
                return res.status(200).json({ message: 'Create account success.', data: createAccount });
            } else {
                return res.status(500).json({ message: createAccount.data, data: req.body });
            }
        } else {
            // Tồn tại username
            delete (req.body.password);
            return res.status(400).json({ message: 'Username is exist.', data: req.body });
        }
    }
});

account.put("/accountId", async function (req, res) {


    return null;
});

var middleware = require('../configs/middlewware');
account.put("/updatePassword", middleware.mdw_auth, async function (req, res) {
    req.checkBody("password", "Vui lòng nhập mật khẩu").notEmpty();
    req.checkBody("new_password", "Vui lòng nhập mật khẩu").notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json(errors);
    } else {
        const { username } = req.user;
        const { password, new_password } = req.body;
        var account = await helpers.auth_helper.verify_user(username, password);
        if (account) {
            var data = {
                password: new_password,
            };

            var uPassword = await bols.My_model.update(req, 'Account', { username }, data, false);
            if (uPassword.status == 200) {
                return res.status(200).json({ message: 'Update password success.', data: {} });
            } else {
                return res.status(500).json({ message: uPassword.data, data: {} });
            }
        } else {
            return res.status(400).json({ message: 'Password error.', data: req.body });
        }
    }

    return null;
});

account.post('/reset-password', async function (req, res, next) {
    req.checkBody("email", "Vui lòng nhập email").notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json(errors);
    }

    // Just create hash string
    const user = await helpers.auth_helper.find_user_by_email(req.body.email);
    if (!user) {
        return res.sendStatus(400)
    }

    const hashContent = `${Date.now()}`
    const token2 = _md5(hashContent)
    const claims = {
        email: req.body.email,
        token2,
    };
    const tokenSecret = config.app.secretKey;
    const token = await helpers.helper.renderToken(tokenSecret, claims, 1 / 24);

    // Token 1 (jwt) will be send to email, token 2 (hashed string) will be response to client
    _sendResetPasswordMail(user, token)

    res.json({
        message: 'Reset password info',
        data: {
            token: hashContent,
        }
    })
})

account.post('/reset-password/confirm', async function (req, res, next) {
    req.checkBody("password", "Vui lòng nhập password").notEmpty();
    req.checkBody("confirmPassword", "Vui lòng nhập lại password mới").notEmpty();
    req.checkBody("token", "Vui lòng nhập reset password token").notEmpty();
    req.checkBody("token2", "Vui lòng nhập reset password token 2").notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json(errors);
    }

    const signingKey = config.app.secretKey;
    const token = req.body.token ? req.body.token.toString() : '';
    var tokenBody;
    try {
        tokenBody = nJwt.verify(token, signingKey).body;
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }


    const email = tokenBody.email;
    // Token 1 is jwt token, token 2 is just a hashed string
    const hashedInToken = tokenBody.token2;
    const hashedInRequest = _md5(req.body.token2);

    if (hashedInToken != hashedInRequest) {
        return res.sendStatus(400);
    }

    // OK, update new password
    const data = {
        password: req.body.password,
    };
    const uPassword = await bols.My_model.update(req, 'Account', { email }, data, false);
    if (uPassword.status == 200) {
        return res.status(200).json({ message: 'Update password success.', data: {} });
    } else {
        return res.status(500).json({ message: uPassword.data, data: {} });
    }
})

function _md5(content) {
    return crypto.createHash('md5').update(content).digest('hex');
}

function _sendResetPasswordMail(user, token) {
    const url = `${config.app.clientUrl}/#/reset-password?token=${token}`
    mailjet.send({
        from: {
            name: 'Info',
            email: config.mailJet.emailToSend,
        },
        to: {
            name: user.username,
            email: user.email,
        },
        subject: 'Reset Password',
        text: `Click url below to reset your password: \r\n ${url}`,
    })
}

module.exports = account;
