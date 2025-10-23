// import semua library yg dibutuhin
//
import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
// Sesi 5 - import path/url buat ngurusin path file
import path from "node:path";
import { fileURLToPath } from "node:url";

// import dotenv buat baca file .env
import "dotenv/config";

// inisialisasi aplikasi
//
// --- Catatan Deklarasi Variabel ---
// [const|let] [namaVariable] = [value]
// [var] --> udah ga dipake, diganti const/let
//
// [const] --> ga bisa diubah lagi
// [let]   --> bisa diubah-ubah (re-assignment)
//
// Tipe data: number, string, boolean, undefined, null
//

const app = express();
const upload = multer(); // ini buat upload file nanti

const ai = new GoogleGenAI({}); // bikin instance AI-nya

// Sesi 5 - setup path buat __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// inisialisasi middleware
//
app.use(cors()); // middleware buat CORS, biar ga error pas di-fetch
app.use(express.json()); // middleware buat baca JSON dari body request

// Sesi 5 - inisialisasi folder 'static'
app.use(
  // express.static(rootDirectory, options)
  express.static(
    path.join(__dirname, "static"), // folder 'static' jadi root
    // jadi nanti bisa akses file di dalamnya lgsg
    // dari browser, contoh: /index.html
  ),
);

// inisialisasi routing
//
// --- Catatan HTTP Methods ---
// GET, PUT, POST, PATCH, DELETE, OPTIONS, HEAD
//
// --- Catatan Function ---
// function biasa --> function namaFunction() {}
// arrow function --> () => {}
// async function --> async () => {}
//
app.post("/generate-text", async (req, res) => {
  // ambil data 'prompt' dari body
  const { prompt } = req.body; // pake object destructuring

  // debugging, cek prompt masuk atau ngga
  console.log({ prompt });

  // "satpam" buat ngecek input
  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({
      success: false,
      message: "Prompt harus berupa string!",
      data: null,
    });
    return; // stop eksekusi kalo error
  }

  // bagian utamanya
  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }], // kirim prompt-nya
      // config tambahan buat AI
      config: {
        systemInstruction:
          "Harus dibalas dalam bahasa Jepang atau Sunda secara acak.",
      },
    });

    // kalo berhasil, kirim jawaban AI
    res.status(200).json({
      success: true,
      message: "Berhasil dijawab sama Gemini nih!",
      data: aiResponse.text,
    });
  } catch (e) {
    // kalo gagal, kirim pesan error
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Gagal gan, server-nya kayaknya lagi bermasalah!",
      data: null,
    });
  }
});

// fitur chat
// endpoint: POST /api/chat
app.post("/api/chat", async (req, res) => {
  // ambil 'conversation' dari body
  const { conversation } = req.body;

  try {
    // Satpam #1: Cek dulu, 'conversation' harus array
    if (!Array.isArray(conversation)) {
      throw new Error("Conversation harus berupa array!");
    }

    // Satpam #2: Cek isi conversationnya
    let messageIsValid = true; // asumsi awalnya valid

    // Kalo array-nya kosong, lempar error
    if (conversation.length === 0) {
      throw new Error("Conversation tidak boleh kosong!");
    }

    // Cek tiap message di dalem array
    conversation.forEach((message) => {
      // Kondisi #1 -- message harus object & ga boleh null
      if (!message || typeof message !== "object") {
        messageIsValid = false;
        return;
      }

      // Cek keys-nya, harus 'text' dan 'role'
      const keys = Object.keys(message);
      const objectHasValidKeys = keys.every((key) =>
        ["text", "role"].includes(key),
      );

      // .every() --> semua harus true
      // .some()  --> salah satu true aja cukup

      // Kondisi #2 -- jumlah keys harus 2 & namanya harus valid
      if (keys.length !== 2 || !objectHasValidKeys) {
        messageIsValid = false;
        return;
      }

      const { text, role } = message;

      // Kondisi 3A -- role harus 'model' atau 'user'
      if (!["model", "user"].includes(role)) {
        messageIsValid = false;
        return;
      }

      // Kondisi 3B -- text harus string & ga boleh kosong
      if (!text || typeof text !== "string") {
        messageIsValid = false;
        return;
      }
    });

    // Kalo ada satu aja yg ga valid, lempar error
    if (!messageIsValid) {
      throw new Error("Message harus valid!");
    }

    // Kalo lolos satpam, lanjut proses
    // Ubah format data biar sesuai sama maunya Gemini API
    const contents = conversation.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    // Kirim ke Gemini
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents, // kirim semua history conversation
      config: {
        systemInstruction: "Harus membalas dengan bahasa Sunda.",
      },
    });

    // Kirim jawaban AI ke frontend
    res.status(200).json({
      success: true,
      message: "Berhasil dibalas oleh Google Gemini!",
      data: aiResponse.text,
    });
  } catch (e) {
    // Kalo ada error di try, tangkep di sini
    res.status(500).json({
      success: false,
      message: e.message,
      data: null,
    });
  }
});

// server-nya harus dijalanin
app.listen(
  3000, // port 3000
  () => {
    console.log("I LOVE YOU 3000"); // nandain server udah jalan
  },
);
