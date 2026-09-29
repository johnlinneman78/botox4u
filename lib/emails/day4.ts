// Day 4: The Alternatives Your Provider Might Not Mention
// Subject: Botox isn't the only option (and might not be the best one for you)

interface Day4Props {
    firstName: string
}

export function day4Subject() {
    return "Botox isn't the only option (and might not be the best one for you)"
}

export function day4Html({ firstName }: Day4Props): string {
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

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">"Botox" has become a generic term, like "Band-Aid" or "Kleenex." But Botox is actually one of four FDA-approved neurotoxin brands — and each has differences worth knowing about.</p>

  <div style="background-color:#F7F4F0;padding:20px 24px;border-radius:12px;margin:20px 0;">
    <p style="font-size:16px;line-height:1.6;color:#1A1A1A;margin:0;"><strong>Botox (Allergan)</strong> — The original. Most widely available. 3-4 month duration for most patients. Premium pricing.</p>
  </div>

  <div style="background-color:#F7F4F0;padding:20px 24px;border-radius:12px;margin:20px 0;">
    <p style="font-size:16px;line-height:1.6;color:#1A1A1A;margin:0;"><strong>Dysport (Galderma)</strong> — Spreads more than Botox, which can be an advantage for large areas like the forehead. Some patients report faster onset (2-3 days vs. Botox's 5-7). Often 10-15% cheaper per treatment.</p>
  </div>

  <div style="background-color:#F7F4F0;padding:20px 24px;border-radius:12px;margin:20px 0;">
    <p style="font-size:16px;line-height:1.6;color:#1A1A1A;margin:0;"><strong>Xeomin (Merz)</strong> — "Naked" neurotoxin with no accessory proteins. Less likely to cause resistance over time with repeated use. Similar duration to Botox. Often the most affordable option.</p>
  </div>

  <div style="background-color:#F7F4F0;padding:20px 24px;border-radius:12px;margin:20px 0;">
    <p style="font-size:16px;line-height:1.6;color:#1A1A1A;margin:0;"><strong>Daxxify (Revance)</strong> — The newest option. Key differentiator: lasts 6-9 months for some patients vs. 3-4 months for the others. Higher per-session cost, but potentially fewer sessions per year — which can make it cheaper annually.</p>
  </div>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">Here's the thing: many providers only carry one or two brands. If yours only offers Botox, they might not mention that Dysport or Daxxify could be a better fit for you.</p>

  <div style="background-color:#1A1A1A;border-left:3px solid #B5936B;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
    <p style="font-size:15px;line-height:1.6;color:#ffffff;margin:0;"><strong style="color:#B5936B;">The question to ask:</strong> "Do you offer alternatives to Botox? If so, which would you recommend for my goals and anatomy?"</p>
  </div>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">A provider who takes time to explain your options — not just default to one brand — is one who's treating you as a patient, not a revenue line.</p>

  <div style="text-align:center;margin:32px 0;">
    <a href="https://injectorindex.com" style="display:inline-block;background-color:#1A1A1A;color:#ffffff;padding:16px 32px;border-radius:50px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Find Multi-Toxin Providers →</a>
  </div>

  <p style="font-size:14px;line-height:1.6;color:#666;">Tomorrow (final email): The one thing that matters more than price.</p>

  <p style="font-size:16px;line-height:1.6;color:#1A1A1A;">—VerifiedAesthetics</p>

  <hr style="border:none;border-top:1px solid #ECE8E2;margin:32px 0;">
  <p style="font-size:10px;color:#999;text-align:center;letter-spacing:0.05em;">© 2026 VerifiedAesthetics · Independent clinical data for the regenerative era.<br><a href="https://injectorindex.com/unsubscribe" style="color:#999;">Unsubscribe</a></p>

</div>
</body>
</html>`
}
