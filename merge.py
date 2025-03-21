import os
import shutil

# Define file paths
html_file = 'index.html'
css_file = 'styles.css'
js_file = 'script.js'
output_file = r'P:\Public Folder\SandScore.html'

# Read the contents of the HTML file
with open(html_file, 'r', encoding='utf-8') as file:
    html_content = file.read()

# Read the contents of the CSS file
with open(css_file, 'r', encoding='utf-8') as file:
    css_content = file.read()

# Read the contents of the JS file
with open(js_file, 'r', encoding='utf-8') as file:
    js_content = file.read()

# Insert CSS into the HTML file
html_content = html_content.replace('</head>', f'<style>\n{css_content}\n</style>\n</head>')

# Remove the external script and css references
html_content = html_content.replace('<script src="script.js"></script>', '')
html_content = html_content.replace('<link rel="stylesheet" href="styles.css">', '')

# Insert JS into the HTML file
html_content = html_content.replace('</body>', f'<script>\n{js_content}\n</script>\n</body>')

# Write the merged content to the output file
with open(output_file, 'w', encoding='utf-8') as file:
    file.write(html_content)

print(f'Merged file created: {output_file}')
