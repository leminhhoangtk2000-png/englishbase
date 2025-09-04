#!/bin/bash

cd "/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/a1niveau/grammatik"

echo "Creating simplified filename structure..."

# Backup original files and create new ones with simple names
if [[ -f "1. Chia động từ ở thì hiện tại - Präsens.md" ]]; then
    cp "1. Chia động từ ở thì hiện tại - Präsens.md" "01-prasens.md"
fi

if [[ -f "2. Artikel und Nomen - Khái niệm về Quán từ.md" ]]; then
    cp "2. Artikel und Nomen - Khái niệm về Quán từ.md" "02-artikel-nomen.md"
fi

if [[ -f "3.  Wfragen und JaNein-Fragen.md" ]]; then
    cp "3.  Wfragen und JaNein-Fragen.md" "03-w-fragen.md"
fi

if [[ -f "4. Nomi - Akku - Dativ.md" ]]; then
    cp "4. Nomi - Akku - Dativ.md" "04-kasus.md"
fi

if [[ -f "5. Modalverben - Động từ khuyết thiếu trong tiếng Đức.md" ]]; then
    cp "5. Modalverben - Động từ khuyết thiếu trong tiếng Đức.md" "05-modalverben.md"
fi

if [[ -f "6. Trennbare Verben - Động từ tách được và không tách được.md" ]]; then
    cp "6. Trennbare Verben - Động từ tách được và không tách được.md" "06-trennbare-verben.md"
fi

if [[ -f "7. Imperativ - Câu mệnh lệnh trong tiếng Đức.md" ]]; then
    cp "7. Imperativ - Câu mệnh lệnh trong tiếng Đức.md" "07-imperativ.md"
fi

if [[ -f "8. Präpositionen - Giới từ trong tiếng Đức.md" ]]; then
    cp "8. Präpositionen - Giới từ trong tiếng Đức.md" "08-prapositionen.md"
fi

if [[ -f "9. Negation mit nicht und kein.md" ]]; then
    cp "9. Negation mit nicht und kein.md" "09-negation.md"
fi

if [[ -f "10. Konjunktionen - Liên kết mệnh đề chính trong tiếng Đức.md" ]]; then
    cp "10. Konjunktionen - Liên kết mệnh đề chính trong tiếng Đức.md" "10-konjunktionen.md"
fi

if [[ -f "11. Quán Từ nâng cao - Erweiterter Wortschatz.md" ]]; then
    cp "11. Quán Từ nâng cao - Erweiterter Wortschatz.md" "11-quan-tu-nang-cao.md"
fi

if [[ -f "12. Personalpronomen - Đại từ nhân xưng trong tiếng Đức.md" ]]; then
    cp "12. Personalpronomen - Đại từ nhân xưng trong tiếng Đức.md" "12-personalpronomen.md"
fi

echo "Created simplified filename structure!"
echo "Files created:"
ls -1 *-*.md 2>/dev/null || echo "No files found"
