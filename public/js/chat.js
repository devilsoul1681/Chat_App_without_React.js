const socket=io()

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

//elements
const sendMessage=document.querySelector("#SendMessage")
const inputText=document.querySelector("input");
const SendLocation=document.querySelector("#SendLocation")
const messages=document.querySelector("#messages")

//template
const messageTemplate=document.querySelector("#message-template").innerHTML;
const locationTemplate=document.querySelector("#location-template").innerHTML;
const usersTemplate=document.querySelector("#sidebar-template").innerHTML;


const autoscroll = () => {
  $messages=messages
  // New message element
  const $newMessage = $messages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const containerHeight = $messages.scrollHeight

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
      $messages.scrollTop = $messages.scrollHeight
  }
}

//socket code

socket.emit("User detail",{username,room},(error)=>{
  if(error){
    alert(error);
    location.href="/"
  }
})

socket.on("User in room",({room,users})=>{
    const html=Mustache.render(usersTemplate,{
      room,
      users
    })
    document.querySelector(".chat__sidebar").innerHTML=html;
})



socket.on('sendLocationMessage',(location)=>{
  const html=Mustache.render(locationTemplate,{
    username:location.username,
    location:location.message,
    time:moment(location.time).format('h:mm a')
  })
  messages.insertAdjacentHTML('beforeend',html)
  autoscroll();
})

socket.on('message',(message)=>{
    const html=Mustache.render(messageTemplate,{
      username:message.username,
      message:message.message,
      time:moment(message.time).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
})


sendMessage.addEventListener("click",(e)=>{
    e.preventDefault();
    sendMessage.setAttribute("disabled","disabled");
    const message=inputText.value;
    socket.emit('message send from client',message,()=>{
      sendMessage.removeAttribute("disabled");
      inputText.value=null;
      inputText.focus()
    });
})


SendLocation.addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert("Geolocation not available on your browser")
    }
    SendLocation.setAttribute("disabled","disabled");
    navigator.geolocation.getCurrentPosition((position)=>{
      socket.emit("Send Location",{
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
      },()=>{
        SendLocation.removeAttribute("disabled");
        console.log("Location delivered")
      })
    })
})


// COUNT APP
// socket.on("count Updated",(count)=>{
//    console.log("The count is",count);
// })

// document.querySelector("#main").addEventListener('click',()=>{
//     socket.emit('increment')
// })