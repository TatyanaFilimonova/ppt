//const global_url = 'http://127.0.0.1:8000/'
let phoneNumCounter = 1;
const global_url = 'https://pptapi.herokuapp.com/'
//let global_language = 'ru'

const disclaimer = "<p>"+
    "<strong>Внимание</strong>: расчет носит иллюстративный характер, он опирается на <strong>базовый</strong> набор элементов. В "+
    "конкретном проекте набор формируется исходя из потребностей и бюджета.</p>"+
    "<strong>Важно:</strong> не менее 20% от бюджета проекта - это сумма, которую владелец " +
    "аналогичного, но не автоматизированого дома потратит на:"+
    "<ul><li>Клавишные выключатели</li><li>Терморегуляторы</li><li>Многопостовые рамки к электрофурнитуре</li><li>Диммеры</li>"+
    "<li>Пульты управления</li><li>Фрагментированную в управлении автоматику</li></ul>";

function checkBoxChange(checkBoxId, divID) {
    document.getElementById(divID).hidden = !document.getElementById(checkBoxId).checked;
}

function addPhoneInput(){
    phoneNumCounter+=1;
    let elementToAppend = document.getElementById('areaPhones');
    const newInput=document.createElement('input');
    const newInputLabel = document.createElement('div');
    newInput.className = "form__input";
    newInput.type = "text";
    newInput.required = true;
    newInputLabel.innerHTML = "Телефон #" + phoneNumCounter.toString();
    elementToAppend.appendChild(newInput);
    elementToAppend.appendChild(newInputLabel);
    if (phoneNumCounter > 2 ) {
        let buttonAddPhone = document.getElementById('addPhone');
        console.log(buttonAddPhone);
        buttonAddPhone.className = "invisible";
    }
}



function validFormData(formName) {
    const form = document.getElementById(formName);
    const formElements = Array.from(form.elements);
    for (const element of formElements) {
        if (!element.checkValidity()) {
            return false;
        }
    }
    return true;
}


function writeCostConclusion(dataAPI) {

    const projectString = (dataAPI['Project_cost']!==0)? "Разработка проекта: <div>" + Math.ceil(parseFloat(dataAPI['Project_cost'])) +  "</div>" : "";
    const equipmentKnxString = (dataAPI['Equipment_cost_knx']!==0)? "Стоимость оборудования в стандарте KNX: <div>" + Math.ceil(parseFloat(dataAPI['Equipment_cost_knx'])) + "</div>" : "";
    const equipmentLarnitechString = (dataAPI['Equipment_cost_larnitech']!==0)? "Стоимость оборудования в стандарте Larnitech: <div>" + Math.ceil(parseFloat(dataAPI['Equipment_cost_larnitech'])) + "</div>" : "";
    const installKnxString = (dataAPI['Install_cost_knx'])? "Установка и настройка системы KNX: <div>" + Math.ceil(parseFloat(dataAPI['Install_cost_knx'])) + "</div>" : "";
    const installLarnitechString = (dataAPI['Install_cost_larnitech'])? "Установка и настройка системы Larnitech: <div>" + Math.ceil(parseFloat(dataAPI['Install_cost_larnitech'])) + "</div>" : "";
    const totalLarnitechString = (dataAPI['Install_cost_larnitech'])? "<strong>Итого автоматизация в стандарте Larnitech:</strong> <div><strong>"
        + Math.ceil(parseFloat(dataAPI['Install_cost_larnitech']) +parseFloat(dataAPI['Equipment_cost_larnitech'])+
        parseFloat(dataAPI['Project_cost']))+"</strong></div>" : "";
    const totalKnxString = (dataAPI['Install_cost_knx'])? "<strong>Итого автоматизация в стандарте KNX:</strong> <div><strong>"
        + Math.ceil(parseFloat(dataAPI['Install_cost_knx']) +parseFloat(dataAPI['Equipment_cost_knx'])+parseFloat(dataAPI['Project_cost']))+"</strong></div>" : "";
    let elementToWrite = document.getElementById('HouseAmount');
    elementToWrite.innerHTML = ""+
        projectString +
        equipmentKnxString +
        installKnxString +
        totalKnxString+
        "<div></div><div></div>"+
        equipmentLarnitechString+
        installLarnitechString+
        totalLarnitechString;
    elementToWrite.style.display='grid';
    elementToWrite = document.getElementById('HouseDisclaimer');
    elementToWrite.innerHTML = disclaimer;
    elementToWrite.style.display='grid';

}


function writeFormBody(apiData){
    const elementToWrite = document.getElementById('generateFormBody');
    let innerHTML = ''
    apiData.map((direction) => {
        innerHTML += ""+
        "<div class='form__group__checkboxes'>"+"\n"+
            "<input type='checkbox'"+
                   "name = '"+ Object.keys(direction)[0]+"' \n"+
                   " id= '"+ Object.keys(direction)[0]+"' \n"+
                   " onChange = checkBoxChange('"+ Object.keys(direction)[0]+"','"+Object.keys(direction)[0]+"Details')"+"\n"+
            ">"+
                direction[Object.keys(direction)[0]]['name_ru']+"\n"+" </input> </div>"+
            "<div id='"+Object.keys(direction)[0]+"Details' class='form__group noscroll' hidden>"+"\n"
        direction[Object.keys(direction)[0]]['equipment'].map((element) =>{
            innerHTML += ""+
            "<input type='number'"+
                   " name= "+ element['jsname']+"\n"+
                   " class =' form__input' "+"\n"+
                   " min = '0'"+"\n"+
                   " max = '50'"+"\n"+
                   " value= '0'"+"\n"+
            ">"+"\n"+
                element['equipment_name_ru']+" </input>"+"\n"
        })
        innerHTML+=" </div>"
    })
    elementToWrite.innerHTML = innerHTML;

}



async function  SendCalcData(FormName) {
    await makePostRequest(FormName, "calc_api/CalculateBudget/");
}


async function  SendProjectData(FormName) {
    if (!validFormData(FormName)){
        window.alert("Пожалуйста, заполните все поля корректно");
        return 1;
    }
    const result = await makePostRequest(FormName,"calc_api/CreateProject/")
    if (result[0] != 200) {
        console.log(result);
        alert(result[1].result);
    }
    return 0;
}


async function makePostRequest(FormName, url) {
    const form = document.forms[FormName];
    const formData = new FormData(form);
    console.log(formData.keys());
    const request_params = {
        method: "POST",
        cache: 'no-cache',
        mode: 'cors',
        headers: new Headers ({
            'Access-Control-Allow-Headers': 'access-control-allow-header',
        }),
        body: formData
    };
    try {
        const response = await fetch(global_url + url, request_params);
        const result = await response.json();
        const resp_status = response.status;
        writeCostConclusion(result);
        return [resp_status, result];
    } catch (e) {
        window.alert(e);
        return [400, ""]
    }
}


async function  LoadForm() {
    const request_params = {
        method: "GET",
        cache: 'no-cache',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },

    };
    };
    try {
        const response = await fetch(global_url+"calc_api/getformbody/", request_params);
        const result = await response.json();
        const resp_status = response.status;
        writeFormBody(result);
        return [resp_status];
    } catch (e) {
        window.alert(e);
        return [400, ""]
    }
}

function OpenEditorTab() {
    document.querySelector(".toggler__right").click();
    window.open(global_url+'calc_api/editor/', '_blank').focus()
    }
