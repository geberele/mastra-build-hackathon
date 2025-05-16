import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { openai } from '@ai-sdk/openai';

const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const LLM_GPT_4O = openai('gpt-4o'); 
export const LLM_GPT_4O_MINI = openai('gpt-4o-mini'); 
export const LLM_BEDROCK = bedrock('anthropic.claude-3-7-sonnet-20250219-v1:0');
