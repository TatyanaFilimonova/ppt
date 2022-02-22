function SendData(FormName){
    const form = document.forms[FormName];
    const formData = new FormData(form);
    const request = new XMLHttpRequest();
    request.open("POST", "http://127.0.0.1:8000/calc_api/equipment/");
    request.send(formData);
}