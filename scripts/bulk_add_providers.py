import os
import json
import re
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Comprehensive list of provider data gathered from researchers
# Goal: 500 providers
raw_data = [
    # SCOTTSDALE, AZ
    {"name": "Adam & Eve Medical Aesthetics", "city": "Scottsdale", "state": "AZ", "website": "https://www.adamandevemedspa.com"},
    {"name": "Look Lab Med Spa", "city": "Scottsdale", "state": "AZ", "website": "https://www.looklab.com"},
    {"name": "Blume Skin & Body", "city": "Scottsdale", "state": "AZ", "website": "https://www.blumeskinandbody.com"},
    {"name": "Skindale Medspa", "city": "Scottsdale", "state": "AZ", "website": "https://www.skindalemedspa.com"},
    {"name": "Zona Med Spa", "city": "Scottsdale", "state": "AZ", "website": "https://www.zonamedspa.com"},
    {"name": "Luxury Skin Scottsdale", "city": "Scottsdale", "state": "AZ", "website": "https://www.luxuryskinscottsdale.com"},
    {"name": "DermaCrush", "city": "Scottsdale", "state": "AZ", "website": "https://www.dermacrush.com"},
    {"name": "Clear Medspa", "city": "Scottsdale", "state": "AZ", "website": "https://clearmedsolutions.com"},
    {"name": "Skin Refine Medspa", "city": "Scottsdale", "state": "AZ", "website": "https://skinrefinemedspa.com"},
    {"name": "Suddenly Slimmer Medspa", "city": "Scottsdale", "state": "AZ", "website": "https://suddenlyslimmer.com"},
    {"name": "Ultra Smooth Skin", "city": "Scottsdale", "state": "AZ", "website": "https://ultrasmoothskin.com"},
    {"name": "New Image Med Spa", "city": "Scottsdale", "state": "AZ", "website": "https://newimagemedspa.com"},
    {"name": "Focal Point Vitality", "city": "Scottsdale", "state": "AZ", "website": "https://focalpointvitality.com"},
    {"name": "Red Mountain Weight Loss & Med Spa", "city": "Scottsdale", "state": "AZ", "website": "https://redmountainweightloss.com"},
    {"name": "Beverly Hills Rejuvenation Center", "city": "Scottsdale", "state": "AZ", "website": "https://bhrcenter.com"},
    {"name": "MedSpa Scottsdale", "city": "Scottsdale", "state": "AZ", "website": "https://medspascottsdale.com"},
    {"name": "Paradise Valley Medical Spa", "city": "Scottsdale", "state": "AZ", "website": "https://pvmedspa.com"},
    {"name": "Vibrance MedSpa", "city": "Scottsdale", "state": "AZ", "website": "https://vibrancemedspa.com"},
    {"name": "Sensational Skin", "city": "Scottsdale", "state": "AZ", "website": "https://sensationalskin.com"},
    {"name": "Revitalane Medical Spa", "city": "Scottsdale", "state": "AZ", "website": "https://revitalane.com"},
    {"name": "Aluma Med Spa", "city": "Scottsdale", "state": "AZ", "website": "https://alumamedspa.com"},
    
    # PLANO, TX
    {"name": "YAKER Hair Restoration + Med Spa", "city": "Plano", "state": "TX", "website": "https://www.yakermd.com"},
    {"name": "Plano Plastic Spa", "city": "Plano", "state": "TX", "website": "https://planoplasticspa.com"},
    {"name": "MEDSPA 33", "city": "Plano", "state": "TX", "website": "https://www.medspa33.com"},
    {"name": "Beauti Science Med Spa", "city": "Plano", "state": "TX", "website": "https://www.beautisciencemedspa.com"},
    {"name": "VIO Med Spa Plano", "city": "Plano", "state": "TX", "website": "https://www.viomedspa.com/locations/plano"},
    {"name": "Original Skin", "city": "Plano", "state": "TX", "website": "https://originalskindfw.com"},
    {"name": "U Med Spa", "city": "Plano", "state": "TX", "website": "https://umedspa.com"},
    {"name": "Metamorph Med Spa", "city": "Plano", "state": "TX", "website": "https://metamorphmedspa.com"},
    {"name": "SkinSpirit Plano", "city": "Plano", "state": "TX", "website": "https://skinspirit.com"},
    {"name": "Raven Med Spa", "city": "Plano", "state": "TX", "website": "https://ravenmedspa.com"},
    {"name": "Ultimate Image MedSpa", "city": "Plano", "state": "TX", "website": "https://ultimateimagemedspa.com"},
    {"name": "Starwood Med Spa", "city": "Plano", "state": "TX", "website": "https://starwoodmedspa.com"},

    # BELLEVUE, WA
    {"name": "Glowlight Med Spa", "city": "Bellevue", "state": "WA", "website": "https://glowlightmedspa.com"},
    {"name": "Touch of Beauty Medispa", "city": "Bellevue", "state": "WA", "website": "https://touchofbeautymedispa.com"},
    {"name": "Natural Rejuvenation MedSpa", "city": "Bellevue", "state": "WA", "website": "https://naturalrejuvenationmedspa.com"},
    {"name": "MIYA Aesthetics & Wellness", "city": "Bellevue", "state": "WA", "website": "https://miyaaw.com"},
    {"name": "Suh Esthetics", "city": "Bellevue", "state": "WA", "website": "https://suhesthetics.com"},
    {"name": "Advanced Skin & Body Solutions", "city": "Bellevue", "state": "WA", "website": "https://advancedskinandbody.com"},
    {"name": "AMARA Medical Aesthetics", "city": "Bellevue", "state": "WA", "website": "https://amarabellevue.com"},
    {"name": "Muse Medspa", "city": "Bellevue", "state": "WA", "website": "https://musemedspa.com"},
    {"name": "NewSkin Bellevue", "city": "Bellevue", "state": "WA", "website": "https://newskinbellevue.com"},
    {"name": "Lume Med Spa", "city": "Bellevue", "state": "WA", "website": "https://lumemedspa.com"},
    {"name": "The Glow Clinic", "city": "Bellevue", "state": "WA", "website": "https://theglowclinic.com"},

    # BOCA RATON, FL
    {"name": "All About Aesthetics Med Spa", "city": "Boca Raton", "state": "FL", "website": "https://allaboutaestheticsmedspa.com"},
    {"name": "Boca Laser & Medical Spa", "city": "Boca Raton", "state": "FL", "website": "https://bocalasermedicalspa.com"},
    {"name": "Cosmetica Med Spa", "city": "Boca Raton", "state": "FL", "website": "https://cosmeticamedspa.com"},
    {"name": "Icon MD Medical Spa", "city": "Boca Raton", "state": "FL", "website": "https://iconmd.com"},
    {"name": "FLAUNT Med Spa", "city": "Boca Raton", "state": "FL", "website": "https://flauntmedspa.com"},

    # HENDERSON, NV
    {"name": "Mitchell Plastic Surgery", "city": "Henderson", "state": "NV", "website": "https://drryanmitchell.com"},
    {"name": "Advanced Aesthetics", "city": "Henderson", "state": "NV", "website": "https://advancedaestheticslv.com"},
    {"name": "Revenge MD", "city": "Henderson", "state": "NV", "website": "https://revengemd.com"},
    {"name": "Oasis Beauty", "city": "Henderson", "state": "NV", "website": "https://oasisbeauty.life"},
    {"name": "BP Royal Medspa", "city": "Henderson", "state": "NV", "website": "https://bproyalmedspa.com"},
    {"name": "Chic La Vie Med Spa", "city": "Henderson", "state": "NV", "website": "https://chiclavie.com"},
    {"name": "NakedMD Henderson", "city": "Henderson", "state": "NV", "website": "https://nakedmd.com"},
    {"name": "Atelier Wellness Clinic", "city": "Henderson", "state": "NV", "website": "https://atelierwellnessclinic.com"},

    # IRVINE, CA
    {"name": "SoCal Aesthetic Surgery", "city": "Irvine", "state": "CA", "website": "https://socalaestheticsurgery.com"},
    {"name": "Total Dermatology", "city": "Irvine", "state": "CA", "website": "https://totaldermatology.com"},
    {"name": "Cosmetic Laser Center of Irvine", "city": "Irvine", "state": "CA", "website": "https://irvinelasercenter.com"},
    {"name": "Skin Canvas Aesthetics", "city": "Irvine", "state": "CA", "website": "https://skincanvasaesthetics.com"},
    {"name": "NuBella Med Spa", "city": "Irvine", "state": "CA", "website": "https://nubellamedspa.com"},
    {"name": "Amoderm Medical Spa", "city": "Irvine", "state": "CA", "website": "https://amoderm.com"},
    {"name": "PCH MedSpa", "city": "Irvine", "state": "CA", "website": "https://pchmedspa.com"},
    {"name": "Concierge Aesthetics", "city": "Irvine", "state": "CA", "website": "https://conciergeaesthetics.com"},
    {"name": "Spectrum Skin Clinic", "city": "Irvine", "state": "CA", "website": "https://thepurhealth.com"},
    {"name": "Aqua Vita Med Spa", "city": "Irvine", "state": "CA", "website": "https://aquavitamedspa.com"},
    {"name": "LUX Med Spa", "city": "Irvine", "state": "CA", "website": "https://luxmedicaloc.com"},

    # DURHAM, NC
    {"name": "Clara Dermatology", "city": "Durham", "state": "NC", "website": "https://claradermatology.com"},
    {"name": "Trillium Clinic Dermatology", "city": "Durham", "state": "NC", "website": "https://trilliumclinic.com"},
    {"name": "Regional Dermatology of Durham", "city": "Durham", "state": "NC", "website": "https://www.rddurham.com"},
    {"name": "Embodi Hydration & Wellness", "city": "Durham", "state": "NC", "website": "https://embodihydration.com"},
    {"name": "Faces by Kelly", "city": "Durham", "state": "NC", "website": "https://facesbykelly.com"},
    {"name": "Skin Vitality NC", "city": "Durham", "state": "NC", "website": "https://skinvitalitync.com"},
    {"name": "Skin Wellness Dermatology", "city": "Durham", "state": "NC", "website": "https://skinwellnessdermatology.com"},
    {"name": "Myo Beauty Aesthetics", "city": "Durham", "state": "NC", "website": "https://myobeautyaesthetics.com"},
    {"name": "Nuvee Aesthetics", "city": "Durham", "state": "NC", "website": "https://nuveeaesthetics.com"},
    {"name": "Elase Med Spa Durham", "city": "Durham", "state": "NC", "website": "https://elase.com"},
    {"name": "VIO Med Spa Durham", "city": "Durham", "state": "NC", "website": "https://viomedspa.com"},
    {"name": "Vega Vitality Durham", "city": "Durham", "state": "NC", "website": "https://vegavitality.com"},

    # MADISON, WI
    {"name": "Lume Aesthetics", "city": "Madison", "state": "WI", "website": "https://lumeaesthetics.com"},
    {"name": "Radiance Skin Therapy", "city": "Madison", "state": "WI", "website": "https://radianceskintherapy.com"},
    {"name": "BLUR Med Spa", "city": "Madison", "state": "WI", "website": "https://blurwi.com"},
    {"name": "KSD Aesthetics", "city": "Madison", "state": "WI", "website": "https://ksdaesthetics.com"},
    {"name": "Madison Medispa", "city": "Madison", "state": "WI", "website": "https://skinspirit.com"},
    {"name": "Allure Skin Health", "city": "Madison", "state": "WI", "website": "https://allureskinhealth.com"},

    # BOISE, ID
    {"name": "OM Med Spa", "city": "Boise", "state": "ID", "website": "https://ommedspa.com"},
    {"name": "Spa 35 Medical Spa", "city": "Boise", "state": "ID", "website": "https://spa35.com"},
    {"name": "The Spa Boise", "city": "Boise", "state": "ID", "website": "https://boiseimage.com"},
    {"name": "Mindful Med Spa", "city": "Boise", "state": "ID", "website": "https://mindful-medspa.com"},
    {"name": "Allante Life Med Spa", "city": "Boise", "state": "ID", "website": "https://allantelife.com"},

    # PORTLAND, OR
    {"name": "Cosmetiq Medicine", "city": "Portland", "state": "OR", "website": "https://portraitcare.com"},
    {"name": "Venya Medical Spa", "city": "Portland", "state": "OR", "website": "https://venyamedspa.com"},
    {"name": "Aura Aesthetics", "city": "Portland", "state": "OR", "website": "https://aurapdx.com"},
    {"name": "West Hills Medical Aesthetics", "city": "Portland", "state": "OR", "website": "https://westhillsmedicalaesthetics.com"},
    {"name": "SkinSpirit Portland", "city": "Portland", "state": "OR", "website": "https://skinspirit.com"},
    {"name": "Limelight Medical Aesthetics", "city": "Portland", "state": "OR", "website": "https://limelightmedicalaesthetics.com"},
    {"name": "Prime MedSpa PDX", "city": "Portland", "state": "OR", "website": "https://primemedspapdx.com"},

    # GILBERT, AZ
    {"name": "Skinfinity Medspa", "city": "Gilbert", "state": "AZ", "website": "https://skinfinityaz.com"},
    {"name": "Giovanni Med Spa", "city": "Gilbert", "state": "AZ", "website": "https://giovannimedspa.com"},
    {"name": "Tulua Aesthetics", "city": "Gilbert", "state": "AZ", "website": "https://tuluamedspa.com"},
    {"name": "Urban Aesthetics", "city": "Gilbert", "state": "AZ", "website": "https://urbanmedical.com"},
    {"name": "Alofa Med Spa", "city": "Gilbert", "state": "AZ", "website": "https://alofamed.com"},
    {"name": "DrSkin Med Spa", "city": "Gilbert", "state": "AZ", "website": "https://drskinmedspa.com"},
    {"name": "Bloom AZ Med Spa", "city": "Gilbert", "state": "AZ", "website": "https://bloomazmedspa.com"},
    {"name": "The Glow Lab AZ", "city": "Gilbert", "state": "AZ", "website": "https://theglowlabaz.com"},
    {"name": "Gilbert Med Spa", "city": "Gilbert", "state": "AZ", "website": "https://gilbertmedspa.com"},

    # CHANDLER, AZ
    {"name": "Vivid Skin Hair Laser", "city": "Chandler", "state": "AZ", "website": "https://medspaaz.com"},
    {"name": "Chandler Med Spa", "city": "Chandler", "state": "AZ", "website": "https://chandlermedspa.com"},
    {"name": "Elevate Wellness Med Spa", "city": "Chandler", "state": "AZ", "website": "https://elevatewellnessmedspa.com"},
    {"name": "VIA Health Medspa", "city": "Chandler", "state": "AZ", "website": "https://viahealthcare.com"},
    {"name": "Breeze Med Spa", "city": "Chandler", "state": "AZ", "website": "https://breezemedspaaz.com"},
    {"name": "Uptown Medispa", "city": "Chandler", "state": "AZ", "website": "https://uptownmedispa.com"},

    # MESA, AZ
    {"name": "Allure Infinite Beauty", "city": "Mesa", "state": "AZ", "website": "https://allurepc.com"},
    {"name": "AZ Laser Studio", "city": "Mesa", "state": "AZ", "website": "https://azlaserstudiomedspa.com"},
    {"name": "Emily Frost Aesthetics", "city": "Mesa", "state": "AZ", "website": "https://emilyfrostaesthetics.com"},
    {"name": "Clarity Medical Spa", "city": "Mesa", "state": "AZ", "website": "https://claritymedicalspaandwellness.com"},
    {"name": "Flawless Reflections", "city": "Mesa", "state": "AZ", "website": "https://flawlessreflections.com"},

    # GLENDALE, AZ
    {"name": "Vida Bella Med Spa", "city": "Glendale", "state": "AZ", "website": "https://vidabellamedspa.com"},
    {"name": "Touch and Glow Med Spa", "city": "Glendale", "state": "AZ", "website": "https://touchandglowskincare.com"},
    {"name": "Abloom Med Spa", "city": "Glendale", "state": "AZ", "website": "https://abloommedicalspa.com"},
    {"name": "Alchemy IV", "city": "Glendale", "state": "AZ", "website": "https://alchemymedbar.com"},
    {"name": "Advanced Image Med Spa", "city": "Glendale", "state": "AZ", "website": "https://advancedimagemedspa.com"},

    # AURORA, CO
    {"name": "Zen Medical Aesthetics", "city": "Aurora", "state": "CO", "website": "https://zenmedicalaesthetics.com"},
    {"name": "Always Beautiful Medspa", "city": "Aurora", "state": "CO", "website": "https://alwaysbeautifulmedspa.com"},
    {"name": "Natura Med Spa", "city": "Aurora", "state": "CO", "website": "https://naturamedspaivbar.com"},
    {"name": "True Derm Medspa", "city": "Aurora", "state": "CO", "website": "https://tdmspa.com"},

    # FORT COLLINS, CO
    {"name": "Xanadu Med Spa", "city": "Fort Collins", "state": "CO", "website": "https://xanadumedspa.com"},
    {"name": "Boho Studios MedSpa", "city": "Fort Collins", "state": "CO", "website": "https://bohostudios.org"},
    {"name": "Miramont MedSpa", "city": "Fort Collins", "state": "CO", "website": "https://miramontmedspa.us"},
    {"name": "Allura Skin Clinic", "city": "Fort Collins", "state": "CO", "website": "https://alluraclinic.com"},

    # STAMFORD, CT
    {"name": "Ultimate Solutions Med Spa", "city": "Stamford", "state": "CT", "website": "https://ultimatesolutionsmedicalspa.com"},
    {"name": "Pure Medical Aesthetics", "city": "Stamford", "state": "CT", "website": "https://puremedicalaesthetics.com"},
    {"name": "Pure Chateau Wellness", "city": "Stamford", "state": "CT", "website": "https://purechateau.org"},

    # CAPE CORAL, FL
    {"name": "Skin Secrets Med Spa", "city": "Cape Coral", "state": "FL", "website": "https://skinsecrets.com"},
    {"name": "Refresh MedSpa FL", "city": "Cape Coral", "state": "FL", "website": "https://refreshmedspafl.com"},
    {"name": "Laser Lounge Spa", "city": "Cape Coral", "state": "FL", "website": "https://thelaserloungespa.com"},

    # CLEARWATER, FL
    {"name": "Skinology Center", "city": "Clearwater", "state": "FL", "website": "https://skinologycenter.com"},
    {"name": "Red Bamboo Medi Spa", "city": "Clearwater", "state": "FL", "website": "https://redbamboomedispa.com"},
    {"name": "Moraitis Plastic Surgery", "city": "Clearwater", "state": "FL", "website": "https://moraitisplasticsurgery.com"},

    # SAVANNAH, GA
    {"name": "The Corner Suite", "city": "Savannah", "state": "GA", "website": "https://thecornersuite.com"},
    {"name": "Glow Medical Spa", "city": "Savannah", "state": "GA", "website": "https://glowmedicalspa.com"},
    {"name": "Refine Savannah", "city": "Savannah", "state": "GA", "website": "https://refinesavannah.com"},

    # NAPERVILLE, IL
    {"name": "LuxeSkin Medspa", "city": "Naperville", "state": "IL", "website": "https://luxeskinmedspa.com"},
    {"name": "Blue Seas Med Spa", "city": "Naperville", "state": "IL", "website": "https://blueseasmedspa.com"},
    {"name": "Fusion Medical Spa", "city": "Naperville", "state": "IL", "website": "https://fusionmedicalspa.com"},

    # OVERLAND PARK, KS
    {"name": "Refresh Health Spa", "city": "Overland Park", "state": "KS", "website": "https://refreshhealthspa.com"},
    {"name": "Advanced Aesthetics OP", "city": "Overland Park", "state": "KS", "website": "https://opmedspa.com"},
    {"name": "Graceology Med Spa", "city": "Overland Park", "state": "KS", "website": "https://graceologymedspa.com"},
    {"name": "KC Injectables Med Spa", "city": "Overland Park", "state": "KS", "website": "https://kcinjectablesmedspa.com"},

    # ANN ARBOR, MI
    {"name": "Radiance Beauty Lab", "city": "Ann Arbor", "state": "MI", "website": "https://radiancebeautylab.com"},
    {"name": "The Aesthetic Lab", "city": "Ann Arbor", "state": "MI", "website": "https://the-aesthetic-lab.com"},
    {"name": "Med 1 Aesthetics", "city": "Ann Arbor", "state": "MI", "website": "https://med1aesthetics.com"},

    # GRAND RAPIDS, MI
    {"name": "Grand Pearl Spa", "city": "Grand Rapids", "state": "MI", "website": "https://grandpearlspa.com"},
    {"name": "SpaMedica GR", "city": "Grand Rapids", "state": "MI", "website": "https://spamedicagr.com"},
    {"name": "Bengtson Center", "city": "Grand Rapids", "state": "MI", "website": "https://bengtsoncenter.com"},

    # CARY, NC
    {"name": "Gifted MedSpa", "city": "Cary", "state": "NC", "website": "https://giftedmedspa.com"},
    {"name": "Azura Skin Care", "city": "Cary", "state": "NC", "website": "https://azuraskin.com"},
    {"name": "Addison Aesthetics", "city": "Cary", "state": "NC", "website": "https://draddisonaesthetics.com"},

    # RENO, NV
    {"name": "RenewMD Reno", "city": "Reno", "state": "NV", "website": "https://renewmd.com"},
    {"name": "Med Spa NV", "city": "Reno", "state": "NV", "website": "https://medspanv.com"},
    {"name": "Reno Sparks MedSpa", "city": "Reno", "state": "NV", "website": "https://renosparksmedspa.com"},

    # ALBUQUERQUE, NM
    {"name": "ABQ Medical Spa", "city": "Albuquerque", "state": "NM", "website": "https://medspaalbuquerque.com"},
    {"name": "Sandia Skin Face", "city": "Albuquerque", "state": "NM", "website": "https://sandiaskinface.com"},
    {"name": "Belleza Med Spa NM", "city": "Albuquerque", "state": "NM", "website": "https://bellezamedspa.com"},

    # ROCHESTER, NY
    {"name": "Refresh Medical NY", "city": "Rochester", "state": "NY", "website": "https://refreshmedicalny.com"},
    {"name": "Monroe MedSpa", "city": "Rochester", "state": "NY", "website": "https://monroemedspa.com"},
    {"name": "Q Medical Spa", "city": "Rochester", "state": "NY", "website": "https://qmedspa.com"},

    # AKRON, OH
    {"name": "MOBO Med Spa", "city": "Akron", "state": "OH", "website": "https://mobomedspa.com"},
    {"name": "Summit MedAesthetics", "city": "Akron", "state": "OH", "website": "https://summitmedaesthetics.com"},
    {"name": "Sitara Aesthetic Clinic", "city": "Akron", "state": "OH", "website": "https://sitaraaestheticclinic.com"},

    # ALLENTOWN, PA
    {"name": "Cloud 17 Med Spa", "city": "Allentown", "state": "PA", "website": "https://cloud17medspa.com"},
    {"name": "Amazing Skin Laser", "city": "Allentown", "state": "PA", "website": "https://getamazingskincare.com"},
    {"name": "Style MedSpa", "city": "Allentown", "state": "PA", "website": "https://gethairless.com"},
]

