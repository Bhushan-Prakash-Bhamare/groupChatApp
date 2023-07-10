const chatList=document.getElementById('chatList');
const messageInput=document.getElementById('Dataform');

messageInput.addEventListener('submit',formSubmit);

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function getmessages(){
    try{
        const token=localStorage.getItem('token');
        const allMsgs=await axios.get("http://localhost:3100/message/get-message",{ headers:{"Authorization":token}});
        chatList.innerHTML='';
        for(var i=0;i<allMsgs.data.messageData.length;i++)
           await showmsg(allMsgs.data.messageData[i]);
     }
     catch(error){
         console.log(error)
     };
}
window.addEventListener("DOMContentLoaded",()=>{
    showmsg()
    getmessages();
    setInterval(getmessages,1000);   
 })

 

async function formSubmit(e){
    try{
        e.preventDefault();
        const messageData=e.target.message.value;
        e.target.message.value='';
        const token=localStorage.getItem('token');
        let obj={
            messageData
        }
        const response=await axios.post("http://localhost:3100/message/add-message",obj,{headers:{"Authorization":token}})
        showmsg(response.data.messageData);
       console.log(response.data.messageData);
    }
    catch(err){
        console.log(err);
        chatList.body.innerHTML +=`<div style="color:red;">${err.name}</div>`;    
    }  
}

async function showmsg(obj){

    try{
        const token=localStorage.getItem('token');
        const decodedtoken=parseJwt (token);
        const addNewelem=document.createElement('li');
        addNewelem.className="list-group-item bg-light";
        let text;
        if(decodedtoken.userId==obj.userId){
             text=document.createTextNode("You"+":"+obj.message);    
        }
        else{
             const user=await axios.get(`http://localhost:3100/user/${obj.userId}`);
             text=document.createTextNode(user.data.userData.name+":"+obj.message);    
        }
        addNewelem.appendChild(text);
        chatList.appendChild(addNewelem);

    }
    catch(error){
        console.log(error)
    };
}