#!/bin/bash

# Create placeholder images for the news website
cd /Users/khoavo/Documents/GitHub/deutsch/Edu-theme/public/images/shared

# Create a simple colored rectangle for German Parliament
convert -size 800x600 xc:"#1e40af" -pointsize 40 -fill white -gravity center -annotate +0+0 "Deutscher Bundestag" german-parliament.jpg

# Create placeholder avatars
convert -size 100x100 xc:"#6366f1" -fill white -gravity center -pointsize 20 -annotate +0+0 "AF" author1.jpg
convert -size 100x100 xc:"#10b981" -fill white -gravity center -pointsize 20 -annotate +0+0 "SO" author2.jpg  
convert -size 100x100 xc:"#f59e0b" -fill white -gravity center -pointsize 20 -annotate +0+0 "SB" author3.jpg
convert -size 100x100 xc:"#ef4444" -fill white -gravity center -pointsize 20 -annotate +0+0 "GR" author4.jpg
convert -size 100x100 xc:"#8b5cf6" -fill white -gravity center -pointsize 20 -annotate +0+0 "PW" author5.jpg
convert -size 100x100 xc:"#06b6d4" -fill white -gravity center -pointsize 20 -annotate +0+0 "LM" author6.jpg

# Create default avatar
convert -size 100x100 xc:"#6b7280" -fill white -gravity center -pointsize 20 -annotate +0+0 "?" default-avatar.jpg

# Create other news images
convert -size 600x400 xc:"#1f2937" -pointsize 30 -fill white -gravity center -annotate +0+0 "Deutsche Politik" german-politics.jpg
convert -size 600x400 xc:"#065f46" -pointsize 30 -fill white -gravity center -annotate +0+0 "KI Technologie" ai-technology.jpg

echo "Placeholder images created successfully!"
