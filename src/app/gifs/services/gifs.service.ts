import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = []

  private _tagsHistory: string[]= [];
  private apiKey:string = 'pHp3uRjZmGLKx39GlQXwiNkwPrJFnlk9';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'

  constructor( private http: HttpClient) {
    this.loadLocalStorage();
    console.log('gifs service ready');

  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  organizeTag(tag:string):void {

    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter( oldTag => oldTag !== tag)
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0,10);

    this.saveLocalStorage();

  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void {
    const history = localStorage.getItem('history');

    if(!history) return;
    this._tagsHistory = JSON.parse(history);

    if(this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);

  }

  public clearStorage(): void {
    localStorage.removeItem('history');
    window.location.reload();
  }

  searchTag(tag:string):void {

    if( tag.length === 0) return;
    this.organizeTag(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
      .subscribe( resp => {

        this.gifList = resp.data;
        console.log({gifs: this.gifList});


      })



  }

}
