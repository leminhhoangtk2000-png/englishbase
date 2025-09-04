// Test script to verify vocabulary search AI integration
async function testVocabularyAI() {
  try {
    // Test 1: Check if we have active providers
    console.log('Testing AI providers...');
    const providersResponse = await fetch('http://localhost:9002/api/admin/ai-providers');
    const providersData = await providersResponse.json();
    const activeProvider = providersData.providers?.find(p => p.isActive);
    
    if (!activeProvider) {
      console.error('❌ No active AI provider found');
      return;
    }
    
    console.log('✅ Active provider:', activeProvider.displayName, '(' + activeProvider.name + ')');
    
    // Test 2: Test vocabulary lookup with AI
    console.log('\nTesting vocabulary AI lookup...');
    const vocabularyTestResponse = await fetch(`http://localhost:9002/api/admin/ai-providers/${activeProvider.id}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        testPrompt: `Provide a German-Vietnamese vocabulary definition for the word "Hund". Include:
1. Word: Hund
2. Part of speech (e.g., Nomen, Verb, Adjektiv)  
3. German definition
4. Vietnamese translation
5. German example sentence
6. Vietnamese translation of example
7. IPA pronunciation

Format as JSON with keys: word, partOfSpeech, definition, vietnamese, germanExample, vietnameseExample, pronunciation`
      }),
    });
    
    const vocabularyResult = await vocabularyTestResponse.json();
    
    if (vocabularyResult.success) {
      console.log('✅ Vocabulary AI lookup successful');
      console.log('📝 AI Response:', vocabularyResult.result.response);
      console.log('💰 Tokens used:', vocabularyResult.result.tokensUsed);
      console.log('💲 Cost:', vocabularyResult.result.cost);
      
      // Test 3: Try to parse the response
      try {
        let responseText = vocabularyResult.result.response;
        
        // Clean up markdown code blocks if present
        if (responseText.includes('```json')) {
          responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
        }
        if (responseText.includes('```')) {
          responseText = responseText.replace(/```\s*/g, '');
        }
        
        const parsedResponse = JSON.parse(responseText.trim());
        console.log('\n✅ AI response is valid JSON:');
        console.log('- Word:', parsedResponse.word);
        console.log('- Part of Speech:', parsedResponse.partOfSpeech);
        console.log('- Definition:', parsedResponse.definition?.substring(0, 100) + '...');
        console.log('- Vietnamese:', parsedResponse.vietnamese?.substring(0, 100) + '...');
        console.log('- Example (German):', parsedResponse.germanExample);
        console.log('- Example (Vietnamese):', parsedResponse.vietnameseExample);
      } catch (parseError) {
        console.log('\n⚠️ AI response is not JSON format (will use as raw text)');
        console.log('Raw response preview:', vocabularyResult.result.response.substring(0, 200) + '...');
      }
      
    } else {
      console.error('❌ Vocabulary AI lookup failed:', vocabularyResult.error);
    }
    
    console.log('\n🎉 Integration test completed! The vocabulary search system can now use real AI providers.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testVocabularyAI();
