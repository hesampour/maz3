import { TextboxIOComponent } from './textboxIO.component';
import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";


@NgModule({
    imports: [ CommonModule ],
  declarations: [TextboxIOComponent],
    exports: [
        TextboxIOComponent
    ]
})
export class TextBoxIOModule {
}
