import { ImageService } from './../../services/Image.service';
import {
  Component, OnInit,
  Input, EventEmitter, Output, OnChanges,
  ViewContainerRef,
  ElementRef, ViewChild
} from '@angular/core';
import './textboxio';
import { server, baseServer } from './../../global';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
declare var textboxio;

@Component({
  selector: 'textboxIO',
  templateUrl: 'textboxIO.component.html',
  styleUrls: ['./textboxIO.component.css'],
  providers: [ImageService,
    ToastsManager,
    ToastOptions]
})

export class TextboxIOComponent implements OnInit, OnChanges {
  editor: any;
  @Input() content;
  @ViewChild('mytextarea') mytextarea: ElementRef;
  @Input() imageFolder;
  @Output() contentChange: EventEmitter<any> = new EventEmitter<any>();
  constructor(private imageService: ImageService, private toaster: ToastsManager, vcr: ViewContainerRef) {
    toaster.setRootViewContainerRef(vcr);
  }

  ngOnChanges(changes: any) {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add 'implements OnChanges' to the class.
    if (this.content) {
      if (this.editor) {
        this.editor.content.set(this.content);
      }
    }
  }
  ngOnInit() {
    let service = this.imageService;
    let contentChanged = this.contentChange;
    let config = {
      Width: '100%',
      autosubmit: true,
      basePath: 'app/share/textboxIO',
      languages: ['en'],
      images: {
        upload: {
          handler: function (data, success, failure) {
            // console.log(data.filename());
            service.Uploadbase64(data.base64(), data.filename(), this.imageFolder).subscribe(result => {
              if (result.succeeded) {
                success(baseServer + '/' + result.message);
              }
              else {
                this.toaster.error('خطایی در ذخیره سازی تصویر اتفاق افتاده است');
                failure('خطا در ذخیره سازی تصویر اتفاق افتاده است');
              }
            }, err => this.toaster.error(' خطای اتصال به سرور'));
          }.bind(this)
        }
      },

      css: {
        documentStyles: 'body { direction:rtl;text-align: right;width:100% }'
      }
    };
    // let div = document.getElementById('#'+this.id);
    this.editor = textboxio.replace(this.mytextarea.nativeElement, config);
    if (this.content) {
      this.editor.content.set(this.content);
    }

    // editor.events.dirty.addListener(function () {
    //     this.content = editor.content.get();
    //     editor.content.setDirty(false);
    //     this.contentChange.emit(this.content);
    //     console.log(this.content);
    // }.bind(this));

    this.editor.events.dirty.addListener(function () {
      this.editor.content.uploadImages(function () {
        this.content = this.editor.content.get();
        this.editor.content.setDirty(false);
        this.contentChange.emit(this.content);
      }.bind(this));
    }.bind(this));

  }

  // save() {
  //   let callback = function (results) {
  //     console.log('Images have finished uploading.');

  //     results.forEach(function (result) {
  //       console.log('upload successful: ' + result.success);
  //       console.log('the image element ', result.element);
  //     });
  //   };

  //   // Add all Base64 images from editor content to the upload queue
  //   editor.content.uploadImages(callback);

  //   console.log('save');
  //   // let content = this.editor.content.get();
  //   this.content = editor.content.get();
  //   this.contentChange.emit(this.content);
  //   // this.event.emit(this.content);
  // }

}
