import { VocabularyEntry } from './vocabulary-data';

interface TopicGroup {
  topic: string;
  words: VocabularyEntry[];
}

export async function parseAllB1Topics(): Promise<TopicGroup[]> {
  const results: TopicGroup[] = [];

  // Topic definitions with their file paths
  const topicDefinitions = [
    {
      topicName: "Zeit & Zeitgefühl",
      basePath: "/Users/kietvo/Documents/GitHub/Edu-theme/src/content/vocabulary/B1/2. Zeitpunkt",
      files: [
        "1. Zeitgefühl - gefühlte Zeit.md",
        "2. Wo bleibt die Zeit.md",
        "3. Die Zeitgeschichte.md",
        "4. Nachdenken über Zeit.md"
      ]
    },
    {
      topicName: "Peinliche Situationen & Benehmen",
      basePath: "/Users/kietvo/Documents/GitHub/Edu-theme/src/content/vocabulary/B1/3. Das ist mir aber peinlich",
      files: [
        "1. Hauptwort (peinlich).md",
        "2. Was ist Ihnen (nicht) peinlich..md",
        "3. Was sagt der Knigge..md",
        "4. Knigge International.md",
        "5. Ich muss um sieben Uhr aufstehen..md"
      ]
    },
    {
      topicName: "Prioritäten setzen",
      basePath: "/Users/kietvo/Documents/GitHub/Edu-theme/src/content/vocabulary/B1/4. Priorität 1",
      files: [
        "1. Die erste Priorität.md",
        "2. Gute Wünsche.md",
        "3. Wünsche haben wir alle.md",
        "4. Persönliche Briefe.md"
      ]
    },
    {
      topicName: "Migration & Integration",
      basePath: "/Users/kietvo/Documents/GitHub/Edu-theme/src/content/vocabulary/B1/5. Migration",
      files: [
        "1. Meine Familie.md",
        "2. Migrationsgeschichte.md",
        "3. Arbeitsplätze - Wohnsituation.md",
        "4. Integration.md"
      ]
    },
    {
      topicName: "Alltag & Stress",
      basePath: "/Users/kietvo/Documents/GitHub/Edu-theme/src/content/vocabulary/B1/6. Alltag",
      files: [
        "1. Stress.md",
        "2. Das Leben entschleunigen.md",
        "3. Entspannung.md",
        "4. Wie bekommen wir alles in den Griff.md"
      ]
    },
    {
      topicName: "Europa & Politik",
      basePath: "/Users/kietvo/Documents/GitHub/Edu-theme/src/content/vocabulary/B1/7. Europa",
      files: [
        "1. Wir sind Europa.md",
        "2. Das politische Europa.md",
        "3. Meinungen zu Europa.md",
        "4. Europa entdecken.md"
      ]
    },
    {
      topicName: "Frauen & Männer",
      basePath: "/Users/kietvo/Documents/GitHub/Edu-theme/src/content/vocabulary/B1/8. Frauen & Männer",
      files: [
        "1. Frauen und Männerberufe.md",
        "2. Über Paare sprechen.md",
        "3. Paare lieben.md"
      ]
    },
    {
      topicName: "Prioritäten 2",
      basePath: "/Users/kietvo/Documents/GitHub/Edu-theme/src/content/vocabulary/B1/9. Priorität 2",
      files: [
        "1. Geldleben.md",
        "2. Über Geld sprechen wir nicht.md",
        "3. Alles hat seinen Preis.md"
      ]
    },
    {
      topicName: "Arbeit im Wandel",
      basePath: "/Users/kietvo/Documents/GitHub/Edu-theme/src/content/vocabulary/B1/10. Arbeit im Wandel",
      files: [
        "1. Arbeit früher.md",
        "2. Neue Arbeitsformen.md",
        "3. Arbeitsplatz der Zukunft.md"
      ]
    },
    {
      topicName: "Klima & Umwelt",
      basePath: "/Users/kietvo/Documents/GitHub/Edu-theme/src/content/vocabulary/B1/11. Klima und Unwelt",
      files: [
        "1. Wetter.md",
        "2. Der Un-Klimareport.md",
        "3. Umweltprobleme.md"
      ]
    },
    {
      topicName: "Schule & Lernen",
      basePath: "/Users/kietvo/Documents/GitHub/Edu-theme/src/content/vocabulary/B1/12. Schule und Lernen",
      files: [
        "1. Schulalltag.md",
        "2. Das deutsche Schulszstem.md",
        "3. Meine Schulzeit.md"
      ]
    }
  ];

  // Track processed words to avoid duplicates
  const processedWords = new Set<string>();

  for (const topicDef of topicDefinitions) {
    const topicWords: VocabularyEntry[] = [];

    for (const fileName of topicDef.files) {
      const filePath = `${topicDef.basePath}/${fileName}`;

      try {
        const content = await readFileContent(filePath);
        const parsedWords = parseVocabularyFromContent(content, topicDef.topicName);

        // Add words that haven't been processed yet
        for (const word of parsedWords) {
          const wordKey = word.german.toLowerCase();
          if (!processedWords.has(wordKey)) {
            processedWords.add(wordKey);
            topicWords.push(word);
          }
        }
      } catch (error) {
        console.warn(`Could not read file: ${filePath}`);
        continue;
      }
    }

    if (topicWords.length > 0) {
      results.push({
        topic: topicDef.topicName,
        words: topicWords
      });
    }
  }

  return results;
}

