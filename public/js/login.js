const form = document.getElementById("form");
const info = document.getElementById("info");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const sendBody = {
    email: form.email.value,
    password: form.password.value,
  };
  const res = await fetch("./login.html", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(sendBody),
  });
  console.log(res);
  if (res.status === 200) {
    window.location = "/";
  } else {
    info.innerHTML = `<div class="w-full h-auto rounded-md bg-red-200 py-2 px-4 my-2 none">Wrong email or password. Try again</div>`;
  }
});
