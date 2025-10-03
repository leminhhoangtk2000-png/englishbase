#!/usr/bin/env python3
"""
Rewrite B1 Übungen files with correct JSX syntax
Fix escaped underscores and proper component structure
"""
import os
import re

BASE_DIR = "src/content/b1niveau/Übungen"

# Original exercise content for each folder
EXERCISE_DATA = {
    "doppelkonjunktionen": {
        "teil1": {
            "title": "obwohl, trotzdem, falls, da, deshalb",
            "exercises": [
                ("___ er viel gelernt hat, hat er die Prüfung nicht bestanden.", "Obwohl", "Obwohl (mặc dù) - dùng để diễn tả sự tương phản"),
                ("Es regnet, ___ gehen wir spazieren.", "trotzdem", "trotzdem (dù vậy) - liên từ nối hai mệnh đề tương phản"),
                ("___ ich krank bin, bleibe ich zu Hause.", "Da", "Da (vì, do) - liên từ chỉ nguyên nhân"),
                ("Ruf mich an, ___ du Hilfe brauchst.", "falls", "falls (nếu như, trong trường hợp) - diễn tả điều kiện"),
                ("Er hat kein Geld, ___ kann er das Auto nicht kaufen.", "deshalb", "deshalb (vì vậy) - liên từ chỉ kết quả"),
                ("___ wir keine Zeit haben, gehen wir nicht ins Kino.", "Da", "Da (vì) - chỉ nguyên nhân"),
                ("Sie ist müde, ___ arbeitet sie weiter.", "trotzdem", "trotzdem (dù vậy) - sự tương phản"),
                ("___ es sehr kalt ist, tragen wir nur dünne Jacken.", "Obwohl", "Obwohl (mặc dù) - sự tương phản"),
                ("Ich rufe dich an, ___ ich später komme.", "falls", "falls (nếu như) - điều kiện"),
                ("Es ist schon spät, ___ müssen wir uns beeilen.", "deshalb", "deshalb (vì vậy) - kết quả"),
                ("___ es regnet, machen wir ein Picknick.", "Falls", "Falls (nếu như) - điều kiện"),
                ("Wir gehen heute nicht schwimmen, ___ das Wasser zu kalt ist.", "da", "da (vì) - nguyên nhân"),
                ("___ er sehr krank war, ging er zur Arbeit.", "Obwohl", "Obwohl (mặc dù) - tương phản"),
                ("Sie hat viel Arbeit, ___ nimmt sie sich Zeit für ihre Familie.", "trotzdem", "trotzdem (dù vậy) - tương phản"),
                ("Wir haben den Zug verpasst, ___ mussten wir ein Taxi nehmen.", "deshalb", "deshalb (vì vậy) - kết quả"),
                ("___ du Zeit hast, komm bitte morgen vorbei.", "Falls", "Falls (nếu như) - điều kiện"),
                ("Ich esse Schokolade, ___ ich abnehmen möchte.", "obwohl", "obwohl (mặc dù) - tương phản"),
                ("___ er krank war, blieb er im Bett.", "Da", "Da (vì) - nguyên nhân"),
                ("Sie hat keine Zeit, ___ hilft sie uns.", "trotzdem", "trotzdem (dù vậy) - tương phản"),
                ("Er ist zu jung, ___ darf er nicht allein fahren.", "deshalb", "deshalb (vì vậy) - kết quả"),
            ]
        },
        "teil2": {
            "title": "weder...noch, entweder...oder, nicht nur...sondern auch",
            "exercises": [
                ("___ Peter ___ Maria kommen zur Party.", "Weder / noch", "weder...noch = không...cũng không"),
                ("Du kannst ___ Tee ___ Kaffee trinken.", "entweder / oder", "entweder...oder = hoặc...hoặc"),
                ("Sie ist ___ intelligent, ___ fleißig.", "nicht nur / sondern auch", "nicht nur...sondern auch = không chỉ...mà còn"),
                ("Ich habe ___ Zeit ___ Geld für die Reise.", "weder / noch", "weder...noch = không có...cũng không có"),
                ("Wir fahren ___ nach Berlin ___ nach München.", "entweder / oder", "entweder...oder = hoặc...hoặc (lựa chọn)"),
                ("Er spricht ___ Deutsch, ___ Französisch perfekt.", "nicht nur / sondern auch", "không chỉ...mà còn (tích cực)"),
                ("___ meine Eltern ___ meine Geschwister wohnen hier.", "Weder / noch", "weder...noch = cả hai đều không"),
                ("Du musst ___ heute ___ morgen anrufen.", "entweder / oder", "entweder...oder = phải chọn một"),
                ("Das Essen ist ___ lecker, ___ gesund.", "nicht nur / sondern auch", "không chỉ...mà còn (hai tính chất tốt)"),
                ("___ Hans ___ Lisa haben das Buch gelesen.", "Weder / noch", "weder...noch = không ai cả"),
            ]
        },
        "teil3": {
            "title": "sowohl...als auch, je...desto, zwar...aber",
            "exercises": [
                ("Er spricht ___ Deutsch ___ Englisch.", "sowohl / als auch", "sowohl...als auch = cả...lẫn (cả hai đều có)"),
                ("___ mehr ich lerne, ___ besser werden meine Noten.", "Je / desto", "je...desto = càng...càng (tỉ lệ thuận)"),
                ("Das Haus ist ___ groß, ___ sehr teuer.", "zwar / aber", "zwar...aber = tuy...nhưng (nhượng bộ)"),
                ("Sie interessiert sich ___ für Musik ___ für Sport.", "sowohl / als auch", "sowohl...als auch = cả hai đều"),
                ("___ älter man wird, ___ weiser wird man.", "Je / desto", "je...desto = tỉ lệ tăng"),
                ("Der Film ist ___ interessant, ___ zu lang.", "zwar / aber", "zwar...aber = tuy thế nhưng"),
                ("___ Kinder ___ Erwachsene mögen dieses Spiel.", "Sowohl / als auch", "sowohl...als auch = tất cả đều"),
                ("___ schneller du läufst, ___ schneller kommst du an.", "Je / desto", "je...desto = mối quan hệ tỉ lệ"),
                ("Ich kenne ihn ___ gut, ___ nicht persönlich.", "zwar / aber", "zwar...aber = biết nhưng không sâu"),
                ("Er kann ___ kochen ___ backen.", "sowohl / als auch", "sowohl...als auch = cả hai kỹ năng"),
                ("___ mehr ich arbeite, ___ müder werde ich.", "Je / desto", "je...desto = càng làm càng mệt"),
                ("Das Restaurant ist ___ beliebt, ___ immer voll.", "zwar / aber", "zwar...aber = phổ biến nhưng đông"),
            ]
        },
        "teil4": {
            "title": "Tổng hợp các liên từ kép",
            "exercises": [
                ("___ Lisa ___ Maria sind zu Hause. (weder...noch)", "Weder / noch", "weder...noch = không ai ở nhà cả"),
                ("Du kannst ___ Reis ___ Nudeln essen. (entweder...oder)", "entweder / oder", "entweder...oder = chọn một trong hai"),
                ("Sie ist ___ schön ___ intelligent. (nicht nur...sondern auch)", "nicht nur / sondern auch", "không chỉ...mà còn (khen ngợi)"),
                ("Er mag ___ Hunde ___ Katzen. (sowohl...als auch)", "sowohl / als auch", "sowohl...als auch = cả hai đều thích"),
                ("___ länger ich warte, ___ nervöser werde ich. (je...desto)", "Je / desto", "je...desto = càng đợi càng lo"),
                ("Das Buch ist ___ spannend, ___ schwer zu verstehen. (zwar...aber)", "zwar / aber", "zwar...aber = hấp dẫn nhưng khó"),
                ("Ich habe ___ Hunger ___ Durst. (weder...noch)", "weder / noch", "weder...noch = không đói không khát"),
                ("Wir gehen ___ ins Kino ___ ins Theater. (entweder...oder)", "entweder / oder", "entweder...oder = chọn một hoạt động"),
                ("Das Hotel ist ___ modern ___ gemütlich. (nicht nur...sondern auch)", "nicht nur / sondern auch", "không chỉ...mà còn (cả hai đều tốt)"),
                ("___ Thomas ___ Anna sprechen Spanisch. (Sowohl...als auch)", "Sowohl / als auch", "sowohl...als auch = cả hai đều nói được"),
            ]
        },
        "teil5": {
            "title": "Câu phức với liên từ kép - Nâng cao",
            "exercises": [
                ("___ er fleißig lernt, ___ seine Eltern stolz auf ihn sind. (je...desto)", "Je / desto", "je...desto = càng học càng tự hào"),
                ("Das Auto ist ___ schnell, ___ verbraucht viel Benzin. (zwar...aber)", "zwar / aber", "zwar...aber = nhanh nhưng tốn xăng"),
                ("Sie kann ___ tanzen ___ singen. (sowohl...als auch)", "sowohl / als auch", "sowohl...als auch = cả hai tài năng"),
                ("___ mein Bruder ___ meine Schwester studieren Medizin. (Weder...noch)", "Weder / noch", "weder...noch = không ai học y cả"),
                ("Du sollst ___ mehr Sport machen ___ gesünder essen. (nicht nur...sondern auch)", "nicht nur / sondern auch", "không chỉ...mà còn (lời khuyên)"),
                ("___ ich esse, ___ hungriger werde ich. (Je...mehr / desto)", "Je mehr / desto", "je mehr...desto = càng ăn càng đói"),
                ("___ kommst du heute ___ morgen? (Entweder...oder)", "Entweder / oder", "entweder...oder = chọn ngày"),
                ("Der Job ist ___ interessant, ___ schlecht bezahlt. (zwar...aber)", "zwar / aber", "zwar...aber = thú vị nhưng lương thấp"),
                ("___ Kinder ___ Eltern haben Spaß beim Fest. (Sowohl...als auch)", "Sowohl / als auch", "sowohl...als auch = mọi người đều vui"),
                ("Ich möchte ___ nach Frankreich ___ nach Italien reisen. (weder...noch)", "weder / noch", "weder...noch = không đi cả hai"),
            ]
        },
        "teil6": {
            "title": "Ứng dụng thực tế - Viết câu hoàn chỉnh",
            "exercises": [
                ("Maria / können / sowohl Klavier spielen / als auch singen", "Maria kann sowohl Klavier spielen als auch singen.", "sowohl...als auch = cả hai kỹ năng âm nhạc"),
                ("Je / mehr / ich / lesen / desto / besser / verstehen / ich", "Je mehr ich lese, desto besser verstehe ich.", "je...desto = đọc nhiều hiểu tốt"),
                ("Das Wetter / sein / zwar / schön / aber / zu heiß", "Das Wetter ist zwar schön, aber zu heiß.", "zwar...aber = đẹp nhưng nóng"),
                ("Wir / haben / weder / Zeit / noch / Geld / für Urlaub", "Wir haben weder Zeit noch Geld für Urlaub.", "weder...noch = không có cả hai"),
                ("Du / müssen / entweder / Hausaufgaben machen / oder / lernen", "Du musst entweder Hausaufgaben machen oder lernen.", "entweder...oder = chọn một việc"),
                ("Die Stadt / sein / nicht nur / sauber / sondern auch / sicher", "Die Stadt ist nicht nur sauber, sondern auch sicher.", "không chỉ...mà còn (hai ưu điểm)"),
                ("Je / früher / wir / losfahren / desto / mehr / Zeit / haben / wir", "Je früher wir losfahren, desto mehr Zeit haben wir.", "je...desto = đi sớm có nhiều thời gian"),
                ("Sowohl / Lehrer / als auch / Schüler / sein / zufrieden", "Sowohl Lehrer als auch Schüler sind zufrieden.", "sowohl...als auch = cả hai đều hài lòng"),
                ("Er / trinken / weder / Alkohol / noch / Kaffee", "Er trinkt weder Alkohol noch Kaffee.", "weder...noch = không uống cả hai"),
                ("Das Handy / sein / zwar / modern / aber / teuer", "Das Handy ist zwar modern, aber teuer.", "zwar...aber = hiện đại nhưng đắt"),
            ]
        }
    },
    "artikelwoerter-pronomen": {
        "teil1": {
            "title": "Relativpronomen mit Dativ",
            "exercises": [
                ("Das ist der Mann, ___ ich gestern geholfen habe.", "dem", "helfen + Dativ → der Mann → dem"),
                ("Kennst du die Frau, ___ ich das Buch gegeben habe?", "der", "geben + Dativ → die Frau → der"),
                ("Das sind die Kinder, ___ wir die Geschenke geschickt haben.", "denen", "schicken + Dativ → die Kinder (Plural) → denen"),
                ("Hier ist das Mädchen, ___ ich beim Lernen geholfen habe.", "dem", "helfen + Dativ → das Mädchen → dem"),
                ("Die Leute, ___ wir vertrauen, sind unsere Freunde.", "denen", "vertrauen + Dativ → die Leute (Plural) → denen"),
                ("Das ist der Lehrer, ___ alle Schüler zuhören.", "dem", "zuhören + Dativ → der Lehrer → dem"),
                ("Die Nachbarin, ___ ich oft helfe, ist sehr nett.", "der", "helfen + Dativ → die Nachbarin → der"),
                ("Das ist das Kind, ___ ich ein Spielzeug geschenkt habe.", "dem", "schenken + Dativ → das Kind → dem"),
                ("Die Kollegen, ___ ich gratuliert habe, haben Geburtstag.", "denen", "gratulieren + Dativ → die Kollegen → denen"),
                ("Der Arzt, ___ ich vertraue, ist sehr erfahren.", "dem", "vertrauen + Dativ → der Arzt → dem"),
            ]
        },
        "teil2": {
            "title": "Relativpronomen hỗn hợp (Nominativ, Akkusativ, Dativ)",
            "exercises": [
                ("Der Mann, ___ im Garten arbeitet, ist mein Vater. (Nominativ)", "der", "der Mann (chủ ngữ) → der"),
                ("Das ist das Buch, ___ ich letzte Woche gekauft habe. (Akkusativ)", "das", "das Buch (tân ngữ) → das"),
                ("Die Frau, ___ ich geholfen habe, war sehr dankbar. (Dativ)", "der", "helfen + Dativ → die Frau → der"),
                ("Kennst du den Lehrer, ___ so nett zu uns ist? (Nominativ)", "der", "der Lehrer (chủ ngữ) → der"),
                ("Das ist die Stadt, ___ ich besuchen möchte. (Akkusativ)", "die", "besuchen + Akkusativ → die Stadt → die"),
                ("Der Student, ___ ich das Heft gegeben habe, lernt fleißig. (Dativ)", "dem", "geben + Dativ → der Student → dem"),
                ("Die Kinder, ___ im Park spielen, sind sehr laut. (Nominativ)", "die", "die Kinder (chủ ngữ Plural) → die"),
                ("Das sind die Freunde, ___ ich eingeladen habe. (Akkusativ)", "die", "einladen + Akkusativ → die Freunde → die"),
                ("Die Lehrerin, ___ alle vertrauen, ist sehr kompetent. (Dativ)", "der", "vertrauen + Dativ → die Lehrerin → der"),
                ("Das ist das Auto, ___ meinem Bruder gehört. (Dativ)", "das", "gehören + Dativ → das Auto (chủ ngữ) → das"),
            ]
        }
    },
    "passiv": {
        "teil1": {
            "title": "Passiv Präsens mit Modalverben",
            "exercises": [
                ("Das Zimmer / sauber machen / müssen", "Das Zimmer muss sauber gemacht werden.", "müssen + werden + Partizip II"),
                ("Die Hausaufgaben / heute / erledigen / sollen", "Die Hausaufgaben sollen heute erledigt werden.", "sollen + werden + Partizip II"),
                ("Der Brief / bis morgen / schreiben / können", "Der Brief kann bis morgen geschrieben werden.", "können + werden + Partizip II"),
                ("Das Problem / schnell / lösen / müssen", "Das Problem muss schnell gelöst werden.", "müssen + werden + Partizip II"),
                ("Die Tür / abschließen / sollen", "Die Tür soll abgeschlossen werden.", "sollen + werden + Partizip II"),
                ("Das Auto / reparieren / können", "Das Auto kann repariert werden.", "können + werden + Partizip II"),
                ("Die Fenster / putzen / müssen", "Die Fenster müssen geputzt werden.", "müssen + werden + Partizip II"),
                ("Der Tisch / decken / sollen", "Der Tisch soll gedeckt werden.", "sollen + werden + Partizip II"),
                ("Das Paket / abholen / können", "Das Paket kann abgeholt werden.", "können + werden + Partizip II"),
                ("Die Rechnung / bezahlen / müssen", "Die Rechnung muss bezahlt werden.", "müssen + werden + Partizip II"),
            ]
        },
        "teil2": {
            "title": "Passiv Präteritum (Quá khứ bị động)",
            "exercises": [
                ("Das Haus / 1990 / bauen", "Das Haus wurde 1990 gebaut.", "wurde + Partizip II (bị động quá khứ)"),
                ("Der Film / gestern / zeigen", "Der Film wurde gestern gezeigt.", "wurde + gezeigt"),
                ("Die Briefe / letzte Woche / schicken", "Die Briefe wurden letzte Woche geschickt.", "wurden (Plural) + geschickt"),
                ("Das Auto / letzten Monat / verkaufen", "Das Auto wurde letzten Monat verkauft.", "wurde + verkauft"),
                ("Die Straße / vor zwei Jahren / renovieren", "Die Straße wurde vor zwei Jahren renoviert.", "wurde + renoviert"),
                ("Das Buch / 2020 / veröffentlichen", "Das Buch wurde 2020 veröffentlicht.", "wurde + veröffentlicht"),
                ("Die Fenster / gestern / putzen", "Die Fenster wurden gestern geputzt.", "wurden + geputzt"),
                ("Der Kuchen / am Wochenende / backen", "Der Kuchen wurde am Wochenende gebacken.", "wurde + gebacken"),
                ("Die Gäste / freundlich / empfangen", "Die Gäste wurden freundlich empfangen.", "wurden + empfangen"),
                ("Das Problem / schnell / lösen", "Das Problem wurde schnell gelöst.", "wurde + gelöst"),
            ]
        }
    }
}

