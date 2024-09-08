import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modulePath = path.join(__dirname, "..");
const openAIKeyJsonPath = path.join(modulePath, "openAIKey.json");
const modelJsonPath = path.join(modulePath, "model.json");

const checkForOpenAIKeyJson = async () => {
    try {
        await fs.promises.access(openAIKeyJsonPath);
        return true;
    } catch (err) {
        return false;
    }
};

const checkForModelJson = async () => {
    try {
        await fs.promises.access(modelJsonPath);
        return true;
    } catch (err) {
        return false;
    }
};

const createOpenAIKeyJson = async (key) => {
    try {
        await fs.promises.writeFile(openAIKeyJsonPath, JSON.stringify({ key }));
    } catch (err) {
        throw new Error("An error occurred while saving the OpenAI key.");
    }
};

const createModelJson = async (model) => {
    try {
        await fs.promises.writeFile(modelJsonPath, JSON.stringify({ model }));
    } catch (err) {
        throw new Error("An error occurred while saving the model.");
    }
};

const getOpenAIKeyFromJson = async () => {
    try {
        if (!(await checkForOpenAIKeyJson())) {
            throw new Error("OpenAI key not found.");
        }
        const openAIKeyJson = await fs.promises.readFile(openAIKeyJsonPath, "utf8");
        const openAIKey = JSON.parse(openAIKeyJson);
        return openAIKey.key;
    } catch (err) {
        throw new Error("An error occurred while reading the OpenAI key.");
    }
};

const getModelFromJson = async () => {
    try {
        if (!(await checkForModelJson())) {
            throw new Error("Model not found.");
        }
        const modelJson = await fs.promises.readFile(modelJsonPath, "utf8");
        const model = JSON.parse(modelJson);
        return model.model;
    } catch (err) {
        throw new Error("An error occurred while reading the model.");
    }
};

export {
    checkForOpenAIKeyJson,
    createOpenAIKeyJson,
    getOpenAIKeyFromJson,
    checkForModelJson,
    createModelJson,
    getModelFromJson,
};
