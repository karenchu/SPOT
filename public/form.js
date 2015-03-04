function checkPass(){
    //Store the password field objects into variables ...
    var pass1 = document.getElementById("pass1");
    var pass2 = document.getElementById("pass2");
    
    var message = document.getElementById("confirmMessage");
    var goodColor = "#66CC66";
    var badColor = "#2F2F2F";
    //Compare the values in the password field 
    //and the confirmation field
    if(pass1.value == pass2.value){
        //The passwords match. 
        //Set the color to the good color and inform
        //the user that they have entered the correct password 
        pass2.style.backgroundColor = goodColor;
        message.style.color = goodColor;
        message.innerHTML = "Passwords Match!"
    }else{
        //The passwords do not match.
        //Set the color to the bad color and
        //notify the user.
        pass2.style.backgroundColor = badColor;
        message.style.color = badColor;
        message.innerHTML = "Passwords Do Not Match!"
    }
};  

function confirmForm(form){

    var patt1 = /^[a-zA-Z]{1,}$/;
    if(!patt1.test(form.user[firstName].value)){
        alert("Invalid First Name");
        form.user[firstName].focus();
            return false;
    }
  
    var patt2 = /^[a-zA-Z]{1,}$/;
    if(!patt2.test(form.user[lastName].value)){
        alert("Invalid Last Name");
        form.user[lastName].focus();
            return false;
    }

    var patt3 = /^\w.+\@+[a-z]+\.[a-z]{2,7}$/;
    if(!patt3.test(form.user[email].value)){
        alert("Invalid Email");
        form.user[email].focus();
            return false;
    } 

    var patt6 = /^\w{5,}$/;
    if(!patt6.test(form.user[password].value)){
        alert("Invalid Password");
        form.user[password].focus();
            return false;
    }
  
    if(!(form.user[confirm_password].value == form.user[password].value)){
        alert("Password must be the same");
        form.user[confirm_password].focus();
            return false;
    } else {
        return true;
    }
}