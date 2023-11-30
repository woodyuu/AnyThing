const express = require('express')
const User = require('../models/users')
const expressAsyncHandler = require('express-async-handler')
const { createToken, isAuth } = require('../../auth')
const { body, validationResult } = require("express-validator")
const crypto = require('crypto');

const router = express.Router()

const SUCCESS = { code: 200, message: '성공' }
const CLIENT_ERROR = { code: 400, message: '클라이언트 에러' }
const SERVER_ERROR = { code: 500, message: '서버 오류' }

// 회원가입
router.post('/register',
    [
        body("name").matches(/^[a-zA-Z가-힣]+$/, "g").withMessage('한글과 영어로만 구성되어야 합니다.'),
        body("userID").matches(/^[a-zA-Z0-9]+$/, "g").withMessage('영어와 숫자로만 구성되어야 합니다.'),
        body("PW").matches(/^[a-zA-Z0-9]+$/, "g").withMessage('영어와 숫자로만 구성되어야 합니다.'),
        body("userID").isLength({ min: 6 }).withMessage('아이디는 최소 6자 이상이 되어야 합니다.'),
        body("PW").isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이 되어야 합니다.'),
        body("email").matches(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).withMessage('올바른 이메일 형식이 아닙니다.')
    ],
    expressAsyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ...CLIENT_ERROR, errors: errors.array() })
        }
    try{
        const { name, userID, PW, email, birth } = req.body

        if (!/^[a-zA-Z가-힣]+$/.test(name)) { // 이름 구성제한
            res.status(400).json({ ...CLIENT_ERROR, message: '한글과 영어로만 구성되어야 합니다.'})
            return
        }
        
        if(!/^[a-zA-Z0-9]+$/.test(userID)){ // 아이디 구성제한
            res.status(400).json({...CLIENT_ERROR, message: '영어와 숫자로만 구성되어야 합니다.'})
            return
        }
        
        if(!/^[a-zA-Z0-9]+$/.test(PW)){ //비밀번호 구성제한
            res.status(400).json({...CLIENT_ERROR, message: '영어와 숫자로만 구성되어야 합니다.'})
            return
        }

        if(userID.length < 6){ // 아이디 길이 제한
            res.status(400).json({...CLIENT_ERROR, message: '아이디는 최소 6자 이상이 되어야 합니다.'})
            return
        }

        if(PW.length < 6){ // 비밀번호 길이 제한
            res.status(400).json({...CLIENT_ERROR, message: '비밀번호는 최소 6자 이상이 되어야 합니다.'})
            return
        }
        
        const user = new User({
            name,
            userID,
            PW,
            email,
            birth,
        })

        const newUser = await user.save()
        if(!newUser){
            res.status(401).json(CLIENT_ERROR)
        }else{
            const { name, userID, email, isAdmin, createdAt } = newUser
            const token = createToken(newUser)
            res.json({ ...SUCCESS, token, user: { name, userID, email, isAdmin, createdAt }})
        }
    }catch(error){
        res.status(500).json(SERVER_ERROR)
    }
}))

// 아이디 중복확인
router.post('/check-id', expressAsyncHandler(async (req, res, next) => {
    try{
        const {userID} = req.body
        if (!/^[a-zA-Z0-9]+$/.test(userID)){
            res.json({ code: 400, message: '적절하지 않은 아이디입니다.'})
            return
        }

        const existingUser = await User.findOne({userID})

        if(existingUser){
            res.json({ code: 400, message: '중복된 아이디입니다.'})
        }else{
            res.json({ code: 200, message: '사용 가능한 아이디입니다.'})
        }
    }catch(error){
        res.status(500).json(SERVER_ERROR)
    }
}))

// 로그인
router.post('/login', expressAsyncHandler(async (req, res, next) => {
    try{
        console.log(req.body)
        const { userID, PW } = req.body
        const loginUser = await User.findOne({
            userID,
            PW,
        })

        if(!loginUser){
            res.status(401).json(CLIENT_ERROR)
        }else{
            const { name, email, userID, isAdmin, createdAt } = loginUser
            // const token = createToken(loginUser)
            res.json({ ...SUCCESS, user: { name, email, userID, isAdmin, createdAt }})
        }
    }catch (error){
        console.log(error)
        res.status(500).json(SERVER_ERROR)
    }
}))

//아이디 찾기
router.post('/find-id', expressAsyncHandler(async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })

        if(!user){
            res.status(400).json({ code: 400, message: '해당 이메일로 등록된 아이디가 없습니다.'})
        }else{
            res.json({ code: 200, id: user.userID })
        }
    }catch(error){
        res.status(500).json(SERVER_ERROR)
    }
}))

//비밀번호 찾기
router.post('/find-password', expressAsyncHandler(async (req, res, next) => {
    try {
        const { userID } = req.body       
        const user = await User.findOne({ userID })

        if(!user){
            res.status(404).json({ ...CLIENT_ERROR, message: '유저를 찾지못했습니다.'})
        }else{            
            res.json({ code: 200, pw: user.PW})
        }
    } catch (error) {
        res.status(500).json(SERVER_ERROR)
    }
}))

// 로그아웃
router.post('/logout', (req, res, next) => {
    res.json("로그아웃")
})

// 사용자 정보 변경
router.put('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user){
            res.status(404).json({ ...CLIENT_ERROR, message: '유저 찾지 못함' })
        }else{
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.PW = req.body.PW || user.PW
            user.isAdmin = req.body.isAdmin || user.isAdmin
            user.lastModifiedAt = new Date()

            const updatedUser = await user.save()
            const { name, email, userID, isAdmin, createdAt } = updatedUser
            const token = createToken(updatedUser)
            res.json({ ...SUCCESS, token, user: { name, email, userID, isAdmin, createdAt }})
        }
    }catch(error){
        res.status(500).json(SERVER_ERROR)
    }
}))

// 사용자 정보 삭제
router.delete('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(404).json({ ...CLIENT_ERROR, message: '유저 찾지 못함' })
        }else{
            res.status(204).json(SUCCESS)
        }
    }catch(error){
        res.status(500).json(SERVER_ERROR)
    }
}))

module.exports = router

