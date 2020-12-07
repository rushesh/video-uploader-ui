import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getVideo(){
    return this.http.get('http://localhost:3000/getvideos');
  }
  getVideoLink(filename){
    return this.http.get('http://localhost:3000/getvideo/?filename='+filename,
    {
      headers:{
      'Accept-Ranges': 'bytes',
      'Content-Type': 'video/mp4',
      }
    });
  }
}
