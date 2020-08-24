const users=[]

const addUser=({id,username,room})=>{

    if(!username || !room){
        return {
            error:'Please provide valid username and room'
        }
    }


    username=username.trim().toLowerCase();
    room=room.trim().toLowerCase();

    const match=users.find((user)=>{

        return user.username===username && user.room===room
    })

    if(match){
        return {
            error:'Username already in use!!'
        }
    }

    const user={id,username,room};
    users.push(user);
    return user;
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })
    if(index!==-1){
        return users.splice(index,1)[0];
    }

}

const getUser=(id)=>{
   const user =users.find((user)=>{
       return id===user.id
   })
   if(!user){
       return {
           error:"No user found with this id"
       }
   }
   return user
}

const getUserInRoom=(room)=>{
    const userroom=users.filter((user)=>{
        return user.room===room
    })

    return userroom;
}

// const user={
//     id:1,
//     username:"AMan",
//     room:"aavsd"
// }

// addUser(user);
// console.log(getUserInRoom("aasd"));



module.exports={
    addUser,
    getUser,
    getUserInRoom,
    removeUser
}