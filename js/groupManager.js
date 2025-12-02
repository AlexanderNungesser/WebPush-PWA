const REFRESH_INTERVAL = 30000;

const group_id  = tryGetGroupID();

const URL_TO_FETCH = `${window.location.origin}/SmartDataAirquality/smartdata/records/view_groups?storage=gamification&filter=group_id,eq,${group_id}`;

window.addEventListener("group_changed", () => {
    loadData();
});

function tryGetGroupID(){
    const id = localStorage.getItem("user_group_id");
    if(!id){
        window.location.assign(`${window.location.origin}/WebPush-PWA/index.html`);
    }
    return id;
}

let groupData = null;
async function loadData() {
    try {
        const response = await fetch(URL_TO_FETCH);
        if (!response.ok) throw new Error("Could not fetch data");
        const newData = await response.json().then(data => data.records[0])
        if (JSON.stringify(newData) !== JSON.stringify(groupData)) {
            groupData = newData;
            window.dispatchEvent(new Event("group_reload"));
        }

    } catch (err) {
        console.error("Error reloading group data:", err);
    }
}

setInterval(loadData, REFRESH_INTERVAL);

loadData()
