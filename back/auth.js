const config = require('./config')
const jwt = require('jsonwebtoken')

//토큰생성
const createToken = (user) =>{ 
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        userId: user.userId,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
    },
    config.JWT_SECRET, // jwt 비밀키
    {
        expiresIn: '7d', // 만료기한(7일)
        issuer: 'woody',
    })
}

const isAuth = (req, res, next) => { // 권한을 확인하는 하우트핸들러
    const bearerToken = req.headers.authorization
    if(!bearerToken){
        res.status(401).json({message: '토큰이 생성되지 않았습니다.'}) // jwt 토큰이 없는경우
    }else{
        const token = bearerToken.slice(7, bearerToken.length) // jwt 토큰
        jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
            if(err && err.name === 'TokenExpiredError'){ // 토큰만료
                res.status(419).json({ code: 419, message: '토큰 만료되었습니다.'})
            }else if(err){
                res.status(401).json({ code: 401, message: '잘못된 토큰입니다. !'})
            }else{
                req.user = userInfo
            next()
            }            
        })
    }
}

// 관리자 확인
const isAdmin = (req, res, next) => { 
    if(req.user && req.user.isAdmin){
        next() 
    }else{
        res.status(401).json({ code: 401, message: '관리자가 아닙니다.'})
    }
}

module.exports ={
    createToken,
    isAuth,
    isAdmin,
}