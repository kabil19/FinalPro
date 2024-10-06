import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private baseUrl = 'http://localhost:8080/send-email';

  constructor(private http: HttpClient , private toastr: ToastrService) {}

  async onClickSendMail(
    element: HTMLElement,
    emailId?: string,
    title?: string,
    subject: string = "Report Document",
    body: string = "Please find the attached PDF document."
  ): Promise<void> {
    if (!element) {
      this.toastr.error("Error occurred while sending email");
      return Promise.reject('Element not found');
    }
  
    try {
      // Generate the canvas
      const canvas = await html2canvas(element, { scale: 3 });
  
      // Convert canvas to Blob
      const pdfBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to Blob.'));
          }
        }, 'image/jpeg', 0.7);
      });
  
      // Create the PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const compressedImgData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read Blob as Data URL.'));
          }
        };
        reader.readAsDataURL(pdfBlob);
      });
  
      pdf.addImage(compressedImgData, 'JPEG', 0, 0, imgWidth, imgHeight);
  
      // Convert PDF to Blob
      const pdfBlobFinal = pdf.output('blob');
  
      // Create FormData and append the PDF Blob
      const formData = new FormData();
      formData.append('file', pdfBlobFinal, title+'.pdf' || 'document.pdf');
      formData.append('mail', emailId || 'default@example.com');
      formData.append('subject',subject);
      formData.append('title',title||'title.pdf');
  
      // Send PDF to the backend
      await this.http.post(this.baseUrl, formData, { responseType: 'text' }).toPromise();
      this.toastr.success("Email sent successfully");
    } catch (error) {
      this.toastr.error("Error occurred while sending email");
      return Promise.reject(error);
    }
  }
  
}
