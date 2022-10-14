import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {DateService} from "./dateService";
import * as moment from "moment";


export interface Task{
  title: string,
  id?: string,
  date: string
}

interface CreateResponse {
  name: string
}
@Injectable({providedIn:'root'})
export class TasksService{

  static url  = 'https://angular-organizer-e224e-default-rtdb.europe-west1.firebasedatabase.app/tasks'
  constructor(private http: HttpClient) {}

  create(task: Task): Observable<Task> {
    return this.http.post<CreateResponse>(`${TasksService.url}/${task.date}.json`,task )
      .pipe(
        map(res => ({id: res.name,...task}))
      )
  }


  load(date: moment.Moment) {
    return this.http
      .get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(
        map(tasks => {
          if(!tasks) return []
          return Object.keys(tasks).map((key: any) => ({...tasks[key], id: key}))
        })
      )
  }


  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`)
  }
}
