// import dependencies
//

import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";


// session 5 - import path/url package

import path from "node:path";
import { fileURLToPath } from "node:url";




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



// session 5 - penambahan path

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
//
// contoh penggunaan middleware

app.use(cors()); //inisiasi cors  sebagai middleware
app.use(express.json()); // untuk parsing json


// Session 5 - inisialisasi static directory

app.use(express.static(path.join(__dirname, 'static')));


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



app.post("/api/chat", async (req, res) => {
    const { conversation } = req.body;

    try { // satpam 1
        if(Array.isArray(conversation)) {
            throw new Error("Conversation harus berupa string, bukan array.");
        }



        // satpam 2

        let messageIsValid = true;
        if (conversation.length === 0) {
            throw new Error("Conversation tidak boleh kosong.");
        }

        for (let i = 0; i < message.length; i++) {
            const message = conversation[i]
        }

        conversation.forEach((message) => {
            if ( !message|| typeof message !== "object" ) {
                messageIsValid = false;
                return;
            }
        })
    } catch (e) {}

})

// jalankan server
app.listen(3000, () => {
    console.log('Ini berjalan di port 3000');
});


