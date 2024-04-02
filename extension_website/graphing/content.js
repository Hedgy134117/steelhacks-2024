let doc; // the iframe document (where everything happens)

// Only run the script on course catalog category pages (like CS, COE, ARABIC, etc.)
document.querySelector("#main_iframe").addEventListener("load", function () {
    doc = this.contentWindow.document;
    const observer = new MutationObserver(mutations => {
        if (doc.querySelector("h2") !== null && doc.querySelector("h2").innerText.startsWith("Choose")) {
            main(doc);
        }
    })
    observer.observe(doc, {
        childList: true,
        subtree: true
    });
})

function main(doc) {
    // "data-graph" attribute is necessary to avoid adding extra event listeners
    for (let li of doc.querySelectorAll("div[header='Course']:not([data-graph='true'])")) {
        li.setAttribute("data-graph", "true");
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

    // Course already has a graph; don't add a new one
    if (doc.querySelector(`#graph-${courseName.replace(" ", "")}`) !== null) {
        return;
    }

    // there is certainly a better way to do all of this
    let container = target
        .parentElement
        .parentElement
        .parentElement
        .parentElement
        .parentElement

    setTimeout(() => {
        container = container.children[1];
        container = container.children[0].children[0].children[0].children[1].children[0];
        container.innerHTML += generate_reqs_HTML(courseName);
        let graphcontainer = doc.querySelector(`#graph-${courseName.replace(" ", "")}`);
        drawGraph(courseName, graphcontainer);
    }, 1000);
}

function generate_reqs_HTML(courseName) {
    courseName = courseName.replace(" ", "");
    const HTML = `
    <div class="cx-MuiGrid-root cx-MuiGrid-item cx-MuiGrid-grid-xs-12 cx-MuiGrid-grid-md-6" style="display: flex; max-width: 100% !important; flex-basis: 100% !important;">
        <div style="padding: 12px; border-radius: 4px; background: rgb(245, 246, 250); width: 100%;" id="graph-${courseName}">
            <p class="cx-MuiTypography-root cx-MuiTypography-h4">Reqs</p>
        </div>
    </div>`;
    return HTML;
}