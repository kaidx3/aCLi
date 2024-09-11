const apiEndpoint = "https://api.openai.com/v1/chat/completions";

const supportedModels = [
    { id: 1, model: "gpt-4o" },
    { id: 2, model: "gpt-4o-mini" },
    { id: 3, model: "gpt-4-turbo" },
    { id: 4, model: "gpt-3.5-turbo" },
];

const promptOpenAI = async (messages, apiKey, model) => {
    const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            max_tokens: 5000,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        return data.choices[0].message.content.trim();
    } else {
        throw new Error(`Error: ${data.error.message}`);
    }
};

export { promptOpenAI, supportedModels };
