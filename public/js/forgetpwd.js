const form=document.getElementById('Data-form');


form.addEventListener('submit',sendmail);

async function sendmail(e){
    try{    
        e.preventDefault(); 
        const details={
            email:e.target.email.value
        }
        const response=await axios.post(`http://13.49.238.207:3100/password/forgotpassword`,details); 
        console.log(response); 
        form.innerHTML+=`<h3>Mail sent</h3>`
    }   
    catch(err){
        console.log(err);
        form.innerHTML+=`<h3 style="color:red;" >Mail Not Sent</h3>`
    }
}