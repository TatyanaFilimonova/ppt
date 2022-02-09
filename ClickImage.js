function ClickImage(img) {
    const modalBody = document.getElementById("modalBody")
    modalBody.innerHTML = "<img src="+img+" class = 'modal_image'>"
    document.getElementById("modalButton").click()
}