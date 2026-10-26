// Day 2: The Touch-Up Trap
// Subject: If your provider charges for touch-ups, read this

interface Day2Props {
    firstName: string
}

export function day2Subject() {
    return 'If your provider charges for touch-ups, read this'
}

export function day2Html({ firstName }: Day2Props): string {
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

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Quick question: does your provider offer free touch-ups?</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">If you don't know, that's worth finding out before your next appointment. Here's why:</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Botox results aren't always perfect on the first visit. Facial muscles are asymmetric. Product can diffuse slightly differently on each side. A touch-up 10-14 days after treatment is normal and expected.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;"><strong>Good providers include complimentary touch-ups within 2 weeks.</strong> They consider it part of the treatment, not an add-on.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Some providers, though, charge $50-$150 for touch-up visits. Over 3-4 sessions per year, that's an extra $200-$600 you didn't budget for.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Before your next appointment, ask this exact question:</p>

  <div style="background-color:#F7F4F0;border-left:3px solid #B5936B;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
    <p style="font-size:16px;line-height:1.6;color:#1A1A1A;margin:0;font-style:italic;">"If I need an adjustment after my treatment, is that included or is there an additional charge?"</p>
  </div>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Their answer tells you two things:</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">1. Whether they'll cost you more than the sticker price<br>2. Whether they stand behind their work</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Both matter.</p>

  <div style="text-align:center;margin:32px 0;">
    <a href="https://www.verifiedaesthetics.com" style="display:inline-block;background-color:#1A1A1A;color:#ffffff;padding:16px 32px;border-radius:50px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Find Transparent Providers →</a>
  </div>

  <p style="font-size:14px;line-height:1.6;color:#666;">Tomorrow: The Allergan rewards program most patients don't know about.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">—VerifiedAesthetics</p>

  <hr style="border:none;border-top:1px solid #ECE8E2;margin:32px 0;">
  <p style="font-size:10px;color:#999;text-align:center;letter-spacing:0.05em;">© 2026 VerifiedAesthetics · Independent clinical data for the regenerative era.<br><a href="https://www.verifiedaesthetics.com/unsubscribe" style="color:#999;">Unsubscribe</a></p>

</div>
</body>
</html>`
}
