import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermLoanGenealogyTree } from './shared/term-loan-genealogy-tree.model';
import { Table } from 'primeng/table';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';
import { TermLoanGenealogyTreeService } from './shared/term-loan-genealogy-tree.service';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-term-loan-genealogy-tree',
  templateUrl: './term-loan-genealogy-tree.component.html',
  styleUrls: ['./term-loan-genealogy-tree.component.css']
})
export class TermLoanGenealogyTreeComponent {
  @ViewChild('genealogy', { static: false }) private genealogy!: Table;
  termGenealogyTreeForm: FormGroup;
  termLoanGenealogyTreeList: any[] = [];
  checked: boolean = false;
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  relationshipTypesList: any[] = [];
  isMemberCreation: boolean = false;
  termLoanApplicationId: any;
  isEdit: boolean = false;
  visible: boolean = false;
  isFormValid: Boolean = false;
  addButton: boolean = false;
  newRow: any;
  EditDeleteDisable: boolean = false;
  promoterColumns: any[] = [];
  genealogyTreeDetails: any[] = [];
  addButtonService: boolean = false;
  editDeleteDisable: boolean = false;

  productName:any;
  accountType:any;
  minBalence:any;
  accountOpeningDateVal:any;
  
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanGenealogyTreeModel: TermLoanGenealogyTree = new TermLoanGenealogyTree();
  termLoanApplicationModel: TermApplication = new TermApplication();
  admissionNumber: any;
  saveAndNextDisable: boolean = false;
  grenealogyTreeId: any;
  displayDialog: boolean = false;
  constructor(private router: Router, private formBuilder: FormBuilder,
    private translate: TranslateService, private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private commonFunction: CommonFunctionsService,
    private activateRoute: ActivatedRoute,
    private termLoanApplicationsService: TermApplicationService,
    private termLoanGenealogyTreeService: TermLoanGenealogyTreeService,
  ) {

    this.genealogyTreeDetails = [
      { field: 'name', header: 'NAME' },
      { field: 'relationWithApplicantName', header: 'RELATION WITH MEMBER' },
      // { field: 'remarks', header: 'REMARKS' },
      // { field: 'Action', header: 'ACTION' },
    ];

    this.termGenealogyTreeForm = this.formBuilder.group({
      name :new FormControl('', [Validators.required, Validators.pattern(applicationConstants.NAME_PATTERN)]),
      relationWithApplicantName: new FormControl('', Validators.required),
      // remarks: new FormControl('')
    })
  }

