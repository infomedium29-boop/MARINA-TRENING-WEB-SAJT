const RECIPIENT = "marinamagas45@gmail.com";
const SENDER = "upiti@mojetijelo-mojsaveznik.com";
const ALLOWED_ORIGINS = new Set([
  "https://mojetijelo-mojsaveznik.com",
  "https://www.mojetijelo-mojsaveznik.com",
]);

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });

const clean = (value, max = 3000) =>
  String(value ?? "")
    .replace(/\0/g, "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, max);

const oneLine = (value, max = 160) => clean(value, max).replace(/\s+/g, " ");

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const validEmail = (email) =>
  email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function onRequestPost({ request, env }) {
  try {
    const origin = request.headers.get("origin");
    if (origin && !ALLOWED_ORIGINS.has(origin) && !origin.endsWith(".pages.dev")) {
      return json({ success: false, error: "Invalid origin." }, 403);
    }

    const form = await request.formData();
    if (clean(form.get("website"), 200)) {
      return json({ success: true });
    }

    const startedAt = Number(form.get("form_started"));
    const elapsed = Date.now() - startedAt;
    if (!Number.isFinite(startedAt) || elapsed < 1200 || elapsed > 86_400_000) {
      return json({ success: false, error: "Invalid form timing." }, 400);
    }

    const data = {
      language: oneLine(form.get("language"), 5) === "en" ? "en" : "hr",
      name: oneLine(form.get("name"), 120),
      email: oneLine(form.get("email"), 254).toLowerCase(),
      phone: oneLine(form.get("phone"), 40),
      service: oneLine(form.get("service"), 120),
      experience: oneLine(form.get("experience"), 120),
      format: oneLine(form.get("format"), 120),
      goal: clean(form.get("goal"), 3000),
      message: clean(form.get("message"), 3000),
      sourceUrl: clean(form.get("source_url"), 500),
      consent: oneLine(form.get("consent"), 10),
    };

    if (
      data.name.length < 2 ||
      !validEmail(data.email) ||
      !data.service ||
      data.goal.length < 10 ||
      data.consent !== "yes"
    ) {
      return json({ success: false, error: "Missing or invalid fields." }, 400);
    }

    const subject = `Novi upit sa sajta — ${data.name}`;
    const rows = [
      ["Ime i prezime", data.name],
      ["E-mail", data.email],
      ["Telefon", data.phone || "Nije navedeno"],
      ["Usluga", data.service],
      ["Iskustvo", data.experience || "Nije navedeno"],
      ["Način suradnje", data.format || "Nije navedeno"],
      ["Glavni cilj", data.goal],
      ["Dodatna poruka", data.message || "Nije navedeno"],
      ["Jezik forme", data.language.toUpperCase()],
      ["Stranica", data.sourceUrl || "Nije navedeno"],
    ];

    const htmlRows = rows
      .map(
        ([label, value]) => `
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #e7e2d8;font-weight:700;vertical-align:top;width:170px;color:#173229;">${escapeHtml(label)}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e7e2d8;white-space:pre-wrap;color:#303733;">${escapeHtml(value)}</td>
          </tr>`,
      )
      .join("");

    const text = [
      "Novi upit s web stranice Moje tijelo-moj saveznik",
      "",
      ...rows.map(([label, value]) => `${label}: ${value}`),
      "",
      `Vrijeme slanja: ${new Date().toISOString()}`,
    ].join("\n");

    await env.CONTACT_EMAIL.send({
      to: RECIPIENT,
      from: { email: SENDER, name: "Moje tijelo-moj saveznik" },
      replyTo: { email: data.email, name: data.name },
      subject,
      text,
      html: `<!doctype html>
        <html lang="hr"><body style="margin:0;padding:24px;background:#f4f0e7;font-family:Arial,sans-serif;">
          <div style="max-width:720px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e7e2d8;">
            <div style="padding:24px 28px;background:#10231d;color:#ffffff;">
              <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#d99473;">Moje tijelo-moj saveznik</div>
              <h1 style="margin:10px 0 0;font-size:24px;">Novi upit s web stranice</h1>
            </div>
            <table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.55;">${htmlRows}</table>
            <div style="padding:20px 28px;color:#626963;font-size:13px;">Za odgovor klijentu kliknite “Odgovori” u svom e-mail programu.</div>
          </div>
        </body></html>`,
    });

    return json({ success: true });
  } catch (error) {
    console.error("Contact email error", error);
    return json({ success: false, error: "Email could not be sent." }, 500);
  }
}

