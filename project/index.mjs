import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import hbs from 'hbs';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import {readPost, readUser, insertPost, insertUser, likeFun, shareFun, deleteFun} from './operations.mjs'

const app = express()

app.set('view engine', 'hbs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.get('/',(req, res)=>{
    res.render("login")
})


app.post('/login',async (req,res)=>{
    const output = await readUser(req.body.profile)
    const password = output[0].password
    if(password===req.body.password)
    {
        const secret = "7ebb3596b4292f44f841be8539822d662c1e5b947b44bcba6a967aadd965bc63c63fa2f918b868ed600e6cceea0086c3f23feb06ef0e115f9e6d061420f5070d"
        const payload = {"profile":output[0].profile, "name":output[0].name, "headline":output[0].headline}
        const token = jwt.sign(payload,secret)
        res.cookie("token", token)
        res.redirect("/posts")
    }
    else
    {
        res.send("User Id or Password incorrect")
    }
})

app.get('/posts',verifyLogin, async(req, res)=>{
    const output = await readPost()
    res.render("posts",{
        data:output,
        userInfo:req.payload
    })
})
app.post('/like', async (req, res)=>{
    await likeFun(req.body.content)
    res.redirect('/posts')
})

app.post('/shares', async (req, res)=>{
    await shareFun(req.body.content)
    res.redirect('/posts')
})

app.post('/delete', async (req, res)=>{
    await deleteFun(req.body.content)
    res.redirect("/posts")
})

app.post('/addposts', async (req, res)=>{
    await insertPost(req.body.profile, req.body.content)
    res.redirect("/posts")
})

function verifyLogin(req, res, next){
    const secret = "7ebb3596b4292f44f841be8539822d662c1e5b947b44bcba6a967aadd965bc63c63fa2f918b868ed600e6cceea0086c3f23feb06ef0e115f9e6d061420f5070d"
    const token = req.cookies.token
    jwt.verify(token, secret, (err, payload)=>{
        if (err) return res.sendStatus(403)
        req.payload = payload
    })
    next()
}


app.post('/adduser', async (req, res)=>{
    if(req.body.password===req.body.cnfpassword)
    {
        await insertUser(req.body.name, req.body.profile, req.body.password, req.body.headline)
        res.redirect('/')
    }
    else
    {
        res.send("password and confirm password didn't match")
    }
})

app.get('/register', (req, res)=>{
    res.render('register')
})

app.listen(3000, ()=>{
    console.log("Listening....")
})