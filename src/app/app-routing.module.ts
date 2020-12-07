import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VideoUploaderComponent } from './video-uploader/video-uploader.component';
import { VideoChunkComponent } from './video-chunk/video-chunk.component';


const routes: Routes = [
  { path: 'videoupload', component: VideoUploaderComponent },
  { path: 'videochunk', component: VideoChunkComponent },
  { path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
