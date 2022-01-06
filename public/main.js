const socket = io();

function validateKeyvalue (key, value){
    if(!document.getElementById('key').value || /^\s*$/.test(document.getElementById('key').value)){
        alert('Key field can\'t be empty.');
        return false;
    }

    if(document.getElementById('key').value.length<3 || document.getElementById('key').value.length>50){
        alert('The key must be between 3 and 50 characters!');
        return false;
    }

    if(!document.getElementById('value').value || /^\s*$/.test(document.getElementById('value').value)){
        alert('Value field can\'t be empty.');
        return false;
    }

    if(document.getElementById('value').value.length<3 || document.getElementById('value').value.length>50){
        alert('The value must be between 3 and 50 characters!');
        return false;
    }

    return true
}

const sendKeyvalue = () => {
    if(validateKeyvalue(document.getElementById('key').value, document.getElementById('value').value) ){
        socket.emit('saveKeyvalue', 
            `{ 
                "key":"${document.getElementById('key').value.replace(/(\r\n|\n|\r)/gm, "")}",
                "value":"${document.getElementById('value').value.replace(/(\r\n|\n|\r)/gm, "")}",
                "id":"${document.getElementById('id').value.replace(/(\r\n|\n|\r)/gm, "")}"
            }`
        );
    }
}

socket.on('saveKeyvalueFail', data =>{
    alert('an error occurred when trying to save the Key/Value. '+data)
})

socket.on('saveKeyvalueSuccess', data =>{
    if(document.getElementById('id').value){
        alert('The key/value was successfully modified');
    }else{
        alert(`Congratulations! the Key/Value was create with the id ${data}`);
    }
    window.location.replace("/keyvalue/list");
})

const deleteKey = (id) => {
    let key = document.getElementById("trKeyvalue"+id).getElementsByClassName("tdKey")[0].innerHTML;
    if (confirm(`Are you sure you want to delete the key ${key} ?`)) {
        socket.emit('deleteKeyvalue', 
            `{ 
                "id":"${id}"
            }`
        );
      }
}

const deleteUser = (id) => {
    let key = document.getElementById("trUser"+id).getElementsByClassName("tdUser")[0].innerHTML;
    if (confirm(`Are you sure you want to delete the user ${key} ?`)) {
            fetch("/users/form", {method: "DELETE",headers: {"Content-Type": "application/json"},body: '{ "id":"'+id+'"}'})
            .then(response => response.text())
            .then(data => {
                const json = JSON.parse(data);
                if(json.status == 200){
                    alert(`The user was deleted.`);
                    window.location.replace("/users/list");
                }else{
                    alert(`The user could not be deleted. ${json.errorMessagge}`);
                }
            });
      }
}

socket.on('deleteKeyvalueSuccess', data =>{
    alert('The Key/Value was deleted.');
    window.location.replace("/keyvalue/list");
})

socket.on('deleteKeyvalueFail', data =>{
    alert('An error occurred when trying to delete the key/value.')
})

socket.on('changeKeyvalue', data =>{
    const tableKeyvalue = document.getElementById('tableKeyvalue');
    if(tableKeyvalue){
        data = JSON.parse(data);
        if(!data.deleteKeyvalue){
            let targetTr = document.getElementById("trKeyvalue"+data.keyvalue.id);
            if(targetTr){
                targetTr.getElementsByClassName("tdKey")[0].innerHTML=data.keyvalue.key;
                targetTr.getElementsByClassName("tdValue")[0].innerHTML=data.keyvalue.value;
                targetTr.classList.remove("elementToFadeInAndOut");
                setTimeout(function () {
                    targetTr.classList.add("elementToFadeInAndOut");
                }, 200);

            }else{
                document.getElementById("invisibleMessage").style.visibility = 'visible';
            }
        }else{
            document.getElementById("invisibleMessage").style.visibility = 'visible';
        }
    }
})

window.onload = function() {
    const usernameForm = document.getElementById('usernameForm');
    const usernameFormSubmit = document.getElementById('usernameFormSubmit');
    if(usernameForm){
        usernameFormSubmit.addEventListener('click', e =>{
            e.preventDefault();
            if(!document.getElementById('username').value || /^\s*$/.test(document.getElementById('username').value)){
                alert('The Username can\'t be empty!');
                return null;
            }
            
            if(document.getElementById('username').value.length<4 || document.getElementById('username').value.length>30){
                alert('The Username must be between 4 and 30 characters!');
                return null;
            }

            if(!document.getElementById('id').value){
                if((!document.getElementById('password').value || /^\s*$/.test(document.getElementById('password').value))){
                    alert('The Password can\'t be empty!');
                    return null;
                }

                if(document.getElementById('password').value.length<4 || document.getElementById('password').value.length>100){
                    alert('The Password must be between 4 and 100 characters!');
                    return null;
                }
            }

            if(String(document.getElementById('repassword').value)!=String(document.getElementById('password').value)){
                alert('The Passwords must match!');
                return null;
            }

            let body = '{ "username":"'+document.getElementById('username').value+'","password":"'+document.getElementById('password').value+'","lvlUser":"'+document.getElementById('lvlUser').value+'","id":"'+document.getElementById('id').value+'"}';
            fetch("/users/form", {method: "POST",headers: {"Content-Type": "application/json"},body: body})
            .then(response => response.text())
            .then(data => {
                const json = JSON.parse(data);
                if(json.status == 200){
                    let type = document.getElementById('id').value ? 'modificated' : 'created';
                    alert(`The user was ${type}!`);
                    window.location.replace("/users/list");
                }else{
                    alert(`The user could not be modified. ${json.errorMessagge}`);
                }
            });
        })
    }
};