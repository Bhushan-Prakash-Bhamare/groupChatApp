const chatList=document.getElementById('chatList');
const groupList=document.getElementById('groupList');
const memberList=document.getElementById('memberList');
const addGroupBtn=document.getElementById('groupBtn');
const messageInput=document.getElementById('Dataform');
const addGroupDisplay=document.getElementById('addgrp');

addGroupBtn.addEventListener('click',()=>{
    addGroupDisplay.style.display='block'
});

addGroupDisplay.addEventListener('submit',AddGroup);

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
        const msgarray=localStorage.getItem('msgs');
        const parsedMsgs=JSON.parse(msgarray);
        while(parsedMsgs!=null && parsedMsgs.length>10){
            parsedMsgs.shift();
        }
        let mergedArrays;
        let msgId=-1;
        if(parsedMsgs.length>0){  
            parsedMsgs.forEach(element => {
                msgId=element.id;
             }); 
        } 
        const allMsgs=await axios.get(`http://13.49.238.207:3100/message/get-message?lastMsgID=${msgId}`);
        if(parsedMsgs.length>0 && allMsgs.data.messageData.length>0){
            mergedArrays=parsedMsgs.concat(allMsgs.data.messageData);
        }
        else if(parsedMsgs.length==0 && allMsgs.data.messageData.length>0){
            mergedArrays=allMsgs.data.messageData;
        }
        else if(parsedMsgs.length>0 && allMsgs.data.messageData.length==0){
            mergedArrays=parsedMsgs;
        }
        else{
            mergedArrays=[];
        }
        const msgString=JSON.stringify(mergedArrays);
        localStorage.setItem('msgs',msgString);
        for(var i=0;i<allMsgs.data.messageData.length;i++)
            await showmsg(allMsgs.data.messageData[i]);
       
     }
     catch(error){
         console.log(error);
     };
}
window.addEventListener("DOMContentLoaded",async()=>{
    const token=localStorage.getItem('token');
    // const allMsgs=await axios.get(`http://13.49.238.207:3100/message/get-message?lastMsgID=0`);
    // const msgString=JSON.stringify(allMsgs.data.messageData);
    // localStorage.setItem('msgs',msgString);
    // for(var i=0;i<allMsgs.data.messageData.length;i++)
    //         await showmsg(allMsgs.data.messageData[i]);
    
    const response=await axios.get("http://13.49.238.207:3100/group/get-group",{headers:{"Authorization":token}});
    // console.log(response);
    for(var i=0;i<response.data.groupData.length;i++)
            await showgrps(response.data.groupData[i]);

    // setInterval(getmessages,1000);   
 })

 

async function formSubmit(e){
    try{
        e.preventDefault();
        const messageData=e.target.message.value;
        e.target.message.value='';
        const msgArray=localStorage.getItem('msgs');
        const msgArrayParsed=JSON.parse(msgArray);
        const token=localStorage.getItem('token');
        const groupId=localStorage.getItem('groupId');
        let obj={
            messageData,groupId
        }
        const response=await axios.post("http://13.49.238.207:3100/message/add-message",obj,{headers:{"Authorization":token}})
        if(msgArray!=null){
            msgArrayParsed.push(response.data.messageData);
            msgStringArray=JSON.stringify(msgArrayParsed);
            localStorage.setItem('msgs',msgStringArray);
        }
        else{
            msgStringArray=JSON.stringify(response.data.messageData);
            localStorage.setItem('msgs',msgStringArray);
        }
        showmsg(response.data.messageData);
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
             const user=await axios.get(`http://13.49.238.207:3100/user/${obj.userId}`);
             text=document.createTextNode(user.data.userData.name+":"+obj.message);    
        }
        addNewelem.appendChild(text);
        chatList.appendChild(addNewelem);

    }
    catch(error){
        console.log(error)
    };
}

async function AddGroup(e){
    e.preventDefault();
    const token=localStorage.getItem('token');
    addGroupDisplay.style.display='none';
    const groupName=e.target.grpname.value;
    // const email=e.target.email.value; 
    let obj={
        groupName
    }
    const response=await axios.post("http://13.49.238.207:3100/group/add-group",obj,{headers:{"Authorization":token}});
    // console.log(response.data.groupData);
    showgrps(response.data.groupData);
    
}