def create_proper_exercise_file(folder, part, data):
    """Create properly formatted MDX file with correct JSX syntax"""
    
    title_map = {
        "doppelkonjunktionen": "Doppelkonjunktionen",
        "artikelwoerter-pronomen": "Artikelwörter und Pronomen",
        "passiv": "Passiv"
    }
    
    folder_title = title_map.get(folder, folder.title())
    part_number = part.replace('teil', '')
    
    # Frontmatter
    content = f'''---
title: "B1 {folder_title} - Teil {part_number}"
description: "Bài tập thực hành {folder_title} - Cấp độ B1"
tags: ["B1", "{folder_title}", "Grammatik", "Übungen"]
---

import ExerciseComments from "@/components/exercises/ExerciseComments";

# B1 {folder_title} - Teil {part_number}

<ExerciseTable>
  <ExerciseHeader>
    <ExerciseInstruction>
      {data['title']}
    </ExerciseInstruction>
  </ExerciseHeader>

  <ExerciseBody>
'''
    
    # Add exercise items
    for sentence, answer, explanation in data['exercises']:
        content += f'''    <ExerciseItem>
      <ExerciseSentence>
        {sentence}
      </ExerciseSentence>
      <ExerciseAnswer>{answer}</ExerciseAnswer>
      <ExerciseExplanation>
        {explanation}
      </ExerciseExplanation>
    </ExerciseItem>

'''
    
    # Close ExerciseTable
    content += '''  </ExerciseBody>
</ExerciseTable>

---

## Hỏi đáp & Thảo luận 💬

<ExerciseComments
  exerciseId="b1-{}-{}"
  url="/b1niveau/übungen/{}/{}"
/>
'''.format(folder, part, folder, part)
    
    return content

def main():
    print("🔧 Rewriting B1 Übungen files with correct syntax...")
    
    for folder, parts in EXERCISE_DATA.items():
        folder_path = os.path.join(BASE_DIR, folder)
        
        if not os.path.exists(folder_path):
            print(f"❌ Folder not found: {folder_path}")
            continue
        
        print(f"\n📁 Processing: {folder}")
        
        for part, data in parts.items():
            file_path = os.path.join(folder_path, f"{part}.mdx")
            
            print(f"   ✍️  Writing: {part}.mdx")
            
            # Create properly formatted content
            new_content = create_proper_exercise_file(folder, part, data)
            
            # Write to file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"      ✅ Done: {part}.mdx ({len(data['exercises'])} exercises)")
    
    print("\n✨ All files have been rewritten with correct JSX syntax!")
    print("\n📝 Fixed issues:")
    print("   - Proper ___ (underscores) instead of escaped \\_\\_\\_")
    print("   - Correct JSX component syntax")
    print("   - Proper frontmatter and imports")
    print("   - Detailed explanations in Vietnamese")

if __name__ == "__main__":
    main()
