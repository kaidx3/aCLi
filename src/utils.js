const wrapText = (text, maxLineLength) => {
    const regex = new RegExp(`(.{1,${maxLineLength}})(\\s|$)`, "g");
    return text.match(regex).join("\n");
};

const exitWithCode = (message, code) => {
    console.log(message);
    process.exit(code);
};

function trimArrayToLength(arr, desiredLength) {
    if (desiredLength < 0) {
        desiredLength = 0;
    }

    while (arr.length > desiredLength) {
        arr.shift();
    }

    return arr;
}

export { wrapText, exitWithCode, trimArrayToLength };
