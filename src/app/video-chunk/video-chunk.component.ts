import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { UploaderComponent, ChangeEventArgs, RemovingEventArgs } from '@syncfusion/ej2-angular-inputs';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-video-chunk',
  templateUrl: './video-chunk.component.html',
  styleUrls: ['./video-chunk.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VideoChunkComponent {
    public allowedExtentions = '.mp4';
    public maxFileSize = 257698037700;
  public path: Object = {
    saveUrl: 'http://localhost:3000/videofilesadd',
    removeUrl: 'http://localhost:3000/videofilesremove',
    // set chunk size for enable the chunk upload
    chunkSize: 102400
  };

  @ViewChild('chunkupload',null) chunkupload: UploaderComponent;
    @ViewChild('sample', null)
    public listObj: DropDownListComponent;
    // define the JSON of data
    public fields: Object = { text: 'size', value: 'value' };
    // set the placeholder to DropDownList input element
    public waterMark: string = 'Select chunk size';
    // set the value to select an item based on mapped value at initial rendering
    // public value = '500000';

  public onChange(args: any): void {
    this.chunkupload.asyncSettings.chunkSize = parseInt(args.itemData.value);
  }

  public onFileRemove(args: RemovingEventArgs): void {
      args.postRawFile = false;
  }

  public isInteraction: boolean = false;
  // to update flag variable value for automatic pause and resume
  public onPausing(args: any): void {
      if (args.event !== null && !navigator.onLine) {
          this.isInteraction = true;
      } else {
          this.isInteraction = false;
      }
  }
  // to update flag variable value for automatic pause and resume
  public onResuming(args: any): void {
      if (args.event !== null && !navigator.onLine) {
          this.isInteraction = true;
      } else {
          this.isInteraction = false;
      }
  }

  public dropElement: HTMLElement = document.getElementsByClassName('control-section')[0] as HTMLElement;
  // to prevent triggering chunk-upload failure event and to pause uploading on network failure
  public onBeforefailure(args: any): void {
      let proxy: any = this;
      args.cancel = !this.isInteraction;
      /* tslint:disable */
      // interval to check network availability on every 500 milliseconds
      let clearTimeInterval:any = setInterval(() => {
          if (navigator.onLine && !isNullOrUndefined(proxy.chunkupload.filesData[0]) && proxy.chunkupload.filesData[0].statusCode == 4) {
              proxy.chunkupload.resume(proxy.chunkupload.filesData);
              clearSetInterval();
          } else {
              if (!proxy.isInteraction && !isNullOrUndefined(proxy.chunkupload.filesData[0]) && proxy.chunkupload.filesData[0].statusCode == 3) {
                  proxy.chunkupload.pause(proxy.chunkupload.filesData);
              }
          }
      }, 500);
      // clear Interval after when network is available.
      function clearSetInterval(): void {
          clearInterval(clearTimeInterval);
      }
  }
}
