import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MatchMasterNG';

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitzer: DomSanitizer)
              {
                this.matIconRegistry.addSvgIcon("Logo", this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/TrophyMan.svg'));
              }

  
}
