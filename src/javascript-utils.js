
function cooLog(object) {
    const str = JSON.stringify(object, null, 4);
    console.log(str);
}

export { cooLog }