let SERVER_IP = "localhost:8080"
login()
async function login() {

    const loginForm = document.querySelector('#login-form')

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const form = e.target
        const username = form.username.value
        const password = form.password.value
        // console.log(username, password)
        const res = await fetch('/user/login', {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (res.ok) {
            window.location = `/index.html`
        }
        if (res.status == 401) {
            alert("Invalid username or password! Please try again.")
        }
        if (res.status == 400) {
            alert("You have been logged in, please check other browser!")
        }

    })

}

register()
async function register() {

    const registerForm = document.querySelector('#register-form')

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const form = e.target
        const registerUsername = form.registerUsername.value
        const registerPassword = form.registerPassword.value
        const registerImage = form.userImage.files[0]

        const formData = new FormData()
        formData.append('registerUsername', registerUsername)
        formData.append('registerPassword', registerPassword)
        formData.append('image', registerImage)


        const res = await fetch('/user/register', {
            method: "POST",
            body: formData
        })
        if (res.status == 400) {
            alert("Invalid username/password or username already registered")
        }
        if (res.status == 200) {
            window.location = `/index.html`
        }
    })

}
