// Day 0: Immediate — Welcome + PDF Delivery
// Subject: Your 2026 Botox Price Guide is here 📊

interface Day0Props {
    firstName: string
    pdfLink?: string
}

export function day0Subject() {
    return 'Your 2026 Botox Price Guide is here 📊'
}

export function day0Html({ firstName, pdfLink }: Day0Props): string {
    const downloadUrl = pdfLink || 'https://verifiedaesthetics.com/downloads/botox-price-guide-2026.pdf'

    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F7F4F0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;background-color:#ffffff;border-radius:16px;margin-top:20px;margin-bottom:20px;">

  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:#B5936B;margin-right:8px;vertical-align:middle;"></div>
    <span style="font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#B5936B;vertical-align:middle;">VerifiedAesthetics</span>
  </div>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Hi ${firstName},</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Your guide is ready — here's the download link:</p>

  <div style="text-align:center;margin:32px 0;">
    <a href="${downloadUrl}" style="display:inline-block;background-color:#1A1A1A;color:#ffffff;padding:16px 32px;border-radius:50px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Download: 2026 Price Guide →</a>
  </div>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">This guide covers verified pricing across 22 cities, what drives the cost difference between providers, and the 7 questions that save you hundreds per session.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">But there's one thing the guide doesn't cover that I want to share right now:</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;"><strong style="color:#1A1A1A;">The most important number isn't the per-unit price. It's the total units.</strong></p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">A provider charging $14/unit who uses 25 units costs you $350. A provider charging $11/unit who uses 35 units costs you $385 — and they looked cheaper on paper.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Always ask: "How many units do you typically use for this area?" before comparing prices.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Over the next 5 days, I'll send you one short email each morning with an insider tip that most patients don't learn until they've already spent thousands. Each one takes about 90 seconds to read.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Talk tomorrow,<br>VerifiedAesthetics</p>

  <p style="font-size:14px;line-height:1.6;color:#666;">P.S. — If you want to skip ahead and start comparing scored providers in your city, you can search now: <a href="https://verifiedaesthetics.com" style="color:#B5936B;text-decoration:underline;">VerifiedAesthetics.com →</a></p>

  <hr style="border:none;border-top:1px solid #ECE8E2;margin:32px 0;">
  <p style="font-size:10px;color:#999;text-align:center;letter-spacing:0.05em;">© 2026 VerifiedAesthetics · Independent clinical data for the regenerative era.<br><a href="https://verifiedaesthetics.com/unsubscribe" style="color:#999;">Unsubscribe</a></p>

</div>
</body>
</html>`
}
