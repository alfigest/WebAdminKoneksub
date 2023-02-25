class Partner {
  constructor(firebaseId, coord, address, partnerEmail, barcodeId, partnerName, image, qrcode, status, trashCategory, phone, schedule){
    this.firebaseId = firebaseId;
    this.coord = coord;
    this.address = address;
    this.partnerEmail = partnerEmail;
    this.barcodeId = barcodeId;
    this.partnerName = partnerName;
    this.image = image;
    this.qrcode = qrcode;
    this.schedule = schedule;
    this.status = status;
    this.trashCategory = trashCategory;
    this.phone = phone;
  }
} 

export default Partner
