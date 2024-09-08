#!/usr/bin/env node
import { styledText } from "clstyles";
import { promptUser } from "clprompt";
import colors from "clcolors";
import {
    checkForContextLengthJson,
    checkForModelJson,
    checkForOpenAIKeyJson,
    createContextLengthJson,
    createModelJson,
    createOpenAIKeyJson,
    getContextLengthFromJson,
    getModelFromJson,
    getOpenAIKeyFromJson,
} from "./fileService.js";
import { promptOpenAI, supportedModels } from "./openAIService.js";
import { exitWithCode, trimArrayToLength, wrapText } from "./utils.js";

const args = process.argv.slice(2);
const userTag = styledText("User: ", colors.green, true);
const aiTag = styledText("AI: ", colors.red, true);
const systemTag = styledText("System: ", colors.yellow, true);
let messages = [{ role: "system", content: "You are a helpful assistant." }];

const helpMessage =
    "Usage: cmdlai [command]\n\n" +
    "Available commands:\n" +
    "  chat             - Start a conversation with the AI assistant. This command will enter an interactive chat session.\n" +
    "  setApiKey        - Set your OpenAI API key. This will prompt you to enter and save your OpenAI API key for future requests.\n" +
    "  setModel         - Set the OpenAI model to use for your requests. You will be shown a list of supported models to choose from.\n" +
    "  setContextLength - Set the context length for conversations. This will determine how many messages the AI assistant will remember.\n" +
    "  help             - Show this help message.\n\n";

const setOpenAIKey = async () => {
    console.log(systemTag + "Please enter your OpenAI key:");
    const openAIKey = await promptUser(userTag);
    try {
        await createOpenAIKeyJson(openAIKey);
        console.log(systemTag + "OpenAI key saved successfully.");
    } catch (err) {
        throw new Error(err.message);
    }
};

const getOpenAIKey = async () => {
    let openAIKey = "";

    let jsonExists = await checkForOpenAIKeyJson();

    if (jsonExists) {
        try {
            openAIKey = await getOpenAIKeyFromJson();
        } catch (err) {
            throw new Error(err.message);
        }
    }

    if (!jsonExists || openAIKey == "") {
        try {
            await setOpenAIKey();
            openAIKey = await getOpenAIKeyFromJson();
        } catch (err) {
            throw new Error(err.message);
        }
    }

    return openAIKey;
};

const setModel = async () => {
    let isValidSelection = false;

    console.table(supportedModels);
    console.log(systemTag + "Please enter the ID of the model you want to use:");

    do {
        const modelId = await promptUser(userTag);

        const selectedModel = supportedModels.find((model) => model.id == modelId);

        if (selectedModel) {
            console.log(systemTag + `Selected model: ${selectedModel.model}`);
            isValidSelection = true;
        } else {
            console.log(systemTag + "Invalid model ID. Please try again.");
        }

        try {
            await createModelJson(selectedModel.model);
            console.log(systemTag + "Model saved successfully.");
        } catch (err) {
            throw new Error(err.message);
        }
    } while (!isValidSelection);
};

const getModel = async () => {
    let model = "";

    let jsonExists = await checkForModelJson();

    if (jsonExists) {
        try {
            model = await getModelFromJson();
        } catch (err) {
            throw new Error(err.message);
        }
    }

    if (!jsonExists || model == "") {
        try {
            await setModel();
            model = await getModelFromJson();
        } catch (err) {
            throw new Error(err.message);
        }
    }

    return model;
};

const setContextLength = async () => {
    console.log(systemTag + "Please enter the context length for conversations:");
    const contextLength = await promptUser(userTag);

    try {
        await createContextLengthJson(contextLength);
        console.log(systemTag + "Context length saved successfully.");
    } catch (err) {
        throw new Error(err.message);
    }
};

const getContextLength = async () => {
    let contextLength = 30;
    let jsonExists = await checkForContextLengthJson();

    if (jsonExists) {
        try {
            let tempContextLength = await getContextLengthFromJson();
            if (!isNaN(parseFloat(tempContextLength?.toString() ?? ""))) {
                contextLength = tempContextLength;
            }
        } catch (err) {}
    }

    return contextLength;
};

const chat = async () => {
    try {
        let openAIKey = await getOpenAIKey();
        let model = await getModel();
        let contextLength = await getContextLength();

        console.log(styledText("Model: " + model, colors.yellow, true));
        console.log(styledText("Context: " + contextLength + " messages", colors.yellow, true));
        console.log(aiTag + "Hello! I am an AI assistant. How can I help you?");

        while (true) {
            messages = trimArrayToLength(messages, contextLength);
            const input = await promptUser(userTag);
            messages.push({ role: "user", content: input });
            const response = await promptOpenAI(messages, openAIKey, model);
            messages.push({ role: "assistant", content: response });
            console.log(aiTag + wrapText(response, 80));
        }
    } catch (err) {
        throw new Error(err.message);
    }
};

(async () => {
    try {
        switch (args[0]) {
            case "setApiKey":
                await setOpenAIKey();
                break;
            case "setModel":
                await setModel();
                break;
            case "setContextLength":
                await setContextLength();
                break;
            case "chat":
                await chat();
                break;
            case "help":
                console.log(helpMessage);
                break;
            default:
                console.log(
                    systemTag + "Please provide a valid command: chat, setApiKey, setModel, setContextLength, or help."
                );
                break;
        }

        exitWithCode("", 0);
    } catch (err) {
        exitWithCode(styledText(err.message, colors.red), 1);
    }
})();
