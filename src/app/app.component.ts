import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client-konnecteum';

  // @HostListener('window:unload', [ '$event' ])
  // unloadHandler(event) {
  //   alert('call unload');
  // }

  // @HostListener('window:beforeunload', [ '$event' ])
  // beforeUnloadHander(event) {
  //   alert('call beforeunload');
  // }
}
