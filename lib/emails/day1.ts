// Day 1: The Credential Reality Check
// Subject: Your injector's title matters less than you think

interface Day1Props {
    firstName: string
}

export function day1Subject() {
    return "Your injector's title matters less than you think"
}

export function day1Html({ firstName }: Day1Props): string {
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

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Here's something the aesthetic medicine industry doesn't advertise:</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;"><strong>The letters after your injector's name don't predict your results as much as you'd expect.</strong></p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Board-certified dermatologists and plastic surgeons have the most years of training. That's real. But injection technique is a specific skill — and many nurse practitioners and physician assistants who specialize in aesthetics inject more patients per week than the surgeons in town.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Volume matters. A lot.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Here's what to actually look for:</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">→ <strong>How often they inject.</strong> Someone doing 20+ Botox treatments per week has steadier hands than someone doing 5 per month — regardless of their degree.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">→ <strong>How long they've specialized in aesthetics.</strong> A nurse practitioner with 8 years of aesthetic-only experience often outperforms a dermatologist who added Botox to their practice last year.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">→ <strong>Their complication history.</strong> You can check your state medical board's website for any disciplinary actions. It takes 2 minutes. Do it.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">The bottom line: credentials are one factor, not the only factor. That's why VerifiedAesthetics's TrueScore weights credentials at 25 out of 100 points — important, but not the whole picture.</p>

  <div style="text-align:center;margin:32px 0;">
    <a href="https://injectorindex.com/methodology" style="display:inline-block;background-color:#1A1A1A;color:#ffffff;padding:16px 32px;border-radius:50px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">See How TrueScore Works →</a>
  </div>

  <p style="font-size:14px;line-height:1.6;color:#666;">Tomorrow: The touch-up trap (and how to avoid it).</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">—VerifiedAesthetics</p>

  <hr style="border:none;border-top:1px solid #ECE8E2;margin:32px 0;">
  <p style="font-size:10px;color:#999;text-align:center;letter-spacing:0.05em;">© 2026 VerifiedAesthetics · Independent clinical data for the regenerative era.<br><a href="https://injectorindex.com/unsubscribe" style="color:#999;">Unsubscribe</a></p>

</div>
</body>
</html>`
}
