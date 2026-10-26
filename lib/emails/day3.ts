// Day 3: The Loyalty Stack
// Subject: You're probably leaving $150/year on the table

interface Day3Props {
    firstName: string
}

export function day3Subject() {
    return "You're probably leaving $150/year on the table"
}

export function day3Html({ firstName }: Day3Props): string {
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

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">If you get Botox regularly and aren't enrolled in these two programs, you're overpaying:</p>

  <div style="background-color:#F7F4F0;padding:20px 24px;border-radius:12px;margin:24px 0;">
    <p style="font-size:16px;line-height:1.6;color:#1A1A1A;margin-top:0;"><strong>1. Allē (by Allergan)</strong></p>
    <p style="font-size:15px;line-height:1.6;color:#444;margin-bottom:0;">This is the manufacturer's rewards program. You earn points on every Allergan treatment (Botox, Juvederm, etc.) at any participating provider. Points convert to savings on future treatments — typically $50-$75 in value per visit. Most providers participate, but not all. Ask before you book.</p>
  </div>

  <div style="background-color:#F7F4F0;padding:20px 24px;border-radius:12px;margin:24px 0;">
    <p style="font-size:16px;line-height:1.6;color:#1A1A1A;margin-top:0;"><strong>2. Your provider's own loyalty program</strong></p>
    <p style="font-size:15px;line-height:1.6;color:#444;margin-bottom:0;">Many med spas run their own points or membership programs on top of Allē. These stack — meaning you can earn rewards from both programs on the same treatment.</p>
  </div>

  <div style="background-color:#1A1A1A;padding:24px;border-radius:12px;margin:24px 0;text-align:center;">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#B5936B;margin-top:0;">The Math</p>
    <p style="font-size:15px;color:#CCC;margin:8px 0;">Allē savings: ~$60/visit × 3 visits = <strong style="color:#fff;">$180/year</strong></p>
    <p style="font-size:15px;color:#CCC;margin:8px 0;">Provider loyalty: often another <strong style="color:#fff;">$50-$100/year</strong></p>
    <p style="font-size:18px;color:#B5936B;font-weight:700;margin:16px 0 0;">Total: $230-$280/year saved</p>
  </div>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;"><strong>One more thing:</strong> Some providers offer "Botox days" or seasonal promotions where pricing drops 10-20% for a limited time. Ask if they run these, and when the next one is. Planning your treatments around promotions is the easiest money you'll save.</p>

  <div style="text-align:center;margin:32px 0;">
    <a href="https://www.verifiedaesthetics.com" style="display:inline-block;background-color:#1A1A1A;color:#ffffff;padding:16px 32px;border-radius:50px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Compare Pricing & Programs →</a>
  </div>

  <p style="font-size:14px;line-height:1.6;color:#666;">Tomorrow: Alternatives to Botox (and why your provider might not mention them).</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">—VerifiedAesthetics</p>

  <hr style="border:none;border-top:1px solid #ECE8E2;margin:32px 0;">
  <p style="font-size:10px;color:#999;text-align:center;letter-spacing:0.05em;">© 2026 VerifiedAesthetics · Independent clinical data for the regenerative era.<br><a href="https://www.verifiedaesthetics.com/unsubscribe" style="color:#999;">Unsubscribe</a></p>

</div>
</body>
</html>`
}
