const express = require('express');
const userModel = require('./userModel');
const userRouter = express.Router();

userRouter.post('/register', async(req, res) => {
    try {
        const userInfo = req.body;
        if (userInfo.username == '') {
            return res.status(403).json({
                success: false,
                message: 'username must not be empty'
            });
        }
        if (userInfo.password == '') {
            return res.status(403).json({
                success: false,
                message: 'password must not be empty'
            });
        }
        // check username exist
        const existUsername = await userModel.findOne({ username: userInfo.username }).exec();
        if (existUsername) {
            return res.status(403).json({
                success: false,
                message: 'The username has been used'
            })
        }
        // check password regex
        const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,12}$/).test(userInfo.password)
        if (!passwordRegex) {
            return res.status(403).json({
                success: false,
                message: 'Password must be contain at least one digit, one lower case, one upper case, 8 - 12 characters'
            });
        }

        const hashPassword = await bcryptjs.hash(userInfo.password, 10);

        const newUser = await userModel.create({
            ...userInfo,
            password: hashPassword,
        });

        res.status(201).json({
            message: 'Register success',
            success: true,
        });

    } catch (error) {
        res.status(500).end(error.message);
    }
});


userRouter.post('/login', async(req, res) => {
    try {
        const loginInfo = req.body;
        console.log(loginInfo);
        // check username/password 
        if (!loginInfo.username || !loginInfo.password) {
            return res.status(403).json({ success: false, message: 'You must be input username or password ' })
        }

        const user = await userModel.findOne({
            username: req.body.username
        }).exec();
        // console.log(user)
        if (!user) {
            res.status(404).json({
                message: 'User not found',
                success: false,
            });
        } else {
            const password = await userModel.findOne({
                password: req.body.password
            })
            if (password) {
                req.session.user = {
                    _id: user._id,
                    username: user.username,
                };
                req.session.save(); // luu cookie vao storage

                res.status(200).json({
                    message: 'Login success',
                    success: true,
                    id: user._id,
                    username: user.username,
                });
            } else {
                // flase
                res.status(404).json({
                    message: 'Password is not correct',
                    success: false,
                });
            }
        }
    } catch (error) {
        res.status(500).end(error.message);
    }
});


// logout
userRouter.get('/logout', (req, res) => {
    try {
        req.session.destroy();
        res.status(200).json({
            message: 'Log out success',
            success: true,
        });
    } catch (error) {
        res.status(500).end(error.message);
    }
});
module.exports = userRouter