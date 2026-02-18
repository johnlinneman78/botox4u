# AI Description Generator
> Prompt engineering for generating concise, trustworthy clinic descriptions.

## System Prompt
```text
You are a medical aesthetics copywriter.
Output requirements:
- EXACTLY 2 sentences
- MAX 160 characters total
- Lead with doctor credentials + specialty if found
- End with one differentiator (volume, award, technique)
- Never invent credentials not present in source text
- Tone: Professional, clinical, premium
```

## User Prompt Template
```text
Generate a description for {{PROVIDER_NAME}} using this source text:
"{{SOURCE_TEXT}}"
```

---

## Real World Examples

### Example 1: Dr. Jane Smith (Dermatology)
**Source Text:**
> "Dr. Jane Smith is a Board Certified Dermatologist practicing in the Upper East Side since 2010. She specializes in cosmetic dermatology, including Botox, fillers, and laser treatments. She is known for her 'less is more' approach and has been featured in Vogue and Harper's Bazaar. Dr. Smith graduated from Harvard Medical School and completed her residency at NYU."

**Generated Output:**
> Board-certified dermatologist Dr. Jane Smith specializes in natural cosmetic results on the Upper East Side. She is a Harvard graduate featured in Vogue.

### Example 2: Sarah Jones, RN (Injector)
**Source Text:**
> "Sarah Jones is a Registered Nurse and expert injector with over 10 years of experience. She is an Allergan Black Diamond provider, placing her in the top 1% of injectors nationwide. Sarah is passionate about facial balancing and lip augmentation. She offers a variety of neurotoxins and dermal fillers at her SoHo clinic."

**Generated Output:**
> Registered Nurse Sarah Jones is an expert injector with over a decade of experience in facial balancing. She is a top 1% Allergan Black Diamond provider.

### Example 3: The Men's Lab (Male Aesthetics)
**Source Text:**
> "The Men's Lab is New York's premier med spa dedicated exclusively to men. We offer treatments tailored to male anatomy, including Brotox, jawline contouring, and hair restoration. Our team understands the unique needs of men's skin and aging patterns. Located in Chelsea."

**Generated Output:**
> The Men's Lab is New York's premier med spa dedicated exclusively to male aesthetics and anatomy. They specialize in jawline contouring and hair restoration.

### Example 4: LaserAway (Chain)
**Source Text:**
> "LaserAway is the nation's leader in aesthetic dermatology. We offer laser hair removal, laser tattoo removal, and skin rejuvenation using state-of-the-art technology. Our medical staff is highly trained in the latest laser protocols. We have over 60 locations across the country."

**Generated Output:**
> LaserAway is a national leader in aesthetic dermatology specializing in advanced laser hair and tattoo removal. Their medical staff utilizes state-of-the-art technology.

### Example 5: Holistic Glow (Wellness)
**Source Text:**
> "Holistic Glow combines modern aesthetics with functional medicine. Dr. Emily Green offers PRP facials, microneedling, and nutritional counseling. We believe beauty starts from the inside out. Our approach addresses inflammation and gut health to improve skin radiance."

**Generated Output:**
> Dr. Emily Green combines modern aesthetics with functional medicine to address skin radiance from the inside out. Services include PRP facials and nutritional counseling.
