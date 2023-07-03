const generateTab = document.querySelector('.nav-genrate');
const scannerTab = document.querySelector('.nav-scan');

// Nav Bar 
generateTab.addEventListener("click",()=>{
    generateTab.classList.add('active');
    scannerTab.classList.remove('active')
    document.querySelector('.scanner').style.display = 'none';
    document.querySelector('.generate').style.display = 'block';


})

scannerTab.addEventListener("click",()=>{
    scannerTab.classList.add('active');
    generateTab.classList.remove('active')
    document.querySelector('.scanner').style.display = 'block'
    document.querySelector('.generate').style.display = 'none';


})


// generate QR code
const generate = document.querySelector('.generate');
const textInput = document.querySelector('.generate-form input')
const generateBtn = document.querySelector('.generate-form button');
const generateImg = document.querySelector('.generate-img img');
const btnLink = document.getElementById('download');


let imgURL='';
 generateBtn.addEventListener("click",()=>{
   let text = textInput.value;
   if(!text.trim()) return;

   generateBtn.innerHTML ="Generating QR code...."

   imgURL=` https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text}`
    generateImg.src=imgURL;

    generateImg.addEventListener('load',()=>{
        generate.classList.add('active');
        generateBtn.innerHTML='Generate QR Code';
    })
})

//Download QR
btnLink.addEventListener("click", () => {
    if(!imgURL) return;
    fetchImage(imgURL) 
    // console.log(imgURL)
    });

 function fetchImage(url){
    fetch(url).then(res => res.blob()).then(file =>{
        // console.log(file)
        let tempFile = URL.createObjectURL(file)
        let file_name = url.split(" ").pop().split('.')[0]
        let extension = file.type.split("/")[1]
        download(tempFile,file_name,extension);
    }).catch(()=> imgURL="")
 }

 function download (tempFile,file_name,extension){
    let a = document.createElement('a');
    a.href = tempFile;
    a.download = `${file_name}.${extension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
 }
  




// if input is empty then remove qr img
    textInput.addEventListener("input",()=>{
        if(!textInput.value.trim())
        return generate.classList.remove('active');
    })

//Scanner finction

const scannerDiv = document.querySelector('.scanner');

const camera = document.querySelector('.scanner .fa-camera')
const stopCamera = document.querySelector('.scanner .fa-circle-stop');
const scannerForm = document.querySelector(".scanner-form")
const fileInput = document.querySelector(".scanner-form input")
const img = document.querySelector(".scanner-form img")
const video = document.querySelector(".video")
const content = document.querySelector(".content")
const p = document.querySelector(".content p")

const textArea = document.querySelector(".scanner-detail textarea")
const copyBtn = document.querySelector(".copy")
const closeBtn = document.querySelector(".close")

scannerForm.addEventListener("click",()=> fileInput.click())

//Scan QR image
fileInput.addEventListener("change",e =>{
    let file = e.target.files[0];
    // console.log(file)
    if(!file) return;
    fetchRequest(file)
})

function fetchRequest(file){
    let formData = new FormData();
    formData.append("file",file);
    p.innerText = "Scanning QR code...";
    fetch(`http://api.qrserver.com/v1/read-qr-code/`,{
        method : "POST",
        body : formData
    }).then (res => res.json()).then(result =>{
        let text = result[0].symbol[0].data;
        // console.log(text)

        if(!text)
        return  p.innerText = "Couldn't Scan QR code...";

        scannerDiv.classList.add("active")
        scannerForm.classList.add("active-img");

        img.src = URL.createObjectURL(file);
        textArea.innerHTML=text;
        
    })
}



// Scan by camera
let scanner;
camera.addEventListener("click",()=>{
    camera.style.display='none';
    p.innerHTML='Scanning QR Code...'

    scanner = new Instascan.Scanner({video:video});
    Instascan.Camera.getCameras()
    .then(cameras=>{
        if(cameras.length > 0){
            // scanner.start(cameras[0]).then(()=>{
                scanner.camera = cameras[cameras.length - 1];
                scanner.start().then(()=>{

                 scannerForm.classList.add("active-video") 
                 stopCamera.style.display="inline-block"
            })
        } else{
            console.log("No camera found")
        }
    })
    .catch(err=>console.error(err))

    scanner.addListener("scan", c =>{
        scannerDiv.classList.add("active");
        textArea.innerText=c;
    })
})

//copy button

copyBtn.addEventListener("click",() => {
    let text = textArea.textContent;
    navigator.clipboard.writeText(text);
})

//Close button

closeBtn.addEventListener("click",()=>stopScan());
stopCamera.addEventListener("click",()=>stopScan());
// stop function

function stopScan(){
    p.innerText = "Upload QR to Scan";

    camera.style.display='inline-block'
    scannerForm.classList.remove("active-video") 

    stopCamera.style.display="none"
    scannerDiv.classList.remove("active")
    scannerForm.classList.remove("active-img");
    scanner.stop();
}

