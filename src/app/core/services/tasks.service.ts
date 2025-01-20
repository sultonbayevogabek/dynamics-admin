import { inject, Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  public refreshBoard$ = new Subject<void>();
  public refreshKeyResultBoard$ = new Subject<void>();

  private _httpClient = inject(HttpClient);

  createObjective(payload: any): Observable<any> {
    return this._httpClient.post(environment.host + 'objective/create', payload)
      .pipe(
        tap(() => {
          this.refreshBoard$.next();
        })
      );
  }

  getObjectivesList(params: any): Observable<any> {
    return this._httpClient.post(environment.host + 'objective/list', params);
  }

  getObjectiveListByKeyId(key_id?: string): Observable<any> {
    const payload: any = {};

    if (key_id) {
      payload.key_id = key_id;
    }
    return this._httpClient.post(environment.host + 'objective/list-on-key', payload);
  }

  deleteObjective(id: string): Observable<any> {
    return this._httpClient.post(environment.host + 'objective/delete', { id })
      .pipe(
        tap(() => {
          this.refreshBoard$.next();
        })
      );
  }

  deleteObjectiveComment(comment_id: string): Observable<any> {
    return this._httpClient.post(environment.host + 'comment/delete-objective-comment', { comment_id });
  }

  getKeyResultListByObjectiveId(objective_id: string): Observable<any> {
    return this._httpClient.post(environment.host + 'key/list-by-objective-id', {
      objective_id
    });
  }

  updateObjectiveStatus(id: string, status: number): Observable<any> {
    return this._httpClient.post(environment.host + 'objective/change-status', {
      id, status
    });
  }

  updateObjective(payload: any): Observable<any> {
    return this._httpClient.post(environment.host + 'objective/update', payload)
      .pipe(
        tap(() => {
          this.refreshBoard$.next();
        })
      );
  }

  getCommentListByObjective({ objective_id }): Observable<any> {
    if (!objective_id) {
      return null;
    }
    return this._httpClient.post(environment.host + 'comment/list-by-objective', {
      objective_id
    });
  }

  addCommentToObjective(params: {
    objective_id: string,
    content: string;
    replied_comment_id?: string,
    files?: any[]
  }): Observable<any> {
    return this._httpClient.post(environment.host + 'comment/create-objective-comment', params);
  }

  setKeysToObjective(payload: any): Observable<any> {
    return this._httpClient.post(environment.host + 'objective/assign-key', payload);
  }

  createKeyResult(payload: any): Observable<any> {
    console.log(payload);
    return this._httpClient.post(environment.host + 'key/create', payload)
      .pipe(
        tap(() => {
          this.refreshKeyResultBoard$.next();
        })
      );
  }

  updateKeyResultStatus(id: string, status: number): Observable<any> {
    return this._httpClient.post(environment.host + 'key/change-status', {
      id, status
    });
  }

  getKeyResultList(params: any = {}): Observable<any> {
    return this._httpClient.post(environment.host + 'key/list', params);
  }

  updateKeyResult(payload: any): Observable<any> {
    console.log(payload);
    return this._httpClient.post(environment.host + 'key/update', payload)
      .pipe(
        tap(() => {
          this.refreshKeyResultBoard$.next();
        })
      );
  }

  deleteKeyResult(id: string): Observable<any> {
    return this._httpClient.post(environment.host + 'key/delete', { id })
      .pipe(
        tap(() => {
          this.refreshKeyResultBoard$.next();
        })
      );
  }

  deleteKeyComment(comment_id: string): Observable<any> {
    return this._httpClient.post(environment.host + 'comment/delete-key-comment', { comment_id });
  }

  getCommentListByKey({ key_id }): Observable<any> {
    if (!key_id) {
      return null;
    }
    return this._httpClient.post(environment.host + 'comment/list-by-key', {
      key_id
    });
  }

  addCommentToKeyResult(params: {
    key_id: string;
    content: string;
    replied_comment_id?: string;
    files?: any[];
  }): Observable<any> {
    return this._httpClient.post(environment.host + 'comment/create-key-comment', params);
  }

  enterKeyUnitDoneValue(id: string, unit_done_value: number): Observable<any> {
    console.log({ id, unit_done_value });
    return this._httpClient.post(environment.host + 'key/enter-key-unit-done-value', { id, unit_done_value });
  }

  markKeyAsDone(payload: { key_id: string; objective_id?: string }): Observable<any> {
    return this._httpClient.post(environment.host + 'objective/confirm-key', payload)
  }
}
