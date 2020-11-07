import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private baseUrlRoom = 'http://localhost:8000/api/rooms';

  constructor(private http: HttpClient) { }

  getRoomList(): Observable<any>{
    return this.http.get(`${this.baseUrlRoom}`);
  }

  getRoomById(id: string): Observable<object>{
    return this.http.get(`${this.baseUrlRoom}/${id}`);
  }

  createRoom(room: any): Observable<object>{
    return this.http.post(`${this.baseUrlRoom}`, room);
  }

  updateRoom(id: string, room: any): Observable<object>{
    return this.http.put(`${this.baseUrlRoom}/${id}`, room);
  }

  deleteRoom(id: string): Observable<any>{
    return this.http.delete(`${this.baseUrlRoom}/${id}`);
  }

  deleteAllRooms(): Observable<any>{
    return this.http.delete(`${this.baseUrlRoom}`);
  }
}
