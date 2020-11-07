import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Student } from '../model-service/student/student';
import { StudentService } from '../model-service/student/student.service';
import { StudentDetailsComponent } from '../student-details/student-details.component';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {

  students = new MatTableDataSource<Student>();
  tableColumns: string[] = ['matric', 'name', 'year', 'course'];

  filterForm: FormGroup;

  formDialogOpened = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private studentService: StudentService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.reloadData();

    this.filterForm = this.formBuilder.group({
      matric: ['', ''],
      name: ['', ''],
      year: ['', ''],
      course: ['', '']
    });
  }

  reloadData() {
    this.studentService.getStudentList()
      .subscribe(
        (data: Student[]) => {
          this.students.data = data;
        }
      );
  }

  filterOnSubmit() {
    this.students.filterPredicate = this.studentFilterPredicate;
    this.students.filter = this.filterForm.value;
  }

  studentFilterPredicate(data: Student, filter: any): boolean {
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

  openEditDialog(student: any, mode: string) {
    if (!this.formDialogOpened) {
      this.formDialogOpened = true;
      const dialogRef = this.dialog.open(StudentDetailsComponent, { data: { student, mode } });
      dialogRef.afterClosed().subscribe((result) => {
        this.formDialogOpened = false;
        if (result && result.delete) {
          this.confirmDelete(student.matric);
        }
        this.reloadData();
      });
    }
  }

  confirmDelete(matric: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: `Student ${matric}` });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.event === 'yes') {
          this.studentService.deleteStudent(matric).subscribe(() => this.reloadData());
        }
      }
    );
  }

}
