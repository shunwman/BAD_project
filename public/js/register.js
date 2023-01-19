async function registerNewUser() {
	const registerFormElement = document.querySelector('#register-form')
	registerFormElement.addEventListener('submit', async (event) => {
        event.preventDefault()

        // Serialize the Form afterwards
        const form = event.target
        const formObject = {}
        formObject['username'] = form.username.value
        formObject['password'] = form.password.value
        console.log(formObject);
        const res = await fetch('/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formObject),
        })
        const result = await res.json()
        if (res.ok){
        window.location.href="/index.html"
        }else{
          window.alert(result.message)
        }
      })}




registerNewUser();