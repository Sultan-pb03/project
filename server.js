var express=require("express");
var mysql2=require("mysql2");
var fileuploader=require("express-fileupload");

let app=express()

app.listen(2005,function(){
    console.log("server start")
})
app.use(express.static("public"))
app.use(express.urlencoded("true"))

app.use(fileuploader())

let config={
    host:"bwtbfxvs9wrzzzw5bvg2-mysql.services.clever-cloud.com",
    user:"uej5dbdjjhxzgrhx",
    password:"FZgCMW0NYWRDkQnJ2Alo",
    database:"bwtbfxvs9wrzzzw5bvg2",
    dateStrings:true,
    keepAliveInitialDelay:10000,
    enableKeepAlive:true                                    

}
var mysql=mysql2.createConnection(config)
mysql.connect(function(err){
    if(err==null)
        console.log("connected to database successfully")
    else
    console.log(err.message+"##########")
})
app.get("/signup-process",function(req,resp){
    let email=req.query.txtemail
    let pwd=req.query.txtpwd
    let utype=req.query.combo
    mysql.query("insert into user values(?,?,?,?)",[email,pwd,utype,1],function(err,result){
        if(err==null)
        
            resp.send("signed up sucessfully")
            
        
        else
        resp.send(err.message)
    })
})
app.get("/login-process",function(req,resp){
   // console.log("login-process")

    let email=req.query.txtemaill
    let pwd=req.query.txtpwdd
    mysql.query("select* from user where email=? and pwd=?",[email,pwd],function(err,result){
        if(err!=null){
            resp.send(err.message)
            return
        }
        if(result.length==0)
        {
            resp.send("invalid id or password")
            return
        }
        if(result[0].status==1){
            resp.send(result[0].utype)   
            return
        }
        else{
            resp.send("U R BLOCKED   ........")
            return
        }
    })
})
app.get("/influencer-profile",function(req,resp){
    let path=__dirname+"/public/influencer-profile.html"
    resp.sendFile(path)
})
app.post("/inprofile-submit",function(req,resp){
    let fileName="";
    if(req.files!=null)
        {
             fileName=req.files.pics.name;
            let path=__dirname+"/public/uploads/"+fileName;
            req.files.pics.mv(path);
        }
        else
        fileName="nopic.jpg";


        var x = req.body.ifields.toString();

    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.txtemail,req.body.txtname,req.body.gender,req.body.dob,req.body.txtaddress,req.body.city,req.body.txtcontact,x,req.body.txtinstagram,req.body.txtfacebook,req.body.txtyoutube,req.body.otherinfo,fileName],function(err){
        if(err==null)
        {
            resp.send("REGISTERED SUCCESSFULLY")

        }
        else
        resp.send(err.message)
    })
})
app.post("/iprofile-update",function(req,resp){
    console.log(req.body)
    let fileName="";
    if(req.files!=null)
        {
             fileName=req.files.pics.name;
            let path=__dirname+"/public/uploads/"+fileName;
            req.files.pics.mv(path);
        }
        else
        fileName=req.body.hdn

        mysql.query("update iprofile set iname=?,gender=?,dob=?,address=?,city=?,contact=?,ifields=?,insta=?,facebook=?,youtube=?,other=?,picpath=? where email=?",[req.body.txtname,req.body.gender,req.body.dob,req.body.txtaddress,req.body.city,req.body.txtcontact,req.body.ifields.toString(),req.body.txtinstagram,req.body.txtfacebook,req.body.txtyoutube,req.body.otherinfo,fileName,req.body.txtemail],function(err,result){
            if(err==null)//no error
            {
                   if(result.affectedRows>=1) 
                       resp.send("Updated  Successfulllyyyy....");
                    else
                        resp.send("Invalid Email ID");
            }
        else
            resp.send(err.message);
        })
})

app.get("/influencer-dash",function(req,resp){
    let path=__dirname+"/public/influencer.html";
    resp.sendFile(path);
})
app.get("/post-bookings",function(req,resp){
    let email=req.query.txtemail
    let events=req.query.txtevents
    let date=req.query.date
    let time=req.query.time
    let city=req.query.txtcity
    let venue=req.query.txtvenue
    mysql.query("insert into events values(?,?,?,?,?,?)",[email,events,date,time,city,venue],function(err,result){
        if(err==null)
        
            resp.send("booked successfulll")
            
        
        else
        resp.send(err.message)
    })
})
app.get("/find-influencer-details",function(req,resp){
    let email=req.query.txtemail

    mysql.query("select*from iprofile where email=?",[email],function(err,resultjsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
        console.log(resultjsonAry);
            resp.send(resultjsonAry);//sending array of json object 0-1
    })
}
)

app.get("/admin-dash",function(req,resp)
{
    let path=__dirname+"/public/admin-dash.html"
    resp.sendFile(path)
})

