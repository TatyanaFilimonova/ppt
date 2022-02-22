const disclaimer = "<p>"+
    "<strong>Внимание</strong>: расчет носит иллюстративный характер, он опирается на <strong>базовый</strong> набор элементов. В "+
    "конкретном проекте набор формируется исходя из потребностей и бюджета.</p>"+
    "<strong>Важно:</strong> не менее 20% от бюджета проекта - это сумма, которую владелец " +
    "аналогичного, но не автоматизированого дома потратит на:"+
    "<ul><li>Клавишные выключатели</li><li>Терморегуляторы</li><li>Многопостовые рамки к электрофурнитуре</li><li>Диммеры</li>"+
    "<li>Пульты управления</li><li>Фрагментированную в управлении автоматику</li></ul>";

function checkBoxChange(checkBoxId, divID) {
    if (document.getElementById(checkBoxId).checked) {
        document.getElementById(divID).hidden = false;
    }
    else {
        document.getElementById(divID).hidden = true;
    }
}


function parseData(formData, formItemName){
    let data = formData.get(formItemName);
    if (data !== null) {
        return parseInt(data);
    }
    return 0;
}

function getCheckBoxData(formData, formItemName){
    if (formData.has(formItemName)) {
        return 1;
    }
    return 0;
}

function validFormData(form, formData) {
    const keys = formData.keys();
    console.log(keys);
    for (const key of keys) {
        if (form[key].type === "number"){
            if (parseInt(form[key].value) > parseInt(form[key].max) || parseInt(form[key].value) < parseInt(form[key].min)) {
                form[key].focus();
                return false;
            }
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
    elementToWrite = document.getElementById(formPrefix+'Disclaimer');
    elementToWrite.innerHTML = disclaimer;
    elementToWrite.style.display='grid';

}



async function  SendData(FormName) {
    const form = document.forms[FormName];
    const formData = new FormData(form);
    let object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    const request_params = {
        method: "POST",
        cache: 'no-cache',
        mode: 'cors',
        headers: {
            'Content-Type': "application/json",
            // 'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(object)
    };
    try {
        const response = await fetch("https://pptapi.herokuapp.com/calc_api/CalculateBudget/", request_params);
        const result = await response.json();
        const resp_status = response.status
        console.log(result)
        console.log(result['Project_cost'])
        writeCostConclusion(result)
        return [resp_status];
    } catch (e) {
        return [400, ""]
    }
}

