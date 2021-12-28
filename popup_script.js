let tabData = []
let sessionData = []
let tags = {}
let _tags = {}

function getCurrentTabs() {
    console.log("getting current tabs")
    tags["get_sessions"] = false 
    tags["add_session"] = true 
    
    chrome.tabs.query({
        currentWindow: true
    }, (tabs) => {
        // chrome.tabs.sendMessage(tabs[0].id, "potato!", {purple: true, ugly: false}, console.log)
        $("#current_tabs").empty()
        tabData = tabs.map(_ => ({title: _.title.replace('💤', ''), url: _.url}))
        tabData.map((_, i) => $(`<div id='link'><input id='link-checkbox' type='checkbox' data='${i}'></input><span id='link-span'>${_.title}</span></div>`).appendTo('#current_tabs'))
        console.log(tabData)
    })    
}

function createSession() {
    console.log("Creating session")
    let tabs = $("input[type='checkbox']").toArray().filter(_ => _.checked).map(_ => tabData[_.attributes.getNamedItem('data').value])
    let name = $("#session-name").val()
	let data = {}
	data[name] = tabs
    if(tabs.length < 1)
	return 
	
    $("#session-name").val('')
	chrome.storage.local.set(data, function() {
		console.log(name + ' is set to ' + tabs);
	})
}

function getSessions() {
	tags["add_session"] = false
	tags["get_sessions"] = true 

	$('#get_sessions').empty()

	chrome.storage.local.get(null).then((_) => {
		sessionData = Object.entries(_)
		console.log(sessionData)
		sessionData.forEach((_, i) => {
			$(`<div id="link_header" data="${i}"><span id="link_header_name">${_[0]}</span><span>📂</span><span>❌</span></div><br>`).appendTo('#get_sessions')
			_[1].forEach(__ => $(`<a href="${__.url}" target="_blank">${__.title}</a><br>`).appendTo('#get_sessions'))
			$('<br>').appendTo('#get_sessions')
		})
	})
}

function removeSession(id) {
	let name = sessionData[id][0]
	if(!confirm("Are you sure you want to delete " + name + " ?"))
	return 
	chrome.storage.local.remove(name).then(getSessions)
}

function openTab(url) {
	chrome.tabs.create({url})
}

async function openSession(id) {
	let name = sessionData[id][0]
	if(!confirm("Are you sure you want to open " + name + " ?"))
		return 
	chrome.windows.create({
		focused: true,
		url: sessionData[id][1].map(_ => _.url)
	}) 
}

function click(e) {
	let parent = e.target?.parentElement
	switch(e.target.innerText) {
		case "❌":
			removeSession(parent.attributes.data.value); 
			break; 
		case "📂":
			openSession(parent.attributes.data.value); 
			break; 
	}
}

$(window).on("load", () => {
    $("[style]").toArray().forEach(e => _tags[e.id] = e.style.display != "none")
    tags = new Proxy(_tags, {
        set: (obj, prop, val) => {
            $("#" + prop).toArray()[0].style.display = val ? "initial" : "none";
            obj[prop] = val; 
        }, 
        get: (obj, prop) => {
            obj[prop] = $("#" + prop).toArray()[0].style.display
            return obj[prop]
        }
    })
    
    $("#get_current_tabs").on("click", getCurrentTabs)
    $("#create_session_dialogue_button").on('click', createSession)
	$("#get_sessions_button").on('click', getSessions)
	$(document).on('click', click)

	getSessions()
})