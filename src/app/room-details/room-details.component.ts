import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Room } from '../model-service/room/room';
import { RoomService } from '../model-service/room/room.service';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss']
})
export class RoomDetailsComponent implements OnInit {

  room: any;
  roomForm: FormGroup;

  hasData: boolean;

  constructor(
    public dialogRef: MatDialogRef<RoomDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public roomData: any,
    public formBuilder: FormBuilder,
    public roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.room = this.roomData.room;

    this.hasData = this.room ? true : false;

    this.roomForm = this.formBuilder.group({
      code: [{value: this.room ? this.room.code : '', disabled: this.room ? true : false}, Validators.required],
      name: [this.room ? this.room.name : '', Validators.required],
      address: [this.room ? this.room.address : '', Validators.required],
      max_capacity: [this.room ? this.room.max_capacity : '', Validators.required]
    });
  }

  getDialogTitle() {
    if (this.roomData.mode === 'create') {
      return 'Create Room';
    } else if (this.roomData.mode === 'edit') {
      return 'Edit Room';
    }
  }

  onSubmit() {
    this.dialogRef.close();
    const data = this.roomForm.value;
    if (this.roomData.mode === 'create'){
      this.roomService.createRoom(data).subscribe();
    } else if (this.roomData.mode === 'edit'){
      const dataCopy = { ...data };
      const finalData: Room = Object.assign(dataCopy, {code: this.roomData.room.code}) as Room;
      this.roomService.updateRoom(this.roomData.room.code, finalData).subscribe();
    }
  }

  onDelete() {
    this.dialogRef.close({delete: true});
  }

}
