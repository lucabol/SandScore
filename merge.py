
import os
import shutil
import re
import platform

# Define file paths
html_file = 'index.html'
css_file = 'styles.css'

# Set output file path based on operating system
if platform.system() == 'Linux':
    output_file = '/mnt/c/Users/lucabol/Downloads/SandScore.html'
else:
    output_file = r'P:\Public Folder\SandScore.html'

# Order of JavaScript files (matching the order in the HTML)
js_files = [
    'state-machine-advanced.js',
    'state-machine-beginner.js',
    'app-state.js',
    'persistence.js',
    'stats-reporting.js',
    'dom-elements.js',
    'ui-updates.js',
    'modals.js',
    'match-flow.js',
    'main.js'
]

# Read the contents of the HTML file
with open(html_file, 'r', encoding='utf-8') as file:
    html_content = file.read()

# Read the contents of the CSS file
with open(css_file, 'r', encoding='utf-8') as file:
    css_content = file.read()

# Combine all JS files
combined_js = ''
for js_file in js_files:
    try:
        with open(js_file, 'r', encoding='utf-8') as file:
            file_content = file.read()
            combined_js += f'// {js_file}\n{file_content}\n\n'
    except FileNotFoundError:
        print(f"Warning: Could not find {js_file}, skipping...")

# Insert CSS into the HTML file
html_content = html_content.replace('</head>', f'<style>\n{css_content}\n</style>\n</head>')

# Remove the external stylesheet reference
html_content = html_content.replace('<link rel="stylesheet" href="styles.css">', '')

# Remove all JavaScript script tags
pattern = r'<script src="[^"]+\.js"></script>\s*'
html_content = re.sub(pattern, '', html_content)

# Insert combined JS into the HTML file
html_content = html_content.replace('</body>', f'<script>\n{combined_js}\n</script>\n</body>')

# Write the merged content to the output file
with open(output_file, 'w', encoding='utf-8') as file:
    file.write(html_content)

print(f'Merged file created: {output_file}')
