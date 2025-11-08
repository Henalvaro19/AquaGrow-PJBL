document.getElementById("connectBtn").addEventListener("click", function() {
    const token = document.getElementById("token").value;

    if (token) {
        localStorage.setItem("blynk_token", token);
        window.location.href = "inti.html";
    } else {
    }
});

document.getElementById("backBtn").addEventListener("click", function() {
    window.location.href = "index.html";
});
