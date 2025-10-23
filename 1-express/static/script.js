// Ambil elemen HTML-nya dulu
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Ini 'memori' buat nyimpen history chat
let conversationHistory = [];

// Pas form di-submit (tombol send diklik atau enter)
form.addEventListener('submit', async function (e) {
    // Penting: biar halaman ga reload
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) return; // Kalo kosong, gausah kirim apa-apa

    // 1. Tunjukin pesan user di layar
    appendMessage('user', userMessage);
    // 2. Kosongin inputnya
    input.value = '';

    // 3. Simpen pesan user ke history
    conversationHistory.push({ role: 'user', text: userMessage });
    
    // 4. Kirim history ke backend pake fetch
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Kirim semua history-nya, ini kuncinya
            body: JSON.stringify({ conversation: conversationHistory }),
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        const result = await response.json();
        const botMessage = result.data;

        // 5. Kalo sukses, ambill & tampilin jawaban bot
        appendMessage('bot', botMessage);

        // 6. Simpen jawaban bot ke history juga
        conversationHistory.push({ role: 'model', text: botMessage });

    } catch (error) {
        // Kalo fetch-nya gagal, kasih tau user
        console.error('Error:', error);
        appendMessage('bot', 'Waduh, ada masalah nih. Coba lagi ya.');
    }
});

// Fungsi helper buat nampilin chat ke layar
function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    // Biar auto-scroll ke pesan baru
    chatBox.scrollTop = chatBox.scrollHeight;
}
