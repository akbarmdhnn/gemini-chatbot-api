# **Proyek Chatbot Gemini: Aplikasi Percakapan Berbasis AI**

## **Deskripsi**

Aplikasi ini adalah sebuah chatbot berbasis web yang terhubung langsung dengan Google Gemini API. Aplikasi ini dirancang sebagai proyek *full-stack* sederhana yang menunjukkan bagaimana antarmuka frontend (HTML/CSS/JS) dapat berkomunikasi dengan server backend (Node.js/Express) untuk mendapatkan respons cerdas dari model AI generatif.

Proyek ini fokus pada penanganan alur percakapan, di mana frontend bertanggung jawab untuk mengelola riwayat obrolan (`conversationHistory`) dan mengirimkannya ke backend pada setiap permintaan. Backend kemudian meneruskan konteks ini ke Gemini API, memungkinkannya untuk memberikan jawaban yang relevan dan berkelanjutan.

## **Fitur Utama**

* **Antarmuka Chat Real-time:** Tampilan chat yang bersih dan responsif tempat pengguna dapat mengirim pesan dan menerima balasan secara langsung.
* **Koneksi Backend Express.js:** Sebuah server Node.js yang berfungsi sebagai perantara aman antara frontend dan Gemini API.
* **Integrasi Google Gemini API:** Terhubung dengan model `gemini-1.5-flash` (atau model lain yang dikonfigurasi) untuk menghasilkan respons AI.
* **Manajemen Konteks (History):** Logika di sisi klien (`script.js`) yang menyimpan seluruh riwayat percakapan dan mengirimkannya ke backend untuk menjaga konteks obrolan.
* **Validasi Sisi Server:** Backend (`index.js`) dilengkapi dengan "satpam" (validasi) untuk memastikan data yang diterima dari frontend memiliki format yang benar sebelum diproses.

## **Teknologi yang Digunakan**

* **Frontend:**
    * **HTML5:** Untuk struktur semantik konten aplikasi.
    * **CSS3:** Untuk desain dan tata letak antarmuka chat (`style.css`).
    * **JavaScript (ES6+):** Untuk semua logika aplikasi di sisi klien.
* **Backend:**
    * **Node.js:** Sebagai lingkungan runtime untuk server.
    * **Express.js:** Sebagai *framework* untuk membuat server web dan API endpoint (`/api/chat`).
    * **@google/generative-ai:** Library resmi Google untuk berinteraksi dengan Gemini API.
    * **dotenv:** Untuk mengelola *environment variables* (khususnya `GOOGLE_API_KEY`) dengan aman.
    * **cors:** *Middleware* untuk menangani *Cross-Origin Resource Sharing*.
* **Tools & Pengembangan:**
    * **Git & GitHub:** Untuk kontrol versi dan manajemen kode.
    * **Visual Studio Code:** Sebagai editor kode utama.
    * **NPM (Node Package Manager):** Untuk mengelola dependensi proyek.

## **Instruksi Setup**

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone repository ini:**
    ```bash
    git clone [https://github.com/akbarmdhnn/gemini-chatbot-api.git](https://github.com/akbarmdhnn/gemini-chatbot-api.git)
    ```

2.  **Buka folder proyek:**
    ```bash
    cd gemini-chatbot-api
    ```

3.  **Install semua dependensi:**
    ```bash
    npm install
    ```

4.  **Buat file `.env`:**
    * Buat file baru bernama `.env` di dalam folder utama proyek.
    * Isi file tersebut dengan API Key kamu:
        ```
        GOOGLE_API_KEY=AIzaSy... (API Key Gemini kamu)
        ```

5.  **Jalankan server backend:**
    ```bash
    node index.js
    ```
    * Kamu akan melihat pesan `Server nyala di http://localhost:3000` di terminal.

6.  **Buka aplikasi di browser:**
    * Buka browser dan akses `http://localhost:3000`.
    * Frontend (`static/index.html`) akan otomatis disajikan dan kamu bisa mulai chatting.

## **Penjelasan Arsitektur AI (Google Gemini)**

Tidak seperti proyek sebelumnya yang menggunakan AI untuk *menghasilkan* kode, dalam proyek ini, **AI adalah inti dari fungsionalitas aplikasi**. Arsitektur aplikasi ini dirancang untuk memungkinkan komunikasi yang efisien dengan Gemini API.

Berikut adalah alur data dan logika AI dalam aplikasi ini:

### **Tahap 1: Inisiasi oleh Pengguna (Frontend)**

* **Input Pengguna:** Pengguna mengetik pesan di `index.html` dan menekan "Send".
* **Penangkapan Event:** `script.js` menangkap *event submit* ini.
* **Penyimpanan History:** Pesan baru dari pengguna ditambahkan ke dalam array `conversationHistory` dengan peran (`role`) "user".

### **Tahap 2: Pengiriman Konteks ke Backend (Frontend ke Backend)**

* **Pengiriman Konteks:** `script.js` menggunakan `fetch` untuk mengirim **seluruh** array `conversationHistory` ke endpoint `/api/chat` di server `index.js`.
* **Alasan:** Pengiriman seluruh riwayat ini sangat penting karena model Gemini bersifat *stateless* (pelupa). Kita harus memberinya konteks penuh setiap saat.

### **Tahap 3: Proses di Server (Backend)**

* **Penerimaan Data:** Server `index.js` menerima data `conversation`.
* **Validasi:** Kode melakukan validasi untuk memastikan data adalah array yang valid.
* **Transformasi Data:** Data diubah formatnya (di-`map`) agar sesuai dengan struktur `contents` yang diminta oleh Gemini API.

### **Tahap 4: Permintaan ke Gemini API (Backend ke Google)**

* **Permintaan API:** Backend menggunakan library `@google/generative-ai` untuk mengirim data `contents` yang sudah diformat ke model AI (misal: `gemini-1.5-flash`).
* **Proses Asinkron:** Server menunggu (`await`) balasan dari Google.

### **Tahap 5: Respons Kembali ke Frontend (Backend ke Frontend)**

* **Pengiriman Balasan:** Setelah mendapat jawaban teks dari Gemini, backend mengirimkannya kembali ke frontend sebagai respons JSON (misal: `{ success: true, data: '...' }`).

### **Tahap 6: Pembaruan Antarmuka (Frontend)**

* **Penerimaan Balasan:** `script.js` menerima respons JSON dari `fetch`.
* **Pembaruan UI:** Jawaban dari bot (misal: `result.data`) ditampilkan di layar menggunakan fungsi `appendMessage('bot', ...)`.
* **Penyimpanan History (Lagi):** Jawaban bot ini kemudian juga disimpan ke dalam `conversationHistory` dengan peran (`role`) "model", melengkapi siklus percakapan.

**Dampak Keseluruhan:**
Pendekatan ini memastikan bahwa setiap kali pengguna mengirim pesan baru, AI menerima riwayat lengkap dari apa yang telah dibicarakan sebelumnya, memungkinkannya untuk memberikan jawaban yang kontekstual dan cerdas.