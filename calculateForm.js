const disclaimer = "<p>"+
    "<strong>Внимание</strong>: расчет носит иллюстративный характер: он опирается на <strong>базовый</strong> набор элементов. В "+
    "конкретном проекте набор формируется исходя из потребностей и бюджета.</p>"+
    "<strong>Важно:</strong> не менее 20% от бюджета проекта - это сумма, которую владелец " +
    "аналогичного, но не автоматизированого дома потратит на:"+
    "<ul><li>Клавишные выключатели</li><li>Терморегуляторы</li><li>Многопостовые рамки к электрофурнитуре</li><li>Диммеры</li>"+
    "<li>Пульты управления</li><li>Фрагментированную в управлении автоматику</li></ul>";

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

function clickCalculateButton(formPrefix) {

    const form = document.forms[formPrefix+'Form'];
    const formData = new FormData(form);
    if (!validFormData(form, formData)) {
        window.alert("Ошибка при вводе данных. Внесите корректную информацию в поля, выделенные красным");
        return 1;
    }

    const floorNumber = parseData(formData, formPrefix+'FloorNumber');
    const square = parseData(formData, formPrefix+'Square');
    const ceilHeight = parseData(formData, formPrefix+'CeilHeight');
    const bathroomNumber = parseData(formData, formPrefix+'BathroomNumber');
    const roomNumber = parseData(formData, formPrefix+'RoomNumber');
    const spacesNumber = parseData(formData, formPrefix+'SpacesNumber');
    const groundSquare = parseData(formData, formPrefix+'GroundSquare');
    const parking = getCheckBoxData(formData, formPrefix+'Parking');

    const taskListProject = getCheckBoxData(formData, formPrefix+'TaskListProject');
    const taskListWiring = getCheckBoxData(formData, formPrefix+'TaskListWiring');
    const taskListInstall = getCheckBoxData(formData, formPrefix+'TaskListInstall');
    const taskListService = getCheckBoxData(formData, formPrefix+'TaskListService');

    const compIndoorLight = getCheckBoxData(formData, formPrefix+'ComponentsIndoorLight');
    const compOutdoorLight = getCheckBoxData(formData, formPrefix+'ComponentsOutdoorLight');
    const compGates = getCheckBoxData(formData, formPrefix+'ComponentsGates');
    const compClimat = getCheckBoxData(formData, formPrefix+'ComponentsClimat');
    const compVentilation = getCheckBoxData(formData, formPrefix+'ComponentVentilation');
    const compCurtains = getCheckBoxData(formData, formPrefix+'ComponentsCurtains');
    const compPipes = getCheckBoxData(formData, formPrefix+'ComponentsPipes');
    const compIPtelecom = getCheckBoxData(formData, formPrefix+'ComponentsIPtelecom');
    const compIrrigation = getCheckBoxData(formData, formPrefix+'ComponentsIrrigation');
    const compMultimedia = getCheckBoxData(formData, formPrefix+'ComponentsMultimedia');
    const compVideo = getCheckBoxData(formData, formPrefix+'ComponentsVideo');
    const compGuard = getCheckBoxData(formData, formPrefix+'ComponentsGuard');
    const compResource = getCheckBoxData(formData, formPrefix+'ComponentsGuard');

    const  componentSet =  {
        leaksSensor: {quantity: bathroomNumber+2, priceMin: 10, priceMax: 15, demand: compPipes, installCost: 5},
        switchPanel: {quantity: bathroomNumber+roomNumber*2+parking+spacesNumber, priceMin: 150, priceMax: 300, demand: compIndoorLight, installCost: 10},
        dimmer:      {quantity: Math.ceil(roomNumber/2), priceMin: 290, priceMax: 500, demand: compIndoorLight, installCost: 5},
        lightActuator: {quantity: Math.ceil((bathroomNumber*2+roomNumber*2+spacesNumber+parking+Math.ceil(groundSquare/200))/6), priceMin: 200, priceMax:300, demand: compIndoorLight, installCost: 5 },
        socketActuator: {quantity: Math.ceil((bathroomNumber*2+roomNumber*3+spacesNumber+parking*2+Math.ceil(groundSquare/200))/6), priceMin: 200, priceMax: 300, demand: compIndoorLight, installCost: 5},
        heatFloorActuator:   {quantity: Math.ceil((bathroomNumber+2)/4), priceMin: 150, priceMax: 250, demand: compClimat, installCost: 5},
        airSensor:   {quantity: (roomNumber+bathroomNumber+1), priceMin: 150, priceMax: 200, demand: compClimat, installCost: 5},
        climaBridge:   {quantity: (roomNumber+1), priceMin: 300, priceMax: 1000, demand: compClimat, installCost: 10},
        servoDrive:  {quantity: bathroomNumber+Math.ceil(groundSquare/200)*compIrrigation, priceMin: 50, priceMax: 150, demand: compPipes, installCost: 10},
        gateControl: {quantity: parking+3, priceMin: 100, priceMax: 200, demand: compGates, installCost: 15},
        mainControl: {quantity: 1, priceMin: 500, priceMax: 1000, demand: 0, installCost: 100},
        irrigator:   {quantity: Math.ceil((groundSquare-square)/200), priceMin: 100, priceMax: 300, demand: compIrrigation, installCost: 15},
        ipPanel:     {quantity: parking+1+floorNumber-1, priceMin: 150, priceMax: 300, demand: compIPtelecom, installCost: 15},
        ipCam:       {quantity: parking+6, priceMin: 100, priceMax: 300, demand: compVideo, installCost: 15},
        heatControl: {quantity: Math.ceil((bathroomNumber+roomNumber+1+spacesNumber+parking)/6), priceMin: 400, priceMax: 600, demand: compClimat, installCost: 20},
        ipStorage:   {quantity: 1, priceMin: 150, priceMax: 500, demand: compVideo, installCost: 15},
        curtain:     {quantity: Math.ceil((roomNumber+1)*2/6), priceMin: 150, priceMax: 50, demand: compCurtains, installCost: 10},
        resourceCounter: {quantity: 1, priceMin: 330, priceMax: 500, demand: compResource, installCost: 20},
        wires:       {quantity: Math.ceil(square*12*(1+(2.7+ceilHeight-3)/2.7*0.4)), priceMin: 0.8, priceMax: 1.2, demand: taskListWiring, installCost: 0},
        twistedPair: {quantity: Math.ceil(square*5*(1+(2.7+ceilHeight-3)/2.7*0.4)), priceMin: 0.6, priceMax: 1, demand: taskListWiring, installCost: 0}
    }

    console.log(componentSet);
    const costs = getMaterialCost(componentSet);
    const wires_cost  = componentSet.wires.quantity*componentSet.wires.priceMin*componentSet.wires.demand +
        componentSet.twistedPair.quantity*componentSet.twistedPair.priceMin*componentSet.twistedPair.demand;

    const projectCost = {
        materialCost: costs[0] - wires_cost,
        wires_cost: wires_cost,
        projectDevCost: 400*taskListProject,
        electricDevCost: (componentSet.wires.quantity+componentSet.twistedPair.quantity)*1*taskListWiring,
        installCost: costs[1],
        serviceCost: (costs[0]!==0)? 15 : 0,
    }

    const wireString = (taskListWiring!==0)? "Кабельная продукция: <div><strong>" + wires_cost + "</strong></div>" : "";
    const projectString = (taskListProject!==0)? "Разработка проекта: <div><strong>" + projectCost.projectDevCost +  "</strong></div>" : "";
    const electricDevString = (taskListWiring!==0)? "Электромонтажные работы: <div><strong>" + projectCost.electricDevCost + "</strong></div>" : "";
    const totalElectro = (taskListWiring!==0)? "<strong>Итого электромонтаж:</strong> <div><strong>" + (projectCost.wires_cost + projectCost.electricDevCost)  + "</strong></div>" : "";
    const installString = (taskListInstall!==0)? "Установка и настройка системы: <div><strong>" + projectCost.installCost + "</strong></div>" : "";
    const serviceString = (taskListService!==0)? "Абонентское обслуживание, за месяц:  <div><strong>" + projectCost.serviceCost + "</strong></div>" : "";
    let elementToWrite = document.getElementById('HouseAmount');
    elementToWrite.innerHTML = ""+
        projectString +
        "Стоимость компонентов: <div><strong>"+ projectCost.materialCost + "</strong></div>" +
        installString +
        serviceString +
        "<strong>Итого проект автоматизации :</strong><div><strong>"+ (projectCost.materialCost + projectCost.projectDevCost+projectCost.installCost ) + "</strong></div>"+
        "<div>&nbsp; </div>"+ "<div>&nbsp;</div>"+
        wireString+
        electricDevString+
        totalElectro;
    elementToWrite = document.getElementById(formPrefix+'Disclaimer');
    elementToWrite.innerHTML = disclaimer;
    document.getElementById(formPrefix+'Amount').style.display='grid';
    document.getElementById(formPrefix+'Disclaimer').style.display='grid';
}

function getMaterialCost(componentSet){
    let materialCost = 0;
    let installCost = 0;
    const keys = Object.keys(componentSet);
    keys.map((key) => {
        materialCost+= componentSet[key].priceMin*componentSet[key].quantity*componentSet[key].demand;
        installCost+= componentSet[key].installCost*componentSet[key].quantity*componentSet[key].demand;
    })
    if (materialCost !==0) {
        materialCost+=componentSet.mainControl.priceMin
    }
    return [materialCost, installCost];
}

