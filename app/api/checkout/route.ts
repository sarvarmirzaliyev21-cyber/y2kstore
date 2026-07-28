import { NextResponse } from "next/server";

// Вставьте сюда ваш токен и ваш личный Chat ID
const TELEGRAM_BOT_TOKEN = "8888538637:AAGu1hLNqbGMDXxeHQOMuiL79QhbPQlLsZA";
// ВНИМАНИЕ: Укажите ваш личный ID из @userinfobot (НЕ ID бота!)
const TELEGRAM_CHAT_ID = "6613038560"; 

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const district = formData.get("district") as string;
    const street = formData.get("street") as string;
    const house = formData.get("house") as string;
    const apartment = formData.get("apartment") as string;
    const landmark = formData.get("landmark") as string;
    const productName = formData.get("productName") as string;
    const price = formData.get("price") as string;
    const size = formData.get("size") as string; // 👈 Добавили считывание размера
    const receiptFile = formData.get("receipt") as File;

    const caption = `
🛒 **НОВЫЙ ЗАКАЗ**

📦 **Товар:** ${productName}
📏 **Размер:** ${size || "Не указан"}
💰 **Сумма:** ${price}

👤 **Покупатель:** ${fullName}
📞 **Телефон:** ${phone}
✉️ **Email:** ${email}

📍 **Адрес:** г. Ташкент, ${district} р-н, ${street}, д. ${house}${apartment ? `, кв. ${apartment}` : ""}
🧭 **Ориентир:** ${landmark || "Не указан"}
    `;

    // Если прикреплен файл (фото чека), отправляем через sendPhoto
    if (receiptFile && receiptFile.size > 0) {
      const tgFormData = new FormData();
      tgFormData.append("chat_id", TELEGRAM_CHAT_ID);
      tgFormData.append("caption", caption);
      tgFormData.append("parse_mode", "Markdown");
      tgFormData.append("photo", receiptFile);

      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: tgFormData,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Ошибка Telegram API:", err);
        return NextResponse.json({ error: "Ошибка при отправке в Telegram" }, { status: 500 });
      }
    } else {
      // Если без фото (просто текст)
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: caption,
          parse_mode: "Markdown",
        }),
      });

      if (!res.ok) {
        return NextResponse.json({ error: "Ошибка при отправке в Telegram" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}