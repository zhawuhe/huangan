const express=require("express")
const app=express()
const bodyParser=require('body-parser')
const mysql=require('mysql')
const moment=require("moment")
const conn=mysql.createConnection({
    host:'127.0.0.1',
    database:'mysql_002',
    user:'root',
    password:'root'
})
//设置模板引擎
app.set("view engine",'ejs')
//设置模板存放路径,如果不设置就默认在views
app.set('views','./views')

app.use(bodyParser.urlencoded({extended:false}))
//静态资源托管
app.use("/node_modules",express.static('./node_modules'))

app.get("/",(req,res)=>{
    res.render('index.ejs',{})
})

app.get("/register",(req,res)=>{

    res.render("./user/register.ejs",{})
})
app.get("/login",(req,res)=>{
    res.render("./user/login.ejs",{})
})


//要注册新用户了
app.post('/register',(req,res)=>{
    const body=req.body
   if(body.username.trim().length<=0||body.password.trim().length<=0||body.nickname.trim().length<=0){
       return res.send({msg:"请填写完整的表单数据后在注册用户",status:400})
   }
   //查询用户名是否重复
   const sql1='select count(*) as count from blog_users where username=?'
   conn.query(sql1,body.username,(err,result)=>{
       if(err) return res.send({msg:"用户名查重失败",status:400})
       if(result[0].count!==0) return res.send({msg:"请更换其他用户名",status:500})
      body.ctime= moment().format('YYYY-MM-DD HH:mm:ss')
       const sql2="insert into blog_users set?"
       conn.query(sql2,body,(err,result)=>{
            if(err) return res.send({msg:"注册新用户失败",status:400})
            if(result.affectedRows!==1) return res.send({msg:'注册新用户失败',status:500})
            res.send({msg:'注册新用户成功',status:200})
       })
   })
 
})

//监听登录的请求
app.post("/login",(req,res)=>{
    const body =req.body
    const sql3='select*from blog_users where username=? and password=?'
    conn.query(sql3,[body.username,body.password],(err,result)=>{
        if(err) return res.send({msg:"用户登录失败",status:404})
        // console.log(result)
        if(result.length!==1) return  res.send({msg:"用户登录失败",status:400})
        res.send({msg:'ok',status:200})
    })
   
})


app.listen(80,()=>{
    console.log("server running at http://127.0.0.1")
})