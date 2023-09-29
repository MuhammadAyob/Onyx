import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PDFDocumentProxy, PdfViewerComponent ,PDFSource,PDFProgressData} from 'ng2-pdf-viewer';

@Component({
  selector: 'app-student-help',
  templateUrl: './student-help.component.html',
  styleUrls: ['./student-help.component.scss']
})
export class StudentHelpComponent implements OnInit {
  pdfSrc!: string;
  error: any;
  page:any;
  rotation = 0;
  zoom = 1.0;
  zoomScale = 'page-width';
  originalSize = false;
  pdf: any;
  renderText = true;
  progressData!: PDFProgressData;
  isLoaded = false;
  stickToPage = false;
  showAll = false;
  autoresize = true;
  fitToPage = false;
  outline!: any[];
  isOutlineShown = false;
  pdfQuery = '';
  mobile = false;

  @ViewChild(PdfViewerComponent)
  private pdfComponent!: PdfViewerComponent;

  constructor() { }

  ngOnInit(): void {
    this.pdfSrc= '../../assets/SManual.pdf';
    this.page = localStorage.getItem('pageNumber');
    //console.log(this.page)
    if (window.screen.width <= 768) {
      this.mobile = true;
    }
  }

  /**
   * Set custom path to pdf worker
   */


  incrementPage(amount: number) {
    this.page = (parseInt(this.page) + amount).toString();
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

    // Listen to the pageChange event to update this.page
  this.pdfComponent.pageChange.subscribe((newPage: number) => {
    this.page = newPage.toString();
  });
  }

  /**
   * Scroll view
   */
  scrollToPage(page:number) {
    this.pdfComponent.pdfViewer.scrollPageIntoView({
      pageNumber: page
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

     // Listen to the pageChange event to update this.page
  this.pdfComponent.pageChange.subscribe((newPage: number) => {
    this.page = newPage.toString();
  });
  }

}
