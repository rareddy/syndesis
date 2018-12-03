import { ConnectionService } from './../store/connection/connection.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataservicesModule, ConnectionsModule } from '@teiid/beetle-lib';
import { VirtualizationsComponent } from './virtualizations/virtualizations.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: VirtualizationsComponent,
    pathMatch: 'full'
  } ];

@NgModule({
  imports: [
    CommonModule,
    ConnectionsModule,
    DataservicesModule,
    RouterModule.forChild(routes),
  ],
  providers: [ConnectionService],
  declarations: [ VirtualizationsComponent ]
})
export class DataModule { }
