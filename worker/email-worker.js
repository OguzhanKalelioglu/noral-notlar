
import { EmailMessage } from "cloudflare:email";
import PostalMime from "postal-mime";

export default {
  async email(message, env, ctx) {
    const allowList = ["codeman@kalelioglu.com.tr"];
    if (!allowList.includes(message.to)) return;

    // Telegram & Resend Ayarları
    const telegramToken = "8534538906:AAE_KABRfveKyEKIBVx0UajZoUftwAmeRk0";
    const chatId = "6267596272";
    const resendApiKey = "re_dXoEatA6_A8X7uBwgBWY4u7tujW9duGdr";

    try {
        // 1. Maili Oku
        const rawEmail = await new Response(message.raw).arrayBuffer();
        const parser = new PostalMime();
        const email = await parser.parse(rawEmail);
        
        const subject = email.subject || "(Konu yok)";
        const fromName = email.from.name || "";
        const fromAddr = email.from.address || "Bilinmiyor";
        const fromDisplay = fromName ? `${fromName} <${fromAddr}>` : fromAddr;
        
        let textBody = email.text || "";
        if (!textBody && email.html) textBody = "(Sadece HTML)";
        
        // Mail içeriğini kısalt (Prompt limitleri için)
        const contentForAI = textBody.substring(0, 1500);

        // 2. AI ile Cevap Oluştur (Otonom Mod)
        let aiReply = "";
        let aiStatus = "AI Devrede";
        
        try {
            const systemPrompt = `Sen CodeMAN, Oğuzhan Kalelioğlu'nun yapay zeka asistanısın.
            
            GÖREVİN:
            Sana gelen e-postaya Oğuzhan adına, samimi ama profesyonel bir cevap yaz.
            
            KURALLAR:
            1. Asla Oğuzhan'ın kişisel bilgilerini, telefonunu, adresini verme.
            2. Eğer proje/iş teklifi ise "Mesajınızı Oğuzhan'a ilettim, size dönüş yapacaktır" de.
            3. Eğer spam veya tehlikeli ise cevap yazma (boş döndür).
            4. Cevabın Türkçe olsun (Mail İngilizceyse İngilizce cevap ver).
            5. İmza olarak sadece: "CodeMAN (AI Assistant)" kullan.
            6. Kısa ve öz ol.
            
            GELEN MAİL:
            Kimden: ${fromName}
            Konu: ${subject}
            İçerik: ${contentForAI}`;

            const response = await env.AI.run("@cf/openai/gpt-oss-20b", {
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: "Lütfen cevabı oluştur." }
                ]
            });
            
            aiReply = response.response;

        } catch (aiError) {
            aiStatus = "AI Hatası: " + aiError.message;
            aiReply = "Mesajınızı aldım ve Oğuzhan'a ilettim. \n\nCodeMAN (System Auto-Reply)";
        }

        // 3. Cevabı Gönder (Resend)
        if (aiReply && aiReply.length > 5) {
             const resendResp = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${resendApiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    from: "CodeMAN <codeman@kalelioglu.com.tr>",
                    to: [fromAddr],
                    subject: `Re: ${subject}`,
                    text: aiReply,
                    // Reply-To header'ı ekleyelim ki cevap yine sana dönsün
                    reply_to: "codeman@kalelioglu.com.tr" 
                })
             });
             
             if (!resendResp.ok) {
                 aiStatus += " | Gönderim Başarısız: " + resendResp.status;
             } else {
                 aiStatus += " | Cevap Gönderildi ✅";
             }
        } else {
            aiStatus += " | AI Cevap Vermedi (Pass)";
        }

        // 4. Telegram Raporu
        const reportText = `🤖 *Otonom Mail İşlemi*

📧 *Gelen Mail:*
👤 \`${fromDisplay}\`
🏷 *Konu:* ${subject}
📝 *İçerik:* ${textBody.substring(0, 500)}${textBody.length > 500 ? "..." : ""}

📤 *CodeMAN Cevabı:*
\`${aiReply}\`

📊 *Durum:* ${aiStatus}`;

        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: reportText,
            // Parse mode yok, düz metin daha güvenli
          })
        });

    } catch (e) {
        // Genel Hata Bildirimi
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `⚠️ Kritik Hata: ${e.message}`
          })
        });
    }
  }
};