async function readFileContent(filePath: string): Promise<string> {
  // This function would need to be implemented to read file content
  // For now, return empty string - will be replaced with actual file reading
  return '';
}

function parseVocabularyFromContent(content: string, topicName: string): VocabularyEntry[] {
  const result: VocabularyEntry[] = [];

  // Parse table format vocabulary
  const tableMatches = content.match(/\|.*?\|.*?\|.*?\|.*?\|.*?\|/g);
  if (tableMatches) {
    for (const tableMatch of tableMatches) {
      // Skip header rows
      if (tableMatch.includes('Từ vựng') || tableMatch.includes('---')) continue;

      const cells = tableMatch.split('|').map(cell => cell.trim()).filter(cell => cell);
      if (cells.length >= 5) {
        const [german, plural, type, phonetic, vietnamese] = cells;

        // Clean up formatting
        const cleanGerman = german.replace(/\*\*/g, '').trim();
        const cleanPlural = plural.replace(/\*\*/g, '').trim();
        const cleanVietnamese = vietnamese.replace(/\*\*/g, '').trim();
        const cleanPhonetic = phonetic.replace(/[\[\]]/g, '').trim();

        if (cleanGerman && cleanVietnamese && cleanGerman !== 'Từ vựng') {
          // Find example for this word
          const exampleRegex = new RegExp(`\\*\\*${cleanGerman.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\*[\\s\\S]*?-\\s*\\*\\*Ví dụ:\\*\\*\\s+(.*?)\\n[\\s\\S]*?-\\s*\\*\\*Giải nghĩa:\\*\\*\\s+(.*?)(?=\\n\\d+\\.|\\z)`, 'g');
          const exampleMatch = content.match(exampleRegex);

          let exampleGerman = `Das ist ein Beispiel mit ${cleanGerman}.`;
          let exampleVietnamese = `Đây là ví dụ với ${cleanVietnamese}.`;

          if (exampleMatch && exampleMatch[0]) {
            const exampleParts = exampleMatch[0].match(/\*\*Ví dụ:\*\*\s+(.*?)\n[\s\S]*?\*\*Giải nghĩa:\*\*\s+(.*?)(?=\n\d+\.|\z)/);
            if (exampleParts && exampleParts.length >= 3) {
              exampleGerman = exampleParts[1].trim();
              exampleVietnamese = exampleParts[2].trim();
            }
          }

          result.push({
            german: cleanGerman,
            plural: cleanPlural || '',
            phonetic: cleanPhonetic,
            vietnamese: cleanVietnamese,
            exampleGerman,
            exampleVietnamese,
            type: type.includes('noun') ? 'Nomen' : type.includes('verb') ? 'Verb' : 'Andere',
            level: 'B1'
          });
        }
      }
    }
  }

  return result;
}

