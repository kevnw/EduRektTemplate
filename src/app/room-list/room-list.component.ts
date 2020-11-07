import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Room } from '../model-service/room/room';
import { RoomService } from '../model-service/room/room.service';
import { RoomDetailsComponent } from '../room-details/room-details.component';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {

  rooms = new MatTableDataSource<Room>();
  tableColumns: string[] = ['code', 'name', 'address', 'max_capacity'];

  filterForm: FormGroup;

  formDialogOpened = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private roomService: RoomService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.reloadData();

    this.filterForm = this.formBuilder.group({
      code: ['', ''],
      name: ['', ''],
      address: ['', ''],
      max_capacity: ['', '']
    });
  }

  reloadData() {
    this.roomService.getRoomList()
      .subscribe(
        (data: Room[]) => {
          this.rooms.data = data;
        }
      );
  }

  filterOnSubmit() {
    this.rooms.filterPredicate = this.roomFilterPredicate;
    this.rooms.filter = this.filterForm.value;
  }

  roomFilterPredicate(data: Room, filter: any): boolean {
    for (const value in filter) {
      if (filter[value] !== '' && filter[value] !== 0) {
        if (value !== 'max_capacity') {
          if (!data[value].toLowerCase().includes(filter[value].toLowerCase())) {
            return false;
          }
        } else {
          if (data[value] < filter[value]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  openEditDialog(room: any, mode: string) {
    if (!this.formDialogOpened) {
      this.formDialogOpened = true;
      const dialogRef = this.dialog.open(RoomDetailsComponent, { data: { room, mode } });
      dialogRef.afterClosed().subscribe((result) => {
        this.formDialogOpened = false;
        if (result && result.delete) {
          this.confirmDelete(room.code);
        }
        this.reloadData();
      });
    }
  }

  confirmDelete(code: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: `Room ${code}` });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.event === 'yes') {
          this.roomService.deleteRoom(code).subscribe(() => this.reloadData());
        }
      }
    );
  }
}
