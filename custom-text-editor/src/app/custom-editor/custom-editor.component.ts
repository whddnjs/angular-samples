import { AfterViewInit, Component, ElementRef, forwardRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-editor',
  templateUrl: './custom-editor.component.html',
  styleUrl: './custom-editor.component.css',
  imports: [FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomEditorComponent),
      multi: true
    }
  ]
})
export class CustomEditorComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  @ViewChild('editableContent', { static: true }) editableContent!: ElementRef<HTMLDivElement>;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('linkInput') linkInput!: ElementRef<HTMLInputElement>;

  content: string = '';
  textColor: string = '#000000';
  backgroundColor: string = '#ffffff';
  fontSize: string = '3';
  fontFamily: string = 'Arial, sans-serif';
  textAlign: string = 'left';
  isSourceView: boolean = false;
  selection: Range | null = null;

  onChange: any = () => { };
  onTouch: any = () => { };

  constructor(private renderer: Renderer2,) { }

  ngOnInit() {
    this.setupImagePasteHandler();
    this.setupSelectionSaver();
  }

  ngAfterViewInit() {
    this.makeContentEditable();
    this.editableContent.nativeElement.addEventListener('blur', () => {
      this.onTouch();
    });
  }

  private setupSelectionSaver() {
    // Save selection when clicking color picker
    document.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        this.selection = selection.getRangeAt(0).cloneRange();
      }
    });
  }

  makeContentEditable() {
    this.renderer.setAttribute(this.editableContent.nativeElement, 'contenteditable', 'true');
    this.renderer.setStyle(this.editableContent.nativeElement, 'min-height', '200px');
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.content = value || '';
    if (this.editableContent) {
      this.editableContent.nativeElement.innerHTML = this.content;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // Editor formatting methods
  formatText(command: string, event?: any): void {
    let value = event;
    if (event?.target) {
      value = event.target.value;
    }
    if (command === 'formatBlock') {
      value = `<${value}>`; // Wrap the tag in <>
    }
    document.execCommand(command, false, value);
    this.onContentChange();
  }
  // Text formatting
  applyFormat(format: string): void {
    this.formatText(format);
  }

  // Color handling with selection restore
  setTextColor(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.textColor = color;
    // Restore selection before applying color
    if (this.selection) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(this.selection);
    }
    document.execCommand('foreColor', false, color);
    this.onContentChange();
  }

  setBackgroundColor(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.backgroundColor = color;
    // Restore selection before applying color
    if (this.selection) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(this.selection);
    }
    document.execCommand('hiliteColor', false, color);
    this.onContentChange();
  }

  // Event handlers with selection management
  onContentChange(): void {
    const value = this.editableContent.nativeElement.innerHTML;
    this.content = value;
    this.onChange(value);
    // Save current selection
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.selection = selection.getRangeAt(0).cloneRange();
    }
  }

  // Font size and family
  changeFontSize(event: Event): void {
    const size = (event.target as HTMLSelectElement).value;
    this.formatText('fontSize', size);
  }

  changeFontFamily(event: Event): void {
    const font = (event.target as HTMLSelectElement).value;
    this.formatText('fontName', font);
  }

  // Other existing methods remain the same
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.formatText('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') || '';
    this.formatText('insertText', text);
  }

  // Update image handler to maintain content
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (this.selection) {
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(this.selection);
        }
        const img = `<img src="${e.target?.result}" style="max-width: 100%;">`;
        this.formatText('insertHTML', img);
      };
      reader.readAsDataURL(file);
    }
  }
  setAlignment(alignment: string): void {
    this.formatText('justifyLeft');
    if (alignment !== 'left') {
      this.formatText(`justify${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`);
    }
  }
  // Link handling
  insertLink(): void {
    const url = prompt('Enter URL:');
    if (url) {
      this.formatText('createLink', url);
    }
  }

  // Table handling
  insertTable(): void {
    const rows = prompt('Enter number of rows:', '3');
    const cols = prompt('Enter number of columns:', '3');
    if (rows && cols) {
      let table = '<table style="border-collapse: collapse; width: 100%;">';
      for (let i = 0; i < parseInt(rows); i++) {
        table += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          table += '<td style="border: 1px solid #ccc; padding: 8px;">&nbsp;</td>';
        }
        table += '</tr>';
      }
      table += '</table>';
      this.formatText('insertHTML', table);
    }
  }
  // Image handling
  insertImage(): void {
    this.imageInput.nativeElement.click();
  }
  // Source code view toggle
  toggleSourceView(): void {
    this.isSourceView = !this.isSourceView;
    if (this.isSourceView) {
      const content = this.editableContent.nativeElement.innerHTML;
      this.editableContent.nativeElement.textContent = content;
    } else {
      const content = this.editableContent.nativeElement.textContent || '';
      this.editableContent.nativeElement.innerHTML = content;
    }
  }
  private setupImagePasteHandler(): void {
    this.editableContent.nativeElement.addEventListener('paste', (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            e.preventDefault();
            const file = items[i].getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const img = `<img src="${e.target?.result}" style="max-width: 100%;">`;
                this.formatText('insertHTML', img);
              };
              reader.readAsDataURL(file);
            }
            break;
          }
        }
      }
    });
  }
}
