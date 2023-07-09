const chatList=document.getElementById('chatList');
const messageInput=document.getElementById('Dataform');

messageInput.addEventListener('submit',formSubmit);

async function formSubmit(e){
    try{
        e.preventDefault();
        const messageData=e.target.message.value;
        const token=localStorage.getItem('token');
        let obj={
            messageData
        }
        const response=await axios.post("http://localhost:3100/message/add-message",obj,{headers:{"Authorization":token}})
        showExp(response.data.newMessageData);
    }
    catch(err){
        console.log(err);
        chatList.body.innerHTML +=`<div style="color:red;">${err.name}</div>`;    
    }
    
}