async function showgrps(myobj){
    try{
        const addNewelem=document.createElement('li');
        addNewelem.className="list-group-item bg-light border border-dark border-1";
        const text=document.createTextNode(myobj.name);
        addNewelem.style.fontSize='25px';
        addNewelem.appendChild(text);
        const brTag=document.createElement('br');
        addNewelem.appendChild(brTag);

        const addMemberbtn=document.createElement('button');
        addMemberbtn.className='btn btn-primary btn-sm'
        addMemberbtn.appendChild(document.createTextNode('Add Member'));
        addNewelem.appendChild(addMemberbtn);

        const memberForm=document.createElement('form');
        memberForm.setAttribute("style", "display:none;");
        memberForm.className="mt-3"
        let userName = document.createElement("input");
        userName.className="form-control"
        userName.setAttribute("placeholder", "Phone Number");
        userName.setAttribute("name", "PhoneNo");
        memberForm.appendChild(userName);
        var sBtn = document.createElement("input");
        sBtn.className="btn btn-dark"
         sBtn.setAttribute("value", "Add");
         sBtn.setAttribute("type", "submit");
         memberForm.appendChild(sBtn);
        addNewelem.appendChild(memberForm);

        
        groupList.appendChild(addNewelem);

        memberForm.addEventListener('submit',async(e)=>{
            try{
                e.preventDefault();
                const phoneNo=e.target.PhoneNo.value;
                const gId=localStorage.getItem('groupId');
                e.target.PhoneNo.value="";
                // console.log(phoneNo);
                const addMember=await axios.get(`http://13.49.238.207:3100/group/add-user?phoneNo=${phoneNo}&groupId=${gId}`);
                memberForm.innerHTML+=`<h5 class="text-center" style="color:green;">User Added</h5>`
                setTimeout(()=>{
                   memberForm.setAttribute("style", "display:none;");
                },2000)

            }
            catch(err){
                console.log(err);
            }
        });

        addNewelem.addEventListener('click',async()=>{
            try{
                localStorage.setItem('groupId',myobj.id);
                const token=localStorage.getItem('token');
                const groupId=myobj.id;
                const allMsgs=await axios.get(`http://13.49.238.207:3100/message/get-message/${groupId}`,{headers:{"Authorization":token}});
                const msgString=JSON.stringify(allMsgs.data.messageData);
                localStorage.setItem('msgs',msgString);
                chatList.innerHTML='';
                for(var i=0;i<allMsgs.data.messageData.length;i++)
                    await showmsg(allMsgs.data.messageData[i]);
                const grpMembers=await axios.get(`http://13.49.238.207:3100/group/get-members/${groupId}`);
                memberList.innerHTML='';
                for(var i=0;i<grpMembers.data.members.length;i++)
                    await showMembers(grpMembers.data.members[i]);
                // console.log(grpMembers);
            }
            catch(err){
                console.log(err);
            }
        })        
        addMemberbtn.addEventListener('click',async function(){
            try{

                memberForm.setAttribute("style", "display:block;");
            }
            catch(err){
                console.log(err)
            };     
        })
        }
        catch(error){
            console.log(error)
        };   
}

async function showMembers(obj){
    try{
        const addNewelem=document.createElement('li');
        addNewelem.className="list-group-item bg-light";
        text=document.createTextNode(obj.name);    
        addNewelem.appendChild(text);

        const token=localStorage.getItem('token');
        const decodedtoken=parseJwt (token);
        const gId=localStorage.getItem('groupId');
        // console.log(decodedtoken);
        const isAdmin=await axios.get(`http://13.49.238.207:3100/group/isAdmin?userId=${decodedtoken.userId}&groupId=${gId}`);
        if(isAdmin.data.Data.isAdmin){

            const removeUser=document.createElement('button');
            removeUser.className='btn btn-danger btn-sm float-end'
            removeUser.appendChild(document.createTextNode('Remove User'));
            addNewelem.appendChild(removeUser);

            const makeAdmin=document.createElement('button');
            makeAdmin.className='btn btn-primary btn-sm float-end'
            makeAdmin.appendChild(document.createTextNode('Make Admin'));
            addNewelem.appendChild(makeAdmin);
        
            const gId=localStorage.getItem('groupId');
            const Adminperm=await axios.get(`http://13.49.238.207:3100/group/isAdmin?userId=${obj.id}&groupId=${gId}`);
            if(Adminperm.data.Data.isAdmin){
                addNewelem.removeChild(makeAdmin);
                const removeAdmin=document.createElement('button');
                removeAdmin.className='btn btn-outline-danger btn-sm float-end'
                removeAdmin.appendChild(document.createTextNode('Remove Admin Permisssion'));
                addNewelem.appendChild(removeAdmin);

                removeAdmin.addEventListener('click',async()=>{
                    const gId=localStorage.getItem('groupId');
                    const noAdmin=await axios.get(`http://13.49.238.207:3100/group/removeAdmin?userId=${obj.id}&groupId=${gId}`);
                });
            }

        makeAdmin.addEventListener('click',async()=>{
            const gId=localStorage.getItem('groupId');
            const makeAdmin=await axios.get(`http://13.49.238.207:3100/group/makeAdmin?userId=${obj.id}&groupId=${gId}`);
        });

        removeUser.addEventListener('click',async()=>{
            const gId=localStorage.getItem('groupId');
            const removeMember=await axios.get(`http://13.49.238.207:3100/group/remove-user?userId=${obj.id}&groupId=${gId}`);
        });
        }
        memberList.appendChild(addNewelem);
    }
    catch(error){
        console.log(error)
    };
}