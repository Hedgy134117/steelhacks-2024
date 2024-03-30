window.onload = () => {
    // Only run main when we're looking at a course category (like CS)
    const observer = new MutationObserver(mutations => {
        const doc = document.querySelector("iframe").contentDocument;
        console.log(doc);
        if (doc.querySelector("h2") !== null && doc.querySelector("h2").innerText.startsWith("Choose")) {
            main(doc);
            observer.disconnect();
        }
    })
    observer.observe(document.querySelector("iframe").contentDocument, {
        childList: true,
        subtree: true
    });
}

function main(doc) {
    for (let li of doc.querySelectorAll("li")) {
        li.addEventListener("click", e => inject_click_on_course(e.target));
    }
}

// `target` is whichever class the user clicks on
function inject_click_on_course(target) {
    const courseName = target.querySelector("span").innerText;
    console.log(courseName);
}