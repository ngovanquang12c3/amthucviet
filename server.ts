import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with named parameters & headers for telemetry
let ai: any = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("GoogleGenAI initialized successfully with API key.");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY found, running chatbot in high-quality fallback responder mode.");
}

const SYSTEM_INSTRUCTION = `You are a helpful, extremely polite, and friendly AI Assistant for "Viet Bistro PH", an authentic Vietnamese restaurant located in Bonifacio Global City (BGC), Taguig City, Metro Manila, Philippines.
Our address is: Unit G-12, Ground Floor, Bonifacio High Street, 30th St, BGC, Taguig City, Metro Manila.
Our opening Hours are: Monday to Friday from 10:00 AM to 10:00 PM, and weekends (Saturday and Sunday) from 09:00 AM to 11:00 PM.
We accept Credit Cards, GCash, and Direct Bank Transfers. GCash Number: 0917-123-4567. Bank details: BDO Account # 0012-3456-7890 (Viet Bistro PH Corp).
We deliver to major parts of Metro Manila with these estimated times and fees:
- Bonifacio Global City (BGC) / Taguig: ₱50 delivery fee | Delivery time: 15-20 mins
- Makati District: ₱80 delivery fee | Delivery time: 20-30 mins
- Pasay & Manila City: ₱120 delivery fee | Delivery time: 30-40 mins
- Quezon City: ₱180 delivery fee | Delivery time: 45-60 mins

Recommend delicious dishes from our menu:
1. Premium Beef Pho (₱380, slow-cooked beef marrow bone broth for 24 hours, traditional recipe, gluten-free)
2. Classic Chicken Pho (₱340, chicken broth with ginger and star anise, gluten-free)
3. Special Pork Banh Mi (₱195, crispy baguette, house-made pate, pork, cilantro, pickles, slightly spicy)
4. Lemongrass Chicken Banh Mi (₱180, lemongrass marinated chicken in crisp baguette, slightly spicy)
5. Hanoi Bun Cha (₱390, charcoal grilled pork, vermicelli, fresh greens, sweet dipping fish sauce - highly recommended)
6. Fresh Shrimp Spring Rolls (Goi Cuon, ₱180, prawns, pork, peanut sauce, gluten-free)
7. Imperial Fried Crispy Rolls (Cha Gio, ₱190, minced pork, crab meat, wood ear mushrooms)
8. Vietnamese Iced Coffee (Ca Phe Sua Da, ₱160, premium Robusta slow-dripped drip coffee with sweet condensed milk)
9. Hanoi Egg Coffee (Ca Phe Trung, ₱180, whipped pasteurized egg yolks floated on hot rich espresso)
10. Lotus Seed & Longan Sweet Soup (Che Hat Sen, ₱150, cooling dessert)

Always reply in the customer's language. If they ask in Vietnamese, reply in Vietnamese. If they ask in English, reply in English. If they ask in Tagalog (or Taglish), reply in Tagalog/Taglish. Keep responses concise, friendly, helpful, and polite. Feel free to use appropriate food emojis!`;