// Manual processing function for immediate use
export function createB1TopicsManually(): TopicGroup[] {
  return [
    {
      topic: "Zeit & Zeitgefühl",
      words: [
        {
          german: "die Wartezeit",
          plural: "die Wartezeiten",
          phonetic: "/ˈvaʁtəˌʦaɪ̯t/",
          vietnamese: "Thời gian chờ đợi",
          exampleGerman: "Die Wartezeit war sehr lang, aber die Unterhaltung machte es erträglicher.",
          exampleVietnamese: "Thời gian chờ đợi rất lâu, nhưng cuộc trò chuyện đã làm cho nó dễ chịu hơn.",
          type: "Nomen",
          level: "B1"
        },
        {
          german: "das Zeitdokument",
          plural: "die Zeitdokumente",
          phonetic: "/ˈʦaɪ̯tˌdoːkuˌmɛnt/",
          vietnamese: "Tài liệu thời gian",
          exampleGerman: "Das Zeitdokument wurde sorgfältig aufbewahrt, damit zukünftige Generationen es studieren können.",
          exampleVietnamese: "Tài liệu thời gian đã được lưu giữ cẩn thận, để các thế hệ tương lai có thể nghiên cứu nó.",
          type: "Nomen",
          level: "B1"
        },
        {
          german: "der Zeitdruck",
          plural: "",
          phonetic: "/ˈʦaɪ̯tˌdʁʊk/",
          vietnamese: "Áp lực thời gian",
          exampleGerman: "Der Zeitdruck war enorm, weshalb wir die Arbeit schneller abschließen mussten.",
          exampleVietnamese: "Áp lực thời gian rất lớn, vì vậy chúng tôi phải hoàn thành công việc nhanh hơn.",
          type: "Nomen",
          level: "B1"
        },
        {
          german: "das Zeitgefühl",
          plural: "",
          phonetic: "/ˈʦaɪ̯tɡəˌfyːl/",
          vietnamese: "Cảm giác về thời gian",
          exampleGerman: "Das Zeitgefühl ändert sich, wenn man in eine andere Zeitzone reist.",
          exampleVietnamese: "Cảm giác về thời gian thay đổi, khi bạn đi đến một múi giờ khác.",
          type: "Nomen",
          level: "B1"
        },
        {
          german: "merken",
          plural: "",
          phonetic: "/ˈmɛʁkn̩/",
          vietnamese: "Nhận ra, ghi nhớ",
          exampleGerman: "Ich habe es sofort gemerkt, weil der Termin sich geändert hat.",
          exampleVietnamese: "Tôi đã nhận ra ngay lập tức, vì lịch trình đã thay đổi.",
          type: "Verb",
          level: "B1"
        },
        {
          german: "vergehen",
          plural: "",
          phonetic: "/fɛɐ̯ˈɡeːən/",
          vietnamese: "Trôi qua (về thời gian)",
          exampleGerman: "Die Stunden vergehen schnell, wenn man Spaß hat.",
          exampleVietnamese: "Thời gian trôi qua rất nhanh, khi bạn đang vui vẻ.",
          type: "Verb",
          level: "B1"
        }
      ]
    },
    {
      topic: "Peinliche Situationen & Benehmen",
      words: [
        {
          german: "die Verhaltenregel",
          plural: "die Verhaltenregeln",
          phonetic: "/fɛɐ̯ˈhɛltəˌʁeːɡəl/",
          vietnamese: "Quy tắc hành vi",
          exampleGerman: "Die Verhaltenregel ist einfach, weil sie auf Respekt basiert.",
          exampleVietnamese: "Quy tắc hành vi rất đơn giản, vì nó dựa trên sự tôn trọng.",
          type: "Nomen",
          level: "B1"
        },
        {
          german: "das Benehmen",
          plural: "",
          phonetic: "/bəˈneːmən/",
          vietnamese: "Cách cư xử",
          exampleGerman: "Das Benehmen im Büro sollte professionell sein, damit die Zusammenarbeit reibungslos verläuft.",
          exampleVietnamese: "Cách cư xử trong văn phòng nên chuyên nghiệp, để sự hợp tác diễn ra suôn sẻ.",
          type: "Nomen",
          level: "B1"
        },
        {
          german: "der Knigge",
          plural: "",
          phonetic: "/ˈknɪɡə/",
          vietnamese: "Quy tắc ứng xử trong xã hội",
          exampleGerman: "Der Knigge wird oft als Leitfaden für höfliches Verhalten angesehen, obwohl er in verschiedenen Kulturen variieren kann.",
          exampleVietnamese: "Quy tắc ứng xử thường được coi là một hướng dẫn cho hành vi lịch sự, mặc dù nó có thể khác nhau trong các nền văn hóa khác nhau.",
          type: "Nomen",
          level: "B1"
        },
        {
          german: "das Missgeschick",
          plural: "die Missgeschicke",
          phonetic: "/ˈmɪsɡəˌʃɪk/",
          vietnamese: "Sự cố, điều không may",
          exampleGerman: "Das Missgeschick passierte, als ich versuchte, das Büro zu verlassen, ohne meine Tasche mitzunehmen.",
          exampleVietnamese: "Sự cố xảy ra, khi tôi cố gắng rời văn phòng mà không mang theo túi của mình.",
          type: "Nomen",
          level: "B1"
        },
        {
          german: "kommentieren",
          plural: "",
          phonetic: "/kɔmɛnˈtiːʁən/",
          vietnamese: "Bình luận",
          exampleGerman: "Er kommentierte den Artikel, während er den gesamten Text las.",
          exampleVietnamese: "Anh ấy đã bình luận về bài viết, khi anh ấy đọc toàn bộ văn bản.",
          type: "Verb",
          level: "B1"
        }
      ]
    }
  ];
}
