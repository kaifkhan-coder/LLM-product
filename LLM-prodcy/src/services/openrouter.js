// import axios from "axios";

// export async function generateProductContent({
//   title,
//   description,
// }) {
//   try {
//     const prompt = `
// You are an advanced eCommerce AI assistant.

// Priority Rules:
// 1. User input has highest priority.
// 2. Infer missing details intelligently.
// 3. Generate realistic pricing.

// Generate output STRICTLY in JSON format:

// {
//   "title": "",
//   "summary": "",
//   "description": "",
//   "mrp": "",
//   "sellingPrice": "",
//   "features": []
// }

// User Input:
// Title: ${title}
// Description: ${description}
// `;

// const response = await axios.post(
//   "https://openrouter.ai/api/v1/chat/completions",
//   {
//     model: "google/gemma-3-27b-it:free",

//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a professional eCommerce product generation AI."
//       },
//       {
//         role: "user",
//         content: prompt
//       }
//     ],

//     temperature: 0.5,
//   },

//   {
//     headers: {
//       Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,

//       "Content-Type": "application/json",

//       "HTTP-Referer": "http://localhost:5173",

//       "X-Title": "LLM Product Generator"
//     }
//   }
// );

//     const text =
//       response.data.choices[0].message.content;

//     return JSON.parse(text);

//   } catch (error) {
//     console.error(error);

//     throw new Error("LLM generation failed");
//   }
// }

import axios from "axios";

export async function generateProductContent({
  title,
  description,
  image
}) {

const prompt = `
IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do not write explanations.
3. Use Indian Rupees (₹).
4. Generate realistic Indian ecommerce pricing.
5. Generate detailed product information.
6. Features must contain name + description.

Generate professional ecommerce product data.

User Product Title:
${title}

User Description:
${description}

Generate ecommerce product data.

Return ONLY valid JSON.

{
  "title":"",
  "summary":"",
  "description":"",
  "category":"",
  "subcategory":"",
  "brandSuggestion":"",
  "mrp":"",
  "sellingPrice":"",
  "discountPercentage":"",
  "rating":"",
  "stockStatus":"",
  "targetAudience":"",
  "keywords":[],
  "keyHighlights":[],
  "features":[
    {
      "name":"",
      "description":""
    }
  ],
  "specifications":{},
  "seoTitle":"",
  "seoDescription":"",
  "amazonBulletPoints":[],
  "flipkartHighlights":[],
  "careInstructions":"",
  "warranty":""
}

Rules:
- Prices must be in Indian Rupees ₹
- Estimate realistic Indian market pricing
- Infer category from image/title/description
- Generate 5-10 features
- Generate SEO content 
}
`;

  try {

    console.log(import.meta.env.VITE_OPENROUTER_API_KEY);

    const response = await axios.post(

      "https://openrouter.ai/api/v1/chat/completions",

      {
        // model: "google/gemma-3-27b-it:free",
        model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        // model: "meta-llama/llama-3.1-8b-instruct",

messages: [
  {
    role: "system",
    content:
      "You are an advanced ecommerce AI assistant."
  },

  {
    role: "user",
    content: [
      {
        type: "text",
        text: prompt
      },

      ...(image
        ? [
            {
              type: "image_url",
              image_url: {
                url: image
              }
            }
          ]
        : [])
    ]
  }
],
        temperature: 0.7
      },

      {
        headers: {

          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,

          "Content-Type": "application/json",

          "HTTP-Referer": "http://localhost:5173",

          "X-Title": "LLM Product Generator"
        }
      }
    );

    console.log(response.data);

const text =
  response.data.choices[0].message.content;

console.log("RAW RESPONSE:", text);

// Extract JSON from response
const jsonMatch = text.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error("No valid JSON found");
}

const parsedData = JSON.parse(jsonMatch[0]);

return parsedData;

} catch (error) {

  console.log("FULL ERROR:");
  console.log(error.response?.data, null, 2);

  throw error;
}
}