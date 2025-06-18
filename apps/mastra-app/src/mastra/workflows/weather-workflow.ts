import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { weatherAgent } from '../agents/weather-agent.js';

// Single step: Use the agent to get weather and plan activities
const planWeatherActivities = createStep({
  id: 'plan-weather-activities',
  description: 'Gets weather information and suggests activities using AI agent with weather tool',
  inputSchema: z.object({
    city: z.string().describe('The city to plan activities for'),
  }),
  outputSchema: z.object({
    activities: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    // Create prompt for the agent
    const prompt = `Please provide detailed activity recommendations for ${inputData.city}. 
    Use the weather tool to get current weather information and then suggest appropriate activities 
    following your structured format. Consider the current weather conditions when making recommendations.`;

    // Use the agent to generate recommendations (agent will use weatherTool automatically)
    const response = await weatherAgent.stream([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    let activitiesText = '';

    // Process agent response
    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      activitiesText += chunk;
    }

    return {
      activities: activitiesText,
    };
  },
});

// Simplified workflow with just one step
const weatherWorkflow = createWorkflow({
  id: 'weather-workflow',
  description: 'Gets weather and suggests activities for a city using an AI agent',
  inputSchema: z.object({
    city: z.string().describe('The city to get weather for'),
  }),
  outputSchema: z.object({
    activities: z.string(),
  }),
})
  .then(planWeatherActivities);

weatherWorkflow.commit();

export { weatherWorkflow };
