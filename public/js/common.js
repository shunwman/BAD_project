async function loadUser(){
    let res = await fetch('/user/me')
    let data = await res.json()
   
    return data.data.user
}


loadUser()