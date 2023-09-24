import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PDFDocumentProxy, PdfViewerComponent ,PDFSource,PDFProgressData} from 'ng2-pdf-viewer';

@Component({
  selector: 'app-help-pdf',
  templateUrl: './help-pdf.component.html',
  styleUrls: ['./help-pdf.component.scss']
})
export class HelpPdfComponent implements OnInit {
  pdfSrc: string = '../../assets/Manual.pdf';
  error: any;
  page = 1;
  rotation = 0;
  zoom = 1.0;
  zoomScale = 'page-width';
  originalSize = false;
  pdf: any;
  renderText = true;
  progressData!: PDFProgressData;
  isLoaded = false;
  stickToPage = false;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  outline!: any[];
  isOutlineShown = false;
  pdfQuery = '';
  mobile = false;

  @ViewChild(PdfViewerComponent)
  private pdfComponent!: PdfViewerComponent;

  constructor() { }

   ngOnInit() {
    
    if (window.screen.width <= 768) {
      this.mobile = true;
    }
  }



  /**
   * Set custom path to pdf worker
   */


  incrementPage(amount: number) {
    this.page += amount;
  }

  incrementZoom(amount: number) {
    this.zoom += amount;
  }

  rotate(angle: number) {
    this.rotation += angle;
  }

  /**
   * Render PDF preview on selecting file
   */
  onFileSelected() {
    const $pdf: any = document.querySelector('#file');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };

      reader.readAsArrayBuffer($pdf.files[0]);
    }
  }

  /**
   * Get pdf information after it's loaded
   * @param pdf pdf document proxy
   */
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;

    this.loadOutline();
    //this.incrementPage(2);
  }

  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }

  /**
   * Handle error callback
   *
   * @param error error message
   */
 

 

  /**
   * Pdf loading progress callback
   * @param progressData pdf progress data
   */
  onProgress(progressData: PDFProgressData) {
    console.log(progressData);
    this.progressData = progressData;

    this.isLoaded = progressData.loaded >= progressData.total;
    this.error = null; // clear error
  }

  getInt(value: number): number {
    return Math.round(value);
  }

  /**
   * Navigate to destination
   * @param destination pdf navigate to
   */
  navigateTo(destination: any) {
    this.pdfComponent.pdfLinkService.goToDestination(destination);
  }

  /**
   * Scroll view
   */
  scrollToPage() {
    this.pdfComponent.pdfViewer.scrollPageIntoView({
      pageNumber: 3
    });
  }

  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   *
   * 
   */
  

  /**
   * Page initialized callback.
   *
   * @param {CustomEvent} e
   */
  pageInitialized(e: CustomEvent) {
    console.log('(page-initialized)', e);
  }

  /**
   * Page change callback, which is called when a page is changed (called multiple times)
   *
   * @param e number
   */
  pageChange(e: number) {
    console.log('(page-change)', e);
  }

  searchQueryChanged(newQuery: string) {
    const type = newQuery !== this.pdfQuery ? '' : 'again';
    this.pdfQuery = newQuery;

    this.pdfComponent.eventBus.dispatch('find', {
      type,
      query: this.pdfQuery,
      highlightAll: true,
      caseSensitive: false,
      phraseSearch: true,
      // findPrevious: undefined,
    });
  }

}
