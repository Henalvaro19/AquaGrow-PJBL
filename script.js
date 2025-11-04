const token = "YFTKaTfK3NtU5m4EwfCBehnWLRdj13Rt";

async function updateData() {
  let soil = await (await fetch(`https://blynk.cloud/external/api/get?token=${token}&v0`)).text();
  let temp = await (await fetch(`https://blynk.cloud/external/api/get?token=${token}&v1`)).text();
  let hum = await (await fetch(`https://blynk.cloud/external/api/get?token=${token}&v2`)).text();
  let kondisi = await (await fetch(`https://blynk.cloud/external/api/get?token=${token}&v4`)).text();
  let mode = await (await fetch(`https://blynk.cloud/external/api/get?token=${token}&v6`)).text();

  document.getElementById("soil").innerText = soil + "%";
  document.getElementById("temp").innerText = temp + "°C";
  document.getElementById("hum").innerText = hum + "%";
  document.getElementById("kondisi").innerText = kondisi;
  document.getElementById("mode").innerText = mode;
}

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

async function toggleMode() {
  const mode = await (await fetch(`https://blynk.cloud/external/api/get?token=${token}&v6`)).text();
  const newMode = (mode === "AUTO") ? 0 : 1;
  await fetch(`https://blynk.cloud/external/api/update?token=${token}&V5=${newMode}`);
}

setInterval(updateData, 2000);
updateData();