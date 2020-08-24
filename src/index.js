const express=require("express");
const http=require("http");
const bodyParser=require("body-parser");
const path = require('path')
const socketio=require("socket.io");
const app= express();
const PORT=process.env.PORT || 3000
const server=http.createServer(app);
const publicDirectoryPath = path.join(__dirname, '../public');
const io=socketio(server)

const {addUser,getUser,getUserInRoom,removeUser}=require("../src/utlis");

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())


//important function
generateTime=(username,message)=>{
    return {
        username,
        message:message,
        time:new Date().getTime()
    }
}


io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on("User detail",({username,room},callback)=>{
        const user=addUser({id:socket.id,username,room});
        if(user.error){
            return callback(user.error)
        }

        socket.join(user.room);
        socket.emit('message',generateTime("Admin","Welcome!!"))
        socket.broadcast.to(user.room).emit('message',generateTime("Admin",user.username+" has joined"))
        io.to(user.room).emit("User in room",{
            room:user.room,
            users:getUserInRoom(user.room)
        })
    })
    

    socket.on('message send from client',(message,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('message',generateTime(user.username,message));
        callback();
    })

    socket.on("Send Location",(position,callback)=>{
        const user=getUser(socket.id)
         io.to(user.room).emit('sendLocationMessage',generateTime(user.username,"https://google.com/maps?q="+position.latitude+","+position.longitude));
         callback();
    })

    socket.on('disconnect',()=>{
        const user=removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',generateTime("Admin",user.username+" has left"));
            io.to(user.room).emit("User in room",{
                room:user.room,
                users:getUserInRoom(user.room)
            })
        }
    })


})


server.listen(PORT,()=>{
    console.log("server is running on port 3000")
})



// COUNT APP
// io.on('connection',(socket)=>{
//     console.log('Connected')

//     socket.emit('count Updated',count)

//     socket.on('increment',()=>{
//         count++;
//         io.emit("count Updated",count)
//     })
// })