  ngOnInit() {
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.getAllRelationshipTypes();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.termLoanApplicationId = Number(id);
        this.isEdit = true;
        this.getTermLoanGenealogyTreesById(this.termLoanApplicationId);
        this.getTermApplicationByTermAccId(this.termLoanApplicationId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    });
    this.termGenealogyTreeForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.termGenealogyTreeForm.valid) {
        this.save();
      }
    });
  }

  save() {
    this.updateData();
  }

  updateData() {
    if(this.termLoanGenealogyTreeList == null || this.termLoanGenealogyTreeList == undefined || this.termLoanGenealogyTreeList.length == 0){
      this.saveAndNextDisable = true;
    }
    else {
      this.saveAndNextDisable = false;
    }
    if(this.addButtonService){
      this.saveAndNextDisable = true;
    }
    this.termLoanGenealogyTreeModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termLoanApplicationsService.changeData({
      formValid: this.termGenealogyTreeForm.valid  ,
      data: this.termLoanGenealogyTreeModel,
      isDisable: this.saveAndNextDisable,
      stepperIndex: 9,
    });
  }

  getAllRelationshipTypes() {
    this.termLoanGenealogyTreeService.getAllRelationshipTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.relationshipTypesList = this.responseModel.data;
            this.relationshipTypesList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
            // let relationshiptype = this.relationshipTypesList.find((data: any) => null != data && data.value == this.termLoanGenealogyTreeModel.relationWithApplicant);
            // if (relationshiptype != null && undefined != relationshiptype)
            //   this.termLoanGenealogyTreeModel.relationWithApplicantName = relationshiptype.label;
            for(let tree of this.termLoanGenealogyTreeList){
              this.relationshipTypesList.filter((obj:any) =>(obj.value == tree.relationWithApplicant)).map((obj) => {
               if (obj.label != null) {
                 tree.relationWithApplicantName = obj.label;
               }
               return obj;
             });
           }
          } else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  getTermLoanGenealogyTreesById(termLoanApplicationId: any) {
    this.commonFunctionsService
    this.termLoanGenealogyTreeService.getTermGenealogyTreeDetailsByLoanApplicationId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termLoanGenealogyTreeList = this.responseModel.data;
            for(let tree of this.termLoanGenealogyTreeList){
               this.relationshipTypesList.filter((obj:any) =>(obj.value == tree.relationWithApplicant)).map((obj) => {
                if (obj.label != null) {
                  tree.relationWithApplicantName = obj.label;
                }
                return obj;
              });
            }
          }
        }
        this.updateData();
      }
      
    });
  }
  getTermApplicationByTermAccId(termLoanApplicationId: any) {
    this.commonFunctionsService
    this.termLoanApplicationsService.getTermApplicationByTermAccId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.termLoanApplicationModel = this.responseModel.data[0];
                this.admissionNumber = this.responseModel.data[0].admissionNo;
                if(this.termLoanApplicationModel.memberTypeName != MemberShipTypesData.INDIVIDUAL){
                  this.termLoanApplicationModel.operationTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
                }
              }
            }
          }
        }
      }
    });
  }

  addService() {
    this.termLoanGenealogyTreeModel = new TermLoanGenealogyTree();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.genealogy._first = 0;
    this.genealogy.value.unshift({ relationWithApplicant: '' });
    this.genealogy.initRowEdit(this.genealogy.value[0]);
    this.getAllRelationshipTypes();
  }

  saveService(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termLoanGenealogyTreeModel = row;
    this.termLoanGenealogyTreeList = [];

    const relation = this.relationshipTypesList.find((item: { value: any; }) => item.value === row.relationWithApplicant);
    this.termLoanGenealogyTreeModel.relationWithApplicantName = relation.label;
    if (this.relationtypeDuplicateCheck(this.termLoanGenealogyTreeModel.relationWithApplicant)) {
      return;
    }
    this.termLoanGenealogyTreeModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termLoanGenealogyTreeModel.status = applicationConstants.ACTIVE;
    if (row.id != null && row.id != undefined) {
      this.termLoanGenealogyTreeService.updateTermLoanGenealogyTree(this.termLoanGenealogyTreeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0  ) {
              this.termLoanGenealogyTreeModel = this.responseModel.data;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermLoanGenealogyTreesById(this.responseModel.data[0].termLoanApplicationId);
              }
              this.msgs = [];
              this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            this.getTermLoanGenealogyTreesById(this.termLoanApplicationId);
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
    else {
      this.termLoanGenealogyTreeService.addTermLoanGenealogyTree(this.termLoanGenealogyTreeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
              this.termLoanGenealogyTreeModel = this.responseModel.data;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermLoanGenealogyTreesById(this.responseModel.data[0].termLoanApplicationId);
              }
              this.msgs = [];
              this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            this.getTermLoanGenealogyTreesById(this.termLoanApplicationId);
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }

  cancelService() {
    this.termLoanGenealogyTreeList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermLoanGenealogyTreesById(this.termLoanApplicationId);
  }

  editService(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    // this.getAllRelationshipTypes();
    this.termLoanGenealogyTreeService.getTermLoanGenealogyTreeById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termLoanGenealogyTreeModel = this.responseModel.data[0];
          }
        }
        else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
   * @implements delete confirm enble
   * @param row 
   */
  delete(row: any) {
    this.grenealogyTreeId = row.id ;
    this.displayDialog = true;
  }


  /**
   * @implements submit delete

   */
  submitDelete() {
    this.termLoanGenealogyTreeService.deleteTermLoanGenealogyTree(this.grenealogyTreeId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.displayDialog = false;
        // this.termLoanGenealogyTreeList = this.responseModel.data;
        this.getTermLoanGenealogyTreesById(this.termLoanApplicationId);
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);

      }
    });
  }



  /**\
   * @implements onChange relation Type

   */
  onChangeRelationTypeType(event: any) {
    if (event.value != null && event.value != undefined) {
      const relation = this.relationshipTypesList.find((item: { value: any; }) => item.value === event.value);
      this.termLoanGenealogyTreeModel.relationWithApplicantName = relation.label;
      this.updateData();
    }
  }

  /**
   * @implements cancle

   */
  cancelForDialogBox(){
    this.displayDialog = false;
  }
  relationtypeDuplicateCheck(selectedpurposeType: any) {
    // Check if there is any row in the list with the same purposetypes as the selected one
    const isDuplicate = this.termLoanGenealogyTreeList.some(row =>
      row.relationWithApplicant === selectedpurposeType &&
      row.id !== this.termLoanGenealogyTreeModel.id  // Exclude the current row being edited (if applicable)
    );

    if (isDuplicate) {
      this.termGenealogyTreeForm.get('relationWithApplicantName')?.reset();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.RELATION_TYPE_ALREADY_EXIST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
      return applicationConstants.TRUE;
    }

    return applicationConstants.FALSE;
  }
}