app.get("/admin-user",function(req,resp)
{
    let path=__dirname+"/public/admin-user.html"
    resp.sendFile(path)
})
//----------------------
app.get("/fetch-users",function(req,resp){

    mysql.query("select*from user",function(err,result){
        if(err!=null){
            resp.send(err.message)
            return

        }
        
        resp.send(result)
    })
})
app.get("/block-user",function(req,resp){
    let x=0;
    mysql.query("update user set status=? where email=?",[x,req.query.email],function(err,result){
        if(err!=null){
            resp.send(err.message)
            return

        }
        
        resp.send(result)
    })
})
app.get("/unblock-user",function(req,res)
{
    let x=1;
    mysql.query("update user set status =? where email =?",[x,req.query.email],function(err,result)
    {
        if(!err)
        {
            res.send("ok");
        }
    })
})
app.get("/delete-user",function(req,res)
{
    mysql.query("delete from user where email=?",[req.query.email],function(err,result)
    {
        if(err!=null)
        {
            res.send(err,message);
        }
        res.send(result);
    })
})
app.get("/admin-all-influ",function(req,resp){
    let path=__dirname+"/public/admin-all-influ.html"
    resp.sendFile(path)
})
app.get("/show-all-influencer",function(req,resp){
    mysql.query("select*from iprofile",function(err,result){
        if(err!=null){
            resp.send(err.message)
            return

        }
        
        resp.send(result)
    })
})
app.post("/cprofile-submit",function(req,resp){
    console.log(req.body)
    mysql.query("insert into cprofile values(?,?,?,?,?,?)",[req.body.ctxtemail,req.body.ctxtname,req.body.ctxtcity,req.body.ctxtstate,req.body.ctxtindividual,req.body.ctxtcontact],function(err){
        if(err==null)
            {
                resp.send("REGISTERED SUCCESSFULLY")
    
            }
            else
            resp.send(err.message) 
    })
})
app.get("/influ-data",function(req,res)
{
    let name=req.query.name;
    mysql.query("select distinct city from iprofile where ifield=?",[name],function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;
        }
        res.send(result);
    })
})
app.get("/influ-selected-data",function(req,res)
{
    let field=req.query.sfield;
    let city=req.query.scity;
    mysql.query("select * from iprofile where ifield=? and city=?",[field,city],function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;
        }
        res.send(result);
    })
})
app.get("/fill-model",function(req,res)
{
    let email=req.query.email;
    mysql.query("select * from iprofile where email=?",[email],function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;
        }
        res.send(result);
    })
})

app.post("/cprofile-update",function(req,resp){

    mysql.query("update cprofile set cname=?,city=?,state=?,org=?,contact=? where email=?",[req.body.ctxtname,req.body.ctxtcity,req.body.ctxtstate,req.body.ctxtindividual,req.body.ctxtcontact,req.body.ctxtemail],function(err,result){

        if(err==null)//no error
            {
                   if(result.affectedRows>=1) 
                       resp.send("Updated  Successfulllyyyy....");
                    else
                        resp.send("Invalid Email ID");
            }
        else
            resp.send(err.message);
    })
})
app.get("/find-client-details",function(req,resp){
    let email=req.query.ctxtemail

    mysql.query("select*from cprofile where email=?",[email],function(err,resultjsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
        console.log(resultjsonAry);
            resp.send(resultjsonAry);//sending array of json object 0-1
    })

})
app.get("/client-profile",function(req,resp){
    let path=__dirname+"/public/client-profile.html"
    resp.sendFile(path)
})
app.get("/client-influencer",function(req,resp){
    let path=__dirname+"/public/influ-finder.html"
    resp.sendFile(path)
})
app.get("/event-all",function(req,resp){
    mysql.query("select* from events where doe>=current_date()",function(err,result){
        if(err!=null){
            resp.send(err.message)
            return

        }
        
        resp.send(result)
    })
})
app.get("/event-manager",function(req,resp){
    let path=__dirname+"/public/event-manager.html"
    resp.sendFile(path)
})
app.get("/delete-events",function(req,resp){
    mysql.query("delete from events where email=?",[req.query.email],function(err,result)
    {
        if(err!=null)
        {
            resp.send(err.message);
        }
        resp.send(result);
    })
})
app.get("/change-password-process",function(req,resp){
    let email = req.query.txtSettingEmail;
    let old = req.query.txtSettingOldPassword;
    let newP = req.query.txtSettingNewPassword;
    let confirmP = req.query.txtSettingConfirmPassword;
 
    if(newP!=confirmP){
        resp.send("Passwords don't match");
        return;
    }
    mysql.query("update users set pwd=? where email=? and pwd=?",[newP,email,old],function(err){
        if(err==null)    
            resp.send("Password Changed");
        else
            resp.send(err.message);
    })
    return;
});
app.get("/find-influencer",function(req,resp){
    let path=__dirname+"/public/influ-finder.html"
    resp.sendFile(path)
})