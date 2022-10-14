import { Component, OnInit } from '@angular/core';
import {DateService} from "../shared/dateService";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Task, TasksService} from "../shared/tasks.service";
import {Observable, switchMap} from "rxjs";

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  form: FormGroup
  tasks: Task[] = []
  constructor(public dateService: DateService, private taskService: TasksService) { }

  ngOnInit(): void {
    this.dateService.date$.pipe(
      switchMap(value => {
        return this.taskService.load(value)
      })
    ).subscribe((tasks) => {
      this.tasks = tasks
    })
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })

  }

  submit() {
    if(this.form.invalid) {
      return
    }
    const task: Task = {
      title: this.form.value.title,
      date: this.dateService.date$.value.format('DD-MM-YYYY')
    }
    this.taskService.create(task).subscribe({
      next:(task) => {
        this.form.reset()
        this.tasks.push(task)
      },
      error: err=> console.error(err)
    })
  }

  remove(task: Task) {
    this.taskService.remove(task).subscribe({
      next: () =>{
        this.tasks =  this.tasks.filter(t => t.id !== task.id)
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
}
