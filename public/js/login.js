const form=document.getElementById('Data-form');
const pwShowHide = document.querySelector(".eye-icon");
form.addEventListener('submit',formSubmit);
pwShowHide.addEventListener('click',pwdclick);

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

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
          email:e.target.email.value,
          password:e.target.password.value
      }
      
      const response=await axios.post(`http://13.49.238.207:3100/user/login`,details);  
      localStorage.setItem('token',response.data.token);     
      window.location.href = "../html/chatapp.html"; 
      
  }
  catch(err){ 
      console.log(err.message);
      document.body.innerHTML +=`<div style="color:red;">${err.message}</div>`;
  }
}