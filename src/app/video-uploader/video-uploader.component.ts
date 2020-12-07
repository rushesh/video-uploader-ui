import { HttpClient, HttpHeaders, HttpRequest, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';

@Component({
  selector: 'app-video-uploader',
  templateUrl: './video-uploader.component.html',
  styleUrls: ['./video-uploader.component.css']
})
export class VideoUploaderComponent implements OnInit {

  selectedFile;
  fReader;
  name = "";
  uploadPercent;
  type: string;
  color = "primary";
  mode = "determinate";
  value = 0;
  allvideos;

  
  constructor(private http: HttpClient,  private snackBar: MatSnackBar, private toast: ToastrService, private appService: AppService) {}

  ngOnInit() {
   this.appService.getVideo().subscribe((res: any)=>{
     this.allvideos = res.videos;
   })
  }


  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
    this.type = this.selectedFile.type;

    if(!this.type.startsWith('video/')){
      this.selectedFile = {};
      this.type = '';
      this.snackBar.open("File Name : "+this.name,null ,{
        duration:2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      }); 
      this.toast.error('Only video upload supported.', 'Please select a video.', {
        timeOut: 3000,
      });
    }

    else
    {
    this.name = this.selectedFile.name;
    // console.log(this.selectedFile);
    this.snackBar.open("File Name : "+this.name,null ,{
      duration:2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    }); 
  }
  }

  resetFile()
  {
    if(this.selectedFile == null || this.selectedFile == undefined || this.selectedFile ==''){
      this.toast.info('No file to reset. Please choose a file', 'Info', {
        timeOut: 3000,
      });
    }
    else
    {
    this.selectedFile = {};
    this.name = ''
    // console.log(this.selectedFile);
    this.toast.success('Please choose a new video now.', 'File reset.', {
      timeOut: 3000,
    });
    this.snackBar.open('File Reset. Please choose a new video now.', null ,{
      duration:2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
  }
  resumableUpload() {

    if(this.selectedFile == null || this.selectedFile == undefined || this.selectedFile ==''){
      this.toast.error("No video selected to upload.","Please choose a video to upload.", {
        timeOut: 3000,
      });
      return;
    }

    let fileId = `${this.selectedFile.name}-${this.selectedFile.lastModified}`;
    let headers = new HttpHeaders({
      size: this.selectedFile.size.toString(),
      "x-file-id": fileId,
      name: this.name,
    });

    this.http
      .get("http://localhost:3000/status", { headers: headers })
      .subscribe((res: any) => {
        // console.log(JSON.stringify(res));
        if (res.isUploadAlready == 100) {
          this.toast.error(res.status, 'Error', {
            timeOut: 3000,
          });
          return;
        }
        let uploadedBytes = res.uploaded;
        // console.log(uploadedBytes);
        let headers2 = new HttpHeaders({
          size: this.selectedFile.size.toString(),
          "x-file-id": fileId,
          "x-start-byte": uploadedBytes.toString(),
          name: this.name,
        });
        const req = new HttpRequest(
          "POST",
          "http://localhost:3000/upload",
          this.selectedFile.slice(uploadedBytes, this.selectedFile.size + 1),
          {
            headers: headers2,
            reportProgress: true,
          }
        );
        this.http.request(req).subscribe(
          (res: any) => {
            if (res.type === HttpEventType.UploadProgress) {
              this.uploadPercent = Math.round(
                100 * ((res.loaded + uploadedBytes) / this.selectedFile.size)
              );
              if (this.uploadPercent >= 100) {
                this.name = "";
                this.selectedFile = null;
                //this.uploadPercent = 0;
                this.toast.success("Video" + this.name + " uploaded successfully.", 'Uploaded.', {
                  timeOut: 3000,
                });
                this.appService.getVideo().subscribe((res: any)=>{
                  this.allvideos = res.videos;
                })
              }
            } else {
              // console.log(JSON.stringify(res));
              if (this.uploadPercent >= 100) {
                this.name = "";
                this.selectedFile = null;
              }
            }
          },
          (err) => {}
        );
      });
  }
  showVideo(video){
    this.appService.getVideoLink(video).subscribe((res)=>{
      // console.log(res);
    },
    (err)=>{
      // console.error("Error : "+err);
      
    })
  }


}
