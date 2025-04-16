window.onload = function() {
    // Génère l'URL actuelle du site
    const siteUrl = window.location.href;
    
    // Crée le QR code
    new QRCode(document.getElementById("qrcode"), {
        text: siteUrl,
        width: 128,
        height: 128
    });
}; 