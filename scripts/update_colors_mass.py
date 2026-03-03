import os
import re

def replace_colors(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Text colors
    content = content.replace('text-white', 'text-[#3D2B1F]')
    content = content.replace('text-gray-400', 'text-[#3D2B1F]/70')
    content = content.replace('text-gray-500', 'text-[#3D2B1F]/60')
    content = content.replace('text-gray-600', 'text-[#3D2B1F]/50')
    
    # Backgrounds
    content = content.replace('bg-[#0d1420]', 'bg-[#FAF8F5]')
    content = content.replace('bg-[#101827]', 'bg-[#F2EDE4]')
    content = content.replace('bg-[#050910]', 'bg-[#F2EDE4]')
    content = content.replace('bg-[#0a0f18]', 'bg-[#F2EDE4]')
    content = content.replace('bg-white/[0.02]', 'bg-[#3D2B1F]/5')
    content = content.replace('bg-white/[0.03]', 'bg-[#3D2B1F]/5')
    content = content.replace('bg-white/[0.04]', 'bg-[#3D2B1F]/5')
    content = content.replace('bg-white/[0.05]', 'bg-[#3D2B1F]/5')
    content = content.replace('bg-white/[0.06]', 'bg-[#3D2B1F]/5')
    content = content.replace('bg-white/5', 'bg-[#3D2B1F]/5')
    content = content.replace('bg-white/10', 'bg-[#3D2B1F]/10')
    
    # Borders
    content = content.replace('border-white/[0.05]', 'border-[#3D2B1F]/10')
    content = content.replace('border-white/[0.06]', 'border-[#3D2B1F]/10')
    content = content.replace('border-white/[0.1]', 'border-[#3D2B1F]/10')
    content = content.replace('border-white/10', 'border-[#3D2B1F]/10')
    content = content.replace('border-white/5', 'border-[#3D2B1F]/10')
    
    # Accents
    content = content.replace('#d4af37', '#C9A96E')
    content = content.replace('#c0a030', '#B5955B')
    content = content.replace('emerald-500', '[#8A9E8D]')
    content = content.replace('emerald-400', '[#8A9E8D]')
    
    # Specific inverted elements: dark navy inside a light theme
    content = content.replace('text-[#0d1420]', 'text-white') # if button bg was gold, text was navy -> make text white

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

root_dirs = ['app', 'components']
changed = 0

for d in root_dirs:
    for dirpath, _, filenames in os.walk(d):
        for f in filenames:
            if f.endswith(('.tsx', '.ts')):
                if replace_colors(os.path.join(dirpath, f)):
                    changed += 1

print(f"Changed {changed} files")
