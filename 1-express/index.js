// import dependencies
//

import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

import 'dotenv/config'; // untuk membaca file .env
// inisialisasi app
//
// deklasrasi variable di JavaScript
// [const | let] nama_variable = [value]
// [var] --> 
//app = "budi"; // error karena const tidak bisa di re-assign

const app = express();
const upload = multer(); // akan dgunakan dalam recording

const ai = new GoogleGenAI({ }); // instantion menjadi object intance (oop -- object oriented programming)

// middleware
//
// contoh penggunaan middleware

app.use(cors()); //inisiasi cors  sebagai middleware
app.use(express.json()); // untuk parsing json


// inisialisasi routing
// contoh routing: app.get, app.post, app.put, dll

app.post('/generate-text', async (req, res) => {
    // terima jeroannya, lalu cek disini
    const { prompt } = req.body;  // object destructuring
    //satpamnya 
    if (!prompt || typeof prompt !== 'string') { // cek apakah prompt ada isinya
    res.status(400).json({
        success: false,
        message: 'Prompt harus berupa string!',
        data: null
    });
    }


    try { 
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { text: prompt }
            ],
            config: {
                systemInstruction: 'Harus di bls bahasa indonesia.'
            }
        });


        res.status(200).json({
            success: true,
            message: 'Berhasil dijawab',
            data: aiResponse.text
        });
    } catch (e) {
        // Semua kode penanganan error HARUS ada di DALAM sini
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Gagal mendapatkan respon dari Gemini',
            data: null // Sebaiknya sertakan detail error: e.message
        });
    }
});


// jalankan server
app.listen(3000, () => {
    console.log('Ini berjalan di port 3000');
});


