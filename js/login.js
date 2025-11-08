document.getElementById("loginBtn").addEventListener("click", function() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user && pass) {
    localStorage.setItem("user_name", user);
    window.location.href = "setup.html";
  } else {
  }
});

document.getElementById("skipBtn").addEventListener("click", function() {
  window.location.href = "setup.html";
});