// A rules-based high-quality fallback responder when Gemini is not connected or fails
function generateFallbackResponse(message: string): string {
  const msg = message.toLowerCase();
  
  // Vietnamese Detection
  const isVietnamese = /xin chào|bạn|phở|bánh mì|địa chỉ|ở đâu|giá|ngon|giờ|mở cửa|giao hàng|ship|vận chuyển|thanh toán/.test(msg);
  // Tagalog Detection
  const isTagalog = /kamusta|saan|magkano|masarap|oras|bukas|deliber|bayad|pagkain|vietnam/.test(msg);

  if (isVietnamese) {
    if (msg.includes("phở")) {
      return "Dạ! Viet Bistro có Phở Bò Đặc Biệt (380 ₱) ninh xương 24 giờ thơm lừng thảo mộc, và Phở Gà Ta (340 ₱) thanh ngọt lá chanh thơm mát. Cả hai đều rất được yêu thích đó ạ! Bạn có muốn đặt thử ngay không? 🍜";
    }
    if (msg.includes("bánh mì")) {
      return "Dạ, Bánh Mì bên mình có vỏ giòn rụm kẹp nhân đậm đà ngon tuyệt! Nổi bật nhất là Bánh Mì Thịt Đặc Biệt (195 ₱) kẹp pate gan béo ngậy nhà làm và gà xá xíu, hoặc Bánh Mì Gà Nướng Sả (180 ₱) thơm phức sả tỏi mật ong. 🥖";
    }
    if (msg.includes("cà phê") || msg.includes("uống")) {
      return "Chào bạn, quán có Cà Phê Sữa Đá Sài Gòn truyền thống (160 ₱) thơm nồng từ hạt Robusta hảo hạng và Cà Phê Trứng Hà Nội béo ngậy (180 ₱) ngập tràn bọt trứng mịn màng. Cực kỳ ngon và tỉnh táo ạ! ☕️";
    }
    if (msg.includes("bún chả")) {
      return "Món Bún Chả Hà Nội (390 ₱) là đặc sản trứ danh của quán! Thịt ba chỉ và chả băm nướng than hoa thơm lừng, ăn kèm nước chấm chua ngọt có đu đủ xanh, bún tươi và rau sống thanh mát. Rất khuyên bạn nên thử ạ! 🥗";
    }
    if (msg.includes("địa chỉ") || msg.includes("ở đâu") || msg.includes("đến")) {
      return "Nhà hàng nằm tại: Cửa hàng G-12, Bonifacio High Street, Đường 30, BGC, Taguig City, Metro Manila. Rất hân hạnh được đón tiếp bạn ghé thăm quán! 📍";
    }
    if (msg.includes("giờ") || msg.includes("mở")) {
      return "Dạ, Viet Bistro mở cửa từ 10:00 sáng đến 10:00 tối từ Thứ Hai đến Thứ Sáu. Riêng Thứ Bảy và Chủ Nhật quán mở sớm từ 09:00 sáng đến 11:00 tối để phục vụ bạn ạ! ⏰";
    }
    if (msg.includes("ship") || msg.includes("giao") || msg.includes("vận chuyển") || msg.includes("phí")) {
      return "Chúng mình giao hàng khắp Metro Manila ạ! Phí giao hàng cụ thể:\n- BGC / Taguig: 50 ₱ (15-20 phút)\n- Makati: 80 ₱ (20-30 phút)\n- Pasay / Manila: 120 ₱ (30-40 phút)\n- Quezon City: 180 ₱ (45-60 phút)\nBạn chỉ cần đặt trực tuyến ngay trên website này nhé! 🛵";
    }
    if (msg.includes("thanh toán") || msg.includes("ví") || msg.includes("bank") || msg.includes("gcash")) {
      return "Dạ, bên mình hỗ trợ thanh toán trực tuyến tiện lợi qua Thẻ tín dụng, ví điện tử GCash (Số GCash: 0917-123-4567) hoặc Chuyển khoản ngân hàng BDO (Số tài khoản: 0012-3456-7890, tên Viet Bistro PH Corp). Rất an toàn và nhanh chóng! 💳";
    }
    return "Xin chào! Cảm ơn bạn đã liên hệ Viet Bistro PH. Mình là trợ lý ảo hỗ trợ 24/7. Mình có thể giúp gì cho bạn về thực đơn Phở bò, Bánh mì, đặt hàng trực tuyến hay thời gian hoạt động của quán không ạ? 😊";
  }

  if (isTagalog) {
    if (msg.includes("pho") || msg.includes("sabon")) {
      return "Kamusta! Mayroon kaming Premium Beef Pho (₱380) na may slow-cooked beef broth sa loob ng 24 oras, at Classic Chicken Pho (₱340) na may native na manok at luya. Subukan mo na, napakasariwa at masarap! 🍜";
    }
    if (msg.includes("banh mi") || msg.includes("tinapay")) {
      return "Aba, subukan ang aming crispy Baguette! Espesyal ang Special Pork Banh Mi (₱195) na may homemade pork liver pate at roast pork belly, o Lemongrass Chicken Banh Mi (₱180) na may inihaw na manok sa tanglad. 🥖";
    }
    if (msg.includes("kape") || msg.includes("inumin")) {
      return "Para sa pampagising, mayroon kaming Vietnamese Iced Coffee / Ca Phe Sua Da (₱160) na may condensed milk at yelo, at ang sikat na Hanoi Egg Coffee (₱180) na may whipped egg yolk cream. Swak na swak! ☕️";
    }
    if (msg.includes("saan") || msg.includes("address") || msg.includes("lokasyon")) {
      return "Matatagpuan kami sa: Unit G-12, Ground Floor, Bonifacio High Street, 30th St, BGC, Taguig City, Metro Manila. Bisitahin kami rito! 📍";
    }
    if (msg.includes("oras") || msg.includes("bukas")) {
      return "Bukas kami mula Lunes hanggang Biyernes, 10:00 AM - 10:00 PM. Tuwing Sabado at Linggo naman ay bukas kami mula 09:00 AM hanggang 11:00 PM. ⏰";
    }
    if (msg.includes("deliber") || msg.includes("delivery") || msg.includes("magkano") || msg.includes("fee")) {
      return "Nagde-deliver kami sa iba't ibang parte ng Metro Manila! Narito ang rates:\n- BGC & Taguig: ₱50 (15-20 mins)\n- Makati: ₱80 (20-30 mins)\n- Pasay at Manila: ₱120 (30-40 mins)\n- Quezon City: ₱180 (45-60 mins)\nMag-order na dito sa website para ma-enjoy ang paborito mong pagkain! 🛵";
    }
    if (msg.includes("bayad") || msg.includes("payment") || msg.includes("gcash") || msg.includes("bangko")) {
      return "Tumatanggap kami ng ligtas at madaling online payment sa pamamagitan ng Credit Card, GCash (GCash Number: 0917-123-4567), o Bank Transfer sa BDO (Account: 0012-3456-7890, Viet Bistro PH Corp). napakadali! 💳";
    }
    return "Mabuhay! Welcome sa Viet Bistro PH Online Support. Paano kita matutulungan ngayon tungkol sa aming mga pagkaing Vietnamese tulad ng Pho, Banh Mi, aming lokasyon sa BGC, o delivery estimates? Tanong lang po kayo! 😊";
  }

  // English Default
  if (msg.includes("pho") || msg.includes("noodle")) {
    return "We serve authentic Premium Beef Pho (₱380) with 24-hour slow-cooked aromatic bone broth, and Classic Chicken Pho (₱340) with shredded chicken. Both are healthy, aromatic, and gluten-free! 🍜";
  }
  if (msg.includes("banh mi") || msg.includes("baguette") || msg.includes("sandwich")) {
    return "Our fresh baguettes are crispy on the outside and soft inside! Try our best-selling Special Pork Banh Mi (₱195) with rich liver pate and roast belly pork, or Lemongrass Chicken Banh Mi (₱180) marinated in lemongrass and garlic. 🥖";
  }
  if (msg.includes("coffee") || msg.includes("drink")) {
    return "Don't miss our legendary Vietnamese Iced Coffee (Ca Phe Sua Da, ₱160) made with premium Robusta drip and sweet condensed milk, or our exquisite Hanoi Egg Coffee (₱180) topped with creamy pasteurized sweet egg foam. ☕️";
  }
  if (msg.includes("bun cha")) {
    return "Hanoi Bun Cha (₱390) is a must-try! It features charcoal-grilled pork patties and belly slices in warm sweet-savory dipping sauce, served with cold dry vermicelli noodles and fresh herbs. 🥗";
  }
  if (msg.includes("address") || msg.includes("where") || msg.includes("location") || msg.includes("find")) {
    return "We are located at: Unit G-12, Ground Floor, Bonifacio High Street, 30th St, BGC, Taguig City, Metro Manila. We hope to see you soon! 📍";
  }
  if (msg.includes("hours") || msg.includes("open") || msg.includes("time")) {
    return "We are open Monday to Friday from 10:00 AM to 10:00 PM, and Saturday to Sunday from 09:00 AM to 11:00 PM. ⏰";
  }
  if (msg.includes("deliver") || msg.includes("ship") || msg.includes("fee") || msg.includes("delivery")) {
    return "We deliver to key districts in Metro Manila:\n- BGC / Taguig: ₱50 fee (15-20 mins)\n- Makati: ₱80 fee (20-30 mins)\n- Pasay & Manila: ₱120 fee (30-40 mins)\n- Quezon City: ₱180 fee (45-60 mins)\nYou can customize your cart and order directly through this website! 🛵";
  }
  if (msg.includes("pay") || msg.includes("payment") || msg.includes("gcash") || msg.includes("bank")) {
    return "We support secure, convenient online checkout via Credit Cards, GCash (0917-123-4567), and Direct Bank Transfer via BDO (Account: 0012-3456-7890 under Viet Bistro PH Corp). 💳";
  }
  return "Hello! Welcome to Viet Bistro PH. I am your 24/7 culinary assistant. Ask me anything about our Vietnamese menu, ingredients, location in BGC Manila, or delivery rates and times! I can also help you choose the best dishes. 🌟";
}

// REST API for Live Chat
app.post("/api/chat", async (req: express.Request, res: express.Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (ai) {
      try {
        // Format history according to @google/genai chats specifications
        // We match history items: { sender: 'user'|'assistant', text: string }
        const formattedHistory = (history || []).map((h: any) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        }));

        const chat = ai.chats.create({
          model: "gemini-3.5-flash",
          history: formattedHistory,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION
          }
        });

        const response = await chat.sendMessage({ message });
        const text = response.text || "I apologize, I am processing your inquiry.";
        return res.json({ text });
      } catch (err) {
        console.error("Gemini API call failed, using high-quality local chatbot fallback:", err);
        const text = generateFallbackResponse(message);
        return res.json({ text: text + " (Fallback Active)" });
      }
    } else {
      // Local fallback responder
      const text = generateFallbackResponse(message);
      return res.json({ text });
    }
  } catch (error) {
    console.error("Internal Server Error in /api/chat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Setup Vite Dev Server / Static Hosting
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite Dev Server middleware integrated in Express.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`Serving static files from ${distPath} for production.`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Viet Bistro PH server started on http://localhost:${PORT}`);
  });
}

startServer();
