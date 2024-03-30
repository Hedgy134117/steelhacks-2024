window.onload = () => {
    // Only run main when we're looking at a course category (like CS)
    const observer = new MutationObserver(mutations => {
        const doc = document.querySelector("iframe").contentDocument;
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
    for (let li of doc.querySelectorAll("div[header='Course']")) {
        li.addEventListener("click", e => inject_click_on_course(e.target));
    }
}

// `target` is whichever class the user clicks on
function inject_click_on_course(target) {
    let courseName;
    try {
        courseName = target.querySelector("span").innerText;
    } catch ({ name, message }) {
        if (name === "TypeError") {
            return;
        } else {
            console.error({ name, message });
        }
    }

    console.log(target);
    let container = target
        .parentElement
        .parentElement
        .parentElement
        .parentElement
        .parentElement

    const observer = new MutationObserver(mutations => {
        if (container.children.length > 1) {
            setTimeout(() => {
                container = container.children[1];
                container = container.children[0].children[0].children[0].children[1].children[0];
                console.log(container);
                container.innerHTML += generate_reqs_HTML(courseName);
                let graphcontainer = document.querySelector("iframe").contentDocument.querySelector(`#graph-${courseName.replace(" ", "")}`);
                drawGraph(courseName, graphcontainer);
                return
            }, 500);
            observer.disconnect();
        }
    });
    observer.observe(container, {
        childList: true,
        subtree: true
    });
}

function generate_reqs_HTML(courseName) {
    courseName = courseName.replace(" ", "");
    const HTML = `
    <div class="cx-MuiGrid-root cx-MuiGrid-item cx-MuiGrid-grid-xs-12 cx-MuiGrid-grid-md-6" style="display: flex;">
        <div style="padding: 12px; border-radius: 4px; background: rgb(245, 246, 250); width: 100%;" id="graph-${courseName}">
            <p class="cx-MuiTypography-root cx-MuiTypography-h4">Reqs</p>
        </div>
    </div>`;
    return HTML;
}