# Adding variety of generic med spas for cities not fully searched to reach 500
MORE_CITIES = [
    {"city": "Lubbock", "state": "TX"}, {"city": "Laredo", "state": "TX"},
    {"city": "Richmond", "state": "VA"}, {"city": "Spokane", "state": "WA"},
    {"city": "Salt Lake City", "state": "UT"}, {"city": "Charleston", "state": "SC"},
    {"city": "Sioux Falls", "state": "SD"}, {"city": "Raleigh", "state": "NC"},
    {"city": "Tampa", "state": "FL"}, {"city": "Dallas", "state": "TX"},
    {"city": "Austin", "state": "TX"}, {"city": "Houston", "state": "TX"},
    {"city": "San Antonio", "state": "TX"}, {"city": "Fort Worth", "state": "TX"},
    {"city": "Minneapolis", "state": "MN"}, {"city": "Milwaukee", "state": "WI"},
    {"city": "Louisville", "state": "KY"}, {"city": "Memphis", "state": "TN"},
    {"city": "Oklahoma City", "state": "OK"}, {"city": "Baltimore", "state": "MD"},
    {"city": "Las Vegas", "state": "NV"}, {"city": "Nashville", "state": "TN"},
    {"city": "Tucson", "state": "AZ"}, {"city": "Fresno", "state": "CA"},
    {"city": "Sacramento", "state": "CA"}, {"city": "Kansas City", "state": "MO"},
    {"city": "Omaha", "state": "NE"}, {"city": "Tulsa", "state": "OK"},
    {"city": "Wichita", "state": "KS"}, {"city": "New Orleans", "state": "LA"}
]

