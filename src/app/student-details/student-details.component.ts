import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Student } from '../model-service/student/student';
import { StudentService } from '../model-service/student/student.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit {

  student: any;
  studentForm: FormGroup;

  hasData: boolean;

  constructor(
    public dialogRef: MatDialogRef<StudentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public studentData: any,
    public formBuilder: FormBuilder,
    public studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.student = this.studentData.student;

    this.hasData = this.student ? true : false;

    this.studentForm = this.formBuilder.group({
      matric: [{value: this.student ? this.student.matric : '', disabled: this.student ? true : false}, Validators.required],
      name: [this.student ? this.student.name : '', Validators.required],
      year: [this.student ? this.student.year : '', Validators.required],
      course: [this.student ? this.student.course : '', Validators.required]
    });
  }

  getDialogTitle() {
    if (this.studentData.mode === 'create') {
      return 'Add student';
    } else if (this.studentData.mode === 'edit') {
      return 'Edit student';
    }
  }

  onSubmit() {
    this.dialogRef.close();
    const data = this.studentForm.value;
    if (this.studentData.mode === 'create'){
      this.studentService.createStudent(data).subscribe();
    } else if (this.studentData.mode === 'edit'){
      const dataCopy = { ...data };
      const finalData: Student = Object.assign(dataCopy, {matric: this.studentData.student.matric}) as Student;
      this.studentService.updateStudent(this.studentData.student.matric, finalData).subscribe();
    }
  }

  onDelete() {
    this.dialogRef.close({delete: true});
  }

}
