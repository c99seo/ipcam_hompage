var output = {};
var wificheck = false;
var pageName = "";
var newIp = "";

window.addEeventListener('load', () => {
    pageName = document.getElementsByName("pageName")[0].value;
    output = documnet.getElementById("note");

    once(pageName);

    if(pageName == "content3"){
        document.querySelector('#wifiSaveBt').addEventListener('click', () => {
            let doc = document.network;
            if(doc.dhcp.value == ""){
                alert("인터넷");
                return false;
            }
        })
    }
});