const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

router.post('/tanya', async (req, res) => {
    try {
        // Pindahkan inisialisasi ke dalam sini agar kita yakin .env sudah terbaca
        if (!process.env.GEMINI_API_KEY) {
            console.error("API Key kosong! Pastikan .env sudah diload.");
            return res.status(500).json({ success: false, message: 'API Key tidak ditemukan di server.' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const { pertanyaan, konteks_materi, riwayat } = req.body;
        
        let systemPrompt = "Kamu adalah asisten belajar AI di platform BelajarDimanaAja. Tugasmu adalah membantu siswa sekolah dan mahasiswa memahami materi pelajaran, menjawab pertanyaan terkait pendidikan, dan membuat soal latihan bila diminta. Gunakan bahasa Indonesia yang mudah dipahami, ramah, dan memotivasi. JANGAN berikan instruksi terkait manajemen website, database, atau tugas admin. Jika pengguna bertanya tentang hal di luar edukasi, tolak dengan sopan.";

        if (konteks_materi) {
            systemPrompt += `\n\nSaat ini pengguna sedang membaca materi berikut. Gunakan ini sebagai referensi utama jika pertanyaan berkaitan dengan materi ini:\n---\n${konteks_materi}\n---`;
        }

        const model = 'gemini-3.8-flash'; 

        let contents = [];
        if (riwayat && Array.isArray(riwayat)) {
            contents = [...riwayat];
        }
        
        contents.push({ role: 'user', parts: [{ text: pertanyaan }] });

        let response;
        let retries = 3; // Coba ulang maksimal 3 kali

        for (let i = 0; i < retries; i++) {
            try {
                response = await ai.models.generateContent({
                    model: model,
                    contents: contents,
                    config: {
                        systemInstruction: systemPrompt,
                        temperature: 0.7,
                    }
                });
                break; // Kalau berhasil, keluar dari loop
            } catch (err) {
                if (err.status === 503 && i < retries - 1) {
                    console.log(`Server sibuk (503). Mencoba lagi... (${i + 1}/${retries})`);
                    // Tunggu 1 detik sebelum coba lagi
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {
                    throw err; // Lempar error kalau bukan 503 atau jatah retry habis
                }
            }
        }

        res.json({
            success: true,
            data: response.text
        });
    } catch (error) {
        console.error('Error Gemini API:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada AI. Silakan coba lagi.' });
    }
});

module.exports = router;
