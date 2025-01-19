
window.onerror = (message, source, lineno, colno, error) => {
    alert(
        "An error has occurred:\n" + message + "\n" + source + ":" + lineno + ":" + colno
        + "\n\nPlease contact the developer."
    );
};