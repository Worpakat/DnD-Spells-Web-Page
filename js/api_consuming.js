async function getResponseFromAPI(source) {

    const response = await fetch(source);

    if (response.status != 200) {
        throw new Error("An error occurred, data could not be received!")
    }

    return await response.json();
}


// End Points 
const ROOT_END_POINT = "https://www.dnd5eapi.co";
const SPELLS_EP = "/api/spells";

//Spell List API Consumig and Passing to HTML
import {spellsTrie} from "./trie_and_search_bar.js";
const spellLinksList = document.getElementById('linkList'); //Sidebar spell links' list.

function passSpellsToUI() {

    getResponseFromAPI(ROOT_END_POINT + SPELLS_EP)
        .then((response_data) => {
            const spells = response_data["results"];

            for (let spell of spells) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                const searchKey = spell["index"].replace(/-/g, '');
                a.href = '#';
                a.textContent = spell["name"];
                li.appendChild(a);
                spellLinksList.appendChild(li);(/blue/g, "red");
                a.dataset.url = ROOT_END_POINT + spell["url"];
                a.dataset.searchKey = searchKey;
                
                spellsTrie.insert(searchKey, a);
                
            }

            // console.log(spellSearchKeys);
        })
        .catch(error => {
            console.error("An error occurred:", error.message);
        });

}

passSpellsToUI();

/*_________CONSUMING SPELL'S INFO ADN PASSING TO UI________*/
//_________Helper Methods________//

const getAdjustedLevel = (level) => {

    let adjustedLvl = null;

    switch (parseInt(level)) {
        case 0:
            adjustedLvl = "Cantrip";
            break;
        case 1:
            adjustedLvl = "1st";
            break;
        case 2:
            adjustedLvl = "2nd";
            break;
        case 3:
            adjustedLvl = "3rd";
            break;
        case 4:
            adjustedLvl = "4th";
            break;
        case 5:
            adjustedLvl = "5th";
            break;
        case 6:
            adjustedLvl = "6th";
            break;
        case 7:
            adjustedLvl = "7th";
            break;
        case 8:
            adjustedLvl = "8th";
            break;
        case 9:
            adjustedLvl = "9th";
            break;
    }

    return adjustedLvl;
}
const getAdjustedCastingTime = (casting_time, ritual) => {
    let img = null;

    if (ritual){ //if spell is a ritual spell
        img = document.createElement('img');
        img.src = "./images/ritual.svg";
        img.alt="ritual";
    }
    else {img = false;}
    casting_time = casting_time + " ";

    console.log(img);

    return [casting_time, img];
}
const getAdjustedRangeArea = (range, areaOfEffect) => {
    
    let adjustedRange = "";
    
    if (range != undefined) {
        if (range == "Touch" || range == "Self") { adjustedRange = range; }
        else { adjustedRange = range.split(" ")[0] + "ft"; }
    }
    else { adjustedRange = ""; }

    const adjustedArea = areaOfEffect != undefined ? '(' + areaOfEffect["size"] + "ft " + areaOfEffect["type"] + ')' : "";

    return adjustedRange + " " + adjustedArea;
}
const getAdjustedComponents = (components) => {
    let adjusted = components.join(", ");
    
    if (components[components.length - 1] == 'M') adjusted += '*';

    return adjusted;
}
const getAdjustedDuration = (duration, concentration) => {
    let img = null;

    if (concentration){ //if spell is a concentration spell
        img = document.createElement('img');
        img.src = "./images/concentration.svg";
        img.alt="concentration";
    }
    else {img = false;}
    duration = " " + duration;

    return [duration, img];
}
const getAdjustedAttackSave = (attackType, dc) => {
    let atk = "";
    if (attackType != undefined) atk = attackType.charAt(0).toUpperCase() + attackType.slice(1);

    let _dc = "";
    if (dc != undefined) _dc = dc["dc_type"]["name"] + " Save";


    const combined = atk + _dc;
    if (combined == "") return "None";
    else return combined;
}
const getAdjustedDMGType = (damage) => {
    if (damage != undefined) return damage["damage_type"]["name"];
    else return "None";
}

//UI Elements
const sideBarCloseBtn = document.getElementById("closeMenuBtn");
const spellName = document.getElementById("spellName");
const stats = document.getElementsByClassName("stat-cell");
const spellDesc = document.getElementById("spellDesc");

const schoolSymbol = document.getElementById("schoolSymbol");
const SCHOOL_SYMBOLS_ROOT ="images/School_Symbols/"

//Main UI Passing Methods
function passStatsToUI(spellObj) {    
    const statsData = [
        getAdjustedLevel(spellObj["level"]),
        getAdjustedCastingTime(spellObj["casting_time"], spellObj["ritual"]),
        getAdjustedRangeArea(spellObj["range"], spellObj["area_of_effect"]),
        getAdjustedComponents(spellObj["components"]),
        getAdjustedDuration(spellObj["duration"], spellObj["concentration"]),
        spellObj["school"]["name"],
        getAdjustedAttackSave(spellObj["attack_type"], spellObj["dc"]),
        getAdjustedDMGType(spellObj["damage"])
    ]

    for (let i = 0; i < 8; i++){
        if (i == 1) { //Casting Time / Ritual handling
            stats[i].children[1].innerHTML = "";
            stats[i].children[1].append(statsData[i][0]);
            if (statsData[i][1]) stats[i].children[1].append(statsData[i][1]); //Ritual icon
            continue;
        }

        if (i == 4) { //duration/concentration handling
            stats[i].children[1].innerHTML = "";
            if (statsData[i][1]) stats[i].children[1].append(statsData[i][1]); //Concentration icon
            stats[i].children[1].append(statsData[i][0]);
            continue;
        }
        
        stats[i].children[1].textContent = statsData[i];
    }

}

function passDescriptionToUI(spellObj) {
    spellDesc.innerText = spellObj["desc"].join("\n") + "\n\n" 

    //Higher Levels Handling
    if (spellObj["higher_level"].length > 0){ 
        const higherHeading = document.createElement('span')
        higherHeading.innerText = "Higher Levels: ";
        higherHeading.style.fontWeight = "bold";
        spellDesc.append(higherHeading);

        const higherDesc = document.createElement('span')
        higherDesc.innerText = spellObj["higher_level"].join("\n") + "\n\n";
        spellDesc.append(higherDesc);
    }

    // Materials Handling
    if (spellObj["material"] != undefined){ 
        const materialHeading = document.createElement('span')
        materialHeading.innerText = "Materials: ";
        materialHeading.style.fontWeight = "bold";
        spellDesc.append(materialHeading);

        const materialDesc = document.createElement('span')
        materialDesc.innerText = spellObj["material"];
        spellDesc.append(materialDesc);
    }

}

function updateSchoolSymbolIMG(school) {
    schoolSymbol.src = SCHOOL_SYMBOLS_ROOT + school + ".png";
}

spellLinksList.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() !== 'a') return; //Checked if clicked is an 'a' tag.

    getResponseFromAPI(event.target.dataset.url)
        .then((spellObj) => {
            spellName.innerText = spellObj["name"];
            passStatsToUI(spellObj);
            passDescriptionToUI(spellObj);
            updateSchoolSymbolIMG(spellObj["school"]["index"]);
            
            console.log(spellObj);
            
            if (window.getComputedStyle(sideBarCloseBtn).display == 'inline') sideBarCloseBtn.click();
        })
        .catch(error => {
            console.error("An error occurred:", error.message);
        });
});



