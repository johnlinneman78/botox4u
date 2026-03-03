// Day 5: What Matters More Than Price
// Subject: The one thing that matters more than everything else

interface Day5Props {
    firstName: string
}

export function day5Subject() {
    return 'The one thing that matters more than everything else'
}

export function day5Html({ firstName }: Day5Props): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F7F4F0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;background-color:#ffffff;border-radius:16px;margin-top:20px;margin-bottom:20px;">

  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:#B5936B;margin-right:8px;vertical-align:middle;"></div>
    <span style="font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#B5936B;vertical-align:middle;">InjectorIndex</span>
  </div>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Hi ${firstName},</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">This is the last email in this series, and I want to leave you with the most important thing we've learned from analyzing 500+ aesthetic medicine providers.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;"><strong>The #1 predictor of patient satisfaction isn't price, credentials, or office decor.</strong></p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">It's communication.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">The providers with the highest TrueScore ratings on InjectorIndex share one thing: patients consistently describe feeling <em>heard</em> during consultations. They say things like:</p>

  <div style="background-color:#F7F4F0;padding:20px 24px;border-radius:12px;margin:24px 0;">
    <p style="font-size:15px;line-height:1.8;color:#444;margin:0;">
      • "She actually listened to what I wanted"<br>
      • "He explained why he recommended fewer units than I asked for"<br>
      • "They showed me what to expect and didn't oversell"
    </p>
  </div>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">When we run our semantic analysis on patient reviews across all 22 cities, the language patterns that correlate most strongly with high satisfaction aren't about price or results — they're about the quality of the conversation before the injection.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;"><strong>What this means for you:</strong></p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Your first consultation is an audition — for the provider, not for you. Pay attention to:</p>

  <p style="font-size:16px;line-height:1.8;color:#1A1A1A;">
    → Do they ask about your goals, or just your treatment area?<br>
    → Do they explain what they recommend and why?<br>
    → Do they mention what they <em>wouldn't</em> do (yet)?<br>
    → Do they rush you, or give you space to ask questions?
  </p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">A provider who communicates well will almost certainly deliver better results — because they understood what you actually wanted.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">That's what InjectorIndex was built to surface. Not who has the best ads or the most Instagram followers, but who consistently makes patients feel informed, respected, and satisfied with their results.</p>

  <div style="text-align:center;margin:32px 0;">
    <a href="https://injectorindex.com" style="display:inline-block;background-color:#B5936B;color:#ffffff;padding:16px 32px;border-radius:50px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Find Top-Rated Providers →</a>
  </div>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Thanks for reading this series. If you found it helpful, forward it to a friend who's considering Botox — they'll thank you.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">—InjectorIndex</p>

  <p style="font-size:14px;line-height:1.6;color:#666;">P.S. — Want a personalized analysis of providers in your specific area? Reply to this email with your city and I'll send you a custom comparison.</p>

  <hr style="border:none;border-top:1px solid #ECE8E2;margin:32px 0;">
  <p style="font-size:10px;color:#999;text-align:center;letter-spacing:0.05em;">© 2026 InjectorIndex · Independent clinical data for the regenerative era.<br><a href="https://injectorindex.com/unsubscribe" style="color:#999;">Unsubscribe</a></p>

</div>
</body>
</html>`
}
