const fileInput = document.getElementById("image-input")
fileInput.onchange = () => {
  const filename = fileInput.files[0].name
  document.getElementById("upload-text").innerHTML = filename + ' selected'
}

const fileToBase64 = async (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (e) => reject(e)
})

document.getElementById("upload-button").addEventListener('click', async (e) => {
    e.preventDefault()
    await uploadImage()
})

async function uploadImage() {
    const filesFromUpload = document.getElementById("image-input").files
    if(filesFromUpload.length != 0) {
        const filename = filesFromUpload[0].name
        document.getElementById("upload-text").innerHTML = filename + ' uploading...'
        const b64 = await fileToBase64(filesFromUpload[0])
        localStorage.setItem('proofImageb64', b64)
        var myHeaders = new Headers();
        myHeaders.append("apikey", "fdc893b8fd88957");

        var formdata = new FormData();
        formdata.append("language", "eng");
        formdata.append("isOverlayRequired", "false");
        formdata.append("base64Image", b64);
        formdata.append("iscreatesearchablepdf", "false");
        formdata.append("issearchablepdfhidetextlayer", "false");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://api.ocr.space/parse/image", requestOptions)
        .then(async (result) => {
            const resp = await result.json()
            const textFromOCR = resp.ParsedResults[0].ParsedText
            document.getElementById("ocrText").setAttribute("value", textFromOCR)
            return "ok"
        })
        .catch(error => console.log('error', error));
    }
}

function verifyReply() {

}