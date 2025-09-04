#!/bin/bash

# Script to add frontmatter to remaining grammar files

cd "/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/a1niveau/grammatik"

# File 7: Imperativ
if [[ -f "7. Imperativ - Câu mệnh lệnh trong tiếng Đức.md" ]]; then
    echo "Adding frontmatter to file 7..."
    sed -i '' '1i\
---\
title: "Imperativ - Câu mệnh lệnh"\
description: "Tìm hiểu về câu mệnh lệnh trong tiếng Đức - Imperativ"\
level: "A1"\
topic: "Grammatik"\
order: 7\
---\
' "7. Imperativ - Câu mệnh lệnh trong tiếng Đức.md"
fi

# File 8: Präpositionen
if [[ -f "8. Präpositionen - Giới từ trong tiếng Đức.md" ]]; then
    echo "Adding frontmatter to file 8..."
    sed -i '' '1i\
---\
title: "Präpositionen - Giới từ"\
description: "Tìm hiểu về các giới từ quan trọng trong tiếng Đức"\
level: "A1"\
topic: "Grammatik"\
order: 8\
---\
' "8. Präpositionen - Giới từ trong tiếng Đức.md"
fi

# File 9: Negation
if [[ -f "9. Negation mit nicht und kein.md" ]]; then
    echo "Adding frontmatter to file 9..."
    sed -i '' '1i\
---\
title: "Negation mit nicht und kein"\
description: "Tìm hiểu về cách phủ định trong tiếng Đức với nicht và kein"\
level: "A1"\
topic: "Grammatik"\
order: 9\
---\
' "9. Negation mit nicht und kein.md"
fi

# File 10: Konjunktionen
if [[ -f "10. Konjunktionen - Liên kết mệnh đề chính trong tiếng Đức.md" ]]; then
    echo "Adding frontmatter to file 10..."
    sed -i '' '1i\
---\
title: "Konjunktionen - Liên từ"\
description: "Tìm hiểu về các liên từ kết nối mệnh đề trong tiếng Đức"\
level: "A1"\
topic: "Grammatik"\
order: 10\
---\
' "10. Konjunktionen - Liên kết mệnh đề chính trong tiếng Đức.md"
fi

# File 11: Quán từ nâng cao
if [[ -f "11. Quán Từ nâng cao - Erweiterter Wortschatz.md" ]]; then
    echo "Adding frontmatter to file 11..."
    sed -i '' '1i\
---\
title: "Quán từ nâng cao - Erweiterter Wortschatz"\
description: "Tìm hiểu về các quán từ nâng cao trong tiếng Đức"\
level: "A1"\
topic: "Grammatik"\
order: 11\
---\
' "11. Quán Từ nâng cao - Erweiterter Wortschatz.md"
fi

# File 12: Personalpronomen
if [[ -f "12. Personalpronomen - Đại từ nhân xưng trong tiếng Đức.md" ]]; then
    echo "Adding frontmatter to file 12..."
    sed -i '' '1i\
---\
title: "Personalpronomen - Đại từ nhân xưng"\
description: "Tìm hiểu về đại từ nhân xưng trong tiếng Đức"\
level: "A1"\
topic: "Grammatik"\
order: 12\
---\
' "12. Personalpronomen - Đại từ nhân xưng trong tiếng Đức.md"
fi

echo "Frontmatter added to all remaining files!"
