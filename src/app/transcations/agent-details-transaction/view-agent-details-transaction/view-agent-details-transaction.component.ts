import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentDetailsTransactionConstant } from '../agent-details-transaction-constants';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { AgentDetailsTransactionService } from '../shared/agent-details-transaction.service';
import { AgentDetails } from '../agent-registration-stepper/basic-details/shared/basic-details.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Communication } from '../agent-registration-stepper/communication/shared/communication.model';
import { Kyc } from '../agent-registration-stepper/kyc/shared/kyc.model';
import { Nominee } from '../agent-registration-stepper/nominee/shared/nominee.model';
import { Security, Surity } from '../agent-registration-stepper/security-surety/shared/security-surety.model';
import { MembershipBasicDetails } from '../agent-registration-stepper/membership-basic-details/shared/membership-basic-details';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';

@Component({
  selector: 'app-view-agent-details-transaction',
  templateUrl: './view-agent-details-transaction.component.html',
  styleUrls: ['./view-agent-details-transaction.component.css']
})
export class ViewAgentDetailsTransactionComponent implements OnInit {
  agentViewForm: FormGroup;
  agentViewList: any[] = [];
  securitySurity: any[] = [];
  isEdit: boolean = false;
  activeIndex: number = 0;
  msgs: any[] = [];
  buttonDisabled: boolean = false;
  responseModel !: Responsemodel;
  agentDetailsModel: AgentDetails = new AgentDetails();
  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  communicationModel: Communication = new Communication();
  kycModel: Kyc = new Kyc();
  nomineeModel: Nominee = new Nominee();
  securityModel: Security = new Security();
  surityModel: Surity = new Surity();
  securityGridList: any[] = [];
  agentId: any;
  editbutton: boolean = true;
  orgnizationSetting: any;
  kycGridList: any[] = [];
  surityFlag: boolean = false;
  surityDetailsList: any = [];
  isShowSubmit: boolean = false;
  showForm: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  photoCopyFlag: boolean = true;
  isKycApproved: any;
  agentList: any[] = [];
  admissionNumber: any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionService: CommonFunctionsService,
    private fileUploadService: FileUploadService,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    
    private agentDetailsService: AgentDetailsTransactionService) {
    this.agentViewForm = this.formBuilder.group({

    });
    
  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.agentList = this.commonComponent.agentType();
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      }
    })
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        let isEditParam = this.encryptDecryptService.decrypt(params['editbutton']);
        if (isEditParam == "1") {
          this.editbutton = true;
        } else {
          this.editbutton = false;
        }
        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
          let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
          if (isGrid === "0") {
            this.isShowSubmit = applicationConstants.FALSE;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
          }
        }
        this.isEdit = true;
        this.agentDetailsService.getPreviewDetailsById(id).subscribe(res => {
          this.responseModel = res;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
                this.agentDetailsModel = this.responseModel.data[0];
                if (this.agentDetailsModel.memberShipBasicDetailsDTO != null && this.agentDetailsModel.memberShipBasicDetailsDTO != undefined) {
                  this.membershipBasicDetailsModel = this.agentDetailsModel.memberShipBasicDetailsDTO;
                  if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined) {
                    this.membershipBasicDetailsModel.dob = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
                  }
                  if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined) {
                    this.membershipBasicDetailsModel.admissionDate = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                  }
                  if (this.membershipBasicDetailsModel.photoCopyPath != null && this.membershipBasicDetailsModel.photoCopyPath != undefined) {
                    this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.AGENTDETAILS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoCopyPath);
                  }
                  else {
                    this.photoCopyFlag = false;
                  }
                  if (this.membershipBasicDetailsModel.isKycApproved != null && this.membershipBasicDetailsModel.isKycApproved != undefined && this.membershipBasicDetailsModel.isKycApproved) {
                    this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                  }
                  else {
                    this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
                  }
                  
                }
                if (this.agentDetailsModel.agentCommunicationList != null && this.agentDetailsModel.agentCommunicationList.length > 0) {
                  this.communicationModel = this.agentDetailsModel.agentCommunicationList[0];
                }

                if (this.agentDetailsModel.agentNomineeList != null && this.agentDetailsModel.agentNomineeList.length > 0) {
                  this.nomineeModel = this.agentDetailsModel.agentNomineeList[0];
                  if (this.nomineeModel.nomineeFilePath != null && this.nomineeModel.nomineeFilePath != undefined)
                    this.nomineeModel.multipartFileList = this.fileUploadService.getFile(this.nomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.AGENTDETAILS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.nomineeModel.nomineeFilePath);
                }

                if (this.agentDetailsModel.agentKycDetailsList != null && this.agentDetailsModel.agentKycDetailsList != undefined && this.agentDetailsModel.agentKycDetailsList.length > 0) {
                  this.kycGridList = this.agentDetailsModel.agentKycDetailsList;
                  for (let kyc of this.kycGridList) {
                    kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.AGENTDETAILS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                    if (kyc.multipartFileList != null && kyc.multipartFileList != undefined) {
                      kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                    }
                  }
                }

                if (this.agentDetailsModel.agentSecurityList != null && this.agentDetailsModel.agentSecurityList.length > 0) {
                  this.securityGridList = this.agentDetailsModel.agentSecurityList;
                }

                if (this.agentDetailsModel.agentSurityDetailsList != null && this.agentDetailsModel.agentSurityDetailsList.length > 0) {
                  this.surityFlag = true;
                  this.surityDetailsList = this.agentDetailsModel.agentSurityDetailsList;
                }
              }
            }
          }
        });
      } else {
        this.isEdit = false;
      }
    });
  }

  navigateToBack() {
    this.router.navigate([AgentDetailsTransactionConstant.AGENT_DETAILS]);
  }
  submit() {
    this.commonComponent.startSpinner();
    this.agentList.filter((documenttype: any) => documenttype != null && documenttype.value == this.agentDetailsModel.agentType).map((act: { label: any; }) => {
      this.agentDetailsModel.agentTypeName = act.label;
    });

    if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined) {
      this.membershipBasicDetailsModel.dob = this.commonFunctionService.getUTCEpochWithTime(this.membershipBasicDetailsModel.dob);
    }
    if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined) {
      this.membershipBasicDetailsModel.admissionDate = this.commonFunctionService.getUTCEpochWithTime(this.membershipBasicDetailsModel.admissionDate);
    }

    if (this.agentDetailsModel.id != null && this.agentDetailsModel.id != undefined) {
      this.agentDetailsModel.statusName = "Submission for approval";
      this.agentDetailsService.updateAgentDetails(this.agentDetailsModel).subscribe((response: any) => {
        this.responseModel = response;
        this.commonComponent.stopSpinner();
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0].id != null && this.responseModel.data[0].id != undefined) {            
            if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNumber;
            }
            if (this.agentDetailsModel.memberShipBasicDetailsDTO != null && this.agentDetailsModel.memberShipBasicDetailsDTO != undefined) {
              this.membershipBasicDetailsModel = this.agentDetailsModel.memberShipBasicDetailsDTO;
              if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined) {
                this.membershipBasicDetailsModel.dob = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined) {
                this.membershipBasicDetailsModel.admissionDate = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
            }
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.router.navigate([AgentDetailsTransactionConstant.AGENT_DETAILS]);
        } else {
          this.commonComponent.stopSpinner();
          this.buttonDisabled = applicationConstants.FALSE;
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
    }
  }
  editAgentDetails(rowData: any, activeIndex: any) {
    switch (activeIndex) {
      case 0:
        this.router.navigate([AgentDetailsTransactionConstant.MEMBERSHIP_BASIC_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
        break;
      case 1:
        this.router.navigate([AgentDetailsTransactionConstant.AGENT_COMMUNICATION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
        break;
      case 2:
        this.router.navigate([AgentDetailsTransactionConstant.AGENT_BASIC_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
        break;
      case 3:
        this.router.navigate([AgentDetailsTransactionConstant.AGENT_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
        break;
      case 4:
        this.router.navigate([AgentDetailsTransactionConstant.AGENT_SECURITY_SURETY], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
        break;
    }
  }

  onClickMemberIndividualMoreDetails() {
    this.showForm = true
  }
  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }

}
