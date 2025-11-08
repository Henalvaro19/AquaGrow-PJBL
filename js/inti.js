// Ambil token dari localStorage
const token = localStorage.getItem("blynk_token");

if (!token) {
    alert("Token Blynk tidak ditemukan! Silakan setup terlebih dahulu.");
    window.location.href = "setup.html";
}

// Fungsi update data utama
async function updateData() {
    try {
        // Ambil data
        const tempRes = await fetch(`https://blynk.cloud/external/api/get?token=${token}&v1`);
        const soilRes = await fetch(`https://blynk.cloud/external/api/get?token=${token}&v0`);
        const humRes = await fetch(`https://blynk.cloud/external/api/get?token=${token}&v2`);
        const kondisiRes = await fetch(`https://blynk.cloud/external/api/get?token=${token}&v4`);
        const modeRes = await fetch(`https://blynk.cloud/external/api/get?token=${token}&v6`);

        if (!tempRes.ok || !humRes.ok || !soilRes.ok) throw new Error("Device offline");

        const temp = await tempRes.text();
        const soil = await soilRes.text();
        const hum = await humRes.text();
        const kondisi = await kondisiRes.text();
        const mode = await modeRes.text();

        // Jika temp kosong → offline
        // if (temp === "" || temp === null) throw new Error("Device offline");

        // Online → update semua
        document.getElementById("temp").innerText = temp + "°C";
        document.getElementById("hum").innerText = hum + "%";
        document.getElementById("kondisi").innerText = kondisi;
        document.getElementById("mode").innerText = mode;

        updateSoilGauge(Number(soil)); // tetap pakai soil untuk gauge

        updateStatus(true);

    } catch (error) {
        // Offline → reset semua
        console.log("Device Offline:", error);
        updateStatus(false);
    }
}

// Fungsi update soil gauge
function updateSoilGauge(value) {
    const needle = document.getElementById("needle");
    const soilValue = document.getElementById("soilValue");
    const gauge = document.querySelector(".gauge");

    // 0% = kiri (-90deg), 100% = kanan (90deg)
    let angle = (value / 100) * 180 - 90;
    needle.style.transform = `rotate(${angle}deg)`;

    soilValue.innerText = value + "%";

    if (value <= 30) {
        gauge.style.background = "#ffcccc";   
        needle.style.background = "#d32f2f";  
    } else if (value <= 70) {
        gauge.style.background = "#fff8b3";   
        needle.style.background = "#fbc02d";  
    } else {
        gauge.style.background = "#c8facc";   
        needle.style.background = "#388e3c";  
    }
}

// Fungsi update status Online/Offline
// function updateStatus(isOnline) {
//     const statusDiv = document.getElementById("statusProduk");
//     const body = document.body;

//     if (isOnline) {
//         statusDiv.innerText = "Online";
//         statusDiv.classList.add("status-online");
//         statusDiv.classList.remove("status-offline");
//         body.classList.remove("offline");
//     } else {
//         statusDiv.innerText = "Offline";
//         statusDiv.classList.add("status-offline");
//         statusDiv.classList.remove("status-online");
//         body.classList.add("offline");

//         // Reset nilai dashboard
//         document.getElementById("soilValue").innerText = "0%";
//         document.getElementById("temp").innerText = "0°C";
//         document.getElementById("hum").innerText = "0%";
//         document.getElementById("kondisi").innerText = "--";
//         document.getElementById("mode").innerText = "--";

//         // Reset jarum
//         document.getElementById("needle").style.transform = "rotate(-90deg)";
//         document.getElementById("needle").style.background = "#d3d3d3";
//         document.querySelector(".gauge").style.background = "#e0e0e0";
//     }
// }

// Tombol Pompa
async function togglePompa() {
    const button = document.getElementById("togglePompa");
    if (button.innerText.includes("Nyalakan")) {
        await fetch(`https://blynk.cloud/external/api/update?token=${token}&V3=1`);
        button.innerText = "Matikan Pompa";
        button.classList.add("off");
    } else {
        await fetch(`https://blynk.cloud/external/api/update?token=${token}&V3=0`);
        button.innerText = "Nyalakan Pompa";
        button.classList.remove("off");
    }
}

// Tombol Mode
async function toggleMode() {
    const modeRes = await fetch(`https://blynk.cloud/external/api/get?token=${token}&v6`);
    const mode = await modeRes.text();
    const newMode = (mode === "AUTO") ? 0 : 1;
    await fetch(`https://blynk.cloud/external/api/update?token=${token}&V5=${newMode}`);
}

setInterval(updateData, 2000);
updateData();

// document.querySelectorAll(".category-card .setBtn").forEach(button => {
//     button.addEventListener("click", async function() {
//         const card = button.closest(".category-card");
//         const percent = card.getAttribute("data-percent");
//         await setTargetMoisture(percent);
//     });
// });

// document.getElementById("customBtn").addEventListener("click", async function() {
//     const customValue = document.getElementById("customPercent").value;
//     if (customValue !== "" && customValue >= 0 && customValue <= 100) {
//         await setTargetMoisture(customValue);
//     } else {
//         alert("Masukkan nilai 0-100%");
//     }
// });

// async function setTargetMoisture(percent) {
//     try {
//         await fetch(`https://blynk.cloud/external/api/update?token=${token}&V8=${percent}`);
//         alert(`Setpoint soil moisture diubah ke ${percent}%`);
//     } catch (err) {
//         console.error("Gagal kirim ke ESP:", err);
//         alert("Gagal update setpoint, cek koneksi!");
//     }
// }