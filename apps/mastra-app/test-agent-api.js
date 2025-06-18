// Test script to send a message to the weather agent API
async function testWeatherAgent() {
  const agentUrl = 'http://localhost:4111/api/agents/weatherAgent/generate';
  
  const requestBody = {
    messages: [
      {
        role: 'user',
        content: 'Hello! Can you tell me about the weather in New York and suggest some activities?'
      }
    ],
    maxSteps: 3 // Allow the agent to use tools
  };

  try {
    console.log('🚀 Sending request to weather agent...');
    console.log('URL:', agentUrl);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(agentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('\n📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

    // Get response text regardless of status
    const responseText = await response.text();
    console.log('\n📄 Raw Response Body:');
    console.log(responseText);

    if (!response.ok) {
      console.log('\n❌ HTTP Error Details:');
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      // Try to parse as JSON to see if it's a structured error
      try {
        const errorData = JSON.parse(responseText);
        console.log('📝 Parsed Error Data:');
        console.log(JSON.stringify(errorData, null, 2));
      } catch (parseError) {
        console.log('📝 Error response is not JSON, raw text above');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = JSON.parse(responseText);
    
    console.log('\n✅ Response received:');
    console.log('Status:', response.status);
    console.log('\n📝 Agent Response:');
    console.log(result.text);
    
    if (result.toolCalls && result.toolCalls.length > 0) {
      console.log('\n🔧 Tool Calls Made:');
      result.toolCalls.forEach((toolCall, index) => {
        console.log(`${index + 1}. Tool: ${toolCall.toolName}`);
        console.log(`   Args: ${JSON.stringify(toolCall.args)}`);
        console.log(`   Result: ${JSON.stringify(toolCall.result, null, 2)}`);
      });
    }
    
    if (result.usage) {
      console.log('\n📊 Token Usage:');
      console.log(`   Prompt tokens: ${result.usage.promptTokens}`);
      console.log(`   Completion tokens: ${result.usage.completionTokens}`);
      console.log(`   Total tokens: ${result.usage.totalTokens}`);
    }

  } catch (error) {
    console.error('\n❌ Error calling agent API:', error.message);
    
    if (error.message.includes('fetch is not defined')) {
      console.log('\n💡 Note: If you get "fetch is not defined", you need Node.js 18+ or install node-fetch');
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Note: Make sure the Mastra dev server is running with: mastra dev');
    }
  }
}

// Simple greeting test with better error handling
async function testSimpleGreeting() {
  const agentUrl = 'http://localhost:4111/api/agents/weatherAgent/generate';
  
  const requestBody = {
    messages: [
      {
        role: 'user',
        content: 'Hello!'
      }
    ]
  };

  try {
    console.log('\n🌟 Testing simple greeting...');
    console.log('Request:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(agentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response Status:', response.status);
    
    // Get response text regardless of status
    const responseText = await response.text();
    console.log('Raw Response:', responseText);

    if (!response.ok) {
      console.log('\n❌ Simple greeting failed with status:', response.status);
      
      // Try to parse error details
      try {
        const errorData = JSON.parse(responseText);
        console.log('Error details:', JSON.stringify(errorData, null, 2));
      } catch (parseError) {
        console.log('Error response is not JSON');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = JSON.parse(responseText);
    
    console.log('✅ Simple greeting response:');
    console.log(result.text);

  } catch (error) {
    console.error('❌ Error with simple greeting:', error.message);
  }
}

// Run the tests
console.log('🧪 Testing Weather Agent API\n');
console.log('Make sure to start the Mastra dev server first: mastra dev\n');

testSimpleGreeting()
  .then(() => testWeatherAgent())
  .catch(console.error); 