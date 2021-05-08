let generatedTweet = ``

function generateTweet() {
    generatedTweet = `This is a ‘COVICoin’ generated reply!\n`
    let formData = {}
    formData.address1 = document.getElementsByName('address1')[0].value
    formData.address2 = document.getElementsByName('address2')[0].value
    formData.item = document.getElementsByName('item')[0].value
    formData.quantity = document.getElementsByName('quantity')[0].value
    formData.contactName = document.getElementsByName('contact-name')[0].value
    formData.contactNumber1 = document.getElementsByName('contact-number-1')[0].value
    formData.contactNumber2 = document.getElementsByName('contact-number-2')[0].value
    formData.additionalInfo = document.getElementsByName('addl-info')[0].value
    generatedTweet += `Here's a lead for ‘${formData.item}’ in city.\nLocation: ${formData.address1} ${formData.address2}\nQuantity: ${formData.quantity}`
    if (formData.contactName != '') {
        generatedTweet += `\nContact Name: ${formData.contactName}`
    }
    generatedTweet += `\nContact Number: ${formData.contactNumber1}`
    if (formData.contactNumber2 != '') {
        generatedTweet += `, ${formData.contactNumber2}`
    }
    if (formData.additionalInfo != '') {
        generatedTweet += `\n${formData.additionalInfo}`
    }
    document.getElementById('generated-tweet-div').style.display = "block"
    document.getElementById('generated-tweet-div').innerHTML = `<h1>Generated Tweet</h1>
    <div class="generated-tweet-text">
        ${generatedTweet.replaceAll('\n', '<br>')}
    </div>
    <button class="copy-to-clipboard" onclick="copyToClipboard()"><svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.2969 3.09375L17.9062 0.703125C17.5312 0.328125 16.8281 0 16.3125 0H8.25C6.98438 0 6 1.03125 6 2.25V4.5H2.25C0.984375 4.5 0 5.53125 0 6.75V21.75C0 23.0156 0.984375 24 2.25 24H12.75C13.9688 24 15 23.0156 15 21.75V19.5H18.75C19.9688 19.5 21 18.5156 21 17.25V4.6875C21 4.17188 20.6719 3.46875 20.2969 3.09375ZM16.5 1.54688C16.5938 1.59375 16.7344 1.64062 16.8281 1.73438L19.2656 4.17188C19.3594 4.26562 19.4062 4.40625 19.4531 4.5H16.5V1.54688ZM13.5 21.75C13.5 22.1719 13.125 22.5 12.75 22.5H2.25C1.82812 22.5 1.5 22.1719 1.5 21.75V6.75C1.5 6.375 1.82812 6 2.25 6H6V17.25C6 18.5156 6.98438 19.5 8.25 19.5H13.5V21.75ZM19.5 17.25C19.5 17.6719 19.125 18 18.75 18H8.25C7.82812 18 7.5 17.6719 7.5 17.25V2.25C7.5 1.875 7.82812 1.5 8.25 1.5H15V4.875C15 5.53125 15.4688 6 16.125 6H19.5V17.25Z" fill="black"/></svg>Copy to clipboard</button>`
    document.getElementsByClassName('left-form')[0].parentNode.removeChild(document.getElementsByClassName('left-form')[0]);
    document.getElementsByClassName('buttons-inline')[0].parentNode.removeChild(document.getElementsByClassName('buttons-inline')[0]);
    document.getElementsByClassName('left')[0].innerHTML
    document.getElementsByClassName('left')[0].innerHTML += `<div class="left-form2">
    <h2>Please upload image of call log or contact proof:</h2>
    <p>Upload a screenshot of the call log or call details screen which shows that you contacted the person whose number you have mentioned in your reply.</p>
    <form id="upload-image-form" class="upload-image-form" action="#">
        <p style="color: black;font-size: 18px;"><label for="image-input" style="text-decoration: underline;" class="file-upload-text">Browse files</label> to upload image</p>
        <input id="image-input" style="visibility: hidden;" type="file">
        <br><br>
        <div class="image-upload-inline">
            <p id="upload-text">No file selected</p>
            <button class="upload-button" id="upload-button">Upload</button>
        </div>
    </form>
</div>
<br><br>
<div class="buttons-inline">
    <form action="/verify" method="POST">
        <input type="hidden" id="ocrText" name="ocrText" value="">
        <input type="hidden" id="formData" name="formData" value="">
        <button class="verify-reply-button" type="submit">Verify Reply</button>
    </form>
    <a href="/session" class="token"><button class="back-to-session-button">Back to session</button></a>
</div>
<br><br><br>`
    const verifyScript = document.createElement('script');
    verifyScript.setAttribute('src','/js/verify.js');
    document.head.appendChild(verifyScript);
    document.getElementById('generated-tweet-div').scrollIntoView()
    document.getElementById("formData").setAttribute("value", JSON.stringify(formData))
}

function copyToClipboard() {
    elem = document.createElement('input')
    elem.setAttribute('id', 'copy-input')
    document.getElementById('generated-tweet-div').innerHTML += elem.outerHTML
    document.getElementById('copy-input').value = generatedTweet.replaceAll('\n', ' ')
    document.getElementById('copy-input').select();
    document.getElementById('copy-input').setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");
    document.getElementById('copy-input').parentNode.removeChild(document.getElementById('copy-input'));
}