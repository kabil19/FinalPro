import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  playSoundDelete() {
    let delAudio = new Audio();
    delAudio.src = "../../../assets/sounds/actions/Delete.wav"
    delAudio.load();
    delAudio.play();
}
playSoundUpdate() {
    let updateAudio = new Audio();
    updateAudio.src = "../../../assets/sounds/actions/Update.wav"
    updateAudio.load();
    updateAudio.play();
}
playSoundInsert() {
    let insertAudio = new Audio();
    insertAudio.src = "../../../assets/sounds/actions/Insert.wav"
    insertAudio.load();
    insertAudio.play();
}
}
