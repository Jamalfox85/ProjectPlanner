import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function getTitleRecommendations(favoriteTitles = [], description = "") {
  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are an experienced tech entrepreneur giving feedback to aspiring entrepreneurs." },
      { role: "system", content: "You are tasked with providing title recommendations given an app description and other titles the user likes. " },
      { role: "system", content: "You should generate 5 titles and return your response in a json array. Only return this array, don't include an object." },
      { role: "system", content: `Consider the given description: ${description}, and the titles the user already likes : ${favoriteTitles.join(", ")}. Provide more recommendations for titles:` },
      { role: "user", content: `My app description is: ${description}. I like the titles: ${favoriteTitles.join(", ")}. What are some more title recommendations?` },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    max_tokens: 150,
  });
  return response.choices[0].message.content;
}

async function getDescriptionRecommendations(description = {}, currentFeatures = []) {
  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are an experienced tech entrepreneur giving feedback to aspiring entrepreneurs." },
      { role: "system", content: "You are tasked with improving the user's current app description, keeping in mind their current features." },
      { role: "system", content: "You should generate 3 descriptions of varying length (an elevator pitch, a short summary of 1 paragraph, and an extended summary of 3 paragraphs)." },
      { role: "system", content: 'Return your response as a JSON object with the following format: {"elevator_pitch": "description", "short_summary": "description", "extended_summary": "description"}. This object should be the only thing returned in JSON format, without any additional text or formatting.' },
      { role: "user", content: `My elevator pitch app description is: ${description.elevator_pitch}. My short summary app description is: ${description.short_summary}. My extended summary app description is: ${description.extended_summary}. I plan on building the features: ${currentFeatures.join(", ")}. Can you enhance my descriptions?` },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.8,
  });
  return response.choices[0].message.content;
}

async function getFeatureRecommendations(currentFeatures = [], description = "") {
  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are an experienced tech entrepreneur giving feedback to aspiring entrepreneurs." },
      { role: "system", content: "You are tasked with providing features recommendations given an app description and other features the user currently has. " },
      { role: "system", content: 'You should generate 5 features and return your response in the following format: [{"title": title, "description": description}]. Only return this array.' },
      { role: "system", content: `Consider the given description: ${description}, and the features the user already has : ${currentFeatures.join(", ")}. Provide more recommendations for features:` },
      { role: "user", content: `My app description is: ${description}. I plan on building the features: ${currentFeatures.join(", ")}. What are some more feature recommendations?` },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.8,
  });
  return response.choices[0].message.content;
}

async function getSWOTAnalysis(description = "") {
  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are an experienced tech entrepreneur giving feedback to aspiring entrepreneurs." },
      { role: "system", content: "You are tasked with providing a swot analysis given an app description." },
      { role: "system", content: 'You should generate an object with an array key for "strengths", "weaknesses", "opportunities", and "threats". Ideally 2-4 in each category. Only return this object.' },
      { role: "system", content: `Consider the given description: ${description}. Provide a swot analysis:` },
      { role: "user", content: `My app description is: ${description}. What is my swot analysis?` },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.8,
  });
  return response.choices[0].message.content;
}

async function getColorPalette(description = "") {
  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are an experienced tech entrepreneur giving feedback to aspiring entrepreneurs." },
      { role: "system", content: "You are tasked with generating a color palette with 5 colors (hex) based on an app description." },
      { role: "system", content: `Based on the description '${description}', return a color palette as an array of hex codes without any additional text.` },
      { role: "user", content: `My app description is: ${description}. What is a potential color palette? Please return only the array of hex codes.` },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.8,
  });
  return response.choices[0].message.content;
}

export { getTitleRecommendations, getDescriptionRecommendations, getFeatureRecommendations, getSWOTAnalysis, getColorPalette };
