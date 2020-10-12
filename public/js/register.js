const form = document.getElementById("form");
const info = document.getElementById("info");
let successMsg = "";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const sendBody = {
        username: form.username.value,
        email: form.email.value,
        password: form.password.value,
        password2: form.password2.value
    }

    const res = await fetch('./register.html', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(sendBody)
    });

    const data = await res.json();

    if (data.success) {
        successMsg = `
        <div class="w-full h-10 rounded-md bg-green-200 py-2 px-4 my-2 none">You are now registered. <a class=\"text-blue-500\"href=\"./login.html\">Login</a></div>
        `;
        info.innerHTML = successMsg

    } else {
        info.innerHTML = successMsg + data.errors.map(error => `<div class="w-full h-auto rounded-md bg-red-200 py-2 px-4 my-2 none">${error.msg}</div>`).join('');
    }
})