const form=document.getElementById('Data-form');
const pwShowHide = document.querySelector(".eye-icon");
form.addEventListener('submit',formSubmit);
pwShowHide.addEventListener('click',pwdclick);

function pwdclick(){
  let pwFields = form.querySelector(".password");

      if(pwFields.type === "password"){
        pwFields.type = "text";
          pwShowHide.classList.replace("bx-hide", "bx-show");
          return;
      }
      pwFields.type = "password";
      pwShowHide.classList.replace("bx-show", "bx-hide");
  }

async function formSubmit(e){
    try{
        e.preventDefault();  
        const details={
            name:e.target.name.value,
            email:e.target.email.value,
            phoneNo:e.target.phoneNo.value,
            password:e.target.password.value
        }
        
        const response=await axios.post(`http://localhost:3100/user/signup`,details);
        if(response.status===201){
            console.log("success:User added"); 
        }
        else{
            throw new error('Something went wrong');
        }
    }
    catch(err){
        console.log(err);
        form.innerHTML +=`<div style="color:red;">${err.name}</div>`;
    }
}