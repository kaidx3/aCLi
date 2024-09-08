const wrapText = (text, maxLineLength) => {
    const regex = new RegExp(`(.{1,${maxLineLength}})(\\s|$)`, "g");
    return text.match(regex).join("\n");
};

const exitWithCode = (message, code) => {
    console.log(message);
    process.exit(code);
};

export { wrapText, exitWithCode };
