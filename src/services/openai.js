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
      { role: "system", content: "You should generate 3 descriptions of varying length (an elevator pitch, a short summary of 3-4 sentences, and an extended summary of 2 paragraphs) and return your response in the following format: {elevator_pitch: description, short_summary: description, extended_summary: description}. This object shoudl be the only thing returned in json format." },
      { role: "system", content: `Consider the given descriptions: Elevator Pitch - ${description.elevator_pitch}, Short Summary - ${description.short_summary}, and Extended Summary - ${description.extended_summary}. Provide enhanced alternatives for each.` },
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
      { role: "system", content: "You should generate 5 features and return your response in the following format: [{title: title, description: description}]. Only return this array." },
      { role: "system", content: `Consider the given description: ${description}, and the features the user already has : ${currentFeatures.join(", ")}. Provide more recommendations for features:` },
      { role: "user", content: `My app description is: ${description}. I plan on building the features: ${currentFeatures.join(", ")}. What are some more feature recommendations?` },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.8,
  });
  return response.choices[0].message.content;
}

export { getTitleRecommendations, getDescriptionRecommendations, getFeatureRecommendations };
