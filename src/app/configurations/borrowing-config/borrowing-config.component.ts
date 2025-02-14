import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';

@Component({
  selector: 'app-borrowing-config',
  templateUrl: './borrowing-config.component.html',
  styleUrls: ['./borrowing-config.component.css']
})
export class BorrowingConfigComponent {
  constructor(private translate: TranslateService,private commonFunctionsService: CommonFunctionsService) {
  
  }
  ngOnInit(): void {
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
  }
}
