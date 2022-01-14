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

function clickCalculateButton(formPrefix) {
    const form = document.forms[formPrefix+'Form'];
    const formData = new FormData(form);
    const floorNumber = parseData(formData, formPrefix+'FloorNumber');
    const square = parseData(formData, formPrefix+'Square');
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

    const  componentSet =  {
        leaksSensor: {quantity: bathroomNumber+2, priceMin: 10, priceMax: 15, demand: compPipes, installCost: 5},
        switchPanel: {quantity: bathroomNumber+roomNumber+parking+spacesNumber, priceMin: 200, priceMax: 400, demand: compIndoorLight, installCost: 10},
        powerSocket: {quantity: bathroomNumber+roomNumber+parking+spacesNumber+Math.ceil(groundSquare/100), priceMin: 15, priceMax: 150, demand: compIndoorLight, installCost: 5},
        heatFloor:   {quantity: bathroomNumber+2, priceMin: 15, priceMax: 100, demand: compClimat, installCost: 5},
        airSensor:   {quantity: roomNumber+bathroomNumber+1, priceMin: 30, priceMax: 100, demand: compClimat, installCost: 5},
        servoDrive:  {quantity: bathroomNumber, priceMin: 15, priceMax: 150, demand: compPipes, installCost: 10},
        gateControl: {quantity: parking+3, priceMin: 20, priceMax: 100, demand: compGates, installCost: 15},
        mainControl: {quantity: 1, priceMin: 500, priceMax: 1000, demand: 0, installCost: 100},
        irrigator:   {quantity: Math.ceil((groundSquare-square)/200), priceMin: 100, priceMax: 300, demand: compIrrigation, installCost: 15},
        ipPanel:     {quantity: parking+1+floorNumber-1, priceMin: 150, priceMax: 300, demand: compIPtelecom, installCost: 15},
        ipCam:       {quantity: parking+6, priceMin: 100, priceMax: 300, demand: compVideo, installCost: 15},
        ipStorage:   {quantity: 1, priceMin: 150, priceMax: 500, demand: compVideo, installCost: 15},
        curtain:     {quantity: (roomNumber+1)*2, priceMin: 15, priceMax: 50, demand: compCurtains, installCost: 10},
        wires:       {quantity: square*12, priceMin: 0.8, priceMax: 1.2, demand: taskListWiring, installCost: 0},
        twistedPair: {quantity: square*5, priceMin: 0.6, priceMax: 1, demand: taskListWiring, installCost: 0}
    }

    const costs = getMaterialCost(componentSet);

    const projectCost = {
        materialCost: costs[0],
        projectDevCost: 400*taskListProject,
        electricDevCost: (componentSet.wires.quantity+componentSet.twistedPair.quantity)*1*taskListWiring,
        installCost: costs[1],
        serviceCost: (costs[0]!==0)? 50 : 0,
    }

    console.log(componentSet);
    console.log(costs);
    console.log(projectCost);

    let elementToWrite = document.getElementById('HouseAmount');
    elementToWrite.innerHTML = projectCost.materialCost + projectCost.projectDevCost + projectCost.electricDevCost + projectCost.installCost;
    document.getElementById('HouseConclusion').style.display='grid';
}

function getMaterialCost(componentSet){
    let materialCost = 0;
    let installCost = 0;
    const keys = Object.keys(componentSet);
    keys.map((key) => {
        console.log(key);
        console.log(componentSet[key].priceMin*componentSet[key].quantity*componentSet[key].demand)

        materialCost+= componentSet[key].priceMin*componentSet[key].quantity*componentSet[key].demand;
        installCost+= componentSet[key].installCost*componentSet[key].quantity*componentSet[key].demand;
    })
    if (materialCost !==0) {
        materialCost+=componentSet.mainControl.priceMin
    }
    return [materialCost, installCost];
}