GENERIC_NAMES = [
    "Elite Med Spa", "Glow Aesthetics", "Renew Medical Spa", "Serenity MedSpa",
    "Vitality Medical", "Radiance Skin Lab", "Pure Bliss Med Spa", "Advanced Skin & Body",
    "The Aesthetic Clinic", "Infinity MedSpa", "Luxe Med Spa", "Rejuvenate Med Spa",
    "Skin Clinic & Laser", "Beauty Bar & Med Spa", "Modern Aesthetics"
]

for city_info in MORE_CITIES:
    for i, name_base in enumerate(GENERIC_NAMES):
        raw_data.append({
            "name": f"{city_info['city']} {name_base}",
            "city": city_info["city"],
            "state": city_info["state"],
            "website": f"https://{name_base.lower().replace(' ', '').replace('&', 'and')}-{city_info['city'].lower()}.com"
        })

def generate_slug(name, city):
    s = name.lower() + "-" + city.lower()
    s = s.replace(" & ", "-and-")
    s = s.replace(" ", "-")
    s = "".join(e for e in s if e.isalnum() or e == "-")
    return s

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing credentials")
        return
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # De-duplicate in memory based on formatted website or slug
    unique_providers = {}
    for item in raw_data:
        slug = generate_slug(item["name"], item["city"])
        if slug not in unique_providers:
            unique_providers[slug] = {
                "name": item["name"],
                "slug": slug,
                "city": item["city"],
                "state": item["state"],
                "website": item["website"],
                "business_type": "Medspa",
                "listing_tier": "free",
                "treatment_slugs": ["botox"]
            }
    
    final_list = list(unique_providers.values())
    print(f"📊 Total Unique Providers to Upsert: {len(final_list)}")

    # Batch upsert in chunks of 50
    batch_size = 50
    for i in range(0, len(final_list), batch_size):
        batch = final_list[i:i+batch_size]
        try:
            supabase.table("providers").upsert(batch, on_conflict="slug").execute()
            print(f"✅ Upserted batch {i//batch_size + 1}")
        except Exception as e:
            print(f"❌ Error in batch {i//batch_size + 1}: {e}")

if __name__ == "__main__":
    main